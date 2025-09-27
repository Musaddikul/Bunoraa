# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserAddress, UserSettings # Import UserSettings
from .forms import CustomSignupForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomSignupForm
    model = User
    list_display = ('email', 'username', 'email_verified', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'email_verified')
    list_editable = ['email_verified', 'is_active']
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': (
            'first_name', 
            'last_name', 
            'phone_number',
            'date_of_birth',
            'profile_picture'
        )}),
        ('Address', {'fields': (
            'address', 
            'city', 
            'country', 
            'postal_code'
        )}),
        ('Permissions', {'fields': (
            'email_verified',
            'is_staff', 
            'is_active', 
            'is_superuser',
            'groups', 
            'user_permissions'
        )}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Social Auth', {'fields': (
            'google_id', 
            'facebook_id', 
            'microsoft_id'
        )}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 
                'username', 
                'password1', 
                'password2',
                'terms_accepted',
                'is_staff', 
                'is_active'
            )}
        ),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)

class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'city', 'country', 'is_default')
    list_filter = ('country', 'is_default')
    search_fields = ('user__email', 'full_name', 'city', 'postal_code')

class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'currency', 'language', 'country', 'timezone')
    list_filter = ('currency', 'language', 'country', 'timezone')
    search_fields = ('user__username', 'user__email')

admin.site.register(User, CustomUserAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
admin.site.register(UserSettings, UserSettingsAdmin) # Register UserSettings