# notifications/admin.py
from django.contrib import admin
from .models import (
    Notification, NotificationTemplate, NotificationPreference
)

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name','notif_type','channel','updated_at')
    search_fields = ('name','body_html')
    list_filter = ('notif_type','channel')

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user','notif_type','channel','enabled')
    list_filter = ('notif_type','channel','enabled')
    search_fields = ('user__email',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        'user','notif_type','channel','title',
        'is_read','delivered_at','created_at'
    )
    list_filter = ('notif_type','channel','is_read')
    search_fields = ('user__email','title','message')
    readonly_fields = ('created_at','delivered_at','read_at','metadata')
    actions = ['mark_as_read','mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True, read_at=timezone.now())
    mark_as_read.short_description = "Mark selected as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False, read_at=None)
    mark_as_unread.short_description = "Mark selected as unread"
