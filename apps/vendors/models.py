# apps/vendors/models.py
"""
Vendor Models
Multi-vendor marketplace with storefronts and dashboards.
"""
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
# timezone available when needed
from django.core.validators import MinValueValidator, MaxValueValidator
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from decimal import Decimal

from apps.core.models import BaseModel, TimeStampedModel


class Vendor(BaseModel):
    """
    Vendor/Seller profile for multi-vendor marketplace.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending Approval')
        ACTIVE = 'active', _('Active')
        SUSPENDED = 'suspended', _('Suspended')
        CLOSED = 'closed', _('Closed')
    
    # Owner
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile',
        verbose_name=_('user')
    )
    
    # Store Info
    store_name = models.CharField(_('store name'), max_length=200, unique=True)
    slug = models.SlugField(_('slug'), max_length=220, unique=True, db_index=True)
    tagline = models.CharField(_('tagline'), max_length=200, blank=True)
    description = models.TextField(_('description'), blank=True)
    
    # Branding
    logo = models.ImageField(_('logo'), upload_to='vendors/logos/%Y/%m/', null=True, blank=True)
    banner = models.ImageField(_('banner'), upload_to='vendors/banners/%Y/%m/', null=True, blank=True)
    
    # Contact
    email = models.EmailField(_('business email'), blank=True)
    phone = PhoneNumberField(_('business phone'), blank=True)
    whatsapp = PhoneNumberField(_('WhatsApp'), blank=True)
    website = models.URLField(_('website'), blank=True)
    
    # Address
    address_line_1 = models.CharField(_('address line 1'), max_length=255, blank=True)
    address_line_2 = models.CharField(_('address line 2'), max_length=255, blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)
    state = models.CharField(_('state/division'), max_length=100, blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20, blank=True)
    country = CountryField(_('country'), default='BD')
    
    # Business Info
    business_type = models.CharField(_('business type'), max_length=100, blank=True)
    tax_id = models.CharField(_('tax ID'), max_length=50, blank=True)
    registration_number = models.CharField(_('registration number'), max_length=50, blank=True)
    
    # Status & Verification
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    is_verified = models.BooleanField(_('verified'), default=False)
    is_featured = models.BooleanField(_('featured'), default=False)
    verified_at = models.DateTimeField(_('verified at'), null=True, blank=True)
    
    # Commission
    commission_rate = models.DecimalField(
        _('commission rate'),
        max_digits=5,
        decimal_places=2,
        default=Decimal(10.0),
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text=_('Commission percentage')
    )
    
    # Policies
    return_policy = models.TextField(_('return policy'), blank=True)
    shipping_policy = models.TextField(_('shipping policy'), blank=True)
    
    # Social Media
    facebook_url = models.URLField(_('Facebook'), blank=True)
    instagram_url = models.URLField(_('Instagram'), blank=True)
    twitter_url = models.URLField(_('Twitter'), blank=True)
    youtube_url = models.URLField(_('YouTube'), blank=True)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=150, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Statistics (cached)
    product_count = models.PositiveIntegerField(_('product count'), default=0)
    order_count = models.PositiveIntegerField(_('order count'), default=0)
    total_sales = models.DecimalField(
        _('total sales'),
        max_digits=14,
        decimal_places=2,
        default=Decimal('0.00')
    )
    average_rating = models.DecimalField(
        _('average rating'),
        max_digits=3,
        decimal_places=2,
        default=Decimal('0.00')
    )
    review_count = models.PositiveIntegerField(_('review count'), default=0)
    
    class Meta:
        verbose_name = _('vendor')
        verbose_name_plural = _('vendors')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_verified']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return self.store_name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.store_name)
            slug = base_slug
            counter = 1
            while Vendor.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        
        if not self.meta_title:
            self.meta_title = self.store_name
        
        # Set email from user if not provided
        if not self.email and self.user:
            self.email = self.user.email
        
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('storefront:vendor_detail', kwargs={'slug': self.slug})
    
    @property
    def is_active(self):
        return self.status == self.Status.ACTIVE
    
    @property
    def owner_name(self):
        return self.user.get_full_name()
    
    def update_statistics(self):
        """Update cached statistics."""
        from django.db.models import Avg, Sum, Count
        
        # Product count
        self.product_count = self.products.filter(is_active=True).count()
        
        # Order statistics
        order_items = self.order_items.filter(order__status__name__in=['completed', 'delivered'])
        self.order_count = order_items.values('order').distinct().count()
        self.total_sales = order_items.aggregate(total=Sum('subtotal'))['total'] or Decimal('0.00')
        
        # Review statistics
        reviews = self.reviews.filter(is_approved=True)
        self.review_count = reviews.count()
        self.average_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or Decimal('0.00')
        
        self.save(update_fields=[
            'product_count', 'order_count', 'total_sales',
            'average_rating', 'review_count'
        ])


class VendorPage(TimeStampedModel):
    """
    Custom pages for vendor storefronts.
    """
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='pages',
        verbose_name=_('vendor')
    )
    title = models.CharField(_('title'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=220)
    content = models.TextField(_('content'))
    is_published = models.BooleanField(_('published'), default=True)
    display_order = models.PositiveIntegerField(_('display order'), default=0)
    
    class Meta:
        verbose_name = _('vendor page')
        verbose_name_plural = _('vendor pages')
        ordering = ['display_order', 'title']
        unique_together = [['vendor', 'slug']]
    
    def __str__(self):
        return f'{self.vendor.store_name} - {self.title}'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class VendorSettings(models.Model):
    """
    Vendor-specific settings.
    """
    vendor = models.OneToOneField(
        Vendor,
        on_delete=models.CASCADE,
        related_name='settings',
        verbose_name=_('vendor')
    )
    
    # Notification settings
    email_on_order = models.BooleanField(_('email on new order'), default=True)
    email_on_review = models.BooleanField(_('email on new review'), default=True)
    email_on_low_stock = models.BooleanField(_('email on low stock'), default=True)
    
    # Store settings
    auto_approve_reviews = models.BooleanField(_('auto-approve reviews'), default=False)
    show_sold_count = models.BooleanField(_('show sold count'), default=True)
    show_stock_status = models.BooleanField(_('show stock status'), default=True)
    
    # Vacation mode
    vacation_mode = models.BooleanField(_('vacation mode'), default=False)
    vacation_message = models.TextField(_('vacation message'), blank=True)
    vacation_end_date = models.DateField(_('vacation end date'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('vendor settings')
        verbose_name_plural = _('vendor settings')
    
    def __str__(self):
        return f'Settings for {self.vendor.store_name}'


class VendorReview(BaseModel):
    """
    Reviews for vendors/stores.
    """
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('vendor')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_reviews',
        verbose_name=_('user')
    )
    rating = models.PositiveSmallIntegerField(
        _('rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(_('title'), max_length=200, blank=True)
    comment = models.TextField(_('comment'))
    is_approved = models.BooleanField(_('approved'), default=False)
    
    class Meta:
        verbose_name = _('vendor review')
        verbose_name_plural = _('vendor reviews')
        ordering = ['-created_at']
        unique_together = [['vendor', 'user']]
    
    def __str__(self):
        return f'Review for {self.vendor.store_name} by {self.user.email}'


class VendorPayout(TimeStampedModel):
    """
    Payout records for vendors.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')
    
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='payouts',
        verbose_name=_('vendor')
    )
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2
    )
    currency = models.CharField(_('currency'), max_length=3, default='BDT')
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    payment_method = models.CharField(_('payment method'), max_length=50)
    transaction_id = models.CharField(_('transaction ID'), max_length=100, blank=True)
    notes = models.TextField(_('notes'), blank=True)
    processed_at = models.DateTimeField(_('processed at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('vendor payout')
        verbose_name_plural = _('vendor payouts')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Payout #{self.pk} - {self.vendor.store_name}'
