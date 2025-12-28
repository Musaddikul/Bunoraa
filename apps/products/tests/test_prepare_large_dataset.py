import tempfile
from pathlib import Path
from apps.products.ml.prepare_large_dataset import validate_row


def test_validate_sample_row():
    sample = {'text': 'Handwoven silk shawl', 'target': '{"name":"Handwoven Shawl"}'}
    assert validate_row(sample)


def test_iter_local_file(tmp_path):
    p = tmp_path / 'sample.jsonl'
    p.write_text('{"text":"a","target":"{\\"name\\":\\"A\\"}"}\n')
    from apps.products.ml.prepare_large_dataset import iter_jsonl
    rows = list(iter_jsonl(str(p)))
    assert len(rows) == 1
    assert rows[0]['text'] == 'a'
