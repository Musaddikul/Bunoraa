# apps/products/admin.py
"""
Admin configuration for products.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import (
    Product, ProductImage, ProductVariant, ProductAttribute,
    Tag, Brand, AttributeType, AttributeValue, RelatedProduct
)


class ProductImageInline(admin.TabularInline):
    """Inline for product images."""
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="60" height="60" style="object-fit: cover;" />',
                obj.image.url
            )
        return '-'


class ProductVariantInline(admin.TabularInline):
    """Inline for product variants."""
    model = ProductVariant
    extra = 0
    readonly_fields = ['sku']


class ProductAttributeInline(admin.TabularInline):
    """Inline for product attributes."""
    model = ProductAttribute
    extra = 1


class RelatedProductInline(admin.TabularInline):
    """Inline for related products."""
    model = RelatedProduct
    fk_name = 'product'
    extra = 1
    raw_id_fields = ['related']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin for Product model."""
    
    list_display = [
        'name', 'sku', 'category', 'brand', 'price', 'sale_price',
        'stock', 'is_featured', 'is_active', 'image_preview'
    ]
    list_filter = [
        'is_active', 'is_featured', 'is_deleted',
        'category', 'brand', 'is_taxable', 'track_inventory'
    ]
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']
    readonly_fields = [
        'id', 'sku', 'views', 'sales_count',
        'created_at', 'updated_at', 'image_preview_large'
    ]
    raw_id_fields = ['category', 'brand']
    filter_horizontal = ['tags']
    
    inlines = [
        ProductImageInline,
        ProductVariantInline,
        ProductAttributeInline,
        RelatedProductInline,
    ]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'sku', 'description', 'short_description')
        }),
        (_('Categorization'), {
            'fields': ('category', 'brand', 'tags')
        }),
        (_('Pricing'), {
            'fields': ('price', 'sale_price', 'cost_price', 'is_taxable', 'tax_rate')
        }),
        (_('Inventory'), {
            'fields': (
                'stock', 'low_stock_threshold', 'track_inventory', 'allow_backorder'
            )
        }),
        (_('Physical Attributes'), {
            'fields': ('weight', 'length', 'width', 'height'),
            'classes': ('collapse',)
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        (_('Display'), {
            'fields': ('is_featured', 'featured_weight', 'featured_until', 'image_preview_large')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_deleted', 'published_at')
        }),
        (_('Statistics'), {
            'fields': ('views', 'sales_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        image = obj.primary_image
        if image:
            return format_html(
                '<img src="{}" width="40" height="40" style="object-fit: cover; border-radius: 4px;" />',
                image.image.url
            )
        return '-'
    image_preview.short_description = 'Image'
    
    def image_preview_large(self, obj):
        image = obj.primary_image
        if image:
            return format_html(
                '<img src="{}" width="200" height="200" style="object-fit: cover; border-radius: 8px;" />',
                image.image.url
            )
        return '-'
    image_preview_large.short_description = 'Primary Image'
    
    actions = ['make_active', 'make_inactive', 'make_featured', 'remove_featured']
    
    @admin.action(description='Mark selected products as active')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    
    @admin.action(description='Mark selected products as inactive')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    
    @admin.action(description='Mark selected products as featured')
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    
    @admin.action(description='Remove featured status')
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Admin for Tag model."""
    list_display = ['name', 'slug', 'product_count']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Admin for Brand model."""
    list_display = ['name', 'slug', 'is_active', 'product_count', 'logo_preview']
    list_filter = ['is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" width="40" height="40" style="object-fit: contain;" />',
                obj.logo.url
            )
        return '-'
    logo_preview.short_description = 'Logo'


class AttributeValueInline(admin.TabularInline):
    """Inline for attribute values."""
    model = AttributeValue
    extra = 1


@admin.register(AttributeType)
class AttributeTypeAdmin(admin.ModelAdmin):
    """Admin for AttributeType model."""
    list_display = ['name', 'slug', 'value_count']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [AttributeValueInline]
    
    def value_count(self, obj):
        return obj.values.count()
    value_count.short_description = 'Values'


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    """Admin for ProductVariant model."""
    list_display = ['sku', 'product', 'price', 'stock', 'is_active']
    list_filter = ['is_active', 'product']
    search_fields = ['sku', 'product__name', 'product__sku']
    raw_id_fields = ['product']
    ordering = ['product', 'sku']


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    """Admin for AttributeValue model."""
    list_display = ['attribute_type', 'value', 'display_value', 'color_preview', 'sort_order']
    list_filter = ['attribute_type']
    search_fields = ['value', 'display_value']
    ordering = ['attribute_type', 'sort_order']
    
    def color_preview(self, obj):
        if obj.color_code:
            return format_html(
                '<span style="background-color: {}; width: 20px; height: 20px; display: inline-block; border: 1px solid #ccc;"></span>',
                obj.color_code
            )
        return '-'
    color_preview.short_description = 'Color'
