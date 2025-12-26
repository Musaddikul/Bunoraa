"""
Category admin configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category


class CategoryAdmin(admin.ModelAdmin):
    """Category admin with tree display."""
    
    list_display = [
        'name', 'parent', 'level', 'order', 'is_active', 'is_featured',
        'product_count_display', 'created_at'
    ]
    list_filter = ['is_active', 'is_featured', 'is_deleted', 'level', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    # Use default dropdown select for parent (not raw id search)
    ordering = ['level', 'order', 'name']
    
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'description', 'parent')}),
        ('Display', {'fields': ('image', 'icon', 'order', 'aspect_width', 'aspect_height', 'aspect_unit')}),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Status', {'fields': ('is_active', 'is_featured', 'is_deleted')}),
        ('Info', {
            'fields': ('level', 'path', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['level', 'path', 'created_at', 'updated_at']
    
    def product_count_display(self, obj):
        """Display product count."""
        return obj.product_count
    product_count_display.short_description = 'Products'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('parent')
    
    actions = ['make_active', 'make_inactive', 'make_featured', 'remove_featured']
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = 'Mark selected categories as active'
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = 'Mark selected categories as inactive'
    
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    make_featured.short_description = 'Mark selected categories as featured'
    
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)
    remove_featured.short_description = 'Remove featured status'


# Register Category admin
admin.site.register(Category, CategoryAdmin)
