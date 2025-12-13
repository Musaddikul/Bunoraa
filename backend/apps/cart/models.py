# apps/cart/models.py
"""
Shopping cart models.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db.models import Sum, F


class Cart(models.Model):
    """
    Shopping cart model.
    Supports both authenticated users and anonymous sessions.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Owner - either user or session
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
    
    # Applied coupon
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
    is_checked_out = models.BooleanField(_('checked out'), default=False)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('cart')
        verbose_name_plural = _('carts')
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['session_key']),
            models.Index(fields=['is_active', 'is_checked_out']),
        ]
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Anonymous Cart ({self.session_key})"
    
    @property
    def item_count(self):
        """Get total number of items in cart."""
        return self.items.aggregate(total=Sum('quantity'))['total'] or 0
    
    @property
    def subtotal(self):
        """Calculate subtotal before discounts and shipping."""
        total = self.items.aggregate(
            total=Sum(F('quantity') * F('unit_price'))
        )['total']
        return total or Decimal('0.00')
    
    @property
    def discount_amount(self):
        """Calculate discount amount from coupon."""
        if not self.coupon:
            return Decimal('0.00')
        
        from apps.promotions.services import CouponService
        try:
            return CouponService.calculate_discount(self.coupon, self.subtotal)
        except Exception:
            return Decimal('0.00')
    
    @property
    def total(self):
        """Calculate total after discounts (before shipping/tax)."""
        return max(self.subtotal - self.discount_amount, Decimal('0.00'))
    
    def clear(self):
        """Remove all items from cart."""
        self.items.all().delete()
        self.coupon = None
        self.save()
    
    def merge_from(self, other_cart):
        """
        Merge items from another cart into this one.
        Used when anonymous user logs in.
        """
        for item in other_cart.items.all():
            existing = self.items.filter(
                product=item.product,
                variant=item.variant
            ).first()
            
            if existing:
                existing.quantity += item.quantity
                existing.save()
            else:
                item.cart = self
                item.save()
        
        other_cart.delete()


class CartItem(models.Model):
    """
    Individual item in a shopping cart.
    """
    
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
    
    quantity = models.PositiveIntegerField(_('quantity'), default=1)
    
    # Store price at time of adding to cart
    unit_price = models.DecimalField(
        _('unit price'),
        max_digits=10,
        decimal_places=2
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('cart item')
        verbose_name_plural = _('cart items')
        ordering = ['-created_at']
        unique_together = ['cart', 'product', 'variant']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    @property
    def line_total(self):
        """Calculate total for this line item."""
        return self.unit_price * self.quantity
    
    def save(self, *args, **kwargs):
        # Set unit price from product if not set
        if not self.unit_price:
            if self.variant:
                self.unit_price = self.variant.price
            else:
                self.unit_price = self.product.current_price
        super().save(*args, **kwargs)
