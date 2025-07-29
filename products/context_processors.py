# products/context_processors.py
from django.core.cache import cache
from .models import Category, Product
from core.models import SiteSetting
from cart.models import Cart
from decimal import Decimal # Import Decimal for clarity and consistency

import logging

logger = logging.getLogger(__name__)

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def categories(request):
    cache_key = 'all_categories'
    categories = cache.get(cache_key)

    if not categories:
        categories = Category.objects.filter(level=0).order_by('name')
        cache.set(cache_key, categories, 60 * 15)  # Cache for 15 minutes

    featured = Product.objects.filter(featured_weight__gte=5, available=True)[:8]
    if not featured:
        featured = Product.objects.filter(available=True).order_by('-created_at')[:8]

    return {
        'all_categories': categories,
        'featured_products': featured,
    }

from cart.selectors import get_user_cart
from cart.models import Cart

def cart(request):
    user_cart = None
    if request.user.is_authenticated:
        user_cart = get_user_cart(request)
    elif request.session.session_key:
        # For anonymous users, ensure a session cart exists
        user_cart = get_user_cart(request)

    return {
        'cart': user_cart
    }

def site_settings(request):
    cache_key = 'site_settings'
    settings = cache.get(cache_key)

    if not settings:
        settings = SiteSetting.objects.first()
        cache.set(cache_key, settings, 60 * 60 * 24)  # Cache for 24 hours

    if settings:
        return {
            'site_name': settings.name,
            'site_logo': settings.logo,
            'contact_email': settings.contact_email,
            'phone_number': settings.phone_number,
            'social_media': {
                'facebook': settings.facebook_url,
                'instagram': settings.instagram_url,
                'twitter': settings.twitter_url,
            }
        }

    return {
        'site_name': 'Bunonraa',
        'contact_email': 'musaddikul.amin123@gmail.com',
        'phone_number': '+8801701922629',
        'social_media': {'facebook':'https://www.facebook.com/bunoraa'}
    }

