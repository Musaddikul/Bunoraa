# analytics/utils.py
from .selectors import get_latest_metrics
from orders.models import Order
from django.db.models import Sum

def get_sales_report(period='daily'):
    """
    Legacy compatibility: returns live or cached daily metrics.
    """
    if period == 'live':
        return {
            'total_orders': Order.objects.count(),
            'total_revenue': Order.objects.aggregate(sum=Sum('total'))['sum'] or 0
        }
    return get_latest_metrics()
