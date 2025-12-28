"""Loader for on-disk product suggestor artifact.

Provides `suggest_texts(texts: List[str])` which will return model-generated structured suggestions,
or falls back to `ProductService.generate_product_suggestions`.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import List

try:
    import torch
except Exception:
    torch = None

from .services import generate_product_suggestions

# artifact now stored under ml/artifacts
_MODEL_PATH = Path(__file__).resolve().parent / 'ml' / 'artifacts' / 'product_suggestor.pt'
_SUGGESTOR = None

if torch is not None and _MODEL_PATH.exists():
    try:
        loaded = torch.load(str(_MODEL_PATH), map_location='cpu')
        _SUGGESTOR = loaded.get('model') if isinstance(loaded, dict) and 'model' in loaded else loaded
    except Exception:
        _SUGGESTOR = None


def suggest_texts(texts: List[str], top_k: int = 3):
    """Return suggestions either from loaded model or fallback heuristic.

    Returns: List of dicts (one per input text)
    """
    if _SUGGESTOR is not None and hasattr(_SUGGESTOR, 'predict'):
        try:
            preds = _SUGGESTOR.predict(texts)
            # Ensure each is a dict
            out = []
            for p in preds:
                if isinstance(p, dict):
                    out.append(p)
                else:
                    out.append({'raw': str(p)})
            return out
        except Exception:
            # fallback
            pass

    # Fallback: apply heuristic per text
    results = []
    for t in texts:
        results.extend((generate_product_suggestions({'name': '', 'description': t, 'image_filenames': []}, top_k=top_k) or [{'name': '', 'short_description': '', 'tags': []}]))
        break
    # The helper returns list-of-suggestions; return one suggestion per input
    return [r[0] if isinstance(r, list) else r for r in results]