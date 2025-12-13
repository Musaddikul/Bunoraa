# apps/orders/models.py
"""
Order models for order management.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils import timezone


class Order(models.Model):
    """
    Main order model.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
        PARTIALLY_REFUNDED = 'partially_refunded', 'Partially Refunded'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=32, unique=True, db_index=True)
    
    # Customer
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    
    # Shipping Address
    shipping_first_name = models.CharField(max_length=100)
    shipping_last_name = models.CharField(max_length=100)
    shipping_address_line1 = models.CharField(max_length=255)
    shipping_address_line2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default='US')
    
    # Billing Address (optional, defaults to shipping)
    billing_same_as_shipping = models.BooleanField(default=True)
    billing_first_name = models.CharField(max_length=100, blank=True)
    billing_last_name = models.CharField(max_length=100, blank=True)
    billing_address_line1 = models.CharField(max_length=255, blank=True)
    billing_address_line2 = models.CharField(max_length=255, blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_postal_code = models.CharField(max_length=20, blank=True)
    billing_country = models.CharField(max_length=100, blank=True)
    
    # Totals
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Coupon
    coupon = models.ForeignKey(
        'promotions.Coupon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    coupon_code = models.CharField(max_length=50, blank=True)
    
    # Shipping Method
    shipping_method = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    tracking_url = models.URLField(blank=True)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Payment Info
    payment_method = models.CharField(max_length=50, blank=True)
    payment_intent_id = models.CharField(max_length=255, blank=True)  # Stripe
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Meta
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return f'Order {self.order_number}'
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    @classmethod
    def generate_order_number(cls):
        """Generate unique order number."""
        import random
        import string
        
        timestamp = timezone.now().strftime('%Y%m%d')
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        order_number = f'BNR-{timestamp}-{random_part}'
        
        # Ensure uniqueness
        while cls.objects.filter(order_number=order_number).exists():
            random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            order_number = f'BNR-{timestamp}-{random_part}'
        
        return order_number
    
    @property
    def item_count(self):
        """Total number of items in order."""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def shipping_full_name(self):
        return f'{self.shipping_first_name} {self.shipping_last_name}'
    
    @property
    def shipping_full_address(self):
        parts = [
            self.shipping_address_line1,
            self.shipping_address_line2,
            f'{self.shipping_city}, {self.shipping_state} {self.shipping_postal_code}',
            self.shipping_country
        ]
        return '\n'.join(filter(None, parts))
    
    def mark_as_paid(self):
        """Mark order as paid."""
        self.payment_status = self.PaymentStatus.PAID
        self.paid_at = timezone.now()
        self.status = self.Status.CONFIRMED
        self.save()
    
    def mark_as_shipped(self, tracking_number=None, tracking_url=None):
        """Mark order as shipped."""
        self.status = self.Status.SHIPPED
        self.shipped_at = timezone.now()
        if tracking_number:
            self.tracking_number = tracking_number
        if tracking_url:
            self.tracking_url = tracking_url
        self.save()
    
    def mark_as_delivered(self):
        """Mark order as delivered."""
        self.status = self.Status.DELIVERED
        self.delivered_at = timezone.now()
        self.save()
    
    def cancel(self, reason=''):
        """Cancel order."""
        self.status = self.Status.CANCELLED
        self.cancelled_at = timezone.now()
        if reason:
            self.admin_notes = f'{self.admin_notes}\nCancellation reason: {reason}'.strip()
        self.save()
    
    def can_cancel(self):
        """Check if order can be cancelled."""
        return self.status in [self.Status.PENDING, self.Status.CONFIRMED]


class OrderItem(models.Model):
    """
    Individual item within an order.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Product snapshot (for historical accuracy)
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items'
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items'
    )
    
    # Snapshot data (preserved even if product is deleted/modified)
    product_name = models.CharField(max_length=255)
    product_sku = models.CharField(max_length=100, blank=True)
    variant_name = models.CharField(max_length=255, blank=True)
    product_image = models.URLField(blank=True)
    
    # Pricing
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)  # Before discount
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f'{self.product_name} x{self.quantity}'
    
    @property
    def line_total(self):
        """Calculate line total."""
        return self.unit_price * self.quantity
    
    @property
    def savings(self):
        """Calculate savings on this item."""
        if self.original_price > self.unit_price:
            return (self.original_price - self.unit_price) * self.quantity
        return Decimal('0.00')


class OrderStatusHistory(models.Model):
    """
    Track order status changes.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    notes = models.TextField(blank=True)
    
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_status_changes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Order status histories'
    
    def __str__(self):
        return f'{self.order.order_number}: {self.old_status} -> {self.new_status}'
