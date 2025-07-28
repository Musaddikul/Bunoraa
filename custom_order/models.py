# custom_order/models.py
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

from shipping.models import ShippingMethod

class Category(models.Model):
    """
    Represents a category for custom orders (e.g., 'Clothing', 'Accessories').
    """
    name = models.CharField(max_length=100, unique=True, verbose_name=_('Name'))
    slug = models.SlugField(max_length=100, unique=True, help_text=_("Unique URL-friendly identifier"))
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name=_('Image'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    """
    Represents a subcategory within a main category (e.g., 'Shirts' under 'Clothing').
    Includes a multiplier for base price calculation.
    """
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE, verbose_name=_('Category'))
    name = models.CharField(max_length=100, verbose_name=_('Name'))
    slug = models.SlugField(max_length=100, help_text=_("Unique URL-friendly identifier"))
    image = models.ImageField(upload_to='subcategories/', blank=True, null=True, verbose_name=_('Image'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    base_price_multiplier = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('1.00'),
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('Base Price Multiplier'),
        help_text=_('Multiplier applied to fabric base price for this subcategory (e.g., 1.2 for complex designs).')
    )
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('SubCategory')
        verbose_name_plural = _('SubCategories')
        unique_together = ('category', 'slug')
        ordering = ['name']

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class FabricType(models.Model):
    """
    Represents different types of fabrics available (e.g., 'Cotton', 'Silk').
    Each fabric has a base price.
    """
    name = models.CharField(max_length=100, unique=True, verbose_name=_('Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    base_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('Base Price per Unit')
    )
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Fabric Type')
        verbose_name_plural = _('Fabric Types')
        ordering = ['name']

    def __str__(self):
        return self.name

class SizeOption(models.Model):
    """
    Represents available size options (e.g., 'S', 'M', 'L', 'Custom').
    Can be associated with multiple subcategories.
    """
    name = models.CharField(max_length=50, unique=True, verbose_name=_('Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    subcategories = models.ManyToManyField(
        SubCategory,
        related_name='size_options',
        blank=True,
        verbose_name=_('Applicable Subcategories'),
        help_text=_('Leave blank if applicable to all subcategories.')
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Size Option')
        verbose_name_plural = _('Size Options')
        ordering = ['name']

    def __str__(self):
        return self.name

class ColorOption(models.Model):
    """
    Represents available color options (e.g., 'Red', 'Blue', 'Black').
    """
    name = models.CharField(max_length=50, unique=True, verbose_name=_('Name'))
    hex_code = models.CharField(max_length=7, blank=True, help_text=_('Hexadecimal color code (e.g., #RRGGBB)'))
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Color Option')
        verbose_name_plural = _('Color Options')
        ordering = ['name']

    def __str__(self):
        return self.name

class CustomOrder(models.Model):
    """
    Main model for a custom order, representing a customer's request.
    """
    class OrderType(models.TextChoices):
        OWN_DESIGN = 'OWN_DESIGN', _('Own Design')
        SEND_PRODUCT = 'SEND_PRODUCT', _('Send Product')
        DIRECT_CONTACT = 'DIRECT_CONTACT', _('Direct Contact')

    class ContactMethod(models.TextChoices):
        WHATSAPP = 'whatsapp', _('WhatsApp')
        MESSENGER = 'messenger', _('Messenger')
        PHONE = 'phone', _('Phone Call')
        EMAIL = 'email', _('Email')

    class Status(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        IN_PROGRESS = 'in_progress', _('In Progress')
        READY_FOR_SHIPMENT = 'ready', _('Ready for Shipment')
        SHIPPED = 'shipped', _('Shipped')
        DELIVERED = 'delivered', _('Delivered')
        CANCELLED = 'cancelled', _('Cancelled')
        REJECTED = 'rejected', _('Rejected')
        ON_HOLD = 'on_hold', _('On Hold')

    order_id = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False, verbose_name=_('Order ID'))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('User'))

    order_type = models.CharField(max_length=20, choices=OrderType.choices, default=OrderType.OWN_DESIGN, verbose_name=_('Order Type'))

    customer_name = models.CharField(max_length=255, verbose_name=_('Customer Name'))
    phone = models.CharField(max_length=20, verbose_name=_('Phone Number'))
    email = models.EmailField(max_length=255, blank=True, null=True, verbose_name=_('Email Address'))
    contact_method = models.CharField(max_length=20, choices=ContactMethod.choices, default=ContactMethod.WHATSAPP, verbose_name=_('Preferred Contact Method'))

    # Design/Product Details
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('Category'))
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('SubCategory'))
    fabric_type = models.ForeignKey(FabricType, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('Fabric Type'))
    size_option = models.ForeignKey(SizeOption, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('Size Option'))
    color_option = models.ForeignKey(ColorOption, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_orders', verbose_name=_('Color Option'))
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)], verbose_name=_('Quantity'))

    design_description = models.TextField(blank=True, verbose_name=_('Design Description'))
    customer_item_description = models.TextField(blank=True, verbose_name=_('Customer Item Description'))
    customer_item_condition = models.CharField(max_length=255, blank=True, verbose_name=_('Customer Item Condition'))

    # Size information (e.g., measurements for custom sizes)
    size_info = models.JSONField(blank=True, null=True, verbose_name=_('Size Information'),
                                 help_text=_("JSON object for detailed measurements (e.g., {'chest': 40, 'waist': 32})"))

    expected_date = models.DateField(blank=True, null=True, verbose_name=_('Expected Completion Date'))
    additional_info = models.TextField(blank=True, verbose_name=_('Additional Information'))

    # Shipping & Payment
    shipping_address = models.ForeignKey('accounts.UserAddress', on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_('Shipping Address'))
    shipping_method = models.ForeignKey(ShippingMethod, on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_('Shipping Method'))
    payment_method = models.ForeignKey('payments.PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_('Payment Method'))
    coupon = models.ForeignKey('promotions.Coupon', on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_('Coupon'))

    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('Base Price'))
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('Shipping Cost'))
    vat_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('VAT Percentage'))
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('VAT Amount'))
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('Discount Amount'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))], verbose_name=_('Total Amount'))

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, verbose_name=_('Status'))
    is_draft = models.BooleanField(default=True, verbose_name=_('Is Draft'))

    confirmed_at = models.DateTimeField(blank=True, null=True, verbose_name=_('Confirmed At'))
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name=_('Completed At'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Custom Order')
        verbose_name_plural = _('Custom Orders')
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_name}"

    def save(self, *args, **kwargs):
        """Override save to handle both draft status and confirmed_at timestamp"""
        
        # Handle draft status logic
        if self.is_draft:
            self.status = self.Status.DRAFT
        elif not self.pk and not self.is_draft:
            self.status = self.Status.PENDING
        
        # Handle confirmed_at timestamp logic
        if self.pk:  # Object already exists
            original_order = CustomOrder.objects.get(pk=self.pk)
            if original_order.status != self.status and self.status == self.Status.CONFIRMED:
                self.confirmed_at = timezone.now()
        
        super().save(*args, **kwargs)

