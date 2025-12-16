"""
Notifications admin configuration
"""
from django.contrib import admin
from .models import (
    Notification, NotificationPreference, EmailTemplate, EmailLog, PushToken
)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'type', 'title', 'is_read', 'created_at'
    ]
    list_filter = ['type', 'is_read', 'created_at']
    search_fields = ['user__email', 'title', 'message']
    readonly_fields = ['id', 'created_at', 'read_at', 'channels_sent']
    
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'type', 'title', 'message', 'url')
        }),
        ('Reference', {
            'fields': ('reference_type', 'reference_id', 'metadata')
        }),
        ('Status', {
            'fields': ('is_read', 'read_at', 'channels_sent')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'{queryset.count()} notifications marked as read.')
    mark_as_read.short_description = 'Mark selected notifications as read'
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False, read_at=None)
        self.message_user(request, f'{queryset.count()} notifications marked as unread.')
    mark_as_unread.short_description = 'Mark selected notifications as unread'


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'email_order_updates', 'email_promotions', 'sms_enabled', 'push_enabled'
    ]
    list_filter = ['email_promotions', 'sms_enabled', 'push_enabled']
    search_fields = ['user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('id', 'user')
        }),
        ('Email Preferences', {
            'fields': (
                'email_order_updates', 'email_shipping_updates', 'email_promotions',
                'email_newsletter', 'email_reviews', 'email_price_drops', 'email_back_in_stock'
            )
        }),
        ('SMS Preferences', {
            'fields': (
                'sms_enabled', 'sms_order_updates', 'sms_shipping_updates', 'sms_promotions'
            )
        }),
        ('Push Preferences', {
            'fields': ('push_enabled', 'push_order_updates', 'push_promotions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'notification_type', 'subject', 'is_active', 'updated_at']
    list_filter = ['is_active', 'notification_type']
    search_fields = ['name', 'subject']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'notification_type', 'is_active')
        }),
        ('Content', {
            'fields': ('subject', 'html_template', 'text_template')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = [
        'recipient_email', 'notification_type', 'subject', 'status', 'sent_at', 'created_at'
    ]
    list_filter = ['status', 'notification_type', 'created_at']
    search_fields = ['recipient_email', 'subject']
    readonly_fields = [
        'id', 'recipient_email', 'recipient_user', 'notification_type',
        'subject', 'status', 'error_message', 'sent_at', 'opened_at',
        'clicked_at', 'reference_type', 'reference_id', 'created_at'
    ]
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(PushToken)
class PushTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'device_type', 'device_name', 'is_active', 'last_used_at']
    list_filter = ['device_type', 'is_active']
    search_fields = ['user__email', 'device_name']
    readonly_fields = ['id', 'created_at', 'last_used_at']
