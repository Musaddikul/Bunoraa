"""Create a tiny sample product_suggestor artifact for local development (if torch installed).
"""
from __future__ import annotations
import os
from pathlib import Path
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a sample product_suggestor artifact at apps/products/ml/artifacts/product_suggestor.pt'

    def handle(self, *args, **options):
        try:
            import torch
        except Exception as exc:
            self.stderr.write('torch is not available. Install torch to create sample model.')
            raise

        # New artifact path under ml/artifacts
        MODEL_PATH = Path(__file__).resolve().parent.parent / 'ml' / 'artifacts' / 'product_suggestor.pt'
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        self.stdout.write(self.style.NOTICE('NOTE: artifact location moved to apps/products/ml/artifacts; previous path apps/products/models is deprecated'))
        class SimpleModel:
            def predict(self, texts):
                out = []
                for t in texts:
                    out.append({'name': t[:50], 'short_description': t[:120], 'tags': []})
                return out

        try:
            torch.save({'model': SimpleModel(), 'meta': {}}, MODEL_PATH)
            self.stdout.write(self.style.SUCCESS(f'Created sample product suggestor at {MODEL_PATH}'))
        except Exception as exc:
            self.stderr.write(f"Failed to write model: {exc}\nYou can still provide your own model at the same path.")
