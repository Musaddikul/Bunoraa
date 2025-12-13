# apps/wishlist/models.py
"""
Wishlist models.
"""
import uuid
from django.db import models
from django.conf import settings


class Wishlist(models.Model):
    """
    User wishlist - stores saved products.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Wishlist'
        verbose_name_plural = 'Wishlists'
    
    def __str__(self):
        return f"Wishlist for {self.user.email}"
    
    @property
    def item_count(self):
        return self.items.count()


class WishlistItem(models.Model):
    """
    Individual item in a wishlist.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='wishlist_items'
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='wishlist_items'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    
    # Notify when price drops
    notify_price_drop = models.BooleanField(default=False)
    # Notify when back in stock
    notify_back_in_stock = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['wishlist', 'product', 'variant']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.product.name} in {self.wishlist}"
