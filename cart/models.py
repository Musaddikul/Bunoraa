# cart/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db.models import Sum, F
from django.utils.translation import gettext_lazy as _

from products.models import Product, SiteSettings # Import Product and SiteSettings from 'products' app
from promotions.models import Coupon # Assuming Coupon model exists in 'promotions' app
from shipping.models import ShippingMethod # Using ShippingMethod instead of ShippingCarrier directly
from shipping.services import calculate_shipping_cost
from accounts.models import UserAddress
import logging

logger = logging.getLogger(__name__)
User = settings.AUTH_USER_MODEL

class Cart(models.Model):
    """
    Represents a shopping cart, either for an authenticated user or an anonymous session.
    Calculates total price, discount, shipping, and final total.
    """
    user             = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='carts', verbose_name=_("User"))
    session_key      = models.CharField(max_length=40, null=True, blank=True, unique=True, verbose_name=_("Session Key"),
                                        help_text=_("Used for anonymous carts."))
    created_at       = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at       = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))
    checked_out      = models.BooleanField(default=False, verbose_name=_("Checked Out"),
                                        help_text=_("Indicates if the cart has been converted to an order."))
    abandoned        = models.BooleanField(default=False, verbose_name=_("Abandoned"),
                                        help_text=_("True if the cart has been flagged as abandoned."))
    abandoned_at     = models.DateTimeField(null=True, blank=True, verbose_name=_("Abandoned At"),
                                        help_text=_("Timestamp when the cart was marked as abandoned."))
    converted        = models.BooleanField(default=False, verbose_name=_("Converted"),
                                        help_text=_("True if the cart led to a successful conversion (e.g., order placed)."))
    converted_at     = models.DateTimeField(null=True, blank=True, verbose_name=_("Converted At"),
                                        help_text=_("Timestamp when the cart was converted."))
    coupon           = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='carts_applied', verbose_name=_("Coupon"))
    shipping_method  = models.ForeignKey(ShippingMethod, on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("Shipping Method"))
    address          = models.ForeignKey('accounts.UserAddress', on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("Shipping Address"))
    is_express       = models.BooleanField(default=False, verbose_name=_("Express Shipping"),
                                        help_text=_("Whether express shipping is selected for this cart."))
    
    # Cached totals for quick access (will be updated by update_totals method)
    total_price_cached = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), verbose_name=_("Total Price (Cached)"))
    total_discount_cached = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), verbose_name=_("Total Discount (Cached)"))
    total_shipping_cached = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), verbose_name=_("Total Shipping (Cached)"))
    total_tax_cached = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), verbose_name=_("Total Tax (Cached)"))
    final_total_cached = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), verbose_name=_("Final Total (Cached)"))
    total_items_cached = models.PositiveIntegerField(default=0, verbose_name=_("Total Items (Cached)"))

    class Meta:
        verbose_name = _("Cart")
        verbose_name_plural = _("Carts")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session_key']),
            models.Index(fields=['user', 'checked_out']),
            models.Index(fields=['abandoned', 'abandoned_at']),
        ]

    def __str__(self):
        """Returns a string representation of the cart."""
        if self.user:
            return f"Cart {self.id} for {self.user.email or self.user.username}"
        return f"Cart {self.id} (Session: {self.session_key or 'N/A'})"

    @property
    def total_items(self) -> int:
        """Returns the total number of distinct items in the cart."""
        return self.items.filter(saved_for_later=False).aggregate(total_qty=Sum('quantity'))['total_qty'] or 0

    @property
    def total_price(self) -> Decimal:
        """Calculates the total price of all active items in the cart before discounts, shipping, and tax."""
        return self.items.filter(saved_for_later=False).aggregate(total=Sum(F('quantity') * F('price')))['total'] or Decimal('0.00')

    @property
    def is_empty(self) -> bool:
        """Checks if the cart has no active items."""
        return self.total_items == 0

    def get_discount_amount(self) -> Decimal:
        """Calculates the discount amount applied to the cart from the coupon."""
        discount = Decimal('0.00')
        if self.coupon and not self.coupon.is_expired:
            from promotions.services import CouponService
            try:
                # Validate the coupon against the current cart state
                CouponService.validate_coupon(self.coupon.code, self.total_price, self.user)
                discount = CouponService.calculate_discount(self.total_price, self.coupon)
            except ValidationError as e:
                # If validation fails, the coupon is effectively not applicable for discount calculation
                # but we do NOT clear the coupon from the cart here. That's handled by remove_coupon_from_cart.
                logger.warning(f"Coupon '{self.coupon.code}' validation failed during discount calculation for cart {self.id}: {e.message}. Discount set to 0.")
                discount = Decimal('0.00') # Ensure discount is zero if validation fails
            except Exception as e:
                logger.error(f"Error during coupon validation/calculation in get_discount_amount for cart {self.id}: {str(e)}", exc_info=True)
                discount = Decimal('0.00')
        return discount

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def get_shipping_cost(self) -> Decimal:
        """
        Calculates the shipping cost for the cart based on the selected shipping method,
        address, and cart contents.
        """
        if not self.shipping_method or not self.address:
            return Decimal('0.00')

        # Calculate total weight of items in the cart
        total_weight_kg = sum(
            (item.product.weight if item.product.weight is not None else Decimal('0.00')) * item.quantity
            for item in self.items.filter(saved_for_later=False) if item.product
        )
        total_weight_kg = Decimal(str(total_weight_kg)) # Ensure it's a Decimal

        try:
            # Use the calculate_shipping_cost from shipping.services
            shipping_cost = calculate_shipping_cost(
                shipping_method=self.shipping_method,
                address=self.address,
                weight_kg=total_weight_kg,
                order_total=self.total_price, # Use the cart's total price
                is_express=self.is_express
            )
            return shipping_cost
        except ValidationError as e:
            logger.warning(f"Shipping cost calculation failed for cart {self.id}: {e.message}")
            return Decimal('0.00') # Return 0 if calculation fails
        except Exception as e:
            logger.error(f"An unexpected error occurred during shipping calculation for cart {self.id}: {e}", exc_info=True)
            return Decimal('0.00')

    @property
    def tax_rate(self) -> Decimal:
        """Returns the tax rate applied to the cart."""
        from cart.services import get_tax_configuration # Import here to avoid circular dependency
        tax_config = get_tax_configuration()
        return tax_config.get('rate', Decimal('0.00'))

    def get_tax_amount(self) -> Decimal:
        """Calculates the tax amount for the cart."""
        if self.tax_rate > 0:
            taxable_amount = self.total_price
            return (taxable_amount * self.tax_rate).quantize(Decimal('0.01'))
        return Decimal('0.00')

    @property
    def final_total(self) -> Decimal:
        """Calculates the final total price of the cart including discount, shipping, and tax."""
        final_total = (self.total_price - self.get_discount_amount() + self.get_shipping_cost() + self.get_tax_amount()).quantize(Decimal('0.01'))
        return max(Decimal('0.00'), final_total) # Ensure total is not negative

    def get_shipping_estimate(self) -> str:
        """Returns the estimated delivery time for the selected shipping method."""
        if self.shipping_method:
            return self.shipping_method.estimated_delivery
        return _("Not selected")

    def get_final_total(self) -> Decimal:
        """Calculates the final total price including tax, shipping, and discount."""
        subtotal = self.total_price
        tax = self.get_tax_amount()
        shipping = self.get_shipping_cost()
        discount = self.get_discount_amount()

        final_total = (subtotal + tax + shipping - discount).quantize(Decimal('0.01'))
        return max(Decimal('0.00'), final_total) # Ensure total is not negative

    def update_totals(self):
        """
        Updates the cached total fields of the cart.
        """
        # Store current shipping method before updates
        current_shipping_method = self.shipping_method
        
        self.total_items_cached = self.total_items
        self.total_price_cached = self.total_price
        self.total_discount_cached = self.get_discount_amount()
        self.total_tax_cached = self.get_tax_amount()
        self.total_shipping_cached = self.get_shipping_cost()
        self.final_total_cached = self.get_final_total()
        
        # Restore shipping method if it was cleared during calculations
        if current_shipping_method:
            self.shipping_method = current_shipping_method
        
        self.save(update_fields=[
            'total_items_cached', 'total_price_cached', 'total_discount_cached',
            'total_tax_cached', 'total_shipping_cached', 'final_total_cached',
            'shipping_method', 'coupon', 'updated_at'
        ])
        logger.info(f"Cart {self.id} totals updated. Final Total: {self.final_total_cached}, Discount: {self.total_discount_cached}, Shipping: {self.total_shipping_cached}")

    def clear_cart(self):
        """Removes all active items from the cart."""
        cleared_count = self.items.filter(saved_for_later=False).delete()[0]
        if cleared_count > 0:
            self.save(update_fields=['updated_at']) # Update timestamp
        logger.info(f"Cleared {cleared_count} active items from cart {self.id}.")
        return cleared_count

    def mark_abandoned(self):
        """Marks the cart as abandoned."""
        if not self.abandoned:
            self.abandoned = True
            self.abandoned_at = timezone.now()
            self.save(update_fields=['abandoned', 'abandoned_at', 'updated_at'])
            logger.info(f"Cart {self.id} marked as abandoned.")

    def mark_converted(self):
        """Marks the cart as converted (e.g., order placed)."""
        if not self.converted:
            self.converted = True
            self.converted_at = timezone.now()
            self.save(update_fields=['converted', 'converted_at', 'updated_at'])
            logger.info(f"Cart {self.id} marked as converted.")

    def mark_checked_out(self):
        """
        Marks the cart as checked out. This is a final state for the cart,
        typically set after an order is successfully created from it.
        """
        if not self.checked_out:
            self.checked_out = True
            self.save(update_fields=['checked_out', 'updated_at'])
        # Ensure mark_converted is called only if it was an abandoned cart
        if self.abandoned:
            self.mark_converted() # Call on self
        logger.info(f"Cart {self.id} marked as checked out and converted (if abandoned).")
        


