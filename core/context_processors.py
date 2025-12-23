"""
Context processors for templates
"""
from django.conf import settings
from django.core.cache import cache


def site_settings(request):
    """Add site settings to template context."""
    # Cache the site settings for performance
    cache_key = 'site_settings_context'

    # If using local-memory cache in a multi-process production environment, cache invalidation
    # via SiteSettings.save() (which deletes the key) will NOT propagate to other processes.
    # Detect common locmem backend and avoid caching in that case so admin edits are visible immediately.
    cache_backend = settings.CACHES.get('default', {}).get('BACKEND', '')
    use_cache = True
    if ('locmem' in cache_backend.lower() or 'LocMem' in cache_backend) and not settings.DEBUG:
        use_cache = False

    cached_settings = cache.get(cache_key) if use_cache else None

    if cached_settings is None:
        try:
            from apps.pages.models import SiteSettings
            site = SiteSettings.get_settings()
            cached_settings = {
                'SITE_NAME': site.site_name or 'Bunoraa',
                'SITE_TAGLINE': site.site_tagline or 'Premium Quality Products',
                'SITE_DESCRIPTION': site.site_description or '',
                'SITE_LOGO': site.logo.url if site.logo else None,
                'SITE_LOGO_DARK': site.logo_dark.url if site.logo_dark else None,
                'SITE_FAVICON': site.favicon.url if site.favicon else None,
                'CONTACT_EMAIL': site.contact_email or '',
                'CONTACT_PHONE': site.contact_phone or '',
                'CONTACT_ADDRESS': site.contact_address or '',
                'FACEBOOK_URL': site.facebook_url or '',
                'INSTAGRAM_URL': site.instagram_url or '',
                'TWITTER_URL': site.twitter_url or '',
                'LINKEDIN_URL': site.linkedin_url or '',
                'YOUTUBE_URL': site.youtube_url or '',
                'TIKTOK_URL': site.tiktok_url or '',
                'COPYRIGHT_TEXT': site.copyright_text or '',
                'FOOTER_TEXT': site.footer_text or '',
                'GOOGLE_ANALYTICS_ID': site.google_analytics_id or '',
                'FACEBOOK_PIXEL_ID': site.facebook_pixel_id or '',
                'CUSTOM_HEAD_SCRIPTS': site.custom_head_scripts or '',
                'CUSTOM_BODY_SCRIPTS': site.custom_body_scripts or '',
            }
            # Expose commonly used page URLs in footer (use Page if present & published)
            try:
                from apps.pages.models import Page
                def _page_url(slug):
                    p = Page.objects.filter(slug=slug, is_published=True).first()
                    return p.get_absolute_url() if p else None
                cached_settings.update({
                    'SHIPPING_URL': _page_url('shipping'),
                    'RETURNS_URL': _page_url('returns'),
                    'PRIVACY_URL': _page_url('privacy-policy'),
                    'TERMS_URL': _page_url('terms-of-service'),
                    'COOKIE_URL': _page_url('cookie-policy'),
                    'SELLER_TERMS_URL': _page_url('seller-terms'),
                    'ABOUT_URL': _page_url('about'),
                    'CONTACT_URL': _page_url('contact'),
                    'FAQ_URL': _page_url('faq'),
                })
            except Exception:
                # ignore failures when DB is not reachable
                pass
            # Cache for 5 minutes (only if using a cache that propagates across processes)
            if use_cache:
                cache.set(cache_key, cached_settings, 300)
        except Exception:
            # Fallback if database is not available
            cached_settings = {
                'SITE_NAME': 'Bunoraa',
                'SITE_TAGLINE': 'Premium Quality Products',
                'SITE_DESCRIPTION': '',
                'SITE_LOGO': None,
                'SITE_LOGO_DARK': None,
                'SITE_FAVICON': None,
                'CONTACT_EMAIL': '',
                'CONTACT_PHONE': '',
                'CONTACT_ADDRESS': '',
                'FACEBOOK_URL': '',
                'INSTAGRAM_URL': '',
                'TWITTER_URL': '',
                'LINKEDIN_URL': '',
                'YOUTUBE_URL': '',
                'TIKTOK_URL': '',
                'COPYRIGHT_TEXT': '',
                'FOOTER_TEXT': '',
                'GOOGLE_ANALYTICS_ID': '',
                'FACEBOOK_PIXEL_ID': '',
                'CUSTOM_HEAD_SCRIPTS': '',
                'CUSTOM_BODY_SCRIPTS': '',
            }
    
    return {
        **cached_settings,
        'IS_DEBUG': settings.DEBUG,
        'STRIPE_PUBLIC_KEY': getattr(settings, 'STRIPE_PUBLIC_KEY', ''),
    }
