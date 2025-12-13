# apps/categories/models.py
"""
Category Models
Hierarchical category structure using MPTT for efficient tree queries.
"""
from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.cache import cache
from mptt.models import MPTTModel, TreeForeignKey

from apps.core.models import TimeStampedModel, SoftDeleteModel


class Category(MPTTModel, TimeStampedModel, SoftDeleteModel):
    """
    Hierarchical category model for organizing products.
    Uses MPTT for efficient ancestor/descendant queries.
    """
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=120, unique=True, db_index=True)
    
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent category')
    )
    
    # Display
    description = models.TextField(_('description'), blank=True)
    image = models.ImageField(
        _('image'),
        upload_to='categories/%Y/%m/',
        null=True,
        blank=True
    )
    icon = models.CharField(_('icon class'), max_length=50, blank=True, help_text=_('Font Awesome icon class'))
    banner_image = models.ImageField(
        _('banner image'),
        upload_to='categories/banners/%Y/%m/',
        null=True,
        blank=True
    )
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=100, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Flags
    is_active = models.BooleanField(_('active'), default=True, db_index=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    show_in_menu = models.BooleanField(_('show in menu'), default=True)
    
    # Display order
    display_order = models.PositiveIntegerField(_('display order'), default=0)
    
    # Cache for product count
    product_count_cache = models.PositiveIntegerField(_('product count'), default=0)
    product_count_updated = models.DateTimeField(_('count updated'), null=True, blank=True)
    
    class MPTTMeta:
        order_insertion_by = ['display_order', 'name']
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'show_in_menu']),
            models.Index(fields=['parent', 'display_order']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Auto-generate slug
        if not self.slug:
            self.slug = self._generate_unique_slug()
        
        # Auto-fill SEO fields
        if not self.meta_title:
            self.meta_title = self.name
        
        super().save(*args, **kwargs)
        
        # Clear cache
        self._clear_category_cache()
    
    def delete(self, *args, **kwargs):
        self._clear_category_cache()
        super().delete(*args, **kwargs)
    
    def _generate_unique_slug(self):
        """Generate a unique slug for this category."""
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 1
        
        while Category.all_objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f'{base_slug}-{counter}'
            counter += 1
        
        return slug
    
    def _clear_category_cache(self):
        """Clear category-related caches."""
        cache.delete('category_tree')
        cache.delete('menu_categories')
        cache.delete(f'category_{self.slug}')
    
    def get_absolute_url(self):
        """Get the URL for this category."""
        if self.parent:
            ancestors = self.get_ancestors(include_self=True)
            path = '/'.join([a.slug for a in ancestors])
            return reverse('storefront:category_detail', kwargs={'category_path': path})
        return reverse('storefront:category_detail', kwargs={'category_path': self.slug})
    
    @property
    def full_path(self):
        """Get the full path as a string (e.g., 'Clothing/Men/Shirts')."""
        ancestors = self.get_ancestors(include_self=True)
        return ' / '.join([a.name for a in ancestors])
    
    @property
    def breadcrumbs(self):
        """Get breadcrumb trail as list of dicts."""
        ancestors = self.get_ancestors(include_self=True)
        return [
            {'name': a.name, 'slug': a.slug, 'url': a.get_absolute_url()}
            for a in ancestors
        ]
    
    def get_all_children_ids(self):
        """Get IDs of all descendant categories."""
        return list(self.get_descendants(include_self=True).values_list('id', flat=True))
    
    def get_products(self, include_descendants=True):
        """
        Get all products in this category.
        If include_descendants=True, also gets products from all child categories.
        """
        from apps.products.models import Product
        
        if include_descendants:
            category_ids = self.get_all_children_ids()
            return Product.objects.filter(
                category_id__in=category_ids,
                is_active=True
            )
        return Product.objects.filter(category=self, is_active=True)
    
    def update_product_count(self):
        """Update the cached product count."""
        count = self.get_products(include_descendants=True).count()
        self.product_count_cache = count
        self.product_count_updated = timezone.now()
        self.save(update_fields=['product_count_cache', 'product_count_updated'])
        return count
    
    @property
    def product_count(self):
        """
        Get the product count, using cache if available.
        """
        # Check if cache is stale (older than 1 hour)
        if self.product_count_updated:
            age = (timezone.now() - self.product_count_updated).seconds
            if age < 3600:  # 1 hour
                return self.product_count_cache
        
        return self.update_product_count()
    
    @classmethod
    def get_category_tree(cls, include_inactive=False):
        """
        Get the full category tree structure.
        Cached for performance.
        """
        cache_key = 'category_tree' if not include_inactive else 'category_tree_all'
        tree = cache.get(cache_key)
        
        if tree is None:
            queryset = cls.objects.all() if include_inactive else cls.objects.filter(is_active=True)
            tree = cls._build_tree(queryset.filter(parent=None))
            cache.set(cache_key, tree, 3600)  # Cache for 1 hour
        
        return tree
    
    @classmethod
    def _build_tree(cls, categories):
        """Recursively build category tree structure."""
        result = []
        for category in categories:
            node = {
                'id': category.id,
                'name': category.name,
                'slug': category.slug,
                'url': category.get_absolute_url(),
                'image': category.image.url if category.image else None,
                'icon': category.icon,
                'product_count': category.product_count_cache,
                'children': cls._build_tree(category.get_children().filter(is_active=True))
            }
            result.append(node)
        return result
    
    @classmethod
    def get_menu_categories(cls):
        """Get categories for navigation menu."""
        cache_key = 'menu_categories'
        categories = cache.get(cache_key)
        
        if categories is None:
            categories = list(
                cls.objects.filter(
                    is_active=True,
                    show_in_menu=True,
                    level__lte=1  # Only top 2 levels for menu
                ).select_related('parent')
            )
            cache.set(cache_key, categories, 3600)
        
        return categories
