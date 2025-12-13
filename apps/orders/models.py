# apps/orders/models.py
"""
Order Models
Comprehensive order management system.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator

from apps.core.models import TimeStampedModel


class Order(TimeStampedModel):
    """
    Main order model.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        PROCESSING = 'processing', _('Processing')
        SHIPPED = 'shipped', _('Shipped')
        OUT_FOR_DELIVERY = 'out_for_delivery', _('Out for Delivery')
        DELIVERED = 'delivered', _('Delivered')
        CANCELLED = 'cancelled', _('Cancelled')
        REFUNDED = 'refunded', _('Refunded')
        FAILED = 'failed', _('Failed')
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        AUTHORIZED = 'authorized', _('Authorized')
        PAID = 'paid', _('Paid')
        PARTIALLY_REFUNDED = 'partially_refunded', _('Partially Refunded')
        REFUNDED = 'refunded', _('Refunded')
        FAILED = 'failed', _('Failed')
    
    # Order identification
    order_number = models.CharField(
        _('order number'),
        max_length=32,
        unique=True,
        editable=False
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Customer
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name=_('user')
    )
    email = models.EmailField(_('email'))
    phone = models.CharField(_('phone'), max_length=20, blank=True)
    
    # Status
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    payment_status = models.CharField(
        _('payment status'),
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    
    # Addresses (stored as JSON for immutability)
    shipping_address = models.JSONField(_('shipping address'))
    billing_address = models.JSONField(_('billing address'), null=True, blank=True)
    
    # Shipping
    shipping_method = models.CharField(_('shipping method'), max_length=100, blank=True)
    shipping_carrier = models.CharField(_('shipping carrier'), max_length=100, blank=True)
    tracking_number = models.CharField(_('tracking number'), max_length=100, blank=True)
    estimated_delivery = models.DateField(_('estimated delivery'), null=True, blank=True)
    
    # Amounts
    subtotal = models.DecimalField(_('subtotal'), max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(_('discount'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    shipping_cost = models.DecimalField(_('shipping cost'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(_('tax'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(_('total'), max_digits=12, decimal_places=2)
    
    # Currency
    currency = models.CharField(_('currency'), max_length=3, default='USD')
    
    # Coupon
    coupon_code = models.CharField(_('coupon code'), max_length=50, blank=True)
    coupon_discount = models.DecimalField(_('coupon discount'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    # Payment
    payment_method = models.CharField(_('payment method'), max_length=50, blank=True)
    payment_id = models.CharField(_('payment ID'), max_length=100, blank=True)
    
    # Notes
    customer_notes = models.TextField(_('customer notes'), blank=True)
    admin_notes = models.TextField(_('admin notes'), blank=True)
    
    # Timestamps
    confirmed_at = models.DateTimeField(_('confirmed at'), null=True, blank=True)
    shipped_at = models.DateTimeField(_('shipped at'), null=True, blank=True)
    delivered_at = models.DateTimeField(_('delivered at'), null=True, blank=True)
    cancelled_at = models.DateTimeField(_('cancelled at'), null=True, blank=True)
    
    # IP and tracking
    ip_address = models.GenericIPAddressField(_('IP address'), null=True, blank=True)
    user_agent = models.CharField(_('user agent'), max_length=255, blank=True)
    
    class Meta:
        verbose_name = _('order')
        verbose_name_plural = _('orders')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f'Order #{self.order_number}'
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    def generate_order_number(self):
        """Generate unique order number."""
        from django.utils import timezone
        import random
        prefix = timezone.now().strftime('%Y%m%d')
        suffix = ''.join(random.choices('0123456789', k=6))
        return f'{prefix}-{suffix}'
    
    @property
    def can_cancel(self):
        """Check if order can be cancelled."""
        return self.status in [self.Status.PENDING, self.Status.CONFIRMED]
    
    @property
    def can_refund(self):
        """Check if order can be refunded."""
        return self.payment_status == self.PaymentStatus.PAID and self.status != self.Status.REFUNDED
    
    def mark_confirmed(self):
        """Mark order as confirmed."""
        from django.utils import timezone
        self.status = self.Status.CONFIRMED
        self.confirmed_at = timezone.now()
        self.save()
    
    def mark_shipped(self, tracking_number=None, carrier=None):
        """Mark order as shipped."""
        from django.utils import timezone
        self.status = self.Status.SHIPPED
        self.shipped_at = timezone.now()
        if tracking_number:
            self.tracking_number = tracking_number
        if carrier:
            self.shipping_carrier = carrier
        self.save()
    
    def mark_delivered(self):
        """Mark order as delivered."""
        from django.utils import timezone
        self.status = self.Status.DELIVERED
        self.delivered_at = timezone.now()
        self.save()
    
    def cancel(self, reason=''):
        """Cancel order."""
        from django.utils import timezone
        self.status = self.Status.CANCELLED
        self.cancelled_at = timezone.now()
        if reason:
            self.admin_notes = f'{self.admin_notes}\nCancelled: {reason}'.strip()
        self.save()
        
        # Restore inventory
        for item in self.items.all():
            item.restore_inventory()


class OrderItem(TimeStampedModel):
    """
    Individual item in an order.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('order')
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name=_('product')
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
        verbose_name=_('variant')
    )
    vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
        verbose_name=_('vendor')
    )
    
    # Product snapshot (for history)
    product_name = models.CharField(_('product name'), max_length=255)
    product_sku = models.CharField(_('SKU'), max_length=100)
    product_image = models.URLField(_('product image'), blank=True)
    variant_name = models.CharField(_('variant'), max_length=255, blank=True)
    
    # Quantity and pricing
    quantity = models.PositiveIntegerField(_('quantity'), validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(_('unit price'), max_digits=12, decimal_places=2)
    discount = models.DecimalField(_('discount'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax = models.DecimalField(_('tax'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(_('total'), max_digits=12, decimal_places=2)
    
    # Status
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        SHIPPED = 'shipped', _('Shipped')
        DELIVERED = 'delivered', _('Delivered')
        CANCELLED = 'cancelled', _('Cancelled')
        RETURNED = 'returned', _('Returned')
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Fulfillment
    fulfilled_quantity = models.PositiveIntegerField(_('fulfilled qty'), default=0)
    
    class Meta:
        verbose_name = _('order item')
        verbose_name_plural = _('order items')
    
    def __str__(self):
        return f'{self.quantity}x {self.product_name}'
    
    @property
    def line_total(self):
        """Calculate line total."""
        return (self.unit_price * self.quantity) - self.discount + self.tax
    
    def save(self, *args, **kwargs):
        if not self.total:
            self.total = self.line_total
        super().save(*args, **kwargs)
    
    def restore_inventory(self):
        """Restore inventory when order cancelled."""
        if self.variant:
            self.variant.stock += self.quantity
            self.variant.save()
        else:
            self.product.stock += self.quantity
            self.product.save()


class OrderStatusHistory(TimeStampedModel):
    """
    Track order status changes.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history',
        verbose_name=_('order')
    )
    status = models.CharField(_('status'), max_length=20)
    previous_status = models.CharField(_('previous status'), max_length=20, blank=True)
    note = models.TextField(_('note'), blank=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('changed by')
    )
    
    class Meta:
        verbose_name = _('status history')
        verbose_name_plural = _('status histories')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.order.order_number}: {self.previous_status} → {self.status}'


class OrderNote(TimeStampedModel):
    """
    Internal notes for orders.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='notes',
        verbose_name=_('order')
    )
    note = models.TextField(_('note'))
    is_customer_visible = models.BooleanField(_('visible to customer'), default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('created by')
    )
    
    class Meta:
        verbose_name = _('order note')
        verbose_name_plural = _('order notes')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Note for {self.order.order_number}'
