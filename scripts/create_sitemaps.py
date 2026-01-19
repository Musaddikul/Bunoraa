#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.production')
django.setup()

from apps.seo.models import SitemapSubmission

# Create test sitemaps
test_sitemaps = [
    ('static', 'https://bunoraa.com/sitemap-static.xml'),
    ('products', 'https://bunoraa.com/sitemap-products.xml'),
    ('categories', 'https://bunoraa.com/sitemap-categories.xml'),
    ('blog', 'https://bunoraa.com/sitemap-blog.xml'),
]

print("Creating test sitemaps...")
for sitemap_type, url in test_sitemaps:
    submission, created = SitemapSubmission.objects.get_or_create(
        url=url,
        defaults={
            'sitemap_type': sitemap_type,
            'status': 'pending',
            'search_engines': ['google', 'bing']
        }
    )
    status = "Created" if created else "Already exists"
    print(f"✓ {status}: {sitemap_type} -> {url}")

# Show summary
count = SitemapSubmission.objects.count()
print(f"\nTotal sitemaps: {count}")
