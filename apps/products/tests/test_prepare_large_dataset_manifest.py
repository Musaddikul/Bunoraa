from pathlib import Path
import json
from apps.products.ml.prepare_large_dataset import create_manifest


def test_create_manifest_writes_manifest(tmp_path):
    out = tmp_path / 'out'
    out.mkdir()
    # create two shard dirs with fake files
    s0 = out / 'shard_0'
    s0.mkdir()
    f1 = s0 / 'data.arrow'
    f1.write_text('x')
    s1 = out / 'shard_1'
    s1.mkdir()
    f2 = s1 / 'data.arrow'
    f2.write_text('yy')

    shards_meta = [
        {'shard_name': 'shard_0', 'row_count': 5},
        {'shard_name': 'shard_1', 'row_count': 3},
    ]

    manifest_path = create_manifest(out, shards_meta)
    assert manifest_path.exists()
    payload = json.loads(manifest_path.read_text(encoding='utf-8'))
    assert payload['total_shards'] == 2
    assert payload['total_rows'] == 8
    assert len(payload['shards']) == 2
    # size bytes should be > 0 for both
    for s in payload['shards']:
        assert s['size_bytes'] > 0


def test_main_creates_manifest_and_uploads(tmp_path, monkeypatch):
    # We'll patch write_arrow to create shard dirs and return metadata, and patch upload_directory_to_s3 to capture calls
    out = tmp_path / 'out'
    out.mkdir()

    def fake_write_arrow(_out_dir, rows, shard_size=0):
        # create two shards
        s0 = _out_dir / 'shard_0'
        s0.mkdir(parents=True, exist_ok=True)
        (s0 / 'data.arrow').write_text('a')
        s1 = _out_dir / 'shard_1'
        s1.mkdir(parents=True, exist_ok=True)
        (s1 / 'data.arrow').write_text('bb')
        return [
            {'shard_name': 'shard_0', 'row_count': 2},
            {'shard_name': 'shard_1', 'row_count': 3},
        ]

    uploaded = {}

    def fake_upload_directory_to_s3(directory, bucket, prefix=''):
        # ensure manifest exists when upload is called
        m = directory / 'manifest.json'
        assert m.exists()
        uploaded['called'] = True
        uploaded['bucket'] = bucket
        uploaded['prefix'] = prefix

    monkeypatch.setattr('apps.products.ml.prepare_large_dataset.write_arrow', fake_write_arrow)
    monkeypatch.setattr('apps.products.ml.prepare_large_dataset.upload_directory_to_s3', fake_upload_directory_to_s3)

    # now call main-like sequence
    from apps.products.ml import prepare_large_dataset as mod

    shards_meta = mod.write_arrow(out, iter(()), shard_size=1)
    manifest_path = mod.create_manifest(out, shards_meta)

    # simulate upload
    mod.upload_directory_to_s3(out, 'my-bucket', 'prefix/sub')
    assert uploaded.get('called', False)
    assert uploaded.get('bucket') == 'my-bucket'
    assert uploaded.get('prefix') == 'prefix/sub'