# apps/promotions/admin.py
"""
Promotions admin configuration.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Coupon, CouponUsage, Banner, Sale


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'discount_display', 'minimum_purchase',
        'usage_info', 'valid_period', 'is_active'
    ]
    list_filter = ['is_active', 'discount_type', 'created_at']
    search_fields = ['code', 'description']
    readonly_fields = ['id', 'times_used', 'created_at', 'updated_at']
    filter_horizontal = ['applicable_products', 'applicable_categories']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'code', 'description', 'is_active')
        }),
        ('Discount', {
            'fields': ('discount_type', 'discount_value', 'maximum_discount')
        }),
        ('Limits', {
            'fields': (
                'minimum_purchase', 'usage_limit',
                'usage_limit_per_user', 'times_used'
            )
        }),
        ('Validity', {
            'fields': ('valid_from', 'valid_until', 'first_order_only')
        }),
        ('Restrictions', {
            'fields': ('applicable_products', 'applicable_categories'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def usage_info(self, obj):
        if obj.usage_limit:
            return f'{obj.times_used}/{obj.usage_limit}'
        return f'{obj.times_used}/∞'
    usage_info.short_description = 'Usage'
    
    def valid_period(self, obj):
        if obj.valid_until:
            return f'{obj.valid_from.strftime("%Y-%m-%d")} to {obj.valid_until.strftime("%Y-%m-%d")}'
        return f'From {obj.valid_from.strftime("%Y-%m-%d")}'
    valid_period.short_description = 'Valid Period'


@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'used_at']
    list_filter = ['used_at', 'coupon']
    search_fields = ['coupon__code', 'user__email', 'order__order_number']
    readonly_fields = ['id', 'coupon', 'user', 'order', 'used_at']


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'position', 'order', 'is_active',
        'valid_period', 'preview'
    ]
    list_filter = ['is_active', 'position', 'created_at']
    search_fields = ['title', 'subtitle']
    list_editable = ['order', 'is_active']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'link_url', 'link_text')
        }),
        ('Media', {
            'fields': ('image', 'mobile_image')
        }),
        ('Display', {
            'fields': ('position', 'order')
        }),
        ('Styling', {
            'fields': ('text_color', 'overlay_color', 'overlay_opacity')
        }),
        ('Validity', {
            'fields': ('is_active', 'valid_from', 'valid_until')
        }),
    )
    
    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 100px;"/>',
                obj.image.url
            )
        return '-'
    preview.short_description = 'Preview'
    
    def valid_period(self, obj):
        if obj.valid_until:
            return f'{obj.valid_from.strftime("%Y-%m-%d")} to {obj.valid_until.strftime("%Y-%m-%d")}'
        return f'From {obj.valid_from.strftime("%Y-%m-%d")}'
    valid_period.short_description = 'Valid Period'


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'discount_percentage', 'date_range',
        'is_active', 'is_valid'
    ]
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['products', 'categories']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'description', 'is_active')
        }),
        ('Discount', {
            'fields': ('discount_percentage',)
        }),
        ('Products', {
            'fields': ('apply_to_all', 'products', 'categories')
        }),
        ('Validity', {
            'fields': ('start_date', 'end_date')
        }),
        ('Display', {
            'fields': ('banner_image',)
        }),
    )
    
    def date_range(self, obj):
        return f'{obj.start_date.strftime("%Y-%m-%d")} to {obj.end_date.strftime("%Y-%m-%d")}'
    date_range.short_description = 'Duration'
