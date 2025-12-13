# apps/products/models.py
"""
Product Models
Complete product management with variants, images, and inventory.
"""
from django.db import models
# settings imported when needed
from django.utils.text import slugify
from django.urls import reverse
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from django_ckeditor_5.fields import CKEditor5Field
from decimal import Decimal
from taggit.managers import TaggableManager

from apps.core.models import BaseModel, TimeStampedModel
from core.utils import generate_sku, generate_unique_slug


class Brand(TimeStampedModel):
    """
    Product brand model.
    """
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=120, unique=True)
    description = models.TextField(_('description'), blank=True)
    logo = models.ImageField(_('logo'), upload_to='brands/', null=True, blank=True)
    website = models.URLField(_('website'), blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    
    class Meta:
        verbose_name = _('brand')
        verbose_name_plural = _('brands')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('storefront:brand_detail', kwargs={'slug': self.slug})


class ProductAttribute(models.Model):
    """
    Configurable product attributes (e.g., Color, Size, Material).
    """
    name = models.CharField(_('name'), max_length=50, unique=True)
    slug = models.SlugField(_('slug'), max_length=60, unique=True)
    description = models.TextField(_('description'), blank=True)
    
    class Meta:
        verbose_name = _('product attribute')
        verbose_name_plural = _('product attributes')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class AttributeValue(models.Model):
    """
    Values for product attributes (e.g., Red, Blue for Color).
    """
    attribute = models.ForeignKey(
        ProductAttribute,
        on_delete=models.CASCADE,
        related_name='values',
        verbose_name=_('attribute')
    )
    value = models.CharField(_('value'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=120)
    color_code = models.CharField(
        _('color code'),
        max_length=7,
        blank=True,
        help_text=_('Hex color code for color attributes')
    )
    display_order = models.PositiveIntegerField(_('display order'), default=0)
    
    class Meta:
        verbose_name = _('attribute value')
        verbose_name_plural = _('attribute values')
        ordering = ['attribute', 'display_order', 'value']
        unique_together = [['attribute', 'slug']]
    
    def __str__(self):
        return f'{self.attribute.name}: {self.value}'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.value)
        super().save(*args, **kwargs)


class Product(BaseModel):
    """
    Main product model.
    """
    class FeaturedWeight(models.IntegerChoices):
        NOT_FEATURED = 0, _('Not Featured')
        LOW = 1, _('Low Priority')
        MEDIUM = 3, _('Medium Priority')
        HIGH = 5, _('High Priority')
        SPOTLIGHT = 8, _('Homepage Spotlight')
    
    class Status(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PENDING = 'pending', _('Pending Review')
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        OUT_OF_STOCK = 'out_of_stock', _('Out of Stock')
    
    # Basic Info
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=220, unique=True, db_index=True)
    sku = models.CharField(_('SKU'), max_length=50, unique=True, db_index=True)
    
    # Description
    short_description = models.CharField(_('short description'), max_length=300, blank=True)
    description = CKEditor5Field(_('description'), config_name='extends', blank=True)
    
    # Categorization
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('category')
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name=_('brand')
    )
    
    # Vendor
    vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_('vendor')
    )
    
    # Pricing
    price = models.DecimalField(
        _('price'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    compare_at_price = models.DecimalField(
        _('compare at price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Original price for showing discount')
    )
    cost_price = models.DecimalField(
        _('cost price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Cost for profit calculations')
    )
    
    # Tax
    is_taxable = models.BooleanField(_('taxable'), default=True)
    tax_rate = models.DecimalField(
        _('tax rate'),
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Override default tax rate')
    )
    
    # Inventory
    track_inventory = models.BooleanField(_('track inventory'), default=True)
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    low_stock_threshold = models.PositiveIntegerField(_('low stock threshold'), default=5)
    allow_backorder = models.BooleanField(_('allow backorder'), default=False)
    
    # Physical Properties
    weight = models.DecimalField(
        _('weight (kg)'),
        max_digits=8,
        decimal_places=3,
        null=True,
        blank=True
    )
    length = models.DecimalField(_('length (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(_('width (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(_('height (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Status & Visibility
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True
    )
    is_active = models.BooleanField(_('active'), default=True, db_index=True)
    
    # Featured
    featured_weight = models.PositiveSmallIntegerField(
        _('featured weight'),
        choices=FeaturedWeight.choices,
        default=FeaturedWeight.NOT_FEATURED
    )
    featured_until = models.DateTimeField(_('featured until'), null=True, blank=True)
    
    # Collections/Flags
    is_new = models.BooleanField(_('new arrival'), default=True)
    is_bestseller = models.BooleanField(_('bestseller'), default=False)
    is_on_sale = models.BooleanField(_('on sale'), default=False)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=150, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Search
    search_vector = SearchVectorField(null=True, blank=True)
    
    # Statistics
    view_count = models.PositiveIntegerField(_('view count'), default=0)
    sale_count = models.PositiveIntegerField(_('sale count'), default=0)
    
    # Attributes (for filtering)
    attributes = models.ManyToManyField(
        AttributeValue,
        through='ProductAttributeValue',
        related_name='products',
        verbose_name=_('attributes'),
        blank=True
    )
    
    # Tags
    tags = TaggableManager(blank=True)
    
    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['vendor', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['featured_weight', '-created_at']),
            GinIndex(fields=['search_vector'], name='product_search_idx'),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Generate slug
        if not self.slug:
            self.slug = generate_unique_slug(Product, self.name)
        
        # Generate SKU
        if not self.sku:
            self.sku = generate_sku('PRD')
        
        # Auto-fill meta fields
        if not self.meta_title:
            self.meta_title = self.name[:150]
        if not self.meta_description and self.short_description:
            self.meta_description = self.short_description
        elif not self.meta_description and self.description:
            self.meta_description = strip_tags(self.description)[:300]
        
        # Update status based on stock
        if self.track_inventory and self.stock_quantity == 0 and not self.allow_backorder:
            self.status = self.Status.OUT_OF_STOCK
        
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('storefront:product_detail', kwargs={'slug': self.slug})
    
    @property
    def primary_image(self):
        """Get the primary product image."""
        return self.images.filter(is_primary=True).first() or self.images.first()
    
    @property
    def primary_image_url(self):
        """Get the primary image URL."""
        img = self.primary_image
        return img.image.url if img else None
    
    @property
    def is_discounted(self):
        """Check if product has a discount."""
        return self.compare_at_price is not None and self.compare_at_price > self.price
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage."""
        if self.is_discounted and self.compare_at_price is not None:
            return int(((self.compare_at_price - self.price) / self.compare_at_price) * 100)
        return 0
    
    @property
    def current_price(self):
        """Get the current selling price."""
        return self.price
    
    @property
    def is_in_stock(self):
        """Check if product is in stock."""
        if not self.track_inventory:
            return True
        return self.stock_quantity > 0 or self.allow_backorder
    
    @property
    def is_low_stock(self):
        """Check if product is low on stock."""
        if not self.track_inventory:
            return False
        return 0 < self.stock_quantity <= self.low_stock_threshold
    
    @property
    def is_featured(self):
        """Check if product is currently featured."""
        if self.featured_weight == 0:
            return False
        if self.featured_until and self.featured_until < timezone.now():
            return False
        return True
    
    @property
    def average_rating(self):
        """Get average review rating."""
        from django.db.models import Avg
        result = self.reviews.filter(is_approved=True).aggregate(avg=Avg('rating'))
        return result['avg'] or 0
    
    @property
    def review_count(self):
        """Get approved review count."""
        return self.reviews.filter(is_approved=True).count()
    
    def increment_view_count(self):
        """Increment view count."""
        Product.objects.filter(pk=self.pk).update(view_count=models.F('view_count') + 1)
    
    def update_stock(self, quantity_change):
        """Update stock quantity."""
        if self.track_inventory:
            new_quantity = self.stock_quantity + quantity_change
            self.stock_quantity = max(0, new_quantity)
            self.save(update_fields=['stock_quantity', 'updated_at'])


class ProductAttributeValue(models.Model):
    """
    Through model for product attributes.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = [['product', 'attribute_value']]


class ProductImage(TimeStampedModel):
    """
    Product images with ordering support.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('product')
    )
    image = models.ImageField(_('image'), upload_to='products/%Y/%m/')
    alt_text = models.CharField(_('alt text'), max_length=200, blank=True)
    is_primary = models.BooleanField(_('primary image'), default=False)
    display_order = models.PositiveIntegerField(_('display order'), default=0)
    
    class Meta:
        verbose_name = _('product image')
        verbose_name_plural = _('product images')
        ordering = ['display_order', '-is_primary']
    
    def __str__(self):
        return f'Image for {self.product.name}'
    
    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        
        # If no primary image exists, make this one primary
        if not self.pk and not ProductImage.objects.filter(product=self.product, is_primary=True).exists():
            self.is_primary = True
        
        super().save(*args, **kwargs)


class ProductVariant(TimeStampedModel):
    """
    Product variants with specific attribute combinations.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name=_('product')
    )
    sku = models.CharField(_('SKU'), max_length=50, unique=True, db_index=True)
    name = models.CharField(_('name'), max_length=200, blank=True)
    
    # Pricing (override parent if set)
    price = models.DecimalField(
        _('price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Leave empty to use parent product price')
    )
    compare_at_price = models.DecimalField(
        _('compare at price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Inventory
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    
    # Physical properties (override parent if set)
    weight = models.DecimalField(
        _('weight (kg)'),
        max_digits=8,
        decimal_places=3,
        null=True,
        blank=True
    )
    
    # Image
    image = models.ImageField(_('image'), upload_to='variants/%Y/%m/', null=True, blank=True)
    
    # Attributes
    attributes = models.ManyToManyField(
        AttributeValue,
        related_name='variants',
        verbose_name=_('attributes')
    )
    
    is_active = models.BooleanField(_('active'), default=True)
    
    class Meta:
        verbose_name = _('product variant')
        verbose_name_plural = _('product variants')
        ordering = ['product', 'name']
    
    def __str__(self):
        return self.name or f'{self.product.name} - {self.sku}'
    
    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = generate_sku('VAR')
        
        # Generate name from attributes if not set
        if not self.name and self.pk:
            attrs = ' / '.join([str(av) for av in self.attributes.all()])
            self.name = f'{self.product.name} - {attrs}' if attrs else self.product.name
        
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        """Get variant price or fallback to parent."""
        return self.price if self.price else self.product.price
    
    @property
    def current_compare_at_price(self):
        """Get compare price or fallback to parent."""
        return self.compare_at_price if self.compare_at_price else self.product.compare_at_price
    
    @property
    def is_in_stock(self):
        """Check if variant is in stock."""
        if not self.product.track_inventory:
            return True
        return self.stock_quantity > 0 or self.product.allow_backorder
    
    @property
    def attribute_string(self):
        """Get string representation of attributes."""
        return ' / '.join([av.value for av in self.attributes.all()])
