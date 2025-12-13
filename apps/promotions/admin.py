# apps/promotions/admin.py
"""
Promotion Admin
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Coupon, CouponUsage, Sale, FlashDeal, Bundle, BundleItem


class CouponUsageInline(admin.TabularInline):
    model = CouponUsage
    extra = 0
    readonly_fields = ['user', 'order', 'discount_amount', 'created_at']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_display', 'times_used', 'max_uses', 'is_active', 'valid_until']
    list_filter = ['discount_type', 'is_active', 'first_order_only', 'valid_until']
    search_fields = ['code', 'description']
    filter_horizontal = ['applicable_products', 'applicable_categories', 'excluded_products', 'allowed_users']
    inlines = [CouponUsageInline]
    
    def discount_display(self, obj):
        if obj.discount_type == Coupon.DiscountType.PERCENTAGE:
            return f'{obj.discount_value}%'
        elif obj.discount_type == Coupon.DiscountType.FIXED:
            return f'${obj.discount_value}'
        return 'Free Shipping'
    discount_display.short_description = 'Discount'


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['name', 'discount_percentage', 'is_featured', 'is_active', 'start_date', 'end_date']
    list_filter = ['is_active', 'is_featured', 'start_date']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['products', 'categories']


@admin.register(FlashDeal)
class FlashDealAdmin(admin.ModelAdmin):
    list_display = ['product', 'deal_price', 'quantity_available', 'quantity_sold', 'progress_bar', 'is_active', 'start_time', 'end_time']
    list_filter = ['is_active', 'start_time']
    search_fields = ['product__name']
    
    def progress_bar(self, obj):
        percentage = obj.sold_percentage
        return format_html(
            '<div style="width: 100px; background: #ddd; border-radius: 3px;">'
            '<div style="width: {}%; background: {}; height: 15px; border-radius: 3px;"></div>'
            '</div> {}%',
            percentage,
            '#4CAF50' if percentage < 80 else '#FF5722',
            percentage
        )
    progress_bar.short_description = 'Sold'


class BundleItemInline(admin.TabularInline):
    model = BundleItem
    extra = 1


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ['name', 'bundle_price', 'original_price', 'discount_percentage', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [BundleItemInline]
