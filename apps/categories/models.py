"""
Category models - Hierarchical category structure
"""
import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from core.utils.helpers import generate_unique_slug


class Category(models.Model):
    """
    Hierarchical product category with adjacency list structure.
    Supports efficient tree queries through helper services.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic fields
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=250)
    description = models.TextField(_('description'), blank=True)

    # Hierarchy - adjacency list
    parent = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent category')
    )
    
    # For efficient tree operations
    depth = models.PositiveIntegerField(_('depth'), default=0, editable=False)
    path = models.CharField(_('path'), max_length=1000, blank=True, editable=False, db_index=True)

    # Taxonomy & governance
    code = models.CharField(_('code'), max_length=32, unique=True, null=True, blank=True, help_text=_('Immutable category code (e.g., CAT_HOME)'))
    visibility = models.CharField(_('visibility'), max_length=20, default='published', help_text=_('draft/published/archived'))
    owner = models.CharField(_('owner'), max_length=200, blank=True)
    last_reviewed = models.DateField(_('last reviewed'), null=True, blank=True)
    review_interval_days = models.PositiveIntegerField(_('review interval days'), default=90)
    external_mappings = models.JSONField(_('external mappings'), null=True, blank=True, help_text=_('Marketplace/Google mappings'))
    version = models.PositiveIntegerField(_('version'), default=1)
    
    # Display
    image = models.ImageField(
        _('image'),
        upload_to='categories/',
        blank=True,
        null=True
    )
    icon = models.CharField(_('icon class'), max_length=100, blank=True)
    order = models.PositiveIntegerField(_('display order'), default=0)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=200, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=500, blank=True)
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    is_deleted = models.BooleanField(_('deleted'), default=False)

    # Managers will be assigned after the model definition (see bottom of file)
    
    # Image aspect ratio (override for category and inheritable by children/products)
    aspect_width = models.DecimalField(_('aspect width'), max_digits=8, decimal_places=4, null=True, blank=True, help_text=_('Width value used to compute aspect ratio. Leave blank to inherit from parent.'))
    aspect_height = models.DecimalField(_('aspect height'), max_digits=8, decimal_places=4, null=True, blank=True, help_text=_('Height value used to compute aspect ratio. Leave blank to inherit from parent.'))
    ASPECT_UNIT_CHOICES = [
        ('ratio', 'Ratio (unitless)'),
        ('in', 'Inches'),
        ('ft', 'Feet'),
        ('cm', 'Centimeters'),
        ('mm', 'Millimeters'),
        ('px', 'Pixels'),
    ]
    aspect_unit = models.CharField(_('aspect unit'), max_length=10, choices=ASPECT_UNIT_CHOICES, default='ratio')

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['order', 'name']
        constraints = [
            models.UniqueConstraint(fields=['parent', 'slug'], name='unique_parent_slug')
        ]
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent']),
            models.Index(fields=['depth']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['path']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Auto-generate slug unique among siblings
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(parent=self.parent, slug=slug).exclude(pk=getattr(self, 'pk', None)).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Calculate depth and path (materialized slug path)
        if self.parent:
            self.depth = self.parent.depth + 1
            parent_path = self.parent.path or self.parent.slug
            self.path = f"{parent_path}/{self.slug}"
        else:
            self.depth = 0
            self.path = self.slug

        # Preserve old path to detect changes
        old_path = None
        if self.pk:
            try:
                old_path = Category.objects.get(pk=self.pk).path
            except Category.DoesNotExist:
                old_path = None

        super().save(*args, **kwargs)

        # If path changed, update descendants' paths
        if old_path and old_path != self.path:
            self._update_descendants_paths(old_path)

        # Invalidate caches if any - simple cache keys
        try:
            from django.core.cache import cache
            cache.delete('categories:full_tree')
        except Exception:
            pass
    
    def _update_descendants_paths(self, old_prefix):
        """Update paths for all descendants when this node's path changes.

        This iterates descendants and updates their materialized `path` by replacing
        the old prefix with the new prefix. For large trees this could be optimized
        with raw SQL or batched updates depending on DB capabilities.
        """
        new_prefix = self.path
        descendants = Category.objects.filter(path__startswith=f"{old_prefix}/")
        for desc in descendants:
            suffix = desc.path[len(old_prefix) + 1:]
            desc.path = f"{new_prefix}/{suffix}" if suffix else new_prefix
            # update depth based on number of slashes
            desc.depth = desc.path.count('/')
            desc.save(update_fields=['path', 'depth'])

    @classmethod
    def rebuild_all_paths(cls):
        """Recalculate `path` and `depth` for the entire category tree.

        This walks the tree starting from root categories and computes canonical
        `path` and `depth` using parent relationships and current slugs. It is
        idempotent and useful when paths become inconsistent (e.g., after bulk
        imports or manual DB edits).
        """
        roots = cls.objects.filter(parent__isnull=True).order_by('order', 'name')
        total_fixed = 0

        from collections import deque
        queue = deque()
        for root in roots:
            expected_path = root.slug
            expected_depth = 0
            if root.path != expected_path or root.depth != expected_depth:
                root.path = expected_path
                root.depth = expected_depth
                root.save(update_fields=['path', 'depth'])
                total_fixed += 1
            queue.append(root)

        while queue:
            node = queue.popleft()
            children = cls.objects.filter(parent=node).order_by('order', 'name')
            for child in children:
                expected_path = f"{node.path}/{child.slug}"
                expected_depth = node.depth + 1
                if child.path != expected_path or child.depth != expected_depth:
                    child.path = expected_path
                    child.depth = expected_depth
                    child.save(update_fields=['path', 'depth'])
                    total_fixed += 1
                queue.append(child)

        return total_fixed

    def rebuild_subtree(self):
        """Recalculate `path` and `depth` for this node and all descendants.

        Useful when moving or repairing a single subtree.
        """
        # Compute expected path for self
        if self.parent:
            parent = self.parent
            expected_path = parent.path or parent.slug
            expected_path = f"{expected_path}/{self.slug}"
            expected_depth = parent.depth + 1
        else:
            expected_path = self.slug
            expected_depth = 0

        changed = False
        if self.path != expected_path or self.depth != expected_depth:
            self.path = expected_path
            self.depth = expected_depth
            self.save(update_fields=['path', 'depth'])
            changed = True

        # Walk children breadth-first and update
        children = Category.objects.filter(parent=self).order_by('order', 'name')
        for child in children:
            child.rebuild_subtree()

        return changed
    
    @property
    def full_path(self):
        """Get the full category path as a string."""
        ancestors = self.get_ancestors()
        names = [cat.name for cat in ancestors] + [self.name]
        return ' > '.join(names)
    
    def get_ancestors(self):
        """Get all ancestor categories using materialized path for performance when possible."""
        ancestors = []
        if self.path:
            parts = self.path.split('/')[:-1]
            if not parts:
                return []
            qs = Category.objects.filter(slug__in=parts, is_deleted=False).order_by('depth')
            current = self.parent
            while current:
                ancestors.insert(0, current)
                current = current.parent
            return ancestors
        # Fallback to parent traversal
        current = self.parent
        while current:
            ancestors.insert(0, current)
            current = current.parent
        return ancestors
    
    def get_descendants(self, include_self=False):
        """Get all descendant categories using materialized path for performance."""
        qs = Category.objects.filter(path__startswith=f"{self.path}/", is_deleted=False)
        if include_self:
            return [self] + list(qs.order_by('path'))
        return list(qs.order_by('path'))

    def get_effective_aspect(self):
        """Return effective aspect (width, height, unit) inheriting from ancestors.

        Returns a dict: {'width': Decimal, 'height': Decimal, 'unit': str, 'ratio': Decimal}
        Defaults to 1:1 if nothing is set on the category chain.
        """
        from decimal import Decimal

        # If this category has both width and height specified, use it
        if self.aspect_width and self.aspect_height:
            try:
                ratio = Decimal(self.aspect_width) / Decimal(self.aspect_height)
            except Exception:
                ratio = Decimal('1')
            return {
                'width': self.aspect_width,
                'height': self.aspect_height,
                'unit': self.aspect_unit or 'ratio',
                'ratio': ratio
            }

        # Walk up ancestors
        parent = self.parent
        while parent:
            if parent.aspect_width and parent.aspect_height:
                try:
                    ratio = Decimal(parent.aspect_width) / Decimal(parent.aspect_height)
                except Exception:
                    ratio = Decimal('1')
                return {
                    'width': parent.aspect_width,
                    'height': parent.aspect_height,
                    'unit': parent.aspect_unit or 'ratio',
                    'ratio': ratio
                }
            parent = parent.parent

        # Default 1:1
        return {
            'width': Decimal('1'),
            'height': Decimal('1'),
            'unit': 'ratio',
            'ratio': Decimal('1')
        }    
    def get_descendant_ids(self, include_self=False):
        """Get IDs of all descendant categories for efficient queries."""
        descendants = self.get_descendants(include_self=include_self)
        return [cat.id for cat in descendants]
    
    def get_siblings(self, include_self=False):
        """Get sibling categories."""
        queryset = Category.objects.filter(
            parent=self.parent,
            is_active=True,
            is_deleted=False
        )
        if not include_self:
            queryset = queryset.exclude(pk=self.pk)
        return queryset.order_by('order', 'name')

    def get_breadcrumbs(self):
        """Get breadcrumb data for navigation using slug-based path for SEO URLs."""
        parts = self.path.split('/') if self.path else [self.slug]
        breadcrumbs = []
        accum = []
        for slug in parts:
            accum.append(slug)
            # find the category with exact path matching accum
            path = '/'.join(accum)
            cat = Category.objects.filter(path=path).first()
            breadcrumbs.append({'name': cat.name if cat else slug, 'slug': path})
        return breadcrumbs

    @property
    def product_count(self):
        """Get count of products in this category and descendants."""
        from apps.products.models import Product
        category_ids = self.get_descendant_ids(include_self=True)
        return Product.objects.filter(
            categories__id__in=category_ids,
            is_active=True,
            is_deleted=False
        ).distinct().count()

    def soft_delete(self):
        """Soft delete category and all descendants using path-based lookup."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active', 'updated_at'])

        # Soft delete all descendants
        descendants = Category.objects.filter(path__startswith=f"{self.path}/")
        descendants.update(is_deleted=True, is_active=False, updated_at=models.functions.Now())
        # Invalidate cache
        try:
            from django.core.cache import cache
            cache.delete('categories:full_tree')
        except Exception:
            pass


