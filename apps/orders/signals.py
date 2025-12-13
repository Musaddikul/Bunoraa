# apps/orders/signals.py
"""
Order Signals
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order, OrderStatusHistory


@receiver(pre_save, sender=Order)
def track_status_change(sender, instance, **kwargs):
    """Track when order status changes."""
    if instance.pk:
        try:
            old_instance = Order.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Order)
def create_status_history(sender, instance, created, **kwargs):
    """Create status history entry when status changes."""
    if created:
        OrderStatusHistory.objects.create(
            order=instance,
            status=instance.status,
            previous_status='',
            note='Order created'
        )
    elif hasattr(instance, '_old_status') and instance._old_status != instance.status:
        OrderStatusHistory.objects.create(
            order=instance,
            status=instance.status,
            previous_status=instance._old_status or ''
        )


@receiver(post_save, sender=Order)
def send_order_notifications(sender, instance, created, **kwargs):
    """Send notifications on order events."""
    from apps.notifications.tasks import send_order_notification
    
    try:
        if created:
            send_order_notification.delay(instance.id, 'created')
        elif hasattr(instance, '_old_status') and instance._old_status != instance.status:
            send_order_notification.delay(instance.id, instance.status)
    except:
        pass  # Notification service unavailable
