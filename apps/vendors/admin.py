# apps/vendors/admin.py
"""
Vendor Admin Configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Vendor, VendorPage, VendorSettings, VendorReview, VendorPayout


class VendorPageInline(admin.TabularInline):
    model = VendorPage
    extra = 0


class VendorSettingsInline(admin.StackedInline):
    model = VendorSettings


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = [
        'store_name', 'user', 'status', 'is_verified', 'is_featured',
        'product_count', 'order_count', 'average_rating', 'created_at'
    ]
    list_filter = ['status', 'is_verified', 'is_featured', 'country', 'created_at']
    search_fields = ['store_name', 'user__email', 'email', 'phone']
    prepopulated_fields = {'slug': ('store_name',)}
    raw_id_fields = ['user']
    readonly_fields = [
        'product_count', 'order_count', 'total_sales',
        'average_rating', 'review_count', 'created_at', 'updated_at'
    ]
    inlines = [VendorSettingsInline, VendorPageInline]
    list_editable = ['status', 'is_verified', 'is_featured']
    
    fieldsets = (
        ('Owner', {
            'fields': ('user',)
        }),
        ('Store Info', {
            'fields': ('store_name', 'slug', 'tagline', 'description', 'logo', 'banner')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'whatsapp', 'website')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Business Info', {
            'fields': ('business_type', 'tax_id', 'registration_number'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('status', 'is_verified', 'is_featured', 'verified_at', 'commission_rate')
        }),
        ('Policies', {
            'fields': ('return_policy', 'shipping_policy'),
            'classes': ('collapse',)
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'youtube_url'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('product_count', 'order_count', 'total_sales', 'average_rating', 'review_count'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_vendors', 'suspend_vendors', 'verify_vendors', 'update_statistics']
    
    @admin.action(description='Approve selected vendors')
    def approve_vendors(self, request, queryset):
        queryset.update(status=Vendor.Status.ACTIVE)
    
    @admin.action(description='Suspend selected vendors')
    def suspend_vendors(self, request, queryset):
        queryset.update(status=Vendor.Status.SUSPENDED)
    
    @admin.action(description='Mark as verified')
    def verify_vendors(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_verified=True, verified_at=timezone.now())
    
    @admin.action(description='Update statistics')
    def update_statistics(self, request, queryset):
        for vendor in queryset:
            vendor.update_statistics()
        self.message_user(request, f'Updated statistics for {queryset.count()} vendors.')


@admin.register(VendorReview)
class VendorReviewAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'user', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating', 'created_at']
    search_fields = ['vendor__store_name', 'user__email', 'comment']
    raw_id_fields = ['vendor', 'user']
    list_editable = ['is_approved']


@admin.register(VendorPayout)
class VendorPayoutAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'amount', 'currency', 'status', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['vendor__store_name', 'transaction_id']
    raw_id_fields = ['vendor']
    readonly_fields = ['created_at']
