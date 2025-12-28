import tempfile
import os
import torch
import pytest
from typing import List


class _FakeProd(torch.nn.Module):
    def __init__(self):
        super().__init__()

    def predict(self, texts: List[str], top_k: int = 3):
        # return deterministic dummy predictions
        out = []
        for t in texts:
            out.append([{"category_code": "dummy", "confidence": 0.99}])
        return out


@pytest.mark.skipif(not hasattr(torch, 'save'), reason="torch not available")
def test_production_artifact_save_and_predict(tmp_path):
    artifact = tmp_path / 'classifier.pt'
    model = _FakeProd()
    torch.save({'model': model, 'meta': {'id2label': {"0": "dummy"}}}, artifact)

    # Load with weights_only=False for test environment to allow deserializing test-only classes
    loaded = torch.load(str(artifact), weights_only=False)
    assert 'model' in loaded
    m = loaded['model']
    preds = m.predict(["test product"], top_k=1)
    assert isinstance(preds, list)
    assert preds[0][0]['category_code'] == 'dummy'
    assert 0.0 <= preds[0][0]['confidence'] <= 1.0
