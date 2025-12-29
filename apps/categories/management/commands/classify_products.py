"""Classify products using configured classifier and write suggestions.

Usage:
  python manage.py classify_products --limit 100 --min_confidence 0.2
"""
from __future__ import annotations

from django.core.management.base import BaseCommand
from apps.categories.classifier import classify_text
from apps.categories.ml import ProductCategorySuggestion, Category
from apps.products.models import Product

class Command(BaseCommand):
    help = 'Run classifier on products and persist suggestions.'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=1000)
        parser.add_argument('--min_confidence', type=float, default=0.1)

    def handle(self, *args, **options):
        limit = options.get('limit')
        min_conf = options.get('min_confidence')

        processed = 0
        for p in Product.objects.filter(is_deleted=False).iterator():
            text = f"{p.name or ''} {p.description or ''}"
            recs = classify_text(text, top_k=3)
            for code, conf in recs:
                if conf >= min_conf:
                    # resolve category code
                    cat = Category.objects.filter(code=code).first() or Category.objects.filter(slug=code).first()
                    if not cat:
                        continue
                    ProductCategorySuggestion.objects.create(product_id=p.id, suggested_category=cat, confidence=conf, method='classifier')
            processed += 1
            if processed >= limit:
                break
        self.stdout.write(self.style.SUCCESS(f'Processed {processed} products'))