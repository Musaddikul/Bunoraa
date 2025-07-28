# returns/selectors.py
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import ReturnRequest, ReturnItem, ReturnReason
from orders.models import Order

def get_return_requests_for_user(user):
    return ReturnRequest.objects.filter(user=user, is_active=True)\
        .select_related('order','reason_category')\
        .prefetch_related('items','events')

def get_eligible_orders_for_user(user):
    window = getattr(settings, 'RETURN_WINDOW_DAYS', 30)
    cutoff = timezone.now() - timedelta(days=window)
    return Order.objects.filter(user=user, status='delivered', delivered_at__gte=cutoff)

def get_return_reasons():
    return ReturnReason.objects.all()

def get_return_items_for_request(request_id):
    return ReturnItem.objects.filter(return_request_id=request_id)\
        .select_related('order_item__product')
