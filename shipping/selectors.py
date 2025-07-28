# shipping/selectors.py
from django.db.models import QuerySet
from django.core.cache import cache
from decimal import Decimal
from .models import ShippingZone, ShippingCarrier, ShippingMethod, Shipment
from accounts.models import UserAddress
from .services import get_zone_for_address
import logging

logger = logging.getLogger(__name__)

CACHE_TTL_SHORT = 60 * 5 # 5 minutes
CACHE_TTL_LONG = 60 * 60 # 1 hour

def get_active_shipping_carriers() -> QuerySet[ShippingCarrier]:
    """
    Retrieves all active shipping carriers.

    Returns:
        QuerySet[ShippingCarrier]: A queryset of active ShippingCarrier objects.
    """
    cache_key = "active_shipping_carriers"
    carriers = cache.get(cache_key)
    if carriers is None:
        carriers = ShippingCarrier.objects.filter(is_active=True).order_by('name')
        cache.set(cache_key, carriers, CACHE_TTL_LONG)
    return carriers

def get_active_shipping_methods(zone_id: int | None = None) -> QuerySet[ShippingMethod]:
    """
    Retrieves all active shipping methods, optionally filtered by a specific zone.

    Args:
        zone_id (int, optional): The ID of the ShippingZone to filter methods by. Defaults to None.

    Returns:
        QuerySet[ShippingMethod]: A queryset of active ShippingMethod objects.
    """
    cache_key = f"active_shipping_methods_zone_{zone_id or 'all'}"
    methods = cache.get(cache_key)
    if methods is None:
        queryset = ShippingMethod.objects.filter(is_active=True).select_related('carrier').prefetch_related('zones')
        if zone_id:
            queryset = queryset.filter(zones__id=zone_id)
        methods = queryset.order_by('name')
        cache.set(cache_key, methods, CACHE_TTL_LONG)
    return methods

def get_available_shipping_methods_for_address(address: UserAddress, order_total: Decimal | None = None, weight_kg: Decimal | None = None, dims_cm: dict | None = None) -> QuerySet[ShippingMethod]:
    """
    Retrieves shipping methods available for a given user address,
    considering the associated shipping zone and method-specific criteria.

    Args:
        address (UserAddress): The user's shipping address.
        order_total (Decimal, optional): The total amount of the order. Used for free shipping checks.
        weight_kg (Decimal, optional): The weight of the package. Used for method weight limits.
        dims_cm (dict, optional): Dictionary with 'l', 'w', 'h' in cm. Used for method dimension limits.

    Returns:
        QuerySet[ShippingMethod]: A queryset of available ShippingMethod objects.
    """
    address_zone = get_zone_for_address(address)
    if not address_zone:
        logger.info(f"No shipping zone found for address {address.id}. No methods available.")
        return ShippingMethod.objects.none()

    # Start with all active methods available for this zone
    available_methods = ShippingMethod.objects.filter(
        is_active=True,
        zones=address_zone
    ).select_related('carrier').prefetch_related('zones').order_by('name')

    # Filter based on order total for free shipping (if applicable)
    if order_total is not None and order_total >= address_zone.free_shipping_threshold > 0:
        # If free shipping applies, you might want to return only methods that support it,
        # or all methods with a cost of 0. For simplicity, we'll assume the cost calculation
        # handles the zero cost.
        pass # The cost calculation logic will handle the zero cost

    # Filter based on weight limits
    if weight_kg is not None:
        available_methods = available_methods.filter(min_weight_kg__lte=weight_kg)
        # Filter out methods if max_weight_kg is set and weight_kg exceeds it
        available_methods = available_methods.filter(
            models.Q(max_weight_kg__isnull=True) | models.Q(max_weight_kg__gte=weight_kg)
        )

    # Filter based on dimension limits (simplified check, more complex logic might be needed)
    if dims_cm and all(k in dims_cm for k in ['l', 'w', 'h']):
        l, w, h = dims_cm['l'], dims_cm['w'], dims_cm['h']
        available_methods = available_methods.filter(
            models.Q(min_dims_cm__isnull=True) | models.Q(min_dims_cm__l__lte=l, min_dims_cm__w__lte=w, min_dims_cm__h__lte=h)
        )
        available_methods = available_methods.filter(
            models.Q(max_dims_cm__isnull=True) | models.Q(max_dims_cm__l__gte=l, max_dims_cm__w__gte=w, max_dims_cm__h__gte=h)
        )

    logger.info(f"Found {available_methods.count()} shipping methods for address {address.id} in zone {address_zone.name}.")
    return available_methods

def get_shipment_by_id(shipment_id: int) -> Shipment | None:
    """
    Retrieves a single shipment by its ID, with related data prefetched.

    Args:
        shipment_id (int): The ID of the shipment.

    Returns:
        Shipment | None: The Shipment object, or None if not found.
    """
    from .models import Shipment
    try:
        return Shipment.objects.select_related(
            'order', 'shipping_method__carrier'
        ).prefetch_related(
            'status_updates', 'events'
        ).get(id=shipment_id)
    except Shipment.DoesNotExist:
        logger.info(f"Shipment with ID {shipment_id} not found.")
        return None

