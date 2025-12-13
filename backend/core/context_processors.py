# core/context_processors.py
"""
Context processors for templates.
"""
from django.conf import settings


def site_settings(request):
    """Add site settings to template context."""
    bunoraa_settings = getattr(settings, 'BUNORAA_SETTINGS', {})
    return {
        'SITE_NAME': bunoraa_settings.get('SITE_NAME', 'Bunoraa'),
        'SITE_TAGLINE': bunoraa_settings.get('SITE_TAGLINE', 'Premium E-Commerce'),
        'SUPPORT_EMAIL': bunoraa_settings.get('SUPPORT_EMAIL', 'support@bunoraa.com'),
        'SUPPORT_PHONE': bunoraa_settings.get('SUPPORT_PHONE', ''),
        'DEBUG': settings.DEBUG,
    }


def cart_context(request):
    """Add cart information to template context."""
    cart_count = 0
    cart_total = 0
    
    if request.user.is_authenticated:
        try:
            from apps.cart.models import Cart
            cart = Cart.objects.filter(user=request.user).first()
            if cart:
                cart_count = cart.item_count
                cart_total = cart.total
        except Exception:
            pass
    else:
        # Handle guest cart from session
        cart_id = request.session.get('cart_id')
        if cart_id:
            try:
                from apps.cart.models import Cart
                cart = Cart.objects.filter(id=cart_id).first()
                if cart:
                    cart_count = cart.item_count
                    cart_total = cart.total
            except Exception:
                pass
    
    return {
        'cart_count': cart_count,
        'cart_total': cart_total,
    }


def bunoraa_config(request):
    """Provide JavaScript configuration data."""
    bunoraa_settings = getattr(settings, 'BUNORAA_SETTINGS', {})
    
    # Get current currency
    currency_code = request.session.get('currency', bunoraa_settings.get('DEFAULT_CURRENCY', 'BDT'))
    currency_symbol = bunoraa_settings.get('CURRENCY_SYMBOL', '৳')
    
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
            'firstName': user.first_name or '',
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
