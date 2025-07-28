# custom_order/selectors.py
from django.core.cache import cache
from django.db.models import Count, Sum, Prefetch
from django.utils import timezone
from .models import CustomOrder, DesignImage, CustomerItemImage, OrderStatusUpdate
from shipping.models import ShippingMethod

CACHE_TTL = 300

def get_user_orders(user, include_drafts=False):
    """
    Get all orders for a user with optimized queries
    """
    base_qs = CustomOrder.objects.filter(user=user)

    if not include_drafts:
        base_qs = base_qs.filter(is_draft=False)

    return base_qs.select_related(
        'category', 'subcategory', 'fabric_type',
        'size_option', 'color_option',
        'shipping_method',
        'shipping_address',
        'payment_method', 'coupon'
    ).prefetch_related(
        Prefetch('design_images', queryset=DesignImage.objects.order_by('-is_primary', 'created_at')),
        Prefetch('customer_item_images', queryset=CustomerItemImage.objects.order_by('created_at')),
        Prefetch('status_updates', queryset=OrderStatusUpdate.objects.order_by('-created_at'))
    ).order_by('-created_at')

def get_order(order_id):
    """
    Get a single order with all related data, using cache
    """
    cache_key = f"order_{order_id}"
    order = cache.get(cache_key)

    if not order:
        order = CustomOrder.objects.select_related(
            'user', 'category', 'subcategory', 'fabric_type',
            'size_option', 'color_option',
            'shipping_method',
            'shipping_address',
            'payment_method', 'coupon'
        ).prefetch_related(
            Prefetch('design_images', queryset=DesignImage.objects.order_by('-is_primary', 'created_at')),
            Prefetch('customer_item_images', queryset=CustomerItemImage.objects.order_by('created_at')),
            Prefetch('status_updates', queryset=OrderStatusUpdate.objects.order_by('-created_at'))
        ).get(order_id=order_id)

        cache.set(cache_key, order, CACHE_TTL)

    return order

def get_dashboard_stats(user=None):
    """
    Get statistics for dashboard, optionally filtered by user
    """
    today = timezone.now().date()
    qs = CustomOrder.objects.filter(created_at__date=today)

    if user:
        qs = qs.filter(user=user)

    stats = {
        'today': qs.count(),
        'pending': qs.filter(status='pending').count(),
        'confirmed': qs.filter(status='confirmed').count(),
        'in_progress': qs.filter(status='in_progress').count(),
        'completed': qs.filter(status__in=['ready', 'shipped', 'delivered']).count(),
        'revenue': qs.aggregate(total=Sum('total_amount'))['total'] or 0,
    }

    return stats

def get_category_stats():
    """
    Get statistics by category with caching
    """
    cache_key = "category_stats"
    stats = cache.get(cache_key)

    if not stats:
        stats = list(
            CustomOrder.objects
            .values('category__name')
            .annotate(
                order_count=Count('id'),
                total_revenue=Sum('total_amount')
            )
            .order_by('category__name')
        )
        cache.set(cache_key, stats, CACHE_TTL)

    return stats
