# core/admin.py
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import HomeSlide, SiteSetting, TaxSetting

@admin.register(HomeSlide)
class HomeSlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'active', 'order']
    list_editable = ['active', 'order']
    ordering = ['order']

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_email', 'phone_number']
    fieldsets = (
        (None, {
            'fields': ('name', 'logo', 'favicon')
        }),
        ('Contact', {
            'fields': ('contact_email', 'phone_number', 'address')
        }),
        ('Social', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
    )
    search_fields = ['name', 'contact_email', 'phone_number']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(TaxSetting)
class TaxSettingAdmin(admin.ModelAdmin):
    """
    Admin configuration for the TaxSetting model.
    Allows managing VAT rates and other tax-related settings.
    """
    list_display = ('name', 'vat_rate_display', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'vat_rate', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def vat_rate_display(self, obj):
        """Displays the VAT rate as a percentage."""
        return f"{obj.vat_rate * 100:.2f}%"
    vat_rate_display.short_description = _("VAT Rate")
