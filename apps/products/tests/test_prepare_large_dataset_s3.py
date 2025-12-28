from pathlib import Path
from unittest import mock
import tempfile
from apps.products.ml.prepare_large_dataset import upload_directory_to_s3


def test_upload_directory_to_s3_calls_boto3(tmp_path, monkeypatch):
    # Create a small directory with two files
    d = tmp_path / 'out'
    d.mkdir()
    (d / 'shard_0').mkdir()
    f1 = d / 'shard_0' / 'data.arrow'
    f1.write_text('x')
    f2 = d / 'meta.json'
    f2.write_text('{}')

    fake_client = mock.Mock()
    fake_client.upload_file = mock.Mock()

    fake_boto = mock.Mock()
    fake_boto.client.return_value = fake_client

    # Now call upload function, patch the boto3 client used in the module
    with mock.patch('apps.products.ml.prepare_large_dataset.boto3') as mock_boto_mod:
        mock_boto_mod.client.return_value = fake_client
        upload_directory_to_s3(d, 'my-bucket', 'prefix/sub')

        # Expect two upload calls
        assert fake_client.upload_file.call_count == 2
        calls = [mock.call(str(f1), 'my-bucket', 'prefix/sub/shard_0/data.arrow'), mock.call(str(f2), 'my-bucket', 'prefix/sub/meta.json')]
        fake_client.upload_file.assert_has_calls(calls, any_order=True)
