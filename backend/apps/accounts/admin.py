# apps/accounts/admin.py
"""
Admin configuration for accounts app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import User, UserAddress, PasswordResetToken, EmailVerificationToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model."""
    
    list_display = [
        'email', 'full_name', 'phone', 'email_verified',
        'is_active', 'is_staff', 'created_at'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser',
        'email_verified', 'is_deleted', 'gender', 'created_at'
    ]
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_login_ip']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': (
                'first_name', 'last_name', 'phone',
                'avatar', 'date_of_birth', 'gender'
            )
        }),
        (_('Verification'), {
            'fields': ('email_verified', 'phone_verified')
        }),
        (_('Permissions'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'is_deleted', 'groups', 'user_permissions'
            ),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'created_at', 'updated_at', 'last_login_ip')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name',
                'password1', 'password2'
            ),
        }),
    )
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius: 50%;" />',
                obj.avatar.url
            )
        return '-'
    avatar_preview.short_description = 'Avatar'


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    """Admin for UserAddress model."""
    
    list_display = [
        'full_name', 'user', 'city', 'address_type',
        'is_default', 'created_at'
    ]
    list_filter = ['address_type', 'is_default', 'country', 'is_deleted']
    search_fields = ['full_name', 'user__email', 'city', 'phone']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['user']
    
    fieldsets = (
        (None, {'fields': ('user', 'address_type')}),
        (_('Contact'), {'fields': ('full_name', 'phone')}),
        (_('Address'), {
            'fields': (
                'address_line_1', 'address_line_2',
                'city', 'state', 'postal_code', 'country'
            )
        }),
        (_('Settings'), {'fields': ('is_default', 'is_deleted')}),
        (_('Timestamps'), {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Admin for PasswordResetToken model."""
    
    list_display = ['user', 'token', 'created_at', 'expires_at', 'used']
    list_filter = ['used', 'created_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['user']


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    """Admin for EmailVerificationToken model."""
    
    list_display = ['user', 'token', 'created_at', 'expires_at', 'used']
    list_filter = ['used', 'created_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['user']
