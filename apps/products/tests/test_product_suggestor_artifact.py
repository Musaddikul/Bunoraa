import tempfile
import torch
import pytest
from pathlib import Path
from apps.products.suggestor import _MODEL_PATH


@pytest.mark.skipif(not hasattr(torch, 'save'), reason='torch not available')
def test_save_and_load_sample_suggestor(tmp_path):
    MODEL_PATH = tmp_path / 'product_suggestor.pt'

    class Fake:
        def predict(self, texts):
            return [{'name': 'X', 'short_description': 'Y'} for _ in texts]

    torch.save({'model': Fake(), 'meta': {}}, MODEL_PATH)
    loaded = torch.load(str(MODEL_PATH), map_location='cpu')
    assert 'model' in loaded
    m = loaded['model']
    assert hasattr(m, 'predict')
    out = m.predict(['foo'])
    assert isinstance(out, list)
