# apps/core/admin.py
"""
Core App Admin Configuration
"""
from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import Language, Currency, SiteSettings


class BunoraaAdminSite(AdminSite):
    """Custom admin site configuration."""
    site_header = 'Bunoraa Administration'
    site_title = 'Bunoraa Admin'
    index_title = 'Dashboard'


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'native_name', 'is_active', 'is_default']
    list_filter = ['is_active', 'is_default']
    search_fields = ['code', 'name']
    list_editable = ['is_active']


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'symbol', 'exchange_rate', 'is_active', 'is_default']
    list_filter = ['is_active', 'is_default']
    search_fields = ['code', 'name']
    list_editable = ['is_active', 'exchange_rate']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('General', {
            'fields': ('site_name', 'tagline', 'logo', 'favicon')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'youtube_url'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Business Settings', {
            'fields': ('default_currency', 'tax_rate', 'min_order_amount', 'free_shipping_threshold')
        }),
        ('Features', {
            'fields': ('enable_reviews', 'enable_wishlist', 'enable_compare', 
                      'enable_guest_checkout', 'maintenance_mode')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
