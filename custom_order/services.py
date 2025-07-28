# custom_order/services.py
from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
# Removed signal imports as they are now handled in apps.py and signals.py
from .models import CustomOrder
from core.models import TaxSetting
from promotions.services import CouponService
from shipping.services import calculate_shipping_cost
from payments.services import create_payment_intent
import logging

logger = logging.getLogger(__name__)

# Note: calculate_base_price and calculate_vat are now also used by signals.py
# and should not contain any save() calls. They are pure calculation functions.

def calculate_base_price(order: CustomOrder) -> Decimal:
    """
    Calculates the base price of an order based on fabric type, subcategory multiplier, and quantity.

    Args:
        order (CustomOrder): The CustomOrder instance.

    Returns:
        Decimal: The calculated base price.

    Raises:
        ValidationError: If essential data for calculation is missing or an error occurs.
    """
    if not all([order.fabric_type, order.subcategory, order.quantity]):
        logger.warning(f"Incomplete data for base price calculation in order {order.order_id if order.pk else 'new order'}. Returning 0.00.")
        return Decimal('0.00')

    try:
        base_price = order.fabric_type.base_price
        multiplier = order.subcategory.base_price_multiplier
        return (base_price * multiplier * order.quantity).quantize(Decimal('0.01'))
    except Exception as e:
        logger.error(f"Error calculating base price for order {order.order_id if order.pk else 'new order'}: {str(e)}", exc_info=True)
        raise ValidationError(_('Error calculating base price.'))

def calculate_vat(amount: Decimal, percentage: Decimal = None) -> Decimal:
    """
    Calculates VAT (Value Added Tax) by fetching the rate from the database.
    If a percentage is provided (as a decimal, e.g., 0.10 for 10%), it uses that.
    Otherwise, it fetches from TaxSetting (which stores rate as decimal).
    """
    VAT_RATE = Decimal('0.00')
    if percentage is not None:
        # If percentage is provided, assume it's already in decimal form (e.g., 0.10)
        VAT_RATE = percentage
    else:
        try:
            tax_setting = TaxSetting.objects.filter(is_active=True).first()
            if tax_setting:
                VAT_RATE = tax_setting.vat_rate # Use directly, as it's already a decimal
            else:
                VAT_RATE = Decimal('0.10') # Default 10% (as decimal)
                logger.warning("No active TaxSetting found in database. Using default VAT rate of 10%.")
        except Exception as e:
            logger.error(f"Error fetching VAT rate from database: {e}", exc_info=True)
            VAT_RATE = Decimal('0.10') # Fallback to default on error

    return (amount * VAT_RATE).quantize(Decimal('0.01'))

@transaction.atomic
def finalize_pricing(order: CustomOrder) -> CustomOrder:
    """
    Finalizes the pricing for a custom order, including base price, VAT, discount, and shipping.
    This function updates the order object's price fields and saves it.
    This is intended for explicit calls, not for signal-driven updates.

    Args:
        order (CustomOrder): The CustomOrder instance to finalize pricing for.

    Returns:
        CustomOrder: The updated CustomOrder instance.

    Raises:
        Exception: If any error occurs during pricing finalization.
    """
    logger.debug(f"Explicit finalize_pricing call for order {order.order_id if order.pk else 'new order'}")
    try:
        # Use the calculation logic that is also used by the pre_save signal
        order.base_price = calculate_base_price(order)
        order.vat_amount = calculate_vat(order.base_price, percentage=order.vat_percentage)

        order.discount_amount = Decimal('0.00')
        if order.coupon:
            logger.debug(f"Coupon '{order.coupon.code}' found for explicit finalize_pricing. Attempting validation and discount calculation.")
            try:
                validated_coupon = CouponService.validate_coupon(order.coupon.code, order.base_price, order.user)
                order.discount_amount = CouponService.calculate_discount(order.base_price, validated_coupon)
                logger.debug(f"Coupon '{order.coupon.code}' applied. Discount: {order.discount_amount}")
            except ValidationError as e:
                logger.warning(f"Coupon '{order.coupon.code}' validation failed during explicit finalize_pricing: {e.message}. Clearing coupon.")
                order.coupon = None
                order.discount_amount = Decimal('0.00')
            except Exception as e:
                logger.error(f"Error validating/calculating discount for coupon '{order.coupon.code}' in explicit finalize_pricing: {str(e)}", exc_info=True)
                order.coupon = None
                order.discount_amount = Decimal('0.00')
        else:
            logger.debug(f"No coupon found for explicit finalize_pricing. Discount set to 0.00.")

        mock_weight_kg = Decimal('0.5')
        mock_dims_cm = {'l': Decimal('20'), 'w': Decimal('15'), 'h': Decimal('10')}

        if order.shipping_method and order.shipping_address:
            order.shipping_cost = calculate_shipping_cost(
                shipping_method=order.shipping_method,
                address=order.shipping_address,
                weight_kg=mock_weight_kg,
                dimensions_cm=mock_dims_cm,
                order_total=order.base_price,
                is_express=order.shipping_method.is_express
            )
            logger.debug(f"Shipping cost calculated for explicit finalize_pricing: {order.shipping_cost}")
        else:
            order.shipping_cost = Decimal('0.00')
            logger.debug("Shipping method or address missing for explicit finalize_pricing. Shipping cost set to 0.00.")

        order.total_amount = (order.base_price + order.vat_amount + order.shipping_cost - order.discount_amount).quantize(Decimal('0.01'))
        if order.total_amount < 0:
            order.total_amount = Decimal('0.00')
        logger.debug(f"Calculated total_amount for explicit finalize_pricing: {order.total_amount}")

        # This save() is now safe because the pre_save signal will only modify the instance, not call save() again.
        order.save(update_fields=[
            'base_price', 'shipping_cost', 'vat_amount', 'discount_amount',
            'total_amount', 'coupon', 'updated_at', 'vat_percentage' # Include vat_percentage in update_fields
        ])
        logger.debug(f"Explicit finalize_pricing saved order {order.order_id if order.pk else 'new order'}.")
        return order
    except Exception as e:
        logger.error(f"Error during explicit finalize_pricing for order {order.order_id if order.pk else 'new order'}: {str(e)}", exc_info=True)
        raise


