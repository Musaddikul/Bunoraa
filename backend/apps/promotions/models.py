# apps/promotions/models.py
"""
Promotion and coupon models.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class Coupon(models.Model):
    """
    Coupon/discount code model.
    """
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'percentage', 'Percentage'
        FIXED = 'fixed', 'Fixed Amount'
        FREE_SHIPPING = 'free_shipping', 'Free Shipping'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True)
    
    # Discount settings
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
        default=DiscountType.PERCENTAGE
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    # Constraints
    minimum_purchase = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Minimum order amount required to use this coupon'
    )
    maximum_discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Maximum discount amount (for percentage coupons)'
    )
    
    # Usage limits
    usage_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Maximum number of times this coupon can be used'
    )
    usage_limit_per_user = models.PositiveIntegerField(
        default=1,
        help_text='Maximum uses per customer'
    )
    times_used = models.PositiveIntegerField(default=0)
    
    # Validity
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Restrictions
    first_order_only = models.BooleanField(default=False)
    
    # Product/Category restrictions
    applicable_products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='applicable_coupons',
        help_text='Leave empty to apply to all products'
    )
    applicable_categories = models.ManyToManyField(
        'categories.Category',
        blank=True,
        related_name='applicable_coupons',
        help_text='Leave empty to apply to all categories'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'valid_from', 'valid_until']),
        ]
    
    def __str__(self):
        return f'{self.code} ({self.get_discount_type_display()})'
    
    def is_valid(self, user=None, cart_total=None):
        """
        Check if coupon is valid.
        Returns tuple (is_valid, message).
        """
        now = timezone.now()
        
        # Check if active
        if not self.is_active:
            return False, 'This coupon is not active'
        
        # Check validity dates
        if self.valid_from and now < self.valid_from:
            return False, 'This coupon is not yet valid'
        
        if self.valid_until and now > self.valid_until:
            return False, 'This coupon has expired'
        
        # Check usage limit
        if self.usage_limit and self.times_used >= self.usage_limit:
            return False, 'This coupon has reached its usage limit'
        
        # Check minimum purchase
        if cart_total is not None and self.minimum_purchase:
            if cart_total < self.minimum_purchase:
                return False, f'Minimum purchase of ${self.minimum_purchase} required'
        
        # Check user-specific restrictions
        if user and user.is_authenticated:
            # Check per-user limit
            user_usage = CouponUsage.objects.filter(
                coupon=self,
                user=user
            ).count()
            
            if user_usage >= self.usage_limit_per_user:
                return False, 'You have already used this coupon'
            
            # Check first order only
            if self.first_order_only:
                from apps.orders.models import Order
                has_orders = Order.objects.filter(
                    user=user,
                    payment_status=Order.PaymentStatus.PAID
                ).exists()
                
                if has_orders:
                    return False, 'This coupon is only valid for first-time customers'
        
        return True, 'Coupon is valid'
    
    def calculate_discount(self, subtotal):
        """Calculate discount amount for given subtotal."""
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = (subtotal * self.discount_value) / 100
            
            # Apply maximum discount cap
            if self.maximum_discount and discount > self.maximum_discount:
                discount = self.maximum_discount
            
            return discount
        
        elif self.discount_type == self.DiscountType.FIXED:
            # Fixed discount cannot exceed subtotal
            return min(self.discount_value, subtotal)
        
        elif self.discount_type == self.DiscountType.FREE_SHIPPING:
            # Return 0 for free shipping (handled separately)
            return Decimal('0.00')
        
        return Decimal('0.00')
    
    def record_usage(self, user=None):
        """Record coupon usage."""
        self.times_used += 1
        self.save(update_fields=['times_used'])
        
        if user and user.is_authenticated:
            CouponUsage.objects.create(coupon=self, user=user)
    
    @property
    def is_expired(self):
        if self.valid_until:
            return timezone.now() > self.valid_until
        return False
    
    @property
    def discount_display(self):
        if self.discount_type == self.DiscountType.PERCENTAGE:
            return f'{self.discount_value}% off'
        elif self.discount_type == self.DiscountType.FIXED:
            return f'${self.discount_value} off'
        else:
            return 'Free Shipping'


class CouponUsage(models.Model):
    """Track coupon usage by user."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.CASCADE,
        related_name='usages'
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='coupon_usages'
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='coupon_usages'
    )
    used_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-used_at']
    
    def __str__(self):
        return f'{self.user.email} used {self.coupon.code}'


class Banner(models.Model):
    """
    Promotional banner for homepage/category pages.
    """
    class Position(models.TextChoices):
        HOME_HERO = 'home_hero', 'Homepage Hero'
        HOME_SECONDARY = 'home_secondary', 'Homepage Secondary'
        CATEGORY = 'category', 'Category Page'
        SIDEBAR = 'sidebar', 'Sidebar'
        POPUP = 'popup', 'Popup'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    
    # Media
    image = models.ImageField(upload_to='banners/')
    mobile_image = models.ImageField(
        upload_to='banners/mobile/',
        blank=True,
        null=True,
        help_text='Optional mobile-specific image'
    )
    
    # Link
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=50, default='Shop Now')
    
    # Display settings
    position = models.CharField(
        max_length=20,
        choices=Position.choices,
        default=Position.HOME_HERO
    )
    order = models.PositiveIntegerField(default=0)
    
    # Styling
    text_color = models.CharField(max_length=7, default='#FFFFFF')
    overlay_color = models.CharField(max_length=7, blank=True)
    overlay_opacity = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=Decimal('0.3'),
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    # Validity
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['position', 'order']
    
    def __str__(self):
        return self.title
    
    @property
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        return True


class Sale(models.Model):
    """
    Site-wide or category-specific sale.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # Discount
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Products
    products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='sales'
    )
    categories = models.ManyToManyField(
        'categories.Category',
        blank=True,
        related_name='sales'
    )
    apply_to_all = models.BooleanField(
        default=False,
        help_text='Apply to all products site-wide'
    )
    
    # Display
    banner_image = models.ImageField(
        upload_to='sales/',
        blank=True,
        null=True
    )
    
    # Validity
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f'{self.name} ({self.discount_percentage}% off)'
    
    @property
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.start_date <= now <= self.end_date
        )
