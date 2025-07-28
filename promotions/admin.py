# promotions/admin.py
from django.contrib import admin
from .models import Coupon
from django.utils.translation import gettext_lazy as _

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Coupon model.
    Provides comprehensive display, filtering, searching, and field organization.
    """
    list_display = (
        'code', 'discount_type', 'discount_value', 'minimum_order_amount',
        'max_discount_amount', 'valid_from', 'valid_until', 'usage_limit',
        'usage_limit_per_user', 'used_count', 'is_active', 'get_users_used_count'
    )
    list_filter = ('discount_type', 'is_active', 'valid_from', 'valid_until')
    search_fields = ('code', 'description')
    readonly_fields = ('used_count', 'created_at', 'updated_at', 'get_users_used_count')
    filter_horizontal = ('users_used',) # Allows better management of ManyToMany field in admin

    fieldsets = (
        (None, {
            'fields': ('code', 'description', 'is_active')
        }),
        (_('Discount Details'), {
            'fields': ('discount_type', 'discount_value', 'max_discount_amount', 'minimum_order_amount')
        }),
        (_('Validity & Usage'), {
            'fields': ('valid_from', 'valid_until', 'usage_limit', 'usage_limit_per_user', 'users_used')
        }),
        (_('Statistics'), {
            'fields': ('used_count', 'get_users_used_count'),
            'classes': ('collapse',) # Collapsible section
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',) # Collapsible section
        }),
    )

    def get_users_used_count(self, obj):
        """
        Returns the count of unique users who have used this coupon.
        """
        return obj.users_used.count()
    get_users_used_count.short_description = _("Unique Users Used")
    get_users_used_count.admin_order_field = 'users_used__count' # Allows sorting by this count
