"""
Localization Admin Configuration
"""
from django.contrib import admin

from .models import (
    Language, Timezone, Country, UserLocalePreference,
    Translation, LocalizationSettings
)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    """Admin for Language model."""
    
    list_display = [
        'code', 'name', 'native_name', 'is_rtl', 'is_default', 'is_active',
        'translation_progress', 'created_at'
    ]
    list_filter = ['is_active', 'is_default', 'is_rtl']
    search_fields = ['code', 'name', 'native_name']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('code', 'name', 'native_name', 'flag_emoji')
        }),
        ('Settings', {
            'fields': ('is_rtl', 'is_active', 'is_default', 'translation_progress')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if obj.is_default:
            Language.objects.filter(is_default=True).exclude(pk=obj.pk).update(is_default=False)
        super().save_model(request, obj, form, change)


@admin.register(Timezone)
class TimezoneAdmin(admin.ModelAdmin):
    """Admin for Timezone model."""
    
    list_display = ['name', 'display_name', 'offset', 'is_common', 'is_active']
    list_filter = ['is_active', 'is_common']
    search_fields = ['name', 'display_name']
    ordering = ['name']
    
    fieldsets = (
        (None, {
            'fields': ('name', 'display_name')
        }),
        ('Settings', {
            'fields': ('utc_offset', 'is_common', 'is_active')
        }),
    )


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    """Admin for Country model."""
    
    list_display = [
        'code', 'name', 'native_name', 'phone_code',
        'is_shipping_available', 'is_active'
    ]
    list_filter = ['is_active', 'is_shipping_available', 'continent']
    search_fields = ['code', 'name', 'native_name', 'phone_code']
    ordering = ['name']
    autocomplete_fields = ['default_language', 'default_timezone']
    
    fieldsets = (
        (None, {
            'fields': ('code', 'code_alpha3', 'name', 'native_name', 'phone_code', 'continent')
        }),
        ('Defaults', {
            'fields': ('default_language', 'default_currency_code', 'default_timezone')
        }),
        ('Settings', {
            'fields': ('is_shipping_available', 'is_active', 'sort_order')
        }),
    )


@admin.register(UserLocalePreference)
class UserLocalePreferenceAdmin(admin.ModelAdmin):
    """Admin for UserLocalePreference model."""
    
    list_display = [
        'user', 'language', 'timezone', 'country', 
        'date_format', 'time_format', 'measurement_system'
    ]
    list_filter = ['language', 'date_format', 'time_format', 'measurement_system']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    autocomplete_fields = ['user', 'language', 'timezone', 'country']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Regional Settings', {
            'fields': ('language', 'timezone', 'country')
        }),
        ('Format Preferences', {
            'fields': ('date_format', 'time_format', 'first_day_of_week', 'measurement_system')
        }),
        ('Auto Detection', {
            'fields': ('auto_detect_language', 'auto_detect_timezone')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    """Admin for Translation model."""
    
    list_display = [
        'content_type', 'content_id', 'field_name', 'language',
        'is_machine_translated', 'is_approved', 'created_at'
    ]
    list_filter = ['content_type', 'language', 'is_machine_translated', 'is_approved']
    search_fields = ['content_type', 'field_name', 'original_text', 'translated_text']
    autocomplete_fields = ['language', 'translated_by', 'approved_by']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Content Reference', {
            'fields': ('content_type', 'content_id', 'field_name')
        }),
        ('Translation', {
            'fields': ('language', 'original_text', 'translated_text')
        }),
        ('Status', {
            'fields': ('is_machine_translated', 'is_approved', 'translated_by', 'approved_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_translations', 'unapprove_translations']
    
    def approve_translations(self, request, queryset):
        count = queryset.update(is_approved=True, approved_by=request.user)
        self.message_user(request, f'{count} translations approved.')
    approve_translations.short_description = 'Approve selected translations'
    
    def unapprove_translations(self, request, queryset):
        count = queryset.update(is_approved=False, approved_by=None)
        self.message_user(request, f'{count} translations unapproved.')
    unapprove_translations.short_description = 'Unapprove selected translations'


@admin.register(LocalizationSettings)
class LocalizationSettingsAdmin(admin.ModelAdmin):
    """Admin for LocalizationSettings model."""
    
    list_display = [
        'default_language', 'default_timezone',
        'enable_machine_translation', 'updated_at'
    ]
    autocomplete_fields = ['default_language', 'default_timezone']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Default Settings', {
            'fields': ('default_language', 'default_timezone')
        }),
        ('Format Defaults', {
            'fields': ('default_date_format', 'default_time_format', 'default_measurement_system')
        }),
        ('Machine Translation', {
            'fields': ('enable_machine_translation', 'translation_api_provider', 'translation_api_key')
        }),
        ('Auto Detection', {
            'fields': ('auto_detect_language', 'auto_detect_timezone')
        }),
        ('Fallback', {
            'fields': ('fallback_language',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        if LocalizationSettings.objects.exists():
            return False
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        return False
