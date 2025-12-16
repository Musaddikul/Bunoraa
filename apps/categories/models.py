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
    slug = models.SlugField(_('slug'), max_length=250, unique=True)
    description = models.TextField(_('description'), blank=True)
    
    # Hierarchy - adjacency list
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('parent category')
    )
    
    # For efficient tree operations
    level = models.PositiveIntegerField(_('level'), default=0, editable=False)
    path = models.CharField(_('path'), max_length=1000, blank=True, editable=False)
    
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
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent']),
            models.Index(fields=['level']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['path']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Auto-generate slug
        if not self.slug:
            self.slug = generate_unique_slug(Category, self.name)
        
        # Calculate level and path
        if self.parent:
            self.level = self.parent.level + 1
            self.path = f"{self.parent.path}/{self.id}" if self.parent.path else str(self.id)
        else:
            self.level = 0
            self.path = str(self.id)
        
        super().save(*args, **kwargs)
        
        # Update children paths if necessary
        if self.pk:
            self._update_children_paths()
    
    def _update_children_paths(self):
        """Update paths for all descendants."""
        for child in self.children.all():
            child.level = self.level + 1
            child.path = f"{self.path}/{child.id}"
            child.save(update_fields=['level', 'path'])
    
    @property
    def full_path(self):
        """Get the full category path as a string."""
        ancestors = self.get_ancestors()
        names = [cat.name for cat in ancestors] + [self.name]
        return ' > '.join(names)
    
    def get_ancestors(self):
        """Get all ancestor categories."""
        ancestors = []
        current = self.parent
        while current:
            ancestors.insert(0, current)
            current = current.parent
        return ancestors
    
    def get_descendants(self, include_self=False):
        """Get all descendant categories."""
        descendants = []
        if include_self:
            descendants.append(self)
        
        def collect_children(category):
            for child in category.children.filter(is_active=True, is_deleted=False):
                descendants.append(child)
                collect_children(child)
        
        collect_children(self)
        return descendants
    
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
        """Get breadcrumb data for navigation."""
        ancestors = self.get_ancestors()
        breadcrumbs = [{'name': cat.name, 'slug': cat.slug} for cat in ancestors]
        breadcrumbs.append({'name': self.name, 'slug': self.slug})
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
        """Soft delete category and all descendants."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active', 'updated_at'])
        
        # Soft delete all descendants
        for child in self.children.all():
            child.soft_delete()
