# analytics/services.py
from django.db.models import Sum, Count
from django.utils import timezone
from .models import DailyMetrics
from orders.models import Order
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta

def compute_daily_metrics(date_str=None):
    """
    Aggregates yesterday's data into DailyMetrics.
    """
    if date_str:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    else:
        date = timezone.now().date() - timedelta(days=1)
    start = datetime.combine(date, datetime.min.time())
    end   = datetime.combine(date, datetime.max.time())

    total_orders = Order.objects.filter(created_at__range=(start, end)).count()
    total_revenue = Order.objects.filter(created_at__range=(start, end)) \
                     .aggregate(sum=Sum('total'))['sum'] or 0
    avg_order_value = (total_revenue / total_orders) if total_orders else 0

    User = get_user_model()
    new_users = User.objects.filter(date_joined__range=(start, end)).count()
    returning_users = Order.objects.filter(created_at__range=(start, end)) \
                      .exclude(user__date_joined__range=(start, end)) \
                      .values('user').distinct().count()

    DailyMetrics.objects.update_or_create(
        date=date,
        defaults={
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'avg_order_value': avg_order_value,
            'new_users': new_users,
            'returning_users': returning_users
        }
    )
