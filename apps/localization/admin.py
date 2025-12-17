"""
Localization Admin Configuration
"""
from django.contrib import admin

from .models import (
    Language, Timezone, Country, Division, District, Upazila,
    UserLocalePreference, Translation, LocalizationSettings
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
            'fields': ('code', 'name', 'native_name', 'flag_code')
        }),
        ('Settings', {
            'fields': ('is_rtl', 'is_active', 'is_default', 'translation_progress', 'sort_order')
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
            'fields': ('offset', 'offset_minutes', 'is_common', 'is_active')
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


class DistrictInline(admin.TabularInline):
    """Inline for districts within a division."""
    model = District
    extra = 0
    fields = ['code', 'name', 'native_name', 'shipping_zone', 'is_shipping_available', 'is_active']
    show_change_link = True


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    """Admin for Division model."""
    
    list_display = [
        'name', 'code', 'country', 'native_name',
        'is_shipping_available', 'is_active', 'sort_order'
    ]
    list_filter = ['country', 'is_active', 'is_shipping_available']
    search_fields = ['name', 'code', 'native_name']
    ordering = ['country', 'sort_order', 'name']
    autocomplete_fields = ['country']
    inlines = [DistrictInline]
    
    fieldsets = (
        (None, {
            'fields': ('country', 'code', 'name', 'native_name')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_shipping_available', 'is_active', 'sort_order')
        }),
    )


class UpazilaInline(admin.TabularInline):
    """Inline for upazilas within a district."""
    model = Upazila
    extra = 0
    fields = ['code', 'name', 'native_name', 'upazila_type', 'is_shipping_available', 'is_active']
    show_change_link = True


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    """Admin for District model."""
    
    list_display = [
        'name', 'code', 'division', 'native_name', 'shipping_zone',
        'is_shipping_available', 'is_active', 'sort_order'
    ]
    list_filter = ['division__country', 'division', 'is_active', 'is_shipping_available', 'shipping_zone']
    search_fields = ['name', 'code', 'native_name']
    ordering = ['division__country', 'division', 'sort_order', 'name']
    autocomplete_fields = ['division']
    inlines = [UpazilaInline]
    
    fieldsets = (
        (None, {
            'fields': ('division', 'code', 'name', 'native_name')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Shipping', {
            'fields': ('shipping_zone',)
        }),
        ('Settings', {
            'fields': ('is_shipping_available', 'is_active', 'sort_order')
        }),
    )


@admin.register(Upazila)
class UpazilaAdmin(admin.ModelAdmin):
    """Admin for Upazila model."""
    
    list_display = [
        'name', 'code', 'district', 'upazila_type', 'native_name',
        'is_shipping_available', 'is_active', 'sort_order'
    ]
    list_filter = [
        'district__division__country', 'district__division', 'district',
        'upazila_type', 'is_active', 'is_shipping_available'
    ]
    search_fields = ['name', 'code', 'native_name']
    ordering = ['district__division__country', 'district__division', 'district', 'sort_order', 'name']
    autocomplete_fields = ['district']
    
    fieldsets = (
        (None, {
            'fields': ('district', 'code', 'name', 'native_name', 'upazila_type')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Postal Codes', {
            'fields': ('postal_codes',),
            'classes': ('collapse',)
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
        ('Display Options', {
            'fields': ('show_language_selector', 'show_timezone_selector')
        }),
        ('Auto Detection', {
            'fields': ('auto_detect_language', 'auto_detect_timezone')
        }),
        ('Machine Translation', {
            'fields': ('enable_machine_translation', 'translation_api_provider', 'translation_api_key')
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
