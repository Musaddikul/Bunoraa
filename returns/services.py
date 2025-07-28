# returns/services.py
from .models import ReturnRequest, ReturnItem, ReturnEvent, ReturnReason
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
import requests

def request_return(user, order_id, items, reason_category_id, reason_text):
    from orders.models import Order, OrderItem
    try:
        order = Order.objects.get(pk=order_id, user=user)
    except Order.DoesNotExist:
        raise ValidationError("Order not found.")
    window = getattr(settings, 'RETURN_WINDOW_DAYS', 30)
    if order.delivered_at + timezone.timedelta(days=window) < timezone.now():
        raise ValidationError("Return window has expired.")
    try:
        reason = ReturnReason.objects.get(pk=reason_category_id)
    except ReturnReason.DoesNotExist:
        raise ValidationError("Invalid return reason.")
    rr = ReturnRequest.objects.create(
        order=order, user=user,
        reason_category=reason,
        reason_text=reason_text
    )
    rr.log_event('requested', notes=reason_text)
    for item in items:
        try:
            oi = OrderItem.objects.get(pk=item['order_item_id'], order=order)
        except OrderItem.DoesNotExist:
            rr.log_event('item_invalid', notes=f"{item['order_item_id']}")
            continue
        if item['quantity'] > oi.quantity:
            raise ValidationError(f"Quantity for item {oi.pk} exceeds purchased amount.")
        ReturnItem.objects.create(return_request=rr, order_item=oi, quantity=item['quantity'])
    return rr

def approve_return(return_request_id):
    try:
        rr = ReturnRequest.objects.get(pk=return_request_id)
    except ReturnRequest.DoesNotExist:
        raise ValidationError("Return request not found.")
    rr.approve()
    return rr

def generate_return_label(return_request_id):
    rr = ReturnRequest.objects.get(pk=return_request_id)
    payload = {
        "order_number": rr.order.order_number,
        "items": [{"id": i.order_item.pk, "qty": i.quantity} for i in rr.items.all()]
    }
    resp = requests.post(
        settings.RETURN_LABEL_API_URL,
        json=payload,
        headers={'Authorization': f"Bearer {settings.RETURN_LABEL_API_KEY}"}
    )
    if resp.status_code != 200:
        raise ValidationError("Label generation failed.")
    url = resp.json().get('label_url')
    rr.return_label_url = url
    rr.save()
    rr.log_event('label_generated', notes=url)
    return url

def process_refund(return_request_id):
    rr = ReturnRequest.objects.get(pk=return_request_id)
    total = Decimal('0.00')
    for item in rr.items.select_related('order_item'):
        price = item.order_item.price
        total += price * item.quantity
    rr.refund(total)
    return total
