# orders/models.py
from django.db import models
from django.core.validators import MinValueValidator
from products.models import Product
from accounts.models import User, UserAddress
from payments.models import Payment
from shipping.models import ShippingCarrier, ShippingMethod

from django.utils import timezone
import uuid


class OrderStatus(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        User,
        related_name='orders',
        on_delete=models.PROTECT,
        null=True, blank=True
    )
    address = models.ForeignKey(
        UserAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    order_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    status = models.ForeignKey(
        OrderStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )

    shipping_carrier = models.ForeignKey(
        ShippingCarrier,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shipping_method = models.ForeignKey(
        'shipping.ShippingMethod',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    shipping_method_name = models.CharField(
        max_length=100,
        default='Standard'
    )

    payment = models.OneToOneField(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    order_note = models.TextField(blank=True)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    tracking_number = models.CharField(max_length=50, blank=True, null=True)
    invoice_url = models.URLField(blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)

    def _generate_order_number(self):
        timestamp_part = timezone.now().strftime("%Y%m%d")
        unique_part = uuid.uuid4().hex[:5].upper()
        order_number = f"ORD-{timestamp_part}-{unique_part}"
        while Order.objects.filter(order_number=order_number).exists():
            unique_part = uuid.uuid4().hex[:5].upper()
            order_number = f"ORD-{timestamp_part}-{unique_part}"
        return order_number

    @property
    def total(self):
        """Recalculate the total based on the order items."""
        return sum(item.subtotal for item in self.items.all())

    @property
    def grand_total(self):
        """Calculates the grand total by including taxes, discounts, and delivery charges."""
        return self.total + self.delivery_charge + self.tax - self.discount

    def can_be_cancelled(self):
        return self.status and self.status.name.lower() in ['pending', 'processing']


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    product_name = models.CharField(
        max_length=255,
        default='Unknown'
    )

    product_sku = models.CharField(
        max_length=100,
        default='Unknown'
    )

    quantity = models.PositiveIntegerField(default=1)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Price per unit at the time of order"
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity} x {self.product_name} (Order: {self.order.order_number})"

    @property
    def subtotal(self):
        """Calculates the subtotal before applying any discounts."""
        return self.price * self.quantity

    @property
    def final_price(self):
        """Calculates the final price after applying any discounts."""
        return self.subtotal - self.discount

    def save(self, *args, **kwargs):
        if not self.price and self.product:
            self.price = self.product.price
        elif not self.product:
            raise ValueError("Product must be assigned to OrderItem")
        super().save(*args, **kwargs)

