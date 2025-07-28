# cms/selectors.py
from django.core.cache import cache
from django.utils import timezone
from .models import Banner, Page, ContentBlock, SiteSetting

CACHE_TTL = 300  # seconds

def get_active_banners(limit=None):
    key = "cms_active_banners"
    banners = cache.get(key)
    if banners is None:
        now = timezone.now()
        qs = Banner.objects.filter(is_active=True, start_date__lte=now).filter(
            models.Q(end_date__gte=now) | models.Q(end_date__isnull=True)
        ).order_by('order')
        banners = list(qs)
        cache.set(key, banners, CACHE_TTL)
    return banners[:limit] if limit else banners

def get_published_page(slug):
    key = f"cms_page_{slug}"
    page = cache.get(key)
    if page is None:
        now = timezone.now()
        page = Page.objects.filter(slug=slug, status='published', publish_date__lte=now).first()
        cache.set(key, page, CACHE_TTL)
    return page

def get_page_blocks(page):
    return page.blocks.all().order_by('order')

def get_site_settings():
    key = "cms_site_settings"
    settings = cache.get(key)
    if settings is None:
        settings = {s.key: s.value for s in SiteSetting.objects.all()}
        cache.set(key, settings, CACHE_TTL)
    return settings
