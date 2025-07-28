# products/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Sum, Avg
from django.contrib.admin import AdminSite
from mptt.admin import DraggableMPTTAdmin
from .models import *
from reviews.models import Review
from orders.models import Order
from wishlist.models import Wishlist
from django.utils.text import slugify

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'display_order', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image.url)
        return "-"
    image_preview.short_description = 'Preview'

class ProductReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['user', 'product', 'created_at', 'updated_at']
    fields = ['user', 'rating', 'comment', 'created_at', 'updated_at']

@admin.action(description="Mark selected products as Featured")
def make_featured(modeladmin, request, queryset):
    queryset.update(featured_weight=3)

@admin.action(description="Process selected products")
def process_products(modeladmin, request, queryset):
    for product in queryset:
        try:
            processor = ProductImageProcessor(product)
            processor.process()
            modeladmin.message_user(request, f"Successfully processed {product.name}")
        except Exception as e:
            modeladmin.message_user(request, f"Failed to process {product.name}: {str(e)}", level='error')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'category_breadcrumb', 
        'price', 
        'discounted_price',
        'average_rating_display',
        'review_count_display',
        'featured_status', 
        'stock',
        'available',
        'views',
        'processing_status',
        'processing_started_at',
        'processing_completed_at',
        'get_processing_time'
    ]
    list_filter = [
        'available', 
        'trending', 
        'new_collection',
        'festive_collection',
        'category', 
        'featured_weight',
        'fabric',
        'fit',
        'colors',
        'sizes',
        'processing_status',
    ]
    list_editable = ['available', 'price', 'discounted_price', 'stock']
    search_fields = ['name', 'description', 'sku']
    prepopulated_fields = {'slug': ['name']}
    inlines = [ProductImageInline, ProductReviewInline]
    filter_horizontal = ['colors', 'sizes', 'fabric',]
    readonly_fields = ['created_at', 'updated_at', 'views', 'sku', 'processing_status', 'auto_title', 'auto_description', 'auto_meta_title', 'auto_meta_keywords']
    actions = [make_featured, 'process_products']
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'category', 'description', 'short_description')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'search_vector')
        }),
        ('Auto-generated Content', {
            'fields': ('auto_title', 'auto_description', 'auto_meta_title', 'auto_meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': ('price', 'discounted_price')
        }),
        ('Inventory', {
            'fields': ('sku', 'stock', 'available', 'weight')
        }),
        ('Attributes', {
            'fields': ('colors', 'sizes', 'fabric', 'fit'),
            'classes': ('collapse',)
        }),
        ('Marketing', {
            'fields': (
                'trending', 
                'new_collection',
                'festive_collection',
                'featured_weight', 
                'featured_until'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'views'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.sku:
            base = slugify(obj.name)[:10].replace('-', '').upper()
            obj.sku = f"SKU-{base}-{Product.objects.count()+1}"
        super().save_model(request, obj, form, change)

    def discounted_price_display(self, obj):
        if obj.is_discounted:
            return format_html('<span style="color:green; font-weight:bold;">৳{}</span>', obj.discounted_price)
        return "-"
    discounted_price_display.short_description = "Discounted Price"

    def average_rating_display(self, obj):
        return round(obj.average_rating or 0, 1)
    average_rating_display.short_description = "Avg. Rating"

    def review_count_display(self, obj):
        return obj.reviews.count()
    review_count_display.short_description = "Reviews"

    def category_breadcrumb(self, obj):
        if obj.category and obj.category.parent:
            return f"{obj.category.parent.name} > {obj.category.name}"
        return obj.category.name
    category_breadcrumb.short_description = "Category"

    def featured_status(self, obj):
        weights = dict(obj.FEATURED_WEIGHTS)
        color = {
            0: 'gray', 
            1: 'blue', 
            3: 'green', 
            5: 'orange', 
            8: 'red'
        }.get(obj.featured_weight, 'black')
        return format_html('<span style="color:{}">{}</span>', color, weights.get(obj.featured_weight, ''))
    featured_status.short_description = "Featured"

    def get_processing_time(self, obj):
        duration = obj.processing_duration()
        if duration:
            seconds = duration.total_seconds()
            return f"{seconds:.2f}s"
        return "-"
    get_processing_time.short_description = "Processing Time"

@admin.register(Category)
class CategoryAdmin(DraggableMPTTAdmin):
    list_display = (
        'tree_actions',
        'indented_title',
        'active',
        'auto_disable_until',
        'get_products_count',
    )
    list_editable = ('active', 'auto_disable_until')
    list_display_links = ('indented_title',)
    search_fields = ['name']
    prepopulated_fields = {'slug': ['name']}
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'parent', 'featured', 'image')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )

    def get_products_count(self, obj):
        return obj.get_products_with_subcategories().count()
    get_products_count.short_description = 'Products Count'

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['default_tax_rate', 'free_shipping_threshold', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('default_tax_rate', 'free_shipping_threshold')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    search_fields = ['default_tax_rate', 'free_shipping_threshold']

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_preview']
    search_fields = ['name']

    def color_preview(self, obj):
        return format_html('<div style="width:20px; height:20px; background-color:{}; border:1px solid #000;"></div>', obj.name.lower() if obj.name.lower() in ['red', 'blue', 'green', 'black', 'white'] else '#ccc')
    color_preview.short_description = 'Preview'

@admin.register(Fabric)
class FabricAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Fit)
class FitAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class CustomAdminSite(AdminSite):
    site_header = "My Shop Admin"
    index_title = "Site Administration"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('', self.admin_view(self.dashboard), name='index'),
        ]
        return custom_urls + urls

    def dashboard(self, request):
        total_orders = Order.objects.count()
        total_wishlists = Wishlist.objects.count()
        total_views = Product.objects.aggregate(total=Sum('views'))['total'] or 0

        categories = Category.objects.filter(parent=None)
        cat_stats = []
        for cat in categories:
            count = cat.get_products_with_subcategories().count()
            cat_stats.append((cat.name, count))

        context = dict(
            self.each_context(request),
            total_orders=total_orders,
            total_wishlists=total_wishlists,
            total_views=total_views,
            category_stats=cat_stats,
        )
        return render(request, "admin/dashboard.html", context)

custom_admin = CustomAdminSite(name='custom_admin')
custom_admin.register(Category, CategoryAdmin)
custom_admin.register(Product, ProductAdmin)
custom_admin.register(Color, ColorAdmin)
custom_admin.register(Fabric, FabricAdmin)
custom_admin.register(Size, SizeAdmin)
custom_admin.register(Fit, FitAdmin)
