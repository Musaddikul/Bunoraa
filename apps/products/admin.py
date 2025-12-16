"""
Product admin configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Product, ProductImage, ProductVariant, ProductAttribute,
    Tag, Attribute, AttributeValue
)


class ProductImageInline(admin.TabularInline):
    """Inline for product images."""
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order', 'image_preview']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Preview'


class ProductVariantInline(admin.TabularInline):
    """Inline for product variants."""
    model = ProductVariant
    extra = 0
    fields = ['name', 'sku', 'price_modifier', 'stock_quantity', 'is_active']


class ProductAttributeInline(admin.TabularInline):
    """Inline for product attributes."""
    model = ProductAttribute
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Product admin."""
    
    list_display = [
        'name', 'sku', 'price', 'sale_price', 'stock_quantity',
        'is_active', 'is_featured', 'sold_count', 'created_at'
    ]
    list_filter = [
        'is_active', 'is_featured', 'is_new', 'is_bestseller',
        'is_deleted', 'categories', 'tags', 'created_at'
    ]
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['categories', 'tags', 'related_products']
    readonly_fields = ['view_count', 'sold_count', 'created_at', 'updated_at']
    inlines = [ProductImageInline, ProductVariantInline, ProductAttributeInline]
    
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'sku', 'description', 'short_description')}),
        ('Pricing', {'fields': ('price', 'sale_price', 'cost_price')}),
        ('Inventory', {
            'fields': ('stock_quantity', 'low_stock_threshold', 'track_inventory', 'allow_backorder')
        }),
        ('Categories & Tags', {'fields': ('categories', 'tags')}),
        ('Physical Properties', {
            'fields': ('weight', 'length', 'width', 'height'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Status', {'fields': ('is_active', 'is_featured', 'is_new', 'is_bestseller', 'is_deleted')}),
        ('Related Products', {'fields': ('related_products',), 'classes': ('collapse',)}),
        ('Stats', {'fields': ('view_count', 'sold_count', 'created_at', 'updated_at')}),
    )
    
    actions = ['make_active', 'make_inactive', 'make_featured', 'remove_featured']
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = 'Mark selected products as active'
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = 'Mark selected products as inactive'
    
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    make_featured.short_description = 'Mark selected products as featured'
    
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)
    remove_featured.short_description = 'Remove featured status'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Product image admin."""
    
    list_display = ['product', 'is_primary', 'order', 'created_at', 'image_preview']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__name']
    raw_id_fields = ['product']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Preview'


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    """Product variant admin."""
    
    list_display = ['product', 'name', 'sku', 'price_modifier', 'stock_quantity', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['product__name', 'name', 'sku']
    raw_id_fields = ['product']
    filter_horizontal = ['attributes']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Tag admin."""
    
    list_display = ['name', 'slug', 'product_count']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.filter(is_active=True, is_deleted=False).count()
    product_count.short_description = 'Products'


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    """Attribute admin."""
    
    list_display = ['name', 'slug', 'value_count']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    
    def value_count(self, obj):
        return obj.values.count()
    value_count.short_description = 'Values'


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    """Attribute value admin."""
    
    list_display = ['attribute', 'value']
    list_filter = ['attribute']
    search_fields = ['value', 'attribute__name']
