# apps/promotions/models.py
"""
Promotion Models
Comprehensive promotional system with coupons, sales, and offers.
"""
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.core.models import TimeStampedModel


class Coupon(TimeStampedModel):
    """
    Coupon/discount code model.
    """
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'percentage', _('Percentage')
        FIXED = 'fixed', _('Fixed Amount')
        FREE_SHIPPING = 'free_shipping', _('Free Shipping')
    
    code = models.CharField(
        _('code'),
        max_length=50,
        unique=True,
        db_index=True
    )
    description = models.TextField(_('description'), blank=True)
    
    # Discount
    discount_type = models.CharField(
        _('discount type'),
        max_length=20,
        choices=DiscountType.choices,
        default=DiscountType.PERCENTAGE
    )
    discount_value = models.DecimalField(
        _('discount value'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    max_discount = models.DecimalField(
        _('max discount'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Maximum discount amount for percentage coupons')
    )
    
    # Restrictions
    min_order_amount = models.DecimalField(
        _('minimum order'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    max_uses = models.PositiveIntegerField(
        _('max uses'),
        null=True,
        blank=True,
        help_text=_('Total uses allowed')
    )
    max_uses_per_user = models.PositiveIntegerField(
        _('max uses per user'),
        default=1
    )
    
    # Usage tracking
    times_used = models.PositiveIntegerField(_('times used'), default=0)
    
    # Product restrictions
    applicable_products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='applicable_coupons',
        verbose_name=_('applicable products')
    )
    applicable_categories = models.ManyToManyField(
        'categories.Category',
        blank=True,
        related_name='applicable_coupons',
        verbose_name=_('applicable categories')
    )
    excluded_products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='excluded_coupons',
        verbose_name=_('excluded products')
    )
    
    # User restrictions
    user_specific = models.BooleanField(_('user specific'), default=False)
    allowed_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='allowed_coupons',
        verbose_name=_('allowed users')
    )
    first_order_only = models.BooleanField(_('first order only'), default=False)
    
    # Validity
    valid_from = models.DateTimeField(_('valid from'))
    valid_until = models.DateTimeField(_('valid until'))
    is_active = models.BooleanField(_('active'), default=True)
    
    class Meta:
        verbose_name = _('coupon')
        verbose_name_plural = _('coupons')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.code
    
    @property
    def is_valid(self):
        """Check if coupon is currently valid."""
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.max_uses and self.times_used >= self.max_uses:
            return False
        return True
    
    def is_valid_for_user(self, user):
        """Check if coupon is valid for specific user."""
        if not self.is_valid:
            return False
        
        if self.user_specific and user not in self.allowed_users.all():
            return False
        
        if self.first_order_only:
            from apps.orders.models import Order
            if Order.objects.filter(user=user).exists():
                return False
        
        # Check per-user usage limit
        user_usage = CouponUsage.objects.filter(
            coupon=self,
            user=user
        ).count()
        if user_usage >= self.max_uses_per_user:
            return False
        
        return True
    
    def calculate_discount(self, subtotal):
        """Calculate discount amount."""
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = subtotal * (self.discount_value / 100)
            if self.max_discount:
                discount = min(discount, self.max_discount)
        elif self.discount_type == self.DiscountType.FIXED:
            discount = self.discount_value
        else:  # Free shipping
            discount = Decimal('0.00')
        
        return min(discount, subtotal)


class CouponUsage(TimeStampedModel):
    """
    Track coupon usage.
    """
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.CASCADE,
        related_name='usages',
        verbose_name=_('coupon')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='coupon_usages',
        verbose_name=_('user')
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='coupon_usages',
        verbose_name=_('order')
    )
    discount_amount = models.DecimalField(
        _('discount amount'),
        max_digits=10,
        decimal_places=2
    )
    
    class Meta:
        verbose_name = _('coupon usage')
        verbose_name_plural = _('coupon usages')
    
    def __str__(self):
        return f'{self.coupon.code} used by {self.user}'


class Sale(TimeStampedModel):
    """
    Sale/promotional event.
    """
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), unique=True)
    description = models.TextField(_('description'), blank=True)
    
    # Discount
    discount_percentage = models.DecimalField(
        _('discount %'),
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Products
    products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='sales',
        verbose_name=_('products')
    )
    categories = models.ManyToManyField(
        'categories.Category',
        blank=True,
        related_name='sales',
        verbose_name=_('categories')
    )
    apply_to_all = models.BooleanField(
        _('apply to all'),
        default=False,
        help_text=_('Apply to all products')
    )
    
    # Display
    banner_image = models.ImageField(
        _('banner'),
        upload_to='sales/banners/',
        blank=True
    )
    badge_text = models.CharField(
        _('badge text'),
        max_length=50,
        blank=True,
        help_text=_('Text shown on product badges')
    )
    badge_color = models.CharField(
        _('badge color'),
        max_length=7,
        default='#FF0000'
    )
    
    # Validity
    start_date = models.DateTimeField(_('start date'))
    end_date = models.DateTimeField(_('end date'))
    is_active = models.BooleanField(_('active'), default=True)
    
    # Featured
    is_featured = models.BooleanField(_('featured'), default=False)
    priority = models.PositiveSmallIntegerField(_('priority'), default=0)
    
    class Meta:
        verbose_name = _('sale')
        verbose_name_plural = _('sales')
        ordering = ['-priority', '-start_date']
    
    def __str__(self):
        return self.name
    
    @property
    def is_valid(self):
        """Check if sale is currently valid."""
        now = timezone.now()
        return (
            self.is_active and
            self.start_date <= now <= self.end_date
        )
    
    def get_products(self):
        """Get all products in this sale."""
        from apps.products.models import Product
        
        if self.apply_to_all:
            return Product.objects.filter(is_active=True)
        
        product_ids = set(self.products.values_list('id', flat=True))
        
        # Add products from categories
        for category in self.categories.all():
            category_products = Product.objects.filter(
                category__in=category.get_descendants(include_self=True),
                is_active=True
            )
            product_ids.update(category_products.values_list('id', flat=True))
        
        return Product.objects.filter(id__in=product_ids)


