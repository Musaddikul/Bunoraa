# apps/categories/admin.py
"""
Admin configuration for categories.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model."""
    
    list_display = [
        'name', 'parent', 'depth', 'sort_order',
        'is_active', 'is_featured', 'product_count_display', 'image_preview'
    ]
    list_filter = ['is_active', 'is_featured', 'is_deleted', 'depth', 'parent']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['depth', 'sort_order', 'name']
    readonly_fields = ['id', 'path', 'depth', 'created_at', 'updated_at', 'image_preview_large']
    raw_id_fields = ['parent']
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'parent', 'description')
        }),
        (_('Display'), {
            'fields': ('sort_order', 'image', 'image_preview_large', 'icon')
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_featured', 'is_deleted')
        }),
        (_('System'), {
            'fields': ('id', 'path', 'depth', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="40" height="40" style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Image'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="200" height="200" style="object-fit: cover; border-radius: 8px;" />',
                obj.image.url
            )
        return '-'
    image_preview_large.short_description = 'Image Preview'
    
    def product_count_display(self, obj):
        count = obj.product_count
        return format_html('<span style="font-weight: bold;">{}</span>', count)
    product_count_display.short_description = 'Products'
    
    actions = ['make_active', 'make_inactive', 'make_featured', 'remove_featured']
    
    @admin.action(description='Mark selected categories as active')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    
    @admin.action(description='Mark selected categories as inactive')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    
    @admin.action(description='Mark selected categories as featured')
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    
    @admin.action(description='Remove featured status')
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)
