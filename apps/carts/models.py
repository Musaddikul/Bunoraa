# apps/carts/models.py
"""
Cart Models
Shopping cart with session and user support.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
# timezone imported when needed
from django.core.validators import MinValueValidator
from decimal import Decimal

from apps.core.models import TimeStampedModel


class Cart(TimeStampedModel):
    """
    Shopping cart model.
    Supports both authenticated users and anonymous sessions.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='carts',
        verbose_name=_('user')
    )
    session_key = models.CharField(
        _('session key'),
        max_length=40,
        null=True,
        blank=True,
        db_index=True
    )
    
    # Shipping
    shipping_address = models.ForeignKey(
        'accounts.UserAddress',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carts',
        verbose_name=_('shipping address')
    )
    shipping_method = models.ForeignKey(
        'shipping.ShippingMethod',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('shipping method')
    )
    
    # Coupon
    coupon = models.ForeignKey(
        'promotions.Coupon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carts',
        verbose_name=_('coupon')
    )
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    checked_out = models.BooleanField(_('checked out'), default=False)
    checked_out_at = models.DateTimeField(_('checked out at'), null=True, blank=True)
    
    # Cached totals
    subtotal = models.DecimalField(_('subtotal'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(_('discount'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    shipping_cost = models.DecimalField(_('shipping'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(_('tax'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(_('total'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    class Meta:
        verbose_name = _('cart')
        verbose_name_plural = _('carts')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['session_key', 'is_active']),
        ]
    
    def __str__(self):
        if self.user:
            return f'Cart #{self.pk} - {self.user.email}'
        return f'Cart #{self.pk} - Session'
    
    @property
    def item_count(self):
        """Get total number of items."""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def is_empty(self):
        """Check if cart is empty."""
        return self.items.count() == 0
    
    def calculate_subtotal(self):
        """Calculate subtotal from items."""
        return sum(item.line_total for item in self.items.all())
    
    def calculate_discount(self):
        """Calculate discount from coupon."""
        if not self.coupon:
            return Decimal('0.00')
        
        subtotal = self.calculate_subtotal()
        
        if self.coupon.discount_type == 'percentage':
            discount = (subtotal * self.coupon.discount_value / 100)
            if self.coupon.max_discount:
                discount = min(discount, self.coupon.max_discount)
        else:
            discount = self.coupon.discount_value
        
        return min(discount, subtotal)
    
    def calculate_shipping(self):
        """Calculate shipping cost."""
        if not self.shipping_method:
            return Decimal('0.00')
        
        # Simple flat rate for now
        return self.shipping_method.base_rate or Decimal('0.00')
    
    def calculate_tax(self):
        """Calculate tax amount."""
        from apps.core.models import SiteSettings
        settings = SiteSettings.get_settings()
        
        taxable_amount = self.calculate_subtotal() - self.calculate_discount()
        return (taxable_amount * settings.tax_rate / 100).quantize(Decimal('0.01'))
    
    def calculate_total(self):
        """Calculate final total."""
        return (
            self.calculate_subtotal() -
            self.calculate_discount() +
            self.calculate_shipping() +
            self.calculate_tax()
        )
    
    def update_totals(self):
        """Recalculate and save all totals."""
        self.subtotal = self.calculate_subtotal()
        self.discount_amount = self.calculate_discount()
        self.shipping_cost = self.calculate_shipping()
        self.tax_amount = self.calculate_tax()
        self.total = self.calculate_total()
        self.save(update_fields=[
            'subtotal', 'discount_amount', 'shipping_cost',
            'tax_amount', 'total', 'updated_at'
        ])
    
    def add_item(self, product, variant=None, quantity=1):
        """Add item to cart."""
        # Check for existing item
        item = self.items.filter(
            product=product,
            variant=variant
        ).first()
        
        if item:
            item.quantity += quantity
            item.save()
        else:
            item = CartItem.objects.create(
                cart=self,
                product=product,
                variant=variant,
                quantity=quantity,
                price=variant.current_price if variant else product.price
            )
        
        self.update_totals()
        return item
    
    def remove_item(self, item_id):
        """Remove item from cart."""
        self.items.filter(pk=item_id).delete()
        self.update_totals()
    
    def update_item_quantity(self, item_id, quantity):
        """Update item quantity."""
        if quantity <= 0:
            return self.remove_item(item_id)
        
        item = self.items.filter(pk=item_id).first()
        if item:
            item.quantity = quantity
            item.save()
            self.update_totals()
        return item
    
    def clear(self):
        """Clear all items from cart."""
        self.items.all().delete()
        self.coupon = None
        self.update_totals()
    
    def apply_coupon(self, coupon):
        """Apply coupon to cart."""
        self.coupon = coupon
        self.update_totals()
    
    def remove_coupon(self):
        """Remove coupon from cart."""
        self.coupon = None
        self.update_totals()
    
    def merge_with(self, other_cart):
        """Merge another cart into this one."""
        for item in other_cart.items.all():
            self.add_item(item.product, item.variant, item.quantity)
        other_cart.delete()


class CartItem(TimeStampedModel):
    """
    Individual item in a shopping cart.
    """
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
    price = models.DecimalField(
        _('price'),
        max_digits=12,
        decimal_places=2,
        help_text=_('Price at time of adding to cart')
    )
    saved_for_later = models.BooleanField(_('saved for later'), default=False)
    
    class Meta:
        verbose_name = _('cart item')
        verbose_name_plural = _('cart items')
        unique_together = [['cart', 'product', 'variant']]
    
    def __str__(self):
        return f'{self.quantity}x {self.product.name}'
    
    @property
    def line_total(self):
        """Calculate line total."""
        if self.saved_for_later:
            return Decimal('0.00')
        return self.price * self.quantity
    
    @property
    def current_price(self):
        """Get current price (may differ from saved price)."""
        if self.variant:
            return self.variant.current_price
        return self.product.price
    
    @property
    def is_available(self):
        """Check if item is still available."""
        if not self.product.is_active:
            return False
        if self.variant and not self.variant.is_active:
            return False
        return self.product.is_in_stock
    
    def save(self, *args, **kwargs):
        # Update price if not set
        if not self.price:
            self.price = self.current_price
        super().save(*args, **kwargs)
