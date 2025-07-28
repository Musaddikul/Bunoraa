# promotions/models.py
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.conf import settings

class Coupon(models.Model):
    """
    Represents a discount coupon that can be applied to orders.
    Supports percentage and fixed amount discounts, with various validity and usage constraints.
    """
    PERCENTAGE = 'percent'
    FIXED_AMOUNT = 'fixed'
    DISCOUNT_TYPE_CHOICES = [
        (PERCENTAGE, _('Percentage')),
        (FIXED_AMOUNT, _('Fixed Amount')),
    ]

    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_("Coupon Code"),
        help_text=_("Unique code for the coupon (e.g., SUMMER20, FLAT100)")
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Description"),
        help_text=_("A brief description of the coupon's purpose or offer.")
    )
    discount_type = models.CharField(
        max_length=10,
        choices=DISCOUNT_TYPE_CHOICES,
        default=FIXED_AMOUNT,
        verbose_name=_("Discount Type"),
        help_text=_("Choose whether the discount is a percentage or a fixed amount.")
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Discount Value"),
        help_text=_("The value of the discount (e.g., 10 for 10% or 100 for ৳100 off).")
    )
    minimum_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Minimum Order Amount"),
        help_text=_("The minimum total amount of the order required to use this coupon. Leave blank for no minimum.")
    )
    max_discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Maximum Discount Amount"),
        help_text=_("For percentage discounts, the maximum amount that can be discounted. Leave blank for no maximum.")
    )
    valid_from = models.DateTimeField(
        default=timezone.now,
        verbose_name=_("Valid From"),
        help_text=_("The date and time from which the coupon becomes active.")
    )
    valid_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Valid Until"),
        help_text=_("The date and time until which the coupon is valid. Leave blank for no expiry.")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is Active"),
        help_text=_("Designates whether this coupon can currently be used.")
    )
    usage_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Total Usage Limit"),
        help_text=_("The maximum number of times this coupon can be used overall. Leave blank for unlimited.")
    )
    usage_limit_per_user = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Usage Limit Per User"),
        help_text=_("The maximum number of times a single user can use this coupon. Leave blank for unlimited.")
    )
    used_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Times Used"),
        help_text=_("The number of times this coupon has been successfully used.")
    )
    users_used = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='used_coupons',
        verbose_name=_("Users Who Used This Coupon"),
        help_text=_("Users who have successfully applied this coupon.")
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        verbose_name=_("Created At")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At")
    )

    class Meta:
        verbose_name = _("Coupon")
        verbose_name_plural = _("Coupons")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'valid_from', 'valid_until']),
        ]

    def __str__(self):
        """
        Returns the string representation of the coupon, which is its code.
        """
        return self.code

    def clean(self):
        """
        Performs custom validation for the Coupon model.
        Ensures percentage discounts are within bounds and have a max_discount_amount,
        and that valid_from is not after valid_until.
        """
        if self.discount_type == self.PERCENTAGE:
            if self.discount_value > 100:
                raise ValidationError(
                    _("Percentage discount cannot exceed 100%.")
                )
            if not self.max_discount_amount:
                raise ValidationError(
                    _("Percentage coupons require a maximum discount amount (Max Discount Amount field).")
                )
        elif self.discount_type == self.FIXED_AMOUNT:
            if self.max_discount_amount is not None:
                raise ValidationError(
                    _("Fixed amount coupons should not have a maximum discount amount.")
                )

        if self.valid_until and self.valid_from and self.valid_from > self.valid_until:
            raise ValidationError(
                _("Valid from date cannot be after valid until date.")
            )

    def save(self, *args, **kwargs):
        """
        Overrides the save method to ensure full validation is performed before saving.
        """
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_expired(self) -> bool:
        """
        Checks if the coupon has expired based on its valid_until date.
        Returns True if expired, False otherwise.
        """
        if self.valid_until and self.valid_until < timezone.now():
            return True
        return False

    def is_valid_for_order(self, order_total: Decimal, user=None) -> bool:
        """
        Convenience method to quickly check if a coupon is valid for a given order total and user.
        This method uses the CouponService for comprehensive validation.
        """
        try:
            from .services import CouponService
            CouponService.validate_coupon(self.code, order_total, user)
            return True
        except ValidationError:
            return False

    def increment_usage(self, user=None):
        """
        Atomically increments the usage count of the coupon and adds the user to `users_used`.
        This method should be called only after a successful order application.
        """
        from django.db import transaction
        with transaction.atomic():
            self.refresh_from_db()  # Get the latest state of the object
            self.used_count = models.F('used_count') + 1
            self.save(update_fields=['used_count', 'updated_at'])

            if user and user.is_authenticated:
                self.users_used.add(user)

