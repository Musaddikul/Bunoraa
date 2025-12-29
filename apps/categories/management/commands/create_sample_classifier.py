"""Create a small sample PyTorch classifier model at apps/categories/ml/classifier.pt.

This is only for development/testing. The sample model implements a `predict(texts)` method
that returns a list of dictionaries: {"category_code": "CAT_...", "confidence": 0.9}.

Usage: python manage.py create_sample_classifier
"""
from __future__ import annotations

from django.core.management.base import BaseCommand
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent.parent / 'ml' / 'classifier.pt'


class Command(BaseCommand):
    help = 'Create a sample PyTorch classifier model at apps/categories/ml/classifier.pt (dev only)'

    def handle(self, *args, **options):
        try:
            import torch
        except Exception:
            self.stderr.write('PyTorch is not installed. Install torch (cpu) and re-run: pip install torch')
            self.stdout.write('Alternatively, provide a real model at: apps/categories/ml/classifier.pt')
            return

        # Build simple sample model object with a predict method
        class SimpleModel:
            def __init__(self):
                self._mapping = {'shawl': 'CAT_APPAREL', 'scarf': 'CAT_APPAREL', 'ring': 'CAT_JEWELRY'}

            def predict(self, texts):
                results = []
                for text in texts:
                    t = (text or '').lower()
                    best = None
                    for k, v in self._mapping.items():
                        if k in t:
                            best = {'category_code': v, 'confidence': 0.9}
                            break
                    if not best:
                        best = {'category_code': 'CAT_HOME', 'confidence': 0.2}
                    results.append(best)
                return results

        SAMPLE_DIR = MODEL_PATH.parent
        SAMPLE_DIR.mkdir(parents=True, exist_ok=True)

        model = SimpleModel()
        try:
            torch.save(model, str(MODEL_PATH))
            self.stdout.write(self.style.SUCCESS(f'Wrote sample classifier to {MODEL_PATH}'))
        except Exception as exc:
            self.stderr.write(f'Failed to write model: {exc}')
            self.stdout.write('You can still provide your own model at the same path.')
