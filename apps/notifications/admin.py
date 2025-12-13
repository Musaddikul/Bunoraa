# apps/notifications/admin.py
"""
Notification Admin
"""
from django.contrib import admin
from .models import Notification, EmailTemplate, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'type', 'is_read', 'email_sent', 'created_at']
    list_filter = ['type', 'is_read', 'email_sent', 'created_at']
    search_fields = ['title', 'message', 'user__email']
    readonly_fields = ['read_at', 'email_sent_at', 'created_at']


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code', 'subject']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'email_orders', 'email_promotions', 'email_newsletter']
    list_filter = ['email_orders', 'email_promotions', 'email_newsletter']
    search_fields = ['user__email']
