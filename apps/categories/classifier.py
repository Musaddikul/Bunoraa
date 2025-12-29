"""Simple category classifier abstraction.

By default uses lightweight keyword scoring. If `CATEGORY_CLASSIFIER_URL` is set
in Django settings, it will POST {"text": "..."} and expect a JSON response
list of {"category_code": "CAT_...", "confidence": 0.85}.
"""
from __future__ import annotations

import re
from collections import Counter
from typing import List, Tuple
from django.conf import settings
from .models import Category
from pathlib import Path

# Optional torch model support: place your PyTorch model at
# apps/categories/ml/classifier.pt
_TORCH_MODEL = None
_MODEL_PATH = Path(__file__).resolve().parent / 'ml' / 'classifier.pt'

# Attempt to load model at import time (best-effort)
try:
    import torch
    if _MODEL_PATH.exists():
        try:
            _TORCH_MODEL = torch.load(str(_MODEL_PATH), map_location='cpu')
            try:
                _TORCH_MODEL.eval()
            except Exception:
                pass
        except Exception:
            _TORCH_MODEL = None
except Exception:
    _TORCH_MODEL = None

WORD_RE = re.compile(r"[\w']+")


def _tokenize(text: str):
    return [w.lower() for w in WORD_RE.findall(text or '')]


def _try_use_torch_model(text: str, top_k: int):
    """Attempt to use a loaded torch model if available. Returns list[(code,conf)] or None."""
    global _TORCH_MODEL
    if not _TORCH_MODEL:
        return None
    try:
        # Prefer a model exposing a `predict` method that returns [(code, conf), ...]
        if hasattr(_TORCH_MODEL, 'predict'):
            preds = _TORCH_MODEL.predict([text])
            # normalize to expected format
            results = []
            for p in preds[:top_k]:
                if isinstance(p, dict):
                    results.append((p.get('category_code'), float(p.get('confidence', 0))))
                elif isinstance(p, (list, tuple)) and len(p) >= 2:
                    results.append((p[0], float(p[1])))
            return results
        # fallback: try calling model directly and interpret tensor/output
        out = _TORCH_MODEL(text)
        if isinstance(out, dict) and 'predictions' in out:
            preds = out['predictions'][:top_k]
            return [(p.get('category_code'), float(p.get('confidence', 0))) for p in preds]
    except Exception:
        # any failure -> fallback
        return None


def classify_text(text: str, top_k: int = 3) -> List[Tuple[str, float]]:
    """Delegate classification to CategoryService (keeps shim for backward-compatibility)."""
    try:
        from .services import CategoryService
        return CategoryService.classify_text(text, top_k=top_k)
    except Exception:
        # If anything goes wrong, fall back to local heuristic implemented here
        tokens = _tokenize(text)
        if not tokens:
            return []
        candidates = []
        for cat in Category.objects.filter(is_active=True, is_deleted=False):
            kws = set((cat.slug or '').split('-') + _tokenize(cat.name))
            score = sum(1 for t in tokens if t in kws)
            if score > 0:
                candidates.append((cat.code or str(cat.id), score))
        if not candidates:
            return []
        counted = Counter()
        for code, score in candidates:
            counted[code] += score
        total = sum(counted.values()) or 1
        ranked = [(code, counted[code] / total) for code in counted]
        ranked.sort(key=lambda x: x[1], reverse=True)
        return ranked[:top_k]
