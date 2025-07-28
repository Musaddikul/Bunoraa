# payments/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment, PaymentStatus
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Payment)
def update_order_status_on_payment_completion(sender, instance, created, **kwargs):
    """
    Signal receiver to update the associated order's status when a payment is completed.
    """
    # Only act if the payment is not a draft and its status is COMPLETED or CAPTURED
    if not created and instance.status in [PaymentStatus.COMPLETED, PaymentStatus.CAPTURED]:
        try:
            # Fetch the original instance to check if status actually changed
            original_instance = sender.objects.get(pk=instance.pk)
            if original_instance.status != instance.status:
                from custom_order.models import CustomOrder # Import here to avoid circular dependency
                order = CustomOrder.objects.filter(order_id=instance.order_id).first()
                if order and order.status != CustomOrder.Status.CONFIRMED:
                    order.status = CustomOrder.Status.CONFIRMED
                    order.save(update_fields=['status', 'updated_at'])
                    logger.info(f"Order {order.order_id} status updated to CONFIRMED due to payment {instance.id} completion.")
        except sender.DoesNotExist:
            logger.warning(f"Payment {instance.id} does not exist in DB during post_save signal. Skipping order update.")
        except Exception as e:
            logger.error(f"Error updating order status for payment {instance.id}: {e}", exc_info=True)