@receiver(post_save, sender=CustomOrder)
def create_order_status_update(sender, instance, created, **kwargs):
    """
    Signal receiver to create an OrderStatusUpdate record whenever a CustomOrder's
    status changes or a new order is created.
    """
    if created:
        OrderStatusUpdate.objects.create(
            order=instance,
            old_status=None, # No old status for a new order
            new_status=instance.status,
            notes=_("Order created with initial status.")
        )
    else:
        # Check if the status field has actually changed
        try:
            original_instance = sender.objects.get(pk=instance.pk)
            if original_instance.status != instance.status:
                OrderStatusUpdate.objects.create(
                    order=instance,
                    old_status=original_instance.status,
                    new_status=instance.status,
                    notes=_("Order status updated.")
                )
        except sender.DoesNotExist:
            pass # Should not happen, but handle gracefully

class DesignImage(models.Model):
    """
    Images uploaded by the customer for their 'Own Design' orders.
    """
    order = models.ForeignKey(CustomOrder, related_name='design_images', on_delete=models.CASCADE, verbose_name=_('Order'))
    image = models.ImageField(upload_to='custom_orders/designs/%Y/%m/%d/', verbose_name=_('Image'))
    description = models.CharField(max_length=255, blank=True, verbose_name=_('Description'))
    is_primary = models.BooleanField(default=False, verbose_name=_('Is Primary Image'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))

    class Meta:
        ordering = ['-is_primary', 'created_at']
        verbose_name = _('Design Image')
        verbose_name_plural = _('Design Images')

    def __str__(self):
        return f"DesignImage #{self.pk} for Order {self.order.order_id}"

class CustomerItemImage(models.Model):
    """
    Images of existing items sent by the customer for 'Send Product' orders.
    """
    order = models.ForeignKey(CustomOrder, related_name='customer_item_images', on_delete=models.CASCADE, verbose_name=_('Order'))
    image = models.ImageField(upload_to='custom_orders/items/%Y/%m/%d/', verbose_name=_('Image'))
    description = models.CharField(max_length=255, blank=True, verbose_name=_('Description'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))

    class Meta:
        ordering = ['created_at']
        verbose_name = _('Customer Item Image')
        verbose_name_plural = _('Customer Item Images')

    def __str__(self):
        return f"ItemImage #{self.pk}"

class OrderStatusUpdate(models.Model):
    """
    Records historical changes to an order's status, including who made the change.
    """
    order = models.ForeignKey(CustomOrder, related_name='status_updates', on_delete=models.CASCADE, verbose_name=_('Order'))
    old_status = models.CharField(max_length=20, verbose_name=_('Old Status'), blank=True, null=True)
    new_status = models.CharField(max_length=20, verbose_name=_('New Status'))
    notes = models.TextField(blank=True, verbose_name=_('Notes'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Updated By')
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Order Status Update')
        verbose_name_plural = _('Order Status Updates')

    def __str__(self):
        return f"Status update for Order {self.order.order_id}: {self.old_status or 'N/A'} -> {self.new_status}"
