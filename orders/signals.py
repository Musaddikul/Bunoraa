# orders/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .services import EmailService, OrderService

@receiver(post_save, sender=Order)
def handle_order_events(sender, instance, created, **kwargs):
    """
    Handles events after an Order is saved.
    """
    if created:
        # Order is newly created
        EmailService.send_order_confirmation(instance.id)
        OrderService.generate_invoice(instance.id)
    
    else:
        # Order is being updated
        update_fields = kwargs.get("update_fields") or set()
        if "status" in update_fields:
            status_name = instance.status.name.lower()
            
            if status_name == "shipped":
                EmailService.send_order_shipped(instance.id)
            elif status_name == "cancelled":
                # A reason could be stored on the model or passed via other means
                EmailService.send_order_cancellation(instance.id, reason="Order was cancelled.")