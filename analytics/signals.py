# analytics/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from .models import OrderEvent

@receiver(post_save, sender=Order)
def record_order_event(sender, instance, created, **kwargs):
    status = 'created' if created else instance.status
    OrderEvent.objects.create(
        order=instance,
        status=status,
        amount=instance.total,
        timestamp=instance.updated_at
    )
