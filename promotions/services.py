# promotions/services.py
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
import logging
from typing import Optional

from .models import Coupon
# Assuming your Order model is in an 'orders' app.
# If not, you'll need to adjust this import or pass the Order model dynamically.
# from orders.models import Order # This line is commented out to remove direct dependency

logger = logging.getLogger(__name__)

class CouponService:
    """
    Service class for handling all business logic related to coupons,
    including validation, discount calculation, and usage tracking.
    """

    @staticmethod
    def validate_coupon(
        code: str,
        order_total: Decimal,
        user=None
    ) -> Coupon:
        """
        Performs comprehensive validation of a coupon against various criteria.

        :param code: The coupon code to validate.
        :param order_total: The current total amount of the order.
        :param user: The user attempting to use the coupon (optional, for per-user limits).
        :return: The validated Coupon object.
        :raises ValidationError: If the coupon is invalid for any reason.
        """
        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            logger.warning(f"Coupon validation failed: Invalid coupon code '{code}'.")
            raise ValidationError(_("Invalid coupon code."))

        # Check basic validity
        if not coupon.is_active:
            logger.warning(f"Coupon validation failed for '{code}': Coupon is not active.")
            raise ValidationError(_("Coupon is not active."))

        current_time = timezone.now()
        if coupon.valid_from and coupon.valid_from > current_time:
            logger.warning(f"Coupon validation failed for '{code}': Coupon not yet active (valid from {coupon.valid_from}).")
            raise ValidationError(_("Coupon is not yet active."))

        if coupon.valid_until and coupon.valid_until < current_time:
            logger.warning(f"Coupon validation failed for '{code}': Coupon has expired (valid until {coupon.valid_until}).")
            raise ValidationError(_("Coupon has expired."))

        # Check order amount requirements
        if coupon.minimum_order_amount and order_total < coupon.minimum_order_amount:
            logger.warning(
                f"Coupon validation failed for '{code}': Order total {order_total} "
                f"is below minimum required {coupon.minimum_order_amount}."
            )
            raise ValidationError(_(
                f"Minimum order amount of {coupon.minimum_order_amount} BDT required."
            ))

        # Check total usage limits
        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            logger.warning(
                f"Coupon validation failed for '{code}': Total usage limit ({coupon.usage_limit}) reached."
            )
            raise ValidationError(_(
                "This coupon has reached its maximum usage limit."
            ))

        # Check per-user usage limits
        if user and user.is_authenticated and coupon.usage_limit_per_user:
            # We check if the user is already in the ManyToMany field and if their usage count
            # (which would typically be tracked in the Order model or a dedicated CouponUsage model)
            # has reached the limit.
            # For simplicity, if the user is in `users_used` and usage_limit_per_user is 1, it's used.
            # For more complex scenarios (e.g., user can use it 3 times), you'd need to query
            # the Order model or a specific CouponUsage model for this user and coupon.
            # Example (if Order model has a `coupon` ForeignKey and `user` ForeignKey):
            # from orders.models import Order
            # user_usage_count = Order.objects.filter(
            #     user=user,
            #     coupon=coupon,
            #     status__in=['completed', 'processing'] # Only count successful orders
            # ).count()
            # if user_usage_count >= coupon.usage_limit_per_user:
            #     logger.warning(
            #         f"Coupon validation failed for '{code}': User {user.id} has reached "
            #         f"their usage limit ({coupon.usage_limit_per_user})."
            #     )
            #     raise ValidationError(_(
            #         "You've reached the usage limit for this coupon."
            #     ))

            # A more direct check using the ManyToMany field for simplicity if usage_limit_per_user is typically 1
            if coupon.users_used.filter(pk=user.pk).exists() and coupon.usage_limit_per_user == 1:
                logger.warning(
                    f"Coupon validation failed for '{code}': User {user.id} has already used this single-use coupon."
                )
                raise ValidationError(_(
                    "You've reached the usage limit for this coupon."
                ))
            # For usage_limit_per_user > 1, you MUST query your Order model or a dedicated CouponUsage model
            # as the `users_used` M2M only tracks *if* they've used it, not *how many times*.
            # The commented out block above is the correct way for usage_limit_per_user > 1.
            # Ensure your `orders` app is set up to track coupons on orders.

        logger.info(f"Coupon '{code}' validated successfully for order total {order_total}.")
        return coupon

    @staticmethod
    def calculate_discount(
        amount: Decimal,
        coupon: Coupon
    ) -> Decimal:
        """
        Calculates the discount amount based on the coupon type and value.

        :param amount: The total amount to which the discount is applied.
        :param coupon: The Coupon object.
        :return: The calculated discount amount.
        """
        if not coupon.is_active:
            logger.info(f"Cannot calculate discount for inactive coupon '{coupon.code}'. Returning 0.")
            return Decimal('0.00')

        discount = Decimal('0.00')
        if coupon.discount_type == Coupon.PERCENTAGE:
            discount = amount * coupon.discount_value / Decimal('100.00')
            if coupon.max_discount_amount:
                discount = min(discount, coupon.max_discount_amount)
            logger.debug(f"Calculated percentage discount for '{coupon.code}': {discount} on {amount}.")
        elif coupon.discount_type == Coupon.FIXED_AMOUNT:
            discount = coupon.discount_value
            logger.debug(f"Calculated fixed discount for '{coupon.code}': {discount}.")
        else:
            logger.warning(f"Unknown discount type '{coupon.discount_type}' for coupon '{coupon.code}'. Returning 0.")

        # Ensure discount does not exceed the original amount
        discount = min(discount, amount)

        return discount.quantize(Decimal('0.01'))

    @classmethod
    def apply_coupon(
        cls,
        code: str,
        target_amount: Decimal,
        user=None
    ) -> dict:
        """
        Performs the full coupon application process: validates the coupon and calculates the discount.
        This method does NOT mark the coupon as used. Usage tracking should occur
        after a successful transaction (e.g., in the order creation/payment process).

        :param code: The coupon code to apply.
        :param target_amount: The total amount to apply the coupon to.
        :param user: The user attempting to apply the coupon (optional).
        :return: A dictionary containing the coupon object, discount amount, and new total.
        :raises ValidationError: If the coupon is invalid.
        """
        coupon = cls.validate_coupon(code, target_amount, user)
        discount = cls.calculate_discount(target_amount, coupon)

        new_total = target_amount - discount
        logger.info(
            f"Coupon '{code}' applied. Original total: {target_amount}, "
            f"Discount: {discount}, New total: {new_total}."
        )

        return {
            'coupon': coupon,
            'discount_amount': discount,
            'new_total': new_total
        }

    @staticmethod
    def mark_coupon_as_used(coupon: Coupon, user=None):
        """
        Marks a coupon as used by incrementing its `used_count` and associating the user.
        This method should be called by the consuming application (e.g., orders app)
        ONLY AFTER a successful transaction where the coupon was applied.

        :param coupon: The Coupon object to mark as used.
        :param user: The user who used the coupon (optional).
        """
        if not isinstance(coupon, Coupon):
            logger.error(f"Attempted to mark non-Coupon object as used: {type(coupon)}")
            raise TypeError("Expected a Coupon object.")

        try:
            coupon.increment_usage(user)
            logger.info(f"Coupon '{coupon.code}' usage incremented. New count: {coupon.used_count}.")
            if user and user.is_authenticated:
                logger.info(f"User '{user.id}' added to users_used for coupon '{coupon.code}'.")
        except Exception as e:
            logger.error(f"Failed to increment usage for coupon '{coupon.code}': {e}", exc_info=True)
            raise

# Module-level functions for backward compatibility
def validate_coupon_for_order(*args, **kwargs):
    return CouponService.validate_coupon(*args, **kwargs)

def calculate_discount(*args, **kwargs):
    return CouponService.calculate_discount(*args, **kwargs)

def apply_coupon_to_target(*args, **kwargs):
    result = CouponService.apply_coupon(*args, **kwargs)
    return result['coupon']

