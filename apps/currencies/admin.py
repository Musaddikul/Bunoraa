"""
Currency Admin Configuration
"""
from django.contrib import admin
from .models import Currency, ExchangeRate, ExchangeRateHistory, UserCurrencyPreference, CurrencySettings


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'name', 'symbol', 'is_active', 'is_default', 'sort_order'
    ]
    list_filter = ['is_active', 'is_default']
    search_fields = ['code', 'name']
    list_editable = ['is_active', 'is_default', 'sort_order']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['sort_order', 'code']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'code', 'name', 'symbol']
        }),
        ('Display Settings', {
            'fields': [
                'decimal_places', 'symbol_position',
                'thousand_separator', 'decimal_separator'
            ]
        }),
        ('Status', {
            'fields': ['is_active', 'is_default', 'sort_order']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
    
    actions = ['make_active', 'make_inactive', 'set_as_default']
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = "Mark selected currencies as active"
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = "Mark selected currencies as inactive"
    
    def set_as_default(self, request, queryset):
        if queryset.count() == 1:
            Currency.objects.all().update(is_default=False)
            queryset.update(is_default=True)
    set_as_default.short_description = "Set as default currency"


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = [
        'from_currency', 'to_currency', 'rate', 'source',
        'is_active', 'is_valid', 'valid_from', 'valid_until'
    ]
    list_filter = ['is_active', 'source', 'from_currency', 'to_currency']
    search_fields = ['from_currency__code', 'to_currency__code']
    readonly_fields = ['id', 'created_at', 'updated_at', 'inverse_rate', 'is_valid']
    date_hierarchy = 'valid_from'
    raw_id_fields = ['from_currency', 'to_currency']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'from_currency', 'to_currency', 'rate', 'inverse_rate']
        }),
        ('Source', {
            'fields': ['source']
        }),
        ('Validity', {
            'fields': ['is_active', 'is_valid', 'valid_from', 'valid_until']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]


@admin.register(ExchangeRateHistory)
class ExchangeRateHistoryAdmin(admin.ModelAdmin):
    list_display = ['from_currency', 'to_currency', 'rate', 'date', 'source']
    list_filter = ['source', 'from_currency', 'to_currency', 'date']
    search_fields = ['from_currency__code', 'to_currency__code']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'date'
    raw_id_fields = ['from_currency', 'to_currency']


@admin.register(UserCurrencyPreference)
class UserCurrencyPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'currency', 'auto_detect', 'updated_at']
    list_filter = ['auto_detect', 'currency']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'currency']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'user', 'currency']
        }),
        ('Settings', {
            'fields': ['auto_detect']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]


@admin.register(CurrencySettings)
class CurrencySettingsAdmin(admin.ModelAdmin):
    list_display = [
        'default_currency', 'exchange_rate_provider', 'auto_update_rates',
        'show_currency_selector', 'last_rate_update'
    ]
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_rate_update']
    raw_id_fields = ['default_currency']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'default_currency']
        }),
        ('Exchange Rate Settings', {
            'fields': [
                'auto_update_rates', 'update_frequency_hours',
                'exchange_rate_provider', 'api_key', 'last_rate_update'
            ]
        }),
        ('Display Settings', {
            'fields': [
                'show_currency_selector', 'show_original_price', 'rounding_method'
            ]
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not CurrencySettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
