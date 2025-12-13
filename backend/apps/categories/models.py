# apps/categories/models.py
"""
Category models with hierarchical structure.
"""
import uuid
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class Category(models.Model):
    """
    Hierarchical category model using adjacency list pattern.
    Supports unlimited nesting depth with efficient ancestor/descendant queries.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=120, unique=True)
    description = models.TextField(_('description'), blank=True)
    
    # Hierarchical structure
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent category')
    )
    
    # Denormalized path for efficient queries
    # Stores ancestor IDs as comma-separated string: "uuid1,uuid2,uuid3"
    path = models.TextField(_('path'), blank=True, editable=False)
    depth = models.PositiveIntegerField(_('depth'), default=0, editable=False)
    
    # Display order within parent
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    
    # Media
    image = models.ImageField(
        _('image'),
        upload_to='categories/%Y/%m/',
        null=True,
        blank=True
    )
    icon = models.CharField(_('icon class'), max_length=50, blank=True)
    
    # SEO fields
    meta_title = models.CharField(_('meta title'), max_length=150, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    is_deleted = models.BooleanField(_('deleted'), default=False)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['sort_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['depth']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = self._generate_unique_slug()
        
        # Update depth and path
        if self.parent:
            self.depth = self.parent.depth + 1
            parent_path = self.parent.path
            if parent_path:
                self.path = f"{parent_path},{self.parent_id}"
            else:
                self.path = str(self.parent_id)
        else:
            self.depth = 0
            self.path = ''
        
        super().save(*args, **kwargs)
        
        # Update children paths if parent changed
        self._update_children_paths()
    
    def _generate_unique_slug(self):
        """Generate a unique slug for the category."""
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 1
        while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug
    
    def _update_children_paths(self):
        """Update paths for all descendants when parent changes."""
        for child in self.children.all():
            if self.path:
                child.path = f"{self.path},{self.id}"
            else:
                child.path = str(self.id)
            child.depth = self.depth + 1
            child.save()
    
    @property
    def full_path(self):
        """Return full path including self."""
        if self.path:
            return f"{self.path},{self.id}"
        return str(self.id)
    
    def get_ancestors(self, include_self=False):
        """
        Get all ancestor categories.
        Returns QuerySet ordered from root to immediate parent.
        """
        if not self.path:
            if include_self:
                return Category.objects.filter(pk=self.pk)
            return Category.objects.none()
        
        ancestor_ids = self.path.split(',')
        ancestors = Category.objects.filter(pk__in=ancestor_ids)
        
        if include_self:
            ancestors = ancestors | Category.objects.filter(pk=self.pk)
        
        # Order by depth to get root first
        return ancestors.order_by('depth')
    
    def get_descendants(self, include_self=False):
        """
        Get all descendant categories.
        Returns QuerySet of all children, grandchildren, etc.
        """
        # Find categories where path contains this category's ID
        descendants = Category.objects.filter(
            models.Q(path__contains=str(self.id)) |
            models.Q(parent=self)
        ).filter(is_deleted=False)
        
        if include_self:
            descendants = descendants | Category.objects.filter(pk=self.pk)
        
        return descendants.order_by('depth', 'sort_order')
    
    def get_children(self):
        """Get immediate children."""
        return self.children.filter(is_deleted=False).order_by('sort_order', 'name')
    
    def get_siblings(self, include_self=False):
        """Get sibling categories (same parent)."""
        siblings = Category.objects.filter(
            parent=self.parent,
            is_deleted=False
        ).order_by('sort_order', 'name')
        
        if not include_self:
            siblings = siblings.exclude(pk=self.pk)
        
        return siblings
    
    def get_root(self):
        """Get the root category of this branch."""
        if not self.parent:
            return self
        
        if self.path:
            root_id = self.path.split(',')[0]
            try:
                return Category.objects.get(pk=root_id)
            except Category.DoesNotExist:
                return self
        
        return self.parent.get_root()
    
    def get_breadcrumb(self):
        """Get breadcrumb path as list of dictionaries."""
        breadcrumb = []
        for ancestor in self.get_ancestors(include_self=True):
            breadcrumb.append({
                'id': str(ancestor.id),
                'name': ancestor.name,
                'slug': ancestor.slug
            })
        return breadcrumb
    
    @property
    def product_count(self):
        """Get count of active products in this category and descendants."""
        from apps.products.models import Product
        descendant_ids = list(self.get_descendants(include_self=True).values_list('id', flat=True))
        return Product.objects.filter(
            category_id__in=descendant_ids,
            is_active=True,
            is_deleted=False
        ).count()
    
    def soft_delete(self):
        """Soft delete this category and all descendants."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active', 'updated_at'])
        
        # Soft delete all descendants
        for descendant in self.get_descendants():
            descendant.is_deleted = True
            descendant.is_active = False
            descendant.save(update_fields=['is_deleted', 'is_active', 'updated_at'])
