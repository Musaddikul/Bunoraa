# apps/products/admin.py
"""
Product Admin Configuration
"""
from django.contrib import admin
# format_html available when needed
from .models import (
    Brand, ProductAttribute, AttributeValue,
    Product, ProductImage, ProductVariant
)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'is_featured', 'product_count']
    list_filter = ['is_active', 'is_featured']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_featured']
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


class AttributeValueInline(admin.TabularInline):
    model = AttributeValue
    extra = 1


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'value_count']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [AttributeValueInline]
    
    def value_count(self, obj):
        return obj.values.count()
    value_count.short_description = 'Values'


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'display_order']


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ['sku', 'name', 'price', 'stock_quantity', 'is_active']
    readonly_fields = ['sku']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'sku', 'category', 'vendor', 'price',
        'stock_quantity', 'status', 'is_active', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'is_new', 'is_bestseller',
        'category', 'vendor', 'brand', 'created_at'
    ]
    search_fields = ['name', 'sku', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    raw_id_fields = ['category', 'vendor', 'brand']
    readonly_fields = ['sku', 'view_count', 'sale_count', 'created_at', 'updated_at']
    inlines = [ProductImageInline, ProductVariantInline]
    list_editable = ['status', 'is_active']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'sku', 'short_description', 'description')
        }),
        ('Categorization', {
            'fields': ('category', 'brand', 'vendor', 'tags')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_at_price', 'cost_price', 'is_taxable', 'tax_rate')
        }),
        ('Inventory', {
            'fields': ('track_inventory', 'stock_quantity', 'low_stock_threshold', 'allow_backorder')
        }),
        ('Physical Properties', {
            'fields': ('weight', 'length', 'width', 'height'),
            'classes': ('collapse',)
        }),
        ('Status & Visibility', {
            'fields': ('status', 'is_active', 'featured_weight', 'featured_until')
        }),
        ('Flags', {
            'fields': ('is_new', 'is_bestseller', 'is_on_sale')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('view_count', 'sale_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['make_active', 'make_inactive', 'mark_as_featured', 'mark_as_bestseller']
    
    @admin.action(description='Activate selected products')
    def make_active(self, request, queryset):
        queryset.update(is_active=True, status=Product.Status.ACTIVE)
    
    @admin.action(description='Deactivate selected products')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False, status=Product.Status.INACTIVE)
    
    @admin.action(description='Mark as featured')
    def mark_as_featured(self, request, queryset):
        queryset.update(featured_weight=Product.FeaturedWeight.MEDIUM)
    
    @admin.action(description='Mark as bestseller')
    def mark_as_bestseller(self, request, queryset):
        queryset.update(is_bestseller=True)