@transaction.atomic
def create_order_from_draft(order: CustomOrder, user) -> tuple[CustomOrder, dict | None]:
    """
    Converts a draft order to a pending order with necessary validations.
    Also creates a shipment record if shipping method and address are provided,
    initiates payment if an online payment method is selected, and marks the coupon as used.

    Args:
        order (CustomOrder): The draft CustomOrder instance.
        user (User): The user submitting the order.

    Returns:
        tuple[CustomOrder, dict | None]: The updated CustomOrder instance (now pending)
                                         and a dictionary of payment intent details (if applicable).

    Raises:
        ValidationError: If required fields are missing or order type specific
                         requirements are not met, or payment initiation fails.
    """
    if not order.is_draft:
        logger.warning(f"create_order_from_draft called for non-draft order {order.order_id}. This function expects a draft order. Skipping finalization steps.")
        return order, None

    payment_intent_details = None
    logger.debug(f"Attempting to finalize draft order {order.order_id}. Initial status: {order.status}, is_draft: {order.is_draft}")

    try:
        # Re-finalize pricing to ensure all calculations are up-to-date before final submission
        # This will trigger the pre_save signal, which updates pricing fields.
        # Then, this function will save the order, committing the changes.
        finalize_pricing(order) # This call will now save the order
        logger.debug(f"Pricing re-finalized for order {order.order_id} within create_order_from_draft. Total: {order.total_amount}, VAT: {order.vat_amount}, Discount: {order.discount_amount}")


        if not all([
            order.customer_name,
            order.phone,
            order.email,
        ]):
            raise ValidationError(_('Customer name, phone, and email are required.'))

        if order.order_type != CustomOrder.OrderType.DIRECT_CONTACT:
            if not all([
                order.shipping_method,
                order.payment_method,
                order.category,
                order.subcategory,
                order.fabric_type,
                order.quantity,
            ]):
                raise ValidationError(_('Category, subcategory, fabric type, quantity, shipping method, and payment method are required for this order type.'))

            if order.order_type == CustomOrder.OrderType.OWN_DESIGN and not order.design_description:
                raise ValidationError(_('Design description is required for own design orders.'))

            if order.order_type == CustomOrder.OrderType.SEND_PRODUCT and not order.customer_item_description:
                raise ValidationError(_('Item description is required for send product orders.'))

            if order.shipping_method and order.shipping_address and not hasattr(order, 'shipment'):
                mock_weight_kg = Decimal('0.5')
                mock_dims_cm = {'l': Decimal('20'), 'w': Decimal('15'), 'h': Decimal('10')}

                create_shipment_for_order(
                    order=order,
                    shipping_method=order.shipping_method,
                    cost=order.shipping_cost,
                    weight_kg=mock_weight_kg,
                    dims_cm=mock_dims_cm,
                    notes=_("Shipment created automatically upon order submission.")
                )
                logger.debug(f"Shipment created for order {order.order_id}.")

            if order.payment_method and order.payment_method.is_online:
                if not order.total_amount or order.total_amount <= 0:
                    raise ValidationError(_("Cannot initiate payment for zero or negative total amount."))

                payment_intent_details = create_payment_intent(
                    user=user,
                    order=order,
                    amount=order.total_amount,
                    payment_method_code=order.payment_method.code,
                    currency='BDT',
                    is_test=False
                )
                logger.info(f"Payment intent created for order {order.order_id}: {payment_intent_details}")
            else:
                logger.info(f"Order {order.order_id} uses offline payment method. Skipping payment intent creation.")

        # Set status and is_draft for final order
        logger.debug(f"Before final save for order {order.order_id} in create_order_from_draft: Current status={order.status}, is_draft={order.is_draft}")
        order.is_draft = False
        order.status = CustomOrder.Status.PENDING
        order.save(update_fields=['is_draft', 'status']) # Save again to ensure status is updated
        logger.info(f"Order {order.order_id} successfully finalized. Final Status: {order.status}, Final Is Draft: {order.is_draft}")

        if order.coupon:
            try:
                CouponService.mark_coupon_as_used(order.coupon, user)
                logger.info(f"Coupon '{order.coupon.code}' marked as used for order {order.order_id} by user {user.id}.")
            except Exception as e:
                logger.error(f"Failed to mark coupon '{order.coupon.code}' as used for order {order.order_id}: {e}", exc_info=True)

        return order, payment_intent_details

    except ValidationError as e:
        logger.error(f"Validation error finalizing order {order.order_id}: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Error finalizing order {order.order_id}: {str(e)}", exc_info=True)
        raise ValidationError(_(f"Failed to finalize order: {str(e)}"))
