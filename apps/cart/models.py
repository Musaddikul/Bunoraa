"""
Cart models
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator


class Cart(models.Model):
    """Shopping cart - persistent for both guests and users."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Can be linked to user or session
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cart',
        verbose_name=_('user')
    )
    session_key = models.CharField(_('session key'), max_length=40, blank=True, null=True)

    # Coupon
    coupon = models.ForeignKey(
        'promotions.Coupon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carts',
        verbose_name=_('coupon')
    )

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('cart')
        verbose_name_plural = _('carts')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['session_key']),
        ]

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Guest Cart {self.session_key}"

    @property
    def item_count(self):
        """Get total number of items in cart."""
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        """Calculate cart subtotal (before discounts)."""
        return sum(item.total for item in self.items.all())

    @property
    def discount_amount(self):
        """Calculate discount from coupon."""
        if not self.coupon:
            return Decimal('0.00')

        from apps.promotions.models import Coupon
        return self.coupon.calculate_discount(self.subtotal)

    @property
    def total(self):
        """Calculate cart total (after discounts)."""
        return max(Decimal('0.00'), self.subtotal - self.discount_amount)

    def clear(self):
        """Remove all items from cart."""
        self.items.all().delete()
        self.coupon = None
        self.save()

    def merge_from_session(self, session_cart):
        """Merge items from a session cart into this cart."""
        for item in session_cart.items.all():
            existing_item = self.items.filter(
                product=item.product,
                variant=item.variant
            ).first()

            if existing_item:
                existing_item.quantity += item.quantity
                existing_item.save()
            else:
                item.cart = self
                item.save()

        session_cart.delete()


class CartSettings(models.Model):
    """Global cart settings (singleton) - manage gift wrap and cart-level config."""
    gift_wrap_enabled = models.BooleanField(default=False, help_text='Enable gift wrap option at checkout')
    gift_wrap_amount = models.DecimalField(max_digits=10, decimal_places=2, default=50.00, help_text='Fee charged for gift wrapping (store currency)')
    gift_wrap_label = models.CharField(max_length=100, blank=True, default='Gift Wrap', help_text='Label to show for gift wrap option')

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart Settings'
        verbose_name_plural = 'Cart Settings'

    def __str__(self):
        return 'Cart Settings'

    def save(self, *args, **kwargs):
        # Always keep a single instance
        self.pk = 1
        super().save(*args, **kwargs)
        # Clear cache if needed
        try:
            from django.core.cache import cache
            cache.delete('cart_settings')
        except Exception:
            pass

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class CartItem(models.Model):
    """Items in a shopping cart."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('cart')
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name=_('product')
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cart_items',
        verbose_name=_('variant')
    )
    quantity = models.PositiveIntegerField(
        _('quantity'),
        default=1,
        validators=[MinValueValidator(1)]
    )
    
    # Store price at time of adding (for price protection)
    price_at_add = models.DecimalField(
        _('price at add'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('cart item')
        verbose_name_plural = _('cart items')
        unique_together = ['cart', 'product', 'variant']
        ordering = ['-created_at']
    
    def __str__(self):
        name = self.product.name
        if self.variant:
            name += f" - {self.variant.name}"
        return f"{name} x {self.quantity}"
    
    @property
    def unit_price(self):
        """Get current unit price."""
        if self.variant:
            return self.variant.price
        return self.product.current_price
    
    @property
    def total(self):
        """Calculate line total."""
        return self.unit_price * self.quantity
    
    @property
    def total_price(self):
        """Alias for total - for template compatibility."""
        return self.total
    
    @property
    def original_total(self):
        """Calculate original total before sale (for strikethrough display)."""
        if self.variant:
            # For variants, use price (original) vs sale_price (discounted)
            original_price = self.variant.price
        else:
            # For products, use price (original) - sale_price is the discounted price
            original_price = self.product.price
        return original_price * self.quantity
    
    @property
    def is_available(self):
        """Check if item is available for purchase."""
        if not self.product.is_active or self.product.is_deleted:
            return False
        
        if self.variant:
            return self.variant.is_in_stock
        return self.product.is_in_stock
    
    @property
    def available_quantity(self):
        """Get maximum available quantity."""
        if not self.product.track_inventory:
            return 999
        
        if self.variant:
            return self.variant.stock_quantity
        return self.product.stock_quantity
    
    def save(self, *args, **kwargs):
        # Set price at add if not set
        if not self.price_at_add:
            self.price_at_add = self.unit_price
        super().save(*args, **kwargs)
