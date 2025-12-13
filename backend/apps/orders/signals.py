# apps/orders/signals.py
"""
Order signals.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Order


@receiver(post_save, sender=Order)
def order_created_handler(sender, instance, created, **kwargs):
    """Handle order creation."""
    if created:
        # Send order confirmation email
        from .tasks import send_order_confirmation_email
        send_order_confirmation_email.delay(str(instance.id))


@receiver(post_save, sender=Order)
def order_status_changed_handler(sender, instance, **kwargs):
    """Handle order status changes."""
    # Check if status changed (using tracker or comparing)
    if hasattr(instance, '_status_changed') and instance._status_changed:
        from .tasks import send_order_status_email
        send_order_status_email.delay(str(instance.id))
