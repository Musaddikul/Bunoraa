# apps/accounts/admin.py
"""
Account Admin Configuration
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserAddress, UserSettings


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_active', 'is_staff', 'email_verified', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'email_verified', 'gender']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'phone_number', 'gender', 'date_of_birth', 'profile_picture')
        }),
        (_('Verification'), {
            'fields': ('email_verified', 'phone_verified')
        }),
        (_('Social Auth'), {
            'fields': ('google_id', 'facebook_id'),
            'classes': ('collapse',)
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Activity'), {
            'fields': ('last_login', 'last_activity', 'last_login_ip'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )
    
    readonly_fields = ['last_login', 'last_activity', 'last_login_ip', 'created_at', 'updated_at']


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'city', 'address_type', 'is_default', 'created_at']
    list_filter = ['address_type', 'is_default', 'country']
    search_fields = ['user__email', 'full_name', 'city', 'phone_number']
    raw_id_fields = ['user']


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'preferred_currency', 'preferred_language', 'email_notifications']
    list_filter = ['preferred_currency', 'preferred_language', 'email_notifications']
    search_fields = ['user__email']
    raw_id_fields = ['user']
