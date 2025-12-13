# apps/products/models.py
"""
Product models for e-commerce platform.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator


class Tag(models.Model):
    """Product tags for filtering and organization."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=50, unique=True)
    slug = models.SlugField(_('slug'), max_length=60, unique=True)
    
    class Meta:
        verbose_name = _('tag')
        verbose_name_plural = _('tags')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Brand(models.Model):
    """Product brands."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=120, unique=True)
    description = models.TextField(_('description'), blank=True)
    logo = models.ImageField(
        _('logo'),
        upload_to='brands/',
        null=True,
        blank=True
    )
    website = models.URLField(_('website'), blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    
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


class AttributeType(models.Model):
    """Types of product attributes (Color, Size, Material, etc.)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=50, unique=True)
    slug = models.SlugField(_('slug'), max_length=60, unique=True)
    
    class Meta:
        verbose_name = _('attribute type')
        verbose_name_plural = _('attribute types')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    """Values for product attributes."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attribute_type = models.ForeignKey(
        AttributeType,
        on_delete=models.CASCADE,
        related_name='values'
    )
    value = models.CharField(_('value'), max_length=100)
    display_value = models.CharField(_('display value'), max_length=100, blank=True)
    color_code = models.CharField(
        _('color code'),
        max_length=7,
        blank=True,
        help_text=_('Hex color code for color attributes')
    )
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    
    class Meta:
        verbose_name = _('attribute value')
        verbose_name_plural = _('attribute values')
        ordering = ['attribute_type', 'sort_order', 'value']
        unique_together = ['attribute_type', 'value']
    
    def __str__(self):
        return f"{self.attribute_type.name}: {self.display_value or self.value}"


class Product(models.Model):
    """Main product model."""
    
    FEATURED_WEIGHT_CHOICES = [
        (0, _('Not Featured')),
        (1, _('Low Priority')),
        (3, _('Medium Priority')),
        (5, _('High Priority')),
        (10, _('Homepage Spotlight')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=220, unique=True)
    sku = models.CharField(
        _('SKU'),
        max_length=50,
        unique=True,
        blank=True,
        editable=False
    )
    description = models.TextField(_('description'))
    short_description = models.CharField(
        _('short description'),
        max_length=300,
        blank=True,
        help_text=_('Brief description for product cards')
    )
    
    # Category - single category, backend handles ancestor linking
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('category')
    )
    
    # Brand
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name=_('brand')
    )
    
    # Tags
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='products',
        verbose_name=_('tags')
    )
    
    # Pricing
    price = models.DecimalField(
        _('price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    sale_price = models.DecimalField(
        _('sale price'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    cost_price = models.DecimalField(
        _('cost price'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Cost for profit calculation')
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
    stock = models.PositiveIntegerField(_('stock'), default=0)
    low_stock_threshold = models.PositiveIntegerField(
        _('low stock threshold'),
        default=5
    )
    track_inventory = models.BooleanField(_('track inventory'), default=True)
    allow_backorder = models.BooleanField(_('allow backorder'), default=False)
    
    # Physical attributes
    weight = models.DecimalField(
        _('weight (kg)'),
        max_digits=8,
        decimal_places=3,
        null=True,
        blank=True
    )
    length = models.DecimalField(
        _('length (cm)'),
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    width = models.DecimalField(
        _('width (cm)'),
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    height = models.DecimalField(
        _('height (cm)'),
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=150, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Featured/Display
    is_featured = models.BooleanField(_('featured'), default=False)
    featured_weight = models.PositiveSmallIntegerField(
        _('featured weight'),
        choices=FEATURED_WEIGHT_CHOICES,
        default=0
    )
    featured_until = models.DateTimeField(
        _('featured until'),
        null=True,
        blank=True
    )
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    is_deleted = models.BooleanField(_('deleted'), default=False)
    
    # Statistics
    views = models.PositiveIntegerField(_('views'), default=0)
    sales_count = models.PositiveIntegerField(_('sales count'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    published_at = models.DateTimeField(_('published at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['category']),
            models.Index(fields=['brand']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['is_featured', 'featured_weight']),
            models.Index(fields=['price']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['-views']),
            models.Index(fields=['-sales_count']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug()
        if not self.sku:
            self.sku = generate_sku('BN')
        super().save(*args, **kwargs)
    
    def _generate_unique_slug(self):
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 1
        while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug
    
    @property
    def current_price(self):
        """Get the current effective price."""
        if self.sale_price and self.sale_price < self.price:
            return self.sale_price
        return self.price
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage if on sale."""
        if self.sale_price and self.sale_price < self.price:
            discount = ((self.price - self.sale_price) / self.price) * 100
            return round(discount)
        return 0
    
    @property
    def is_on_sale(self):
        """Check if product is on sale."""
        return self.sale_price is not None and self.sale_price < self.price
    
    @property
    def is_in_stock(self):
        """Check if product is in stock."""
        if not self.track_inventory:
            return True
        return self.stock > 0 or self.allow_backorder
    
    @property
    def is_low_stock(self):
        """Check if stock is below threshold."""
        if not self.track_inventory:
            return False
        return self.stock <= self.low_stock_threshold
    
    @property
    def primary_image(self):
        """Get the primary product image."""
        image = self.images.filter(is_primary=True).first()
        if not image:
            image = self.images.first()
        return image
    
    @property
    def average_rating(self):
        """Calculate average product rating."""
        from django.db.models import Avg
        result = self.reviews.filter(
            is_approved=True
        ).aggregate(avg=Avg('rating'))
        return result['avg'] or 0
    
    @property
    def review_count(self):
        """Get total approved review count."""
        return self.reviews.filter(is_approved=True).count()

    # ---------------------------------------------------------------------
    # Template-compatibility helpers
    # ---------------------------------------------------------------------

    @property
    def stock_quantity(self):
        return self.stock

    @property
    def in_stock(self):
        return self.is_in_stock

    @property
    def rating_average(self):
        return self.average_rating

    @property
    def has_variants(self):
        return self.variants.filter(is_active=True).exists()

    @property
    def color_variants(self):
        return []

    @property
    def size_variants(self):
        return []

    @property
    def is_new(self):
        try:
            return (timezone.now() - self.created_at).days <= 30
        except Exception:
            return False
    
    def soft_delete(self):
        """Soft delete the product."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active', 'updated_at'])
    
    def increment_views(self):
        """Increment view counter."""
        self.views = models.F('views') + 1
        self.save(update_fields=['views'])


class ProductImage(models.Model):
    """Product images."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        _('image'),
        upload_to='products/%Y/%m/'
    )
    alt_text = models.CharField(_('alt text'), max_length=200, blank=True)
    is_primary = models.BooleanField(_('primary'), default=False)
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    
    class Meta:
        verbose_name = _('product image')
        verbose_name_plural = _('product images')
        ordering = ['-is_primary', 'sort_order']
    
    def __str__(self):
        return f"Image for {self.product.name}"
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class ProductAttribute(models.Model):
    """Product attribute values (linking products to attribute values)."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='attributes'
    )
    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.CASCADE,
        related_name='products'
    )
    
    class Meta:
        verbose_name = _('product attribute')
        verbose_name_plural = _('product attributes')
        unique_together = ['product', 'attribute_value']
    
    def __str__(self):
        return f"{self.product.name} - {self.attribute_value}"


class ProductVariant(models.Model):
    """Product variants for different sizes/colors/etc."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    sku = models.CharField(_('SKU'), max_length=50, unique=True, blank=True)
    name = models.CharField(
        _('variant name'),
        max_length=100,
        blank=True,
        help_text=_('e.g., "Red - Large"')
    )
    
    # Attributes for this variant
    attributes = models.ManyToManyField(
        AttributeValue,
        related_name='variants',
        verbose_name=_('attributes')
    )
    
    # Pricing override
    price_adjustment = models.DecimalField(
        _('price adjustment'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text=_('Amount to add/subtract from base price')
    )
    
    # Inventory
    stock = models.PositiveIntegerField(_('stock'), default=0)
    
    # Image
    image = models.ImageField(
        _('image'),
        upload_to='products/variants/',
        null=True,
        blank=True
    )
    
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    
    class Meta:
        verbose_name = _('product variant')
        verbose_name_plural = _('product variants')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.product.name} - {self.name or self.sku}"
    
    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = generate_sku('VAR')
        super().save(*args, **kwargs)
    
    @property
    def price(self):
        """Calculate variant price."""
        return self.product.current_price + self.price_adjustment


class RelatedProduct(models.Model):
    """Related products relationship."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='related_products'
    )
    related = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='related_to'
    )
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    
    class Meta:
        verbose_name = _('related product')
        verbose_name_plural = _('related products')
        unique_together = ['product', 'related']
        ordering = ['sort_order']
    
    def __str__(self):
        return f"{self.product.name} -> {self.related.name}"
