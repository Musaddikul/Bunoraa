"""
Context processors for the frontend application.
Provides common data to all templates.
"""
from django.conf import settings


def site_settings(request):
    """
    Add site settings to template context.
    """
    return {
        'SITE_NAME': getattr(settings, 'SITE_NAME', 'Bunoraa'),
        'SITE_TAGLINE': getattr(settings, 'SITE_TAGLINE', 'Premium Shopping Experience'),
        'SITE_DESCRIPTION': getattr(settings, 'SITE_DESCRIPTION', 'Discover premium products at Bunoraa'),
        'SITE_EMAIL': getattr(settings, 'SITE_EMAIL', 'support@bunoraa.com'),
        'SITE_PHONE': getattr(settings, 'SITE_PHONE', '+1 (800) 123-4567'),
        'SITE_ADDRESS': getattr(settings, 'SITE_ADDRESS', '123 Business Street, New York, NY 10001'),
        'SOCIAL_FACEBOOK': getattr(settings, 'SOCIAL_FACEBOOK', '#'),
        'SOCIAL_INSTAGRAM': getattr(settings, 'SOCIAL_INSTAGRAM', '#'),
        'SOCIAL_TWITTER': getattr(settings, 'SOCIAL_TWITTER', '#'),
        'SOCIAL_LINKEDIN': getattr(settings, 'SOCIAL_LINKEDIN', '#'),
        'GOOGLE_ANALYTICS_ID': getattr(settings, 'GOOGLE_ANALYTICS_ID', ''),
        'DEBUG': settings.DEBUG,
    }


def cart_processor(request):
    """
    Add cart information to template context.
    """
    cart_count = 0
    cart_total = 0
    
    if hasattr(request, 'session'):
        cart = request.session.get('cart', {})
        for item in cart.values():
            cart_count += item.get('quantity', 0)
            price = item.get('price', 0)
            quantity = item.get('quantity', 0)
            cart_total += price * quantity
    
    return {
        'cart_count': cart_count,
        'cart_total': cart_total,
    }


def categories_processor(request):
    """
    Add categories to template context for navigation.
    """
    try:
        from products.models import Category
        categories = Category.objects.filter(
            is_active=True,
            parent__isnull=True
        ).prefetch_related('children').order_by('order', 'name')[:8]
    except Exception:
        categories = []
    
    return {
        'nav_categories': categories,
    }


def currencies_processor(request):
    """
    Add currency information to template context.
    """
    try:
        from currencies.models import Currency
        currencies = Currency.objects.filter(is_active=True).order_by('code')
        
        # Get current currency from cookie or session
        current_code = request.COOKIES.get('currency')
        if not current_code and hasattr(request, 'session'):
            current_code = request.session.get('currency')
        
        if current_code:
            try:
                current_currency = Currency.objects.get(code=current_code, is_active=True)
            except Currency.DoesNotExist:
                current_currency = currencies.filter(is_default=True).first()
        else:
            current_currency = currencies.filter(is_default=True).first()
        
        # Attach to request for use in template tags
        request.currency = current_currency
        
    except Exception:
        currencies = []
        current_currency = None
    
    return {
        'currencies': currencies,
        'current_currency': current_currency,
    }


def wishlist_processor(request):
    """
    Add wishlist count to template context.
    """
    wishlist_count = 0
    
    if request.user.is_authenticated:
        try:
            from wishlist.models import WishlistItem
            wishlist_count = WishlistItem.objects.filter(
                user=request.user
            ).count()
        except Exception:
            pass
    
    return {
        'wishlist_count': wishlist_count,
    }


def announcement_processor(request):
    """
    Add active announcement banner to template context.
    """
    try:
        from cms.models import Announcement
        from django.utils import timezone
        
        announcement = Announcement.objects.filter(
            is_active=True,
            start_date__lte=timezone.now()
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=timezone.now())
        ).order_by('-priority', '-created_at').first()
    except Exception:
        announcement = None
    
    return {
        'announcement': announcement,
    }


def user_preferences(request):
    """
    Add user preferences to template context.
    """
    language = request.COOKIES.get('language', settings.LANGUAGE_CODE)
    
    preferences = {
        'language': language,
        'is_rtl': language in ['ar', 'he', 'fa', 'ur'],
    }
    
    if request.user.is_authenticated:
        try:
            preferences.update({
                'newsletter_subscribed': getattr(request.user, 'newsletter_subscribed', False),
                'preferred_currency': getattr(request.user, 'preferred_currency', None),
            })
        except Exception:
            pass
    
    return {
        'user_preferences': preferences,
    }


def recent_products(request):
    """
    Add recently viewed products to template context.
    """
    try:
        from products.models import Product
        
        recently_viewed_ids = request.session.get('recently_viewed', [])
        if recently_viewed_ids:
            # Preserve order
            products = list(Product.objects.filter(
                id__in=recently_viewed_ids,
                is_active=True
            ).select_related('category')[:6])
            # Sort by order in session
            id_order = {pid: idx for idx, pid in enumerate(recently_viewed_ids)}
            products.sort(key=lambda p: id_order.get(p.id, 999))
            return {'recently_viewed_products': products}
    except Exception:
        pass
    
    return {'recently_viewed_products': []}
