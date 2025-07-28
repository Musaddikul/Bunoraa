# analytics/selectors.py
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from .models import DailyMetrics

CACHE_TTL = 300  # seconds

def get_latest_metrics():
    """
    Returns today's metrics (if computed) or empty.
    """
    today = timezone.now().date()
    cache_key = f"analytics_metrics_{today}"
    metrics = cache.get(cache_key)
    if metrics is None:
        try:
            m = DailyMetrics.objects.get(date=today)
            metrics = {
                'total_orders': m.total_orders,
                'total_revenue': float(m.total_revenue),
                'avg_order_value': float(m.avg_order_value),
                'new_users': m.new_users,
                'returning_users': m.returning_users
            }
        except DailyMetrics.DoesNotExist:
            metrics = {}
        cache.set(cache_key, metrics, CACHE_TTL)
    return metrics

def get_metrics_range(days=7):
    """
    Returns time-series of daily total_orders and total_revenue for the past N days.
    """
    end = timezone.now().date()
    start = end - timedelta(days=days-1)
    qs = DailyMetrics.objects.filter(date__range=(start, end)).order_by('date')
    return [
        {
            'date': m.date.isoformat(),
            'total_orders': m.total_orders,
            'total_revenue': float(m.total_revenue)
        }
        for m in qs
    ]
