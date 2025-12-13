# apps/pages/admin.py
"""
Pages admin configuration.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Page, FAQ, ContactMessage, SiteSettings


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'is_published', 'updated_at']
    list_filter = ['is_published', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
        ('Settings', {
            'fields': ('is_published', 'template')
        }),
        ('Info', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question_short', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['order', 'is_active']
    
    def question_short(self, obj):
        return obj.question[:60] + '...' if len(obj.question) > 60 else obj.question
    question_short.short_description = 'Question'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'email', 'subject_short', 'status_badge', 'created_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = [
        'id', 'name', 'email', 'phone', 'subject', 'message',
        'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Message', {
            'fields': ('name', 'email', 'phone', 'subject', 'message')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes', 'handled_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def subject_short(self, obj):
        return obj.subject[:40] + '...' if len(obj.subject) > 40 else obj.subject
    subject_short.short_description = 'Subject'
    
    def status_badge(self, obj):
        colors = {
            'new': '#007bff',
            'in_progress': '#ffc107',
            'resolved': '#28a745',
            'closed': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Info', {
            'fields': ('site_name', 'tagline', 'logo', 'favicon')
        }),
        ('Contact', {
            'fields': ('contact_email', 'contact_phone', 'address')
        }),
        ('Social Media', {
            'fields': (
                'facebook_url', 'instagram_url', 'twitter_url',
                'pinterest_url', 'youtube_url', 'tiktok_url'
            )
        }),
        ('SEO', {
            'fields': ('default_meta_title', 'default_meta_description')
        }),
        ('Footer', {
            'fields': ('footer_text',)
        }),
        ('Analytics', {
            'fields': ('google_analytics_id', 'facebook_pixel_id'),
            'classes': ('collapse',)
        }),
        ('Store Settings', {
            'fields': ('currency_code', 'currency_symbol', 'free_shipping_threshold')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