# QuerySet and Manager definitions for convenience and performance
class CategoryQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True, is_deleted=False)

    def descendants_of(self, category):
        return self.filter(path__startswith=f"{category.path}/")


class CategoryManager(models.Manager):
    def get_queryset(self):
        return CategoryQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()


# Attach managers
Category.add_to_class('objects', CategoryManager())
Category.add_to_class('all_objects', models.Manager())


class Facet(models.Model):
    """Reusable facet definition."""
    facet_code = models.CharField(max_length=64, primary_key=True)
    label = models.CharField(max_length=200)
    data_type = models.CharField(max_length=20)
    allowed_values = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label


class CategoryAllowedFacet(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    facet = models.ForeignKey(Facet, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('category', 'facet'),)


class ExternalCategoryMapping(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    provider = models.CharField(max_length=100)
    external_code = models.TextField()
    extra = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.provider}:{self.external_code}"


class ProductCategorySuggestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_id = models.UUIDField()
    suggested_category = models.ForeignKey(Category, on_delete=models.CASCADE)
    confidence = models.FloatField(default=0.0)
    method = models.CharField(max_length=50, default='heuristic')
    created_at = models.DateTimeField(default=models.functions.Now)
    processed = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=['product_id']), models.Index(fields=['suggested_category'])]

    def __str__(self):
        return f"Suggestion for {self.product_id} -> {self.suggested_category.code or self.suggested_category.slug} ({self.confidence})"

