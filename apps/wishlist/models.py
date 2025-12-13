# apps/wishlist/models.py
"""
Wishlist Models
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimeStampedModel


class Wishlist(TimeStampedModel):
    """
    User wishlist.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlists',
        verbose_name=_('user')
    )
    name = models.CharField(_('name'), max_length=100, default='My Wishlist')
    is_public = models.BooleanField(_('public'), default=False)
    is_default = models.BooleanField(_('default'), default=False)
    
    class Meta:
        verbose_name = _('wishlist')
        verbose_name_plural = _('wishlists')
        ordering = ['-is_default', 'name']
    
    def __str__(self):
        return f'{self.name} - {self.user}'
    
    def save(self, *args, **kwargs):
        if self.is_default:
            Wishlist.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
    
    @property
    def item_count(self):
        return self.items.count()


class WishlistItem(TimeStampedModel):
    """
    Item in a wishlist.
    """
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('wishlist')
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='wishlist_items',
        verbose_name=_('product')
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='wishlist_items',
        verbose_name=_('variant')
    )
    notes = models.TextField(_('notes'), blank=True)
    priority = models.PositiveSmallIntegerField(_('priority'), default=0)
    
    # Price tracking
    added_price = models.DecimalField(
        _('price when added'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    notify_price_drop = models.BooleanField(_('notify on price drop'), default=True)
    
    class Meta:
        verbose_name = _('wishlist item')
        verbose_name_plural = _('wishlist items')
        unique_together = [['wishlist', 'product', 'variant']]
        ordering = ['-priority', '-created_at']
    
    def __str__(self):
        return f'{self.product.name} in {self.wishlist.name}'
    
    def save(self, *args, **kwargs):
        if self.added_price is None:
            if self.variant:
                self.added_price = self.variant.current_price
            else:
                self.added_price = self.product.price
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        if self.variant:
            return self.variant.current_price
        return self.product.price
    
    @property
    def price_changed(self):
        if self.added_price:
            return self.current_price != self.added_price
        return False
    
    @property
    def price_dropped(self):
        if self.added_price:
            return self.current_price < self.added_price
        return False
