"""Export taxonomy to CSV.

Usage: python manage.py export_taxonomy --out /path/to/file.csv
If --out omitted, writes to stdout.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path
from django.core.management.base import BaseCommand
from apps.categories.ml import Category, ExternalCategoryMapping


HEADERS = [
    'node_id', 'code', 'parent_code', 'display_name', 'url_slug', 'path', 'depth',
    'seo_meta_title', 'seo_meta_description', 'allowed_facets', 'visibility', 'is_active',
    'owner', 'last_reviewed', 'review_interval_days', 'release_date', 'version', 'external_mappings'
]


class Command(BaseCommand):
    help = 'Export categories to CSV.'

    def add_arguments(self, parser):
        parser.add_argument('--out', type=str, help='Output CSV file path')

    def handle(self, *args, **options):
        out = options.get('out')
        rows = []
        qs = Category.objects.all().order_by('path')
        for c in qs:
            parent_code = c.parent.code if c.parent else ''
            allowed = ','.join([af.facet.facet_code for af in getattr(c, 'categoryallowedfacet_set', []).all()]) if hasattr(c, 'categoryallowedfacet_set') else ''
            external = list(ExternalCategoryMapping.objects.filter(category=c).values('provider', 'external_code'))
            rows.append({
                'node_id': str(c.id),
                'code': c.code or '',
                'parent_code': parent_code,
                'display_name': c.name,
                'url_slug': c.slug,
                'path': c.path,
                'depth': c.depth,
                'seo_meta_title': c.meta_title or '',
                'seo_meta_description': c.meta_description or '',
                'allowed_facets': allowed,
                'visibility': c.visibility,
                'is_active': str(c.is_active),
                'owner': c.owner or '',
                'last_reviewed': c.last_reviewed.isoformat() if c.last_reviewed else '',
                'review_interval_days': c.review_interval_days,
                'release_date': c.release_date.isoformat() if getattr(c, 'release_date', None) else '',
                'version': c.version,
                'external_mappings': json.dumps(external),
            })

        if out:
            p = Path(out)
            p.parent.mkdir(parents=True, exist_ok=True)
            with p.open('w', newline='', encoding='utf-8') as fh:
                writer = csv.DictWriter(fh, fieldnames=HEADERS)
                writer.writeheader()
                for r in rows:
                    writer.writerow(r)
            self.stdout.write(self.style.SUCCESS(f'Exported {len(rows)} categories to {p}'))
        else:
            writer = csv.DictWriter(self.stdout, fieldnames=HEADERS)
            writer.writeheader()
            for r in rows:
                writer.writerow(r)