class FlashDeal(TimeStampedModel):
    """
    Flash deal - limited time, limited quantity offer.
    """
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='flash_deals',
        verbose_name=_('product')
    )
    
    # Pricing
    deal_price = models.DecimalField(
        _('deal price'),
        max_digits=12,
        decimal_places=2
    )
    
    # Quantity
    quantity_available = models.PositiveIntegerField(_('quantity available'))
    quantity_sold = models.PositiveIntegerField(_('quantity sold'), default=0)
    
    # Timing
    start_time = models.DateTimeField(_('start time'))
    end_time = models.DateTimeField(_('end time'))
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    
    class Meta:
        verbose_name = _('flash deal')
        verbose_name_plural = _('flash deals')
        ordering = ['start_time']
    
    def __str__(self):
        return f'{self.product.name} Flash Deal'
    
    @property
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.start_time <= now <= self.end_time and
            self.quantity_sold < self.quantity_available
        )
    
    @property
    def discount_percentage(self):
        if self.product.price > 0:
            return int(100 - (self.deal_price / self.product.price * 100))
        return 0
    
    @property
    def quantity_remaining(self):
        return self.quantity_available - self.quantity_sold
    
    @property
    def sold_percentage(self):
        if self.quantity_available > 0:
            return int(self.quantity_sold / self.quantity_available * 100)
        return 0


class Bundle(TimeStampedModel):
    """
    Product bundle with special pricing.
    """
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), unique=True)
    description = models.TextField(_('description'), blank=True)
    
    # Products
    products = models.ManyToManyField(
        'products.Product',
        through='BundleItem',
        related_name='bundles',
        verbose_name=_('products')
    )
    
    # Pricing
    bundle_price = models.DecimalField(
        _('bundle price'),
        max_digits=12,
        decimal_places=2
    )
    
    # Display
    image = models.ImageField(
        _('image'),
        upload_to='bundles/',
        blank=True
    )
    
    # Validity
    valid_from = models.DateTimeField(_('valid from'), null=True, blank=True)
    valid_until = models.DateTimeField(_('valid until'), null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    
    class Meta:
        verbose_name = _('bundle')
        verbose_name_plural = _('bundles')
    
    def __str__(self):
        return self.name
    
    @property
    def original_price(self):
        return sum(
            item.product.price * item.quantity
            for item in self.items.all()
        )
    
    @property
    def savings(self):
        return self.original_price - self.bundle_price
    
    @property
    def discount_percentage(self):
        if self.original_price > 0:
            return int(100 - (self.bundle_price / self.original_price * 100))
        return 0


class BundleItem(models.Model):
    """
    Product in a bundle.
    """
    bundle = models.ForeignKey(
        Bundle,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('bundle')
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        verbose_name=_('product')
    )
    quantity = models.PositiveIntegerField(_('quantity'), default=1)
    
    class Meta:
        verbose_name = _('bundle item')
        verbose_name_plural = _('bundle items')
        unique_together = [['bundle', 'product']]
    
    def __str__(self):
        return f'{self.quantity}x {self.product.name}'
