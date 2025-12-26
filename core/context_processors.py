"""
Context processors for templates
"""
from django.conf import settings
from django.core.cache import cache


def site_settings(request):
    """Add site settings to template context."""
    # Cache the site settings for performance
    cache_key = 'site_settings_context'
    cached_settings = cache.get(cache_key)
    
    if cached_settings is None:
        try:
            from apps.pages.models import SiteSettings, SocialLink
            site = SiteSettings.get_settings()

            # Build social links list (name, url, icon-url) from the settings' related links
            social_links = []
            try:
                qs = site.social_links.filter(is_active=True).order_by('order')
                social_links = [
                    {'name': s.name, 'url': s.url, 'icon': s.get_icon_url()}
                    for s in qs
                ]
            except Exception:
                # Fallback to global SocialLink objects for compatibility
                try:
                    qs = SocialLink.objects.filter(is_active=True).order_by('order')
                    social_links = [
                        {'name': s.name, 'url': s.url, 'icon': s.get_icon_url()}
                        for s in qs
                    ]
                except Exception:
                    social_links = []

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
                'SOCIAL_LINKS': social_links,
            }
            # Cache for 5 minutes
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
                'SOCIAL_LINKS': [],
            }
    
    # Determine per-request currency (do not cache - user/session based)
    try:
        from apps.currencies.services import CurrencyService
        currency = CurrencyService.get_user_currency(
            user=request.user if request.user.is_authenticated else None,
            request=request
        )
        currency_code = currency.code if currency else 'BDT'
        currency_symbol = currency.symbol if currency else '৳'
        currency_decimal_places = currency.decimal_places if currency else 2
        currency_thousand_separator = currency.thousand_separator if currency else ','
        currency_decimal_separator = currency.decimal_separator if currency else '.'
        currency_symbol_position = currency.symbol_position if currency else 'before'
        currency_locale = 'en-BD' if currency and getattr(currency, 'code', '') == 'BDT' else 'en-US'
    except Exception:
        currency_code = 'BDT'
        currency_symbol = '৳'
        currency_decimal_places = 2
        currency_thousand_separator = ','
        currency_decimal_separator = '.'
        currency_symbol_position = 'before'
        currency_locale = 'en-US'

    return {
        **cached_settings,
        'IS_DEBUG': settings.DEBUG,
        'STRIPE_PUBLIC_KEY': getattr(settings, 'STRIPE_PUBLIC_KEY', ''),
        'currency_code': currency_code,
        'currency_symbol': currency_symbol,
        'currency_locale': currency_locale,
        'currency_decimal_places': currency_decimal_places,
        'currency_thousand_separator': currency_thousand_separator,
        'currency_decimal_separator': currency_decimal_separator,
        'currency_symbol_position': currency_symbol_position,
    }
