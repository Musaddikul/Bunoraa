# core/context_processors.py
"""
Bunoraa Context Processors
Context data available in all templates.
"""
from django.conf import settings


def site_context(request):
    """
    Add site-wide context variables to all templates.
    """
    return {
        'site_name': getattr(settings, 'SITE_NAME', 'Bunoraa'),
        'site_url': getattr(settings, 'SITE_URL', 'http://localhost:8000'),
        'debug': settings.DEBUG,
        'current_year': __import__('datetime').datetime.now().year,
        'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@bunoraa.com'),
        'social_links': {
            'facebook': getattr(settings, 'FACEBOOK_URL', ''),
            'instagram': getattr(settings, 'INSTAGRAM_URL', ''),
            'twitter': getattr(settings, 'TWITTER_URL', ''),
            'youtube': getattr(settings, 'YOUTUBE_URL', ''),
        },
    }


def active_languages(request):
    """Return active languages for language switcher."""
    from apps.core.models import Language
    return {
        'active_languages': Language.objects.filter(is_active=True).order_by('name')
    }


def bunoraa_config(request):
    """Provide JavaScript configuration data for frontend."""
    # Get current currency from session or default
    currency_code = request.session.get('currency', 'USD')
    currency_symbol = '$'
    
    try:
        from currencies.models import Currency
        current_currency = Currency.objects.filter(code=currency_code, is_active=True).first()
        if current_currency:
            currency_symbol = current_currency.symbol
    except Exception:
        pass
    
    # Build user data
    user = request.user
    user_data = None
    if user.is_authenticated:
        user_data = {
            'id': user.id,
            'email': user.email,
            'firstName': getattr(user, 'first_name', '') or '',
        }
    
    config = {
        'apiBaseUrl': '/api/v1',
        'currency': currency_code,
        'currencySymbol': currency_symbol,
        'isAuthenticated': user.is_authenticated,
        'user': user_data,
    }
    
    return {
        'bunoraa_config': config,
    }