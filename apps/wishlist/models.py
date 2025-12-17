"""
Wishlist Models
"""
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class Wishlist(models.Model):
    """
    User's wishlist container.
    Each user has one wishlist.
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
        ordering = ['-updated_at']
        verbose_name = 'Wishlist'
        verbose_name_plural = 'Wishlists'
    
    def __str__(self):
        return f"Wishlist for {self.user.email}"
    
    @property
    def item_count(self):
        return self.items.count()
    
    @property
    def total_value(self):
        """Calculate total value of wishlist items."""
        total = sum(
            item.product.current_price or item.product.price
            for item in self.items.filter(product__is_active=True)
        )
        return total


class WishlistItem(models.Model):
    """
    Item in a wishlist.
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
    notes = models.TextField(blank=True, help_text="Personal notes about this item")
    
    # Price tracking
    price_at_add = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price when item was added"
    )
    
    # Notification preferences
    notify_on_sale = models.BooleanField(
        default=True,
        help_text="Notify when item goes on sale"
    )
    notify_on_restock = models.BooleanField(
        default=True,
        help_text="Notify when item is back in stock"
    )
    notify_on_price_drop = models.BooleanField(
        default=True,
        help_text="Notify on price drop"
    )
    
    # Tracking
    last_notified_at = models.DateTimeField(null=True, blank=True)
    notification_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-added_at']
        unique_together = ['wishlist', 'product', 'variant']
        verbose_name = 'Wishlist Item'
        verbose_name_plural = 'Wishlist Items'
    
    def __str__(self):
        return f"{self.product.name} in {self.wishlist}"
    
    def save(self, *args, **kwargs):
        # Save price when adding
        if not self.price_at_add and self.product:
            self.price_at_add = self.product.current_price or self.product.price
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        """Get current price of the product."""
        if self.variant and hasattr(self.variant, 'price') and self.variant.price:
            return self.variant.price
        return self.product.current_price or self.product.price
    
    @property
    def price_change(self):
        """Calculate price change since adding."""
        if self.price_at_add:
            return self.current_price - self.price_at_add
        return 0
    
    @property
    def price_change_percentage(self):
        """Calculate percentage price change."""
        if self.price_at_add and self.price_at_add > 0:
            return ((self.current_price - self.price_at_add) / self.price_at_add) * 100
        return 0
    
    @property
    def is_in_stock(self):
        """Check if item is in stock."""
        if self.variant:
            return self.variant.is_in_stock
        return self.product.is_in_stock
    
    @property
    def is_on_sale(self):
        """Check if item is on sale."""
        return self.product.sale_price is not None and self.product.sale_price < self.product.price


class WishlistShare(models.Model):
    """
    Sharing configuration for wishlists.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    share_token = models.CharField(max_length=64, unique=True)
    is_active = models.BooleanField(default=True)
    
    # Permissions
    allow_view = models.BooleanField(default=True)
    allow_purchase = models.BooleanField(default=False, help_text="Allow others to buy items")
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    last_viewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Wishlist Share'
        verbose_name_plural = 'Wishlist Shares'
    
    def __str__(self):
        return f"Share for {self.wishlist}"
    
    def save(self, *args, **kwargs):
        if not self.share_token:
            self.share_token = self._generate_token()
        super().save(*args, **kwargs)
    
    def _generate_token(self):
        import secrets
        return secrets.token_urlsafe(32)
    
    @property
    def is_valid(self):
        """Check if share is still valid."""
        if not self.is_active:
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return True
    
    def record_view(self):
        """Record a view of the shared wishlist."""
        self.view_count += 1
        self.last_viewed_at = timezone.now()
        self.save(update_fields=['view_count', 'last_viewed_at'])


class WishlistNotification(models.Model):
    """
    Notifications sent about wishlist items.
    """
    NOTIFICATION_TYPES = [
        ('price_drop', 'Price Drop'),
        ('back_in_stock', 'Back in Stock'),
        ('sale', 'On Sale'),
        ('low_stock', 'Low Stock Warning'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wishlist_item = models.ForeignKey(
        WishlistItem,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    
    # Price info for price-related notifications
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    new_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Wishlist Notification'
        verbose_name_plural = 'Wishlist Notifications'
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.wishlist_item.product.name}"
    
    def mark_as_sent(self):
        """Mark notification as sent."""
        self.is_sent = True
        self.sent_at = timezone.now()
        self.save(update_fields=['is_sent', 'sent_at'])
    
    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.read_at = timezone.now()
        self.save(update_fields=['is_read', 'read_at'])
