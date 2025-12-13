# apps/orders/tasks.py
"""
Order Celery tasks.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


@shared_task
def send_order_confirmation_email(order_id):
    """Send order confirmation email to customer."""
    from .models import Order
    from .services import OrderService
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    summary = OrderService.get_order_summary(order)
    
    subject = f'Order Confirmation - {order.order_number}'
    
    # HTML email
    html_message = render_to_string('emails/order_confirmation.html', {
        'order': order,
        'summary': summary,
    })
    
    # Plain text fallback
    plain_message = f"""
Thank you for your order!

Order Number: {order.order_number}
Status: {order.get_status_display()}
Total: ${order.total}

We'll send you another email when your order ships.

Thank you for shopping with Bunoraa!
"""
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        html_message=html_message,
        fail_silently=True
    )


@shared_task
def send_order_status_email(order_id):
    """Send order status update email."""
    from .models import Order
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    status_messages = {
        'confirmed': 'Your order has been confirmed and is being prepared.',
        'processing': 'Your order is being processed.',
        'shipped': f'Your order has been shipped! Tracking: {order.tracking_number}',
        'delivered': 'Your order has been delivered. Enjoy!',
        'cancelled': 'Your order has been cancelled.',
    }
    
    message = status_messages.get(
        order.status,
        f'Your order status has been updated to: {order.get_status_display()}'
    )
    
    subject = f'Order Update - {order.order_number}'
    
    html_message = render_to_string('emails/order_status_update.html', {
        'order': order,
        'message': message,
    })
    
    plain_message = f"""
Order Update - {order.order_number}

{message}

You can track your order at: {settings.SITE_URL}/orders/{order.order_number}

Thank you for shopping with Bunoraa!
"""
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        html_message=html_message,
        fail_silently=True
    )


@shared_task
def send_shipping_notification(order_id):
    """Send shipping notification with tracking info."""
    from .models import Order
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    subject = f'Your Order Has Shipped - {order.order_number}'
    
    html_message = render_to_string('emails/shipping_notification.html', {
        'order': order,
    })
    
    plain_message = f"""
Great news! Your order has shipped!

Order Number: {order.order_number}
Shipping Method: {order.shipping_method}
Tracking Number: {order.tracking_number}
Track Your Package: {order.tracking_url}

Shipping Address:
{order.shipping_full_address}

Thank you for shopping with Bunoraa!
"""
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        html_message=html_message,
        fail_silently=True
    )


@shared_task
def cleanup_abandoned_orders():
    """Clean up orders that were never paid after 24 hours."""
    from datetime import timedelta
    from django.utils import timezone
    from .models import Order
    
    cutoff = timezone.now() - timedelta(hours=24)
    
    abandoned = Order.objects.filter(
        status=Order.Status.PENDING,
        payment_status=Order.PaymentStatus.PENDING,
        created_at__lt=cutoff
    )
    
    count = abandoned.count()
    abandoned.delete()
    
    return f'Deleted {count} abandoned orders'


@shared_task
def generate_daily_order_report():
    """Generate daily order report for admin."""
    from datetime import timedelta
    from django.utils import timezone
    from django.db.models import Sum, Count
    from .models import Order
    
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    
    orders = Order.objects.filter(created_at__date=yesterday)
    
    report = {
        'date': str(yesterday),
        'total_orders': orders.count(),
        'total_revenue': orders.filter(
            payment_status=Order.PaymentStatus.PAID
        ).aggregate(total=Sum('total'))['total'] or 0,
        'orders_by_status': dict(orders.values_list('status').annotate(count=Count('id'))),
        'average_order_value': orders.aggregate(
            avg=Sum('total') / Count('id')
        )['avg'] or 0,
    }
    
    # TODO: Send report to admin email or save to analytics
    
    return report
