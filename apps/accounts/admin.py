"""
Account admin configuration
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import User, Address, PasswordResetToken, EmailVerificationToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom user admin."""
    
    list_display = ['email', 'first_name', 'last_name', 'is_verified', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_verified', 'is_deleted', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone', 'avatar', 'date_of_birth')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'is_deleted', 'groups', 'user_permissions'),
        }),
        (_('Preferences'), {'fields': ('newsletter_subscribed',)}),
        (_('Important dates'), {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Address admin."""
    
    list_display = ['full_name', 'user', 'city', 'country', 'address_type', 'is_default', 'created_at']
    list_filter = ['address_type', 'is_default', 'country', 'is_deleted']
    search_fields = ['full_name', 'user__email', 'city', 'address_line_1']
    raw_id_fields = ['user']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'address_type')}),
        (_('Contact'), {'fields': ('full_name', 'phone')}),
        (_('Address'), {'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')}),
        (_('Status'), {'fields': ('is_default', 'is_deleted')}),
        (_('Timestamps'), {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Password reset token admin."""
    
    list_display = ['user', 'created_at', 'expires_at', 'used']
    list_filter = ['used', 'created_at']
    search_fields = ['user__email']
    raw_id_fields = ['user']
    readonly_fields = ['token', 'created_at']


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    """Email verification token admin."""
    
    list_display = ['user', 'created_at', 'expires_at', 'used']
    list_filter = ['used', 'created_at']
    search_fields = ['user__email']
    raw_id_fields = ['user']
    readonly_fields = ['token', 'created_at']
