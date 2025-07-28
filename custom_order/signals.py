# custom_order/signals.py
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from decimal import Decimal
import logging
from django.utils import timezone
from django.core.exceptions import ValidationError

from .models import CustomOrder, OrderStatusUpdate
from core.models import TaxSetting
from promotions.services import CouponService
from shipping.services import calculate_shipping_cost

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=CustomOrder)
def pre_save_order_pricing(sender, instance, **kwargs):
    """
    Signal to handle pricing calculations and status updates before saving a CustomOrder.
    Now properly respects is_draft flag.
    """
    if kwargs.get('raw'): # Skip if loading data directly from DB (e.g., fixtures)
        return

    logger.debug(f"pre_save_order_pricing signal received for order {instance.order_id if instance.pk else 'new order'}.")
    
    # Store original status for post_save comparison
    if instance.pk:
        try:
            original = sender.objects.get(pk=instance.pk)
            instance._original_status = original.status
            instance._original_is_draft = original.is_draft
        except sender.DoesNotExist:
            instance._original_status = None
            instance._original_is_draft = None
    
    # Handle status based on is_draft
    if instance.is_draft:
        instance.status = CustomOrder.Status.DRAFT
        logger.debug(f"Order identified as DRAFT. Status set to {instance.status}.")
        return  # Skip pricing calculations for drafts
    else:
        if not instance.pk or (instance.pk and getattr(instance, '_original_is_draft', False)):
            instance.status = CustomOrder.Status.PENDING
            logger.debug(f"Order identified as FINAL. Status set to {instance.status}.")
    
    # Only calculate pricing for non-draft orders
    try:
        # Calculate base price
        instance.base_price = (instance.fabric_type.base_price * 
                             instance.subcategory.base_price_multiplier * 
                             instance.quantity).quantize(Decimal('0.01'))
        logger.debug(f"Calculated base_price: {instance.base_price}")

        # Calculate VAT
        vat_rate = Decimal('0.10') # Default
        try:
            tax_setting = TaxSetting.objects.filter(is_active=True).first()
            if tax_setting:
                vat_rate = tax_setting.vat_rate
        except Exception as e:
            logger.error(f"Error fetching TaxSetting: {e}")

        instance.vat_amount = (instance.base_price * vat_rate).quantize(Decimal('0.01'))
        instance.vat_percentage = vat_rate * Decimal('100.00')
        logger.debug(f"Calculated vat_amount: {instance.vat_amount}")

        # Calculate discount
        instance.discount_amount = Decimal('0.00')
        if instance.coupon and instance.user:
            try:
                validated_coupon = CouponService.validate_coupon(instance.coupon.code, instance.base_price, instance.user)
                instance.discount_amount = CouponService.calculate_discount(instance.base_price, validated_coupon)
            except Exception as e:
                logger.error(f"Error applying coupon: {e}")
                instance.coupon = None
                instance.discount_amount = Decimal('0.00')

        # Calculate shipping cost
        instance.shipping_cost = Decimal('0.00')
        if instance.shipping_method and instance.shipping_address:
            instance.shipping_cost = calculate_shipping_cost(
                shipping_method=instance.shipping_method,
                address=instance.shipping_address,
                weight_kg=Decimal('0.5'),
                dimensions_cm={'l': Decimal('20'), 'w': Decimal('15'), 'h': Decimal('10')},
                order_total=instance.base_price
            )

        # Calculate total amount
        instance.total_amount = (instance.base_price + 
                               instance.vat_amount + 
                               instance.shipping_cost - 
                               instance.discount_amount).quantize(Decimal('0.01'))
        if instance.total_amount < 0:
            instance.total_amount = Decimal('0.00')

    except Exception as e:
        logger.error(f"Error calculating pricing: {e}")
        instance.base_price = Decimal('0.00')
        instance.vat_amount = Decimal('0.00')
        instance.discount_amount = Decimal('0.00')
        instance.shipping_cost = Decimal('0.00')
        instance.total_amount = Decimal('0.00')

@receiver(post_save, sender=CustomOrder)
def post_save_order_status_update(sender, instance, created, **kwargs):
    """
    Create status update records when order status changes.
    """
    if kwargs.get('raw'):
        return

    if created:
        OrderStatusUpdate.objects.create(
            order=instance,
            old_status=None,
            new_status=instance.status,
            notes="Order created",
            updated_by=instance.user
        )
    else:
        old_status = getattr(instance, '_original_status', None)
        if old_status != instance.status:
            OrderStatusUpdate.objects.create(
                order=instance,
                old_status=old_status,
                new_status=instance.status,
                notes="Status updated",
                updated_by=instance.user
            )