# cart/selectors.py
from django.db.models import QuerySet
from .models import Cart, CartItem
from django.contrib.auth import get_user_model
import logging
from django.http import HttpRequest # Import HttpRequest for type hinting
from accounts.models import UserAddress # Import UserAddress

logger = logging.getLogger(__name__)
User = get_user_model()

# CACHE_TTL_SHORT = 60 * 1 # 1 minute for active carts # Removed cache TTL
# CACHE_TTL_LONG = 60 * 60 * 24 # 24 hours for less frequently changing data # Removed cache TTL

def get_cart_for_user(user: User) -> Cart:
    """
    Retrieves the active cart for an authenticated user.
    """
    cart = Cart.objects.filter(user=user, checked_out=False).select_related('coupon').first()
    if not cart:
        cart = Cart.objects.create(user=user, checked_out=False)
        logger.info(f"get_cart_for_user: New cart {cart.id} created for user {user.id}.")
    else:
        # Ensure related objects are loaded fresh
        cart = Cart.objects.select_related(
            'coupon', 'shipping_method__carrier', 'address'
        ).prefetch_related(
            'items__product'
        ).get(id=cart.id) # Re-fetch with select_related/prefetch_related
        logger.info(f"get_cart_for_user: Existing cart {cart.id} retrieved for user {user.id}.")

    return cart

def get_cart_for_session(session_key: str) -> Cart:
    """
    Retrieves the active cart for an anonymous session.
    Fetches directly from the database to ensure real-time data.

    Args:
        session_key (str): The session key.

    Returns:
        Cart: The active Cart object for the session.
    """
    cart = Cart.objects.filter(session_key=session_key, checked_out=False).select_related('coupon').first()
    if not cart:
        cart = Cart.objects.create(session_key=session_key, checked_out=False)
        logger.info(f"get_cart_for_session: New cart {cart.id} created for session {session_key}.")
    else:
        # Ensure related objects are loaded fresh
        cart = Cart.objects.select_related(
            'coupon', 'shipping_method'
        ).prefetch_related(
            'items__product'
        ).get(id=cart.id) # Re-fetch with select_related/prefetch_related
        logger.info(f"get_cart_for_session: Existing cart {cart.id} retrieved for session {session_key}.")
    
    return cart

def get_active_cart_items(cart: Cart) -> QuerySet[CartItem]:
    """
    Retrieves active (non-saved-for-later) CartItem objects for a given cart.
    """
    return cart.items.filter(saved_for_later=False).select_related('product').order_by('added_at')

def get_saved_cart_items(cart: Cart) -> QuerySet[CartItem]:
    """
    Retrieves saved-for-later CartItem objects for a given cart.
    """
    return cart.items.filter(saved_for_later=True).select_related('product').order_by('added_at')

def get_abandoned_carts(older_than_days: int = 7) -> QuerySet[Cart]:
    """
    Retrieves carts that are considered abandoned (not checked out, not converted,
    and older than a specified number of days).

    Args:
        older_than_days (int): Carts older than this many days will be considered.

    Returns:
        QuerySet[Cart]: A queryset of abandoned Cart objects.
    """
    from django.utils import timezone
    threshold_date = timezone.now() - timezone.timedelta(days=older_than_days)
    return Cart.objects.filter(
        checked_out=False,
        converted=False,
        updated_at__lte=threshold_date,
        abandoned=False
    ).select_related('user')

def get_user_cart(request: HttpRequest) -> Cart:
    """
    Retrieves the active cart for the current request.
    Handles both authenticated users and anonymous sessions.

    Args:
        request (HttpRequest): The Django HttpRequest object.

    Returns:
        Cart: The active Cart object for the user or session.
    """
    if request.user.is_authenticated:
        return get_cart_for_user(request.user)
    
    # Ensure session key exists for anonymous users
    if not request.session.session_key:
        request.session.save() # This will generate a session key
    
    return get_cart_for_session(request.session.session_key)
