# products/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.utils.html import strip_tags
from django.utils import timezone
from django.db.models import Count, Avg, CharField
from django_ckeditor_5.fields import CKEditor5Field
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.db.models.signals import post_delete
from django.dispatch import receiver
from decimal import Decimal

User = get_user_model()

# Helper for SKU
def generate_unique_sku():
    prefix = 'BN'
    while True:
        sku = f"{prefix}-{get_random_string(8).upper()}"
        if not Product.objects.filter(sku=sku).exists():
            return sku

# Filterable attributes models
class Color(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Fabric(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Size(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class Fit(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

# FIX: Add the Brand model definition
class Brand(models.Model):
    """
    Represents a product brand.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='brands/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('products:brand_detail', kwargs={'brand_slug': self.slug})


class Category(MPTTModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    parent = TreeForeignKey(
        'self', on_delete=models.CASCADE, 
        null=True, blank=True, related_name='children'
    )
    meta_title = models.CharField(max_length=100, blank=True)
    meta_description = models.TextField(blank=True)
    featured = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='category_thumbnails/', null=True, blank=True)
    auto_disable_until = models.DateTimeField(null=True, blank=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        verbose_name_plural = "Categories"
        indexes = [GinIndex(fields=['name'],
                name="products_ca_name_gin",
                opclasses=['gin_trgm_ops'])]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        if self.pk:
            old = Category.objects.filter(pk=self.pk).first()
            if old and old.active != self.active:
                self._update_descendants_active_status(self.active)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        if self.parent:
            return reverse('products:subcategory', kwargs={
                'category_slug': self.parent.slug,
                'subcategory_slug': self.slug
            })
        return reverse('products:category', kwargs={'category_slug': self.slug})

    def get_subcategories(self):
        return self.get_children()

    def get_all_subcategories(self):
        return self.get_descendants(include_self=True)

    def get_products_with_subcategories(self):
        from django.db.models import Q
        subcategories = self.get_descendants(include_self=True)
        return Product.objects.filter(category__in=subcategories)

    def _update_descendants_active_status(self, status):
        descendants = self.get_descendants()
        descendants.update(active=status)
        Product.objects.filter(category__in=descendants).update(available=status)
        Product.objects.filter(category=self).update(available=status)

    def check_auto_disable(self):
        if self.auto_disable_until and timezone.now() >= self.auto_disable_until:
            self.active = False
            self.save()

class Product(models.Model):
    FEATURED_WEIGHTS = (
        (0, 'Not Featured'),
        (1, 'Low Priority'),
        (3, 'Medium Priority'),
        (5, 'High Priority'),
        (8, 'Homepage Spotlight'),
    )
    PROCESSING_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = CKEditor5Field('Description', config_name='extends')
    short_description = models.CharField(max_length=160, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Overrides default tax rate for this product")
    is_taxable = models.BooleanField(default=True, help_text="Whether this product should be taxed")
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products', null=True, blank=True)

    colors = models.ManyToManyField(Color, blank=True, related_name='products')
    sizes = models.ManyToManyField(Size, blank=True, related_name='products')
    fabric = models.ManyToManyField(Fabric, blank=True, related_name='products')
    fit = models.ForeignKey(Fit, null=True, blank=True, on_delete=models.SET_NULL, related_name='products')
    # FIX: Add brand foreign key to Product model
    brand = models.ForeignKey(Brand, null=True, blank=True, on_delete=models.SET_NULL, related_name='products')

    featured_weight = models.PositiveSmallIntegerField(choices=FEATURED_WEIGHTS, default=0)
    featured_until = models.DateTimeField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    trending = models.BooleanField(default=True) # Changed default to True for demonstration
    new_collection = models.BooleanField(default=False)
    festive_collection = models.BooleanField(default=False)
    sku = models.CharField(max_length=50, unique=True, blank=True, editable=False)
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.TextField(blank=True)
    search_vector = SearchVectorField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(default=0)
    processed_image = models.ImageField(upload_to='processed_products/%Y/%m/%d/', blank=True)
    auto_title = models.CharField(max_length=200, blank=True)
    auto_description = models.TextField(blank=True)
    auto_meta_title = models.CharField(max_length=150, blank=True)
    auto_meta_keywords = models.TextField(blank=True)
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')

    processing_started_at = models.DateTimeField(default=timezone.now)
    processing_completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(
                fields=['search_vector'],
                name='product_search_vector_gin'
            ),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug or (self.pk and self.name != Product.objects.filter(pk=self.pk).values_list('name', flat=True).first()):
            self.slug = slugify(self.name)
        if not self.short_description:
            self.short_description = strip_tags(self.description)[:160]
        if not self.sku:
            self.sku = generate_unique_sku()
        if not self.meta_title:
            self.meta_title = self.name
        if not self.meta_description:
            self.meta_description = strip_tags(self.description)[:160]
        super().save(*args, **kwargs)

    @property
    def primary_image(self):
        """
        Returns the primary image for the product.
        The primary image is determined by the highest `display_order`.
        """
        return self.images.order_by('-display_order').first()

    @property
    def image(self):
        """
        Convenience property to get the URL of the primary image, or a placeholder if none.
        """
        primary = self.primary_image
        if primary and primary.image:
            return primary.image
        return None

    def get_rating_percentage(self):
        reviews = self.reviews.filter(is_approved=True)
        rating_counts = reviews.values('rating').annotate(count=Count('rating'))
        total_reviews = reviews.count()
        rating_percentage = {'5': 0, '4': 0, '3': 0, '2': 0, '1': 0}
        for r in rating_counts:
            rating = str(r['rating'])
            count = r['count']
            if total_reviews > 0:
                rating_percentage[rating] = (count / total_reviews) * 100
        return rating_percentage

    @property
    def average_rating(self):
        return self.reviews.filter(is_approved=True).aggregate(Avg('rating'))['rating__avg'] or 0

    def get_absolute_url(self):
        category_slug = self.category.parent.slug if self.category.parent else self.category.slug
        subcategory_slug = self.category.slug
        return reverse('products:product_detail', kwargs={
            'category_slug': category_slug,
            'subcategory_slug': subcategory_slug,
            'product_slug': self.slug
        })

    @property
    def is_discounted(self):
        return self.discounted_price is not None and self.discounted_price < self.price

    @property
    def discount_percentage(self):
        if self.is_discounted:
            return int(((self.price - self.discounted_price) / self.price) * 100)
        return 0

    @property
    def current_price(self):
        """Returns the discounted price if available, otherwise the regular price."""
        return self.discounted_price if self.discounted_price is not None else self.price
    
    @property
    def is_featured(self):
        return self.featured_weight and self.featured_weight >= 1
        
    @property
    def is_featured_expired(self):
        return self.featured_until and self.featured_until < timezone.now()

    def increment_views(self):
        self.views = models.F('views') + 1
        self.save(update_fields=['views'])

    @property
    def price_display(self):
        return self.discounted_price if self.discounted_price else self.price

    @property
    def is_low_stock(self):
        return self.stock <= 3

    def processing_duration(self):
        if self.processing_started_at and self.processing_completed_at:
            return self.processing_completed_at - self.processing_started_at
        return None

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/%Y/%m/%d/')
    alt_text = models.CharField(max_length=100, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-display_order']

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        if not self.alt_text:
            self.alt_text = f"{self.product.name}"
        super().save(*args, **kwargs)

@receiver(post_delete, sender=ProductImage)
def delete_image_file(sender, instance, **kwargs):
    instance.image.delete(False)

class SiteSettings(models.Model):
    default_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00, help_text="Default tax rate in percentage (e.g., 10.00 for 10%)")
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00, help_text="Minimum order amount for free shipping")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        self.__class__.objects.exclude(id=self.id).delete()
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        try:
            return cls.objects.get()
        except cls.DoesNotExist:
            return cls.objects.create()

    def __str__(self):
        return "Site Configuration"

