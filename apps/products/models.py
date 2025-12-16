"""
Product models
"""
import uuid
from decimal import Decimal
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from core.utils.helpers import generate_unique_slug, generate_sku


class Tag(models.Model):
    """Product tags for filtering and organization."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=120, unique=True)
    
    class Meta:
        verbose_name = _('tag')
        verbose_name_plural = _('tags')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Tag, self.name)
        super().save(*args, **kwargs)


class Attribute(models.Model):
    """Product attributes (e.g., Color, Size, Material)."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=120, unique=True)
    
    class Meta:
        verbose_name = _('attribute')
        verbose_name_plural = _('attributes')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Attribute, self.name)
        super().save(*args, **kwargs)


class AttributeValue(models.Model):
    """Values for product attributes."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='values',
        verbose_name=_('attribute')
    )
    value = models.CharField(_('value'), max_length=100)
    
    class Meta:
        verbose_name = _('attribute value')
        verbose_name_plural = _('attribute values')
        ordering = ['attribute', 'value']
        unique_together = ['attribute', 'value']
    
    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class Product(models.Model):
    """Main product model."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(_('name'), max_length=300)
    slug = models.SlugField(_('slug'), max_length=350, unique=True)
    sku = models.CharField(_('SKU'), max_length=100, unique=True, blank=True)
    description = models.TextField(_('description'), blank=True)
    short_description = models.CharField(_('short description'), max_length=500, blank=True)
    
    # Pricing
    price = models.DecimalField(
        _('price'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    sale_price = models.DecimalField(
        _('sale price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    cost_price = models.DecimalField(
        _('cost price'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    # Inventory
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    low_stock_threshold = models.PositiveIntegerField(_('low stock threshold'), default=5)
    track_inventory = models.BooleanField(_('track inventory'), default=True)
    allow_backorder = models.BooleanField(_('allow backorder'), default=False)
    
    # Relationships
    categories = models.ManyToManyField(
        'categories.Category',
        related_name='products',
        verbose_name=_('categories')
    )
    tags = models.ManyToManyField(
        Tag,
        related_name='products',
        blank=True,
        verbose_name=_('tags')
    )
    attributes = models.ManyToManyField(
        AttributeValue,
        through='ProductAttribute',
        related_name='products',
        blank=True,
        verbose_name=_('attributes')
    )
    related_products = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        verbose_name=_('related products')
    )
    
    # Physical properties
    weight = models.DecimalField(
        _('weight (kg)'),
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    length = models.DecimalField(_('length (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(_('width (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(_('height (cm)'), max_digits=8, decimal_places=2, null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=200, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=500, blank=True)
    
    # Status flags
    is_active = models.BooleanField(_('active'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    is_new = models.BooleanField(_('new arrival'), default=True)
    is_bestseller = models.BooleanField(_('bestseller'), default=False)
    is_deleted = models.BooleanField(_('deleted'), default=False)
    
    # Stats
    view_count = models.PositiveIntegerField(_('view count'), default=0)
    sold_count = models.PositiveIntegerField(_('sold count'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['sold_count']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Product, self.name)
        if not self.sku:
            self.sku = generate_sku('PRD')
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        """Get the current selling price."""
        if self.sale_price and self.sale_price < self.price:
            return self.sale_price
        return self.price
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage if on sale."""
        if self.sale_price and self.sale_price < self.price:
            discount = ((self.price - self.sale_price) / self.price) * 100
            return round(discount, 0)
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
        return self.stock_quantity > 0 or self.allow_backorder
    
    @property
    def is_low_stock(self):
        """Check if stock is low."""
        if not self.track_inventory:
            return False
        return self.stock_quantity <= self.low_stock_threshold and self.stock_quantity > 0
    
    @property
    def primary_image(self):
        """Get the primary product image."""
        return self.images.filter(is_primary=True).first() or self.images.first()
    
    @property
    def average_rating(self):
        """Get average rating from reviews."""
        from apps.reviews.models import Review
        reviews = Review.objects.filter(product=self, status=Review.STATUS_APPROVED)
        if reviews.exists():
            return round(reviews.aggregate(models.Avg('rating'))['rating__avg'], 1)
        return None
    
    @property
    def review_count(self):
        """Get count of approved reviews."""
        from apps.reviews.models import Review
        return Review.objects.filter(product=self, status=Review.STATUS_APPROVED).count()
    
    def soft_delete(self):
        """Soft delete the product."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active', 'updated_at'])
    
    def increment_view_count(self):
        """Increment view count."""
        self.view_count = models.F('view_count') + 1
        self.save(update_fields=['view_count'])
    
    def update_stock(self, quantity, operation='subtract'):
        """Update stock quantity."""
        if operation == 'subtract':
            self.stock_quantity = max(0, self.stock_quantity - quantity)
        else:
            self.stock_quantity += quantity
        self.save(update_fields=['stock_quantity', 'updated_at'])


class ProductImage(models.Model):
    """Product images."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('product')
    )
    image = models.ImageField(_('image'), upload_to='products/')
    alt_text = models.CharField(_('alt text'), max_length=200, blank=True)
    is_primary = models.BooleanField(_('primary image'), default=False)
    order = models.PositiveIntegerField(_('display order'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('product image')
        verbose_name_plural = _('product images')
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"Image for {self.product.name}"
    
    @property
    def url(self):
        """Return the underlying file URL if it exists."""
        if self.image:
            return self.image.url
        return None

    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class ProductAttribute(models.Model):
    """Through model for product attributes."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = _('product attribute')
        verbose_name_plural = _('product attributes')
        unique_together = ['product', 'attribute_value']


class ProductVariant(models.Model):
    """Product variants (size/color combinations)."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name=_('product')
    )
    sku = models.CharField(_('SKU'), max_length=100, unique=True, blank=True)
    name = models.CharField(_('variant name'), max_length=200)
    
    # Pricing (if different from main product)
    price_modifier = models.DecimalField(
        _('price modifier'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    
    # Inventory
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    
    # Attributes
    attributes = models.ManyToManyField(
        AttributeValue,
        related_name='variants',
        verbose_name=_('attributes')
    )
    
    # Image (optional)
    image = models.ImageField(_('variant image'), upload_to='products/variants/', blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('product variant')
        verbose_name_plural = _('product variants')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.product.name} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = generate_sku('VAR')
        super().save(*args, **kwargs)
    
    @property
    def price(self):
        """Get variant price."""
        return self.product.current_price + self.price_modifier
    
    @property
    def is_in_stock(self):
        """Check if variant is in stock."""
        if not self.product.track_inventory:
            return True
        return self.stock_quantity > 0 or self.product.allow_backorder
