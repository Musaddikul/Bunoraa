"""
Product admin configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django import forms
from .models import (
    Product, ProductImage, ProductVariant, ProductAttribute,
    Tag, Attribute, AttributeValue
)


class CategoryTreeSelectMultiple(forms.SelectMultiple):
    """SelectMultiple widget that adds data attributes to options for building a tree in JS."""
    def __init__(self, category_lookup=None, *args, **kwargs):
        self.category_lookup = category_lookup or {}
        super().__init__(*args, **kwargs)

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super().create_option(name, value, label, selected, index, subindex=subindex, attrs=attrs)
        try:
            key = str(value)
            cat = self.category_lookup.get(key)
            if cat:
                option_attrs = option.setdefault('attrs', {})
                option_attrs['data-depth'] = str(getattr(cat, 'depth', 0))
                option_attrs['data-id'] = str(cat.id)
                option_attrs['data-parent'] = str(cat.parent_id) if getattr(cat, 'parent_id', None) else ''
        except Exception:
            pass
        return option


class ProductImageInline(admin.TabularInline):
    """Inline for product images."""
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order', 'image_preview']
    readonly_fields = ['image_preview']

    class Media:
        js = ('js/admin/image_preview.js',)

    def image_preview(self, obj):
        # Always render an img tag we can target with JS for live preview.
        if getattr(obj, 'image', None):
            return format_html('<img class="admin-image-preview" src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return format_html('<img class="admin-image-preview" src="" width="50" height="50" style="object-fit: cover; display: none;" />')
    image_preview.short_description = 'Preview'


class ProductVariantInline(admin.TabularInline):
    """Inline for product variants with image upload and preview."""
    model = ProductVariant
    extra = 1
    fields = ['name', 'sku', 'price_modifier', 'stock_quantity', 'is_active', 'image', 'image_preview']
    readonly_fields = ['image_preview']

    class Media:
        js = ('js/admin/image_preview.js',)

    def image_preview(self, obj):
        if getattr(obj, 'image', None):
            return format_html('<img class="admin-image-preview" src="{}" width="50" height="50" style="object-fit: cover;" data-existing="1" />', obj.image.url)
        return format_html('<img class="admin-image-preview" src="" width="50" height="50" style="object-fit: cover; display: none;" data-existing="0" />')
    image_preview.short_description = 'Preview'


class ProductAttributeInline(admin.TabularInline):
    """Inline for product attributes."""
    model = ProductAttribute
    extra = 1
    # Use autocomplete for attribute values for faster lookup and add popup
    autocomplete_fields = ['attribute_value']
    fields = ['attribute_value']


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


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Product admin."""

    class Media:
        css = {
            'all': ('css/admin/category_tree.css',)
        }
        js = (
            'js/admin/move_inlines_top.js',
            'js/admin/image_preview.js',
            'js/admin/attribute_inline.js',
            'js/admin/category_tree.js',
            'js/admin/product_classifier.js',
            'js/admin/product_autofill.js',
        )
    
    list_display = [
        'name', 'sku', 'price', 'sale_price', 'currency', 'stock_quantity',
        'is_active', 'is_featured', 'sold_count', 'created_at'
    ]
    list_filter = [
        'is_active', 'is_featured', 'is_new', 'is_bestseller',
        'is_deleted', 'categories', 'tags', 'created_at'
    ]
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['tags', 'related_products']

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        """Render categories as a collapsible checkbox tree.

        We create a ModelMultipleChoiceField and attach a widget that adds data attributes
        so the frontend JS can build a collapsible directory-like tree. The widget is
        wrapped with RelatedFieldWidgetWrapper to keep add/change/view links.
        """
        formfield = super().formfield_for_manytomany(db_field, request, **kwargs)
        try:
            from django.contrib.admin.widgets import RelatedFieldWidgetWrapper
            if db_field.name == 'categories':
                try:
                    from apps.categories.ml import Category

                    queryset = Category.objects.filter(is_active=True, is_deleted=False).order_by('path', 'order', 'name')
                    cats = {str(c.id): c for c in queryset}

                    class CategoryModelMultipleChoiceField(forms.ModelMultipleChoiceField):
                        def label_from_instance(self, obj):
                            # Keep plain name; tree UI will handle indentation
                            return obj.name

                    formfield = CategoryModelMultipleChoiceField(queryset=queryset, required=not db_field.blank)
                    formfield.widget = CategoryTreeSelectMultiple(category_lookup=cats, attrs={'size': 12, 'style': 'font-family: monospace;'})
                except Exception:
                    # Fallback to default on error
                    pass

                # Wrap widget to preserve related-object add/change/view links
                rel = db_field.remote_field
                can_add = self.has_add_permission(request)
                can_change = self.has_change_permission(request)
                can_view = getattr(self, 'has_view_permission', lambda req, obj=None: True)(request, None)

                formfield.widget = RelatedFieldWidgetWrapper(
                    formfield.widget, rel, self.admin_site,
                    can_add_related=can_add,
                    can_change_related=can_change,
                    can_view_related=can_view
                )
        except Exception:
            pass
        return formfield
    readonly_fields = ['view_count', 'sold_count', 'created_at', 'updated_at']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Use a simple dropdown Select widget for currency instead of raw id lookup."""
        from django import forms
        formfield = super().formfield_for_foreignkey(db_field, request, **kwargs)
        try:
            from django.contrib.admin.widgets import RelatedFieldWidgetWrapper
            if db_field.name == 'currency' and formfield is not None:
                # Use a plain Select widget and wrap it to preserve add/change/view links
                formfield.widget = forms.Select()

                rel = db_field.remote_field
                can_add = self.has_add_permission(request)
                can_change = self.has_change_permission(request)
                can_view = getattr(self, 'has_view_permission', lambda req, obj=None: True)(request, None)

                formfield.widget = RelatedFieldWidgetWrapper(
                    formfield.widget, rel, self.admin_site,
                    can_add_related=can_add,
                    can_change_related=can_change,
                    can_view_related=can_view
                )
        except Exception:
            # Fallback to default widget on error
            pass
        return formfield

    inlines = [ProductImageInline, ProductVariantInline, ProductAttributeInline]
    
    fieldsets = (
        (_('Basic Information'), {'fields': ('name', 'slug', 'sku', 'description', 'short_description')}),
        ('Pricing', {'fields': ('price', 'sale_price', 'cost_price', 'currency')}),
        ('Inventory', {
            'fields': ('stock_quantity', 'low_stock_threshold', 'track_inventory', 'allow_backorder')
        }),
        ('Categories & Tags', {'fields': ('categories', 'tags')}),
        ('Physical Properties', {
            'fields': ('weight', 'length', 'width', 'height'),
            'classes': ('collapse',)
        }),
        ('Image Aspect Ratio', {
            'fields': ('aspect_width', 'aspect_height', 'aspect_unit'),
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


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    """Product variant admin."""
    
    list_display = ['product', 'name', 'sku', 'price_modifier', 'stock_quantity', 'is_active', 'image_preview']
    list_filter = ['is_active', 'created_at']
    search_fields = ['product__name', 'name', 'sku']
    raw_id_fields = ['product']
    filter_horizontal = ['attributes']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Preview'


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