class CartItem(models.Model):
    """
    Represents a single product within a shopping cart.
    """
    cart            = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name=_("Cart"))
    product         = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name=_("Product"))
    quantity        = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)], verbose_name=_("Quantity"))
    price           = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Price")) # Price at the time of adding to cart
    saved_for_later = models.BooleanField(default=False, verbose_name=_("Saved for Later"),
                                        help_text=_("If true, item is saved for later, not part of active cart total."))
    added_at        = models.DateTimeField(default=timezone.now, verbose_name=_("Added At"))
    updated_at      = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Cart Item")
        verbose_name_plural = _("Cart Items")
        unique_together = ('cart', 'product') # A product can only be in a cart once
        ordering = ['added_at']
        indexes = [
            models.Index(fields=['cart', 'saved_for_later']),
            models.Index(fields=['product']),
        ]

    def __str__(self):
        """Returns a string representation of the cart item."""
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"

    def save(self, *args, **kwargs):
        """
        Overrides the save method to set the price of the item
        to the product's current price when added or updated.
        Also ensures quantity does not exceed product stock.
        """
        # Set the price to the product's current price (discounted or regular)
        self.price = self.product.current_price

        # Ensure quantity does not exceed product stock before saving
        if self.quantity > self.product.stock:
            logger.warning(f"CartItem quantity for product {self.product.name} adjusted from {self.quantity} to {self.product.stock} due to stock limits.")
            self.quantity = self.product.stock
        
        # If product is out of stock (0), remove the item from cart
        if self.product.stock == 0 and self.quantity > 0:
            logger.warning(f"Product {self.product.name} is out of stock. Setting quantity to 0 for CartItem {self.id}.")
            self.quantity = 0 # Or you could raise an error or delete the item
            # For now, setting to 0, expecting update_totals to handle empty items.
            # A better approach might be to delete the item here if quantity becomes 0.
            # If you want to delete: self.delete(); return

        super().save(*args, **kwargs)

    @property
    def total_price(self) -> Decimal:
        """Calculates the total price for this cart item (price * quantity)."""
        return (self.price * self.quantity).quantize(Decimal('0.01'))


