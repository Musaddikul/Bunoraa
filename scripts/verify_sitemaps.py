#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.production')
django.setup()

from apps.seo.models import SitemapSubmission
from django.db.models import Sum

# Get all sitemaps
sitemaps = SitemapSubmission.objects.all()
print("All Sitemaps in Database:")
print("=" * 60)
for s in sitemaps:
    print(f"ID: {s.id} | Type: {s.sitemap_type} | Status: {s.status}")
    print(f"  URL: {s.url}")
    print(f"  Discovered: {s.discovered_pages} | Indexed: {s.indexed_pages}")
    print()

# Get summary stats
total_discovered = sitemaps.aggregate(total=Sum('discovered_pages'))['total'] or 0
total_indexed = sitemaps.aggregate(total=Sum('indexed_pages'))['total'] or 0
print("Summary Statistics:")
print(f"  Total Sitemaps: {sitemaps.count()}")
print(f"  Total Discovered Pages: {total_discovered}")
print(f"  Total Indexed Pages: {total_indexed}")
