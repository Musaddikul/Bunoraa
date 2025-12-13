# apps/analytics/tasks.py
"""
Analytics Tasks
Background tasks for analytics processing.
"""
from celery import shared_task
from django.utils import timezone
from django.db.models import Sum, Count, Avg
from datetime import timedelta
from decimal import Decimal


@shared_task
def aggregate_daily_stats():
    """Aggregate daily statistics."""
    from .models import DailyStat, PageView, ProductView, SearchQuery
    from apps.orders.models import Order
    
    yesterday = timezone.now().date() - timedelta(days=1)
    
    # Page views
    page_views = PageView.objects.filter(timestamp__date=yesterday)
    total_views = page_views.count()
    unique_visitors = page_views.values('ip_address').distinct().count()
    
    # Product views
    product_views = ProductView.objects.filter(timestamp__date=yesterday).count()
    
    # Orders
    orders = Order.objects.filter(created_at__date=yesterday)
    orders_data = orders.filter(payment_status=Order.PaymentStatus.PAID).aggregate(
        count=Count('id'),
        revenue=Sum('total'),
        avg=Avg('total')
    )
    
    # Searches
    searches = SearchQuery.objects.filter(timestamp__date=yesterday).count()
    
    # Create or update stat
    DailyStat.objects.update_or_create(
        date=yesterday,
        defaults={
            'total_page_views': total_views,
            'unique_visitors': unique_visitors,
            'product_views': product_views,
            'orders_placed': orders_data['count'] or 0,
            'orders_revenue': orders_data['revenue'] or 0,
            'orders_average': orders_data['avg'] or 0,
            'total_searches': searches,
        }
    )


@shared_task
def generate_sales_report(period, start_date=None, end_date=None):
    """Generate sales report for a period."""
    from .models import SalesReport
    from apps.orders.models import Order
    from apps.payments.models import Refund
    
    if not end_date:
        end_date = timezone.now().date()
    if not start_date:
        if period == 'daily':
            start_date = end_date
        elif period == 'weekly':
            start_date = end_date - timedelta(days=7)
        elif period == 'monthly':
            start_date = end_date - timedelta(days=30)
        elif period == 'yearly':
            start_date = end_date - timedelta(days=365)
    
    # Query orders
    orders = Order.objects.filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
        payment_status=Order.PaymentStatus.PAID
    )
    
    order_stats = orders.aggregate(
        total=Count('id'),
        gross=Sum('total'),
        avg=Avg('total'),
        discounts=Sum('discount_amount'),
        shipping=Sum('shipping_cost'),
        tax=Sum('tax_amount')
    )
    
    # Units sold
    from apps.orders.models import OrderItem
    units = OrderItem.objects.filter(
        order__in=orders
    ).aggregate(total=Sum('quantity'))['total'] or 0
    
    # Refunds
    refunds = Refund.objects.filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
        status=Refund.Status.COMPLETED
    ).aggregate(
        total=Sum('amount'),
        count=Count('id')
    )
    
    # Calculate net revenue
    gross = order_stats['gross'] or Decimal('0')
    refund_total = refunds['total'] or Decimal('0')
    net = gross - refund_total
    
    # Create report
    report, created = SalesReport.objects.update_or_create(
        period=period,
        start_date=start_date,
        end_date=end_date,
        defaults={
            'gross_revenue': gross,
            'net_revenue': net,
            'total_orders': order_stats['total'] or 0,
            'average_order_value': order_stats['avg'] or 0,
            'units_sold': units,
            'total_discounts': order_stats['discounts'] or 0,
            'total_refunds': refund_total,
            'refund_count': refunds['count'] or 0,
            'shipping_revenue': order_stats['shipping'] or 0,
            'tax_collected': order_stats['tax'] or 0,
        }
    )
    
    return report.id


@shared_task
def cleanup_old_analytics():
    """Clean up old analytics data."""
    from .models import PageView, ProductView, SearchQuery
    
    # Keep only last 90 days of detailed data
    cutoff = timezone.now() - timedelta(days=90)
    
    PageView.objects.filter(timestamp__lt=cutoff).delete()
    ProductView.objects.filter(timestamp__lt=cutoff).delete()
    SearchQuery.objects.filter(timestamp__lt=cutoff).delete()
