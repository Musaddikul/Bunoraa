"""
Context processors for templates
"""
from django.conf import settings


def site_settings(request):
    """Add site settings to template context."""
    return {
        'SITE_NAME': 'Bunoraa',
        'SITE_TAGLINE': 'Premium Quality Products',
        'IS_DEBUG': settings.DEBUG,
        'STRIPE_PUBLIC_KEY': getattr(settings, 'STRIPE_PUBLIC_KEY', ''),
    }
