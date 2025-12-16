"""
Pages admin configuration
"""
from django.contrib import admin
from .models import Page, FAQ, ContactMessage, SiteSettings, Subscriber


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'template', 'is_published', 'show_in_header', 'show_in_footer', 'menu_order']
    list_filter = ['is_published', 'template', 'show_in_header', 'show_in_footer']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published', 'menu_order']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt', 'featured_image')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Display', {
            'fields': ('template', 'show_in_header', 'show_in_footer', 'menu_order')
        }),
        ('Status', {
            'fields': ('is_published', 'published_at')
        }),
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'sort_order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['sort_order', 'is_active']
    ordering = ['sort_order']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
    
    fieldsets = (
        ('Message', {
            'fields': ('name', 'email', 'phone', 'subject', 'message')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Info', {
            'fields': ('site_name', 'site_tagline', 'site_description')
        }),
        ('Branding', {
            'fields': ('logo', 'logo_dark', 'favicon')
        }),
        ('Contact', {
            'fields': ('contact_email', 'contact_phone', 'contact_address')
        }),
        ('Social Media', {
            'fields': (
                'facebook_url', 'instagram_url', 'twitter_url',
                'linkedin_url', 'youtube_url', 'tiktok_url'
            )
        }),
        ('SEO', {
            'fields': ('default_meta_title', 'default_meta_description')
        }),
        ('E-commerce', {
            'fields': ('currency', 'currency_symbol', 'tax_rate', 'free_shipping_threshold')
        }),
        ('Footer', {
            'fields': ('footer_text', 'copyright_text')
        }),
        ('Analytics & Scripts', {
            'fields': (
                'google_analytics_id', 'facebook_pixel_id',
                'custom_head_scripts', 'custom_body_scripts'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only one settings object allowed
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_active', 'is_verified', 'source', 'subscribed_at']
    list_filter = ['is_active', 'is_verified', 'source', 'subscribed_at']
    search_fields = ['email', 'name']
    readonly_fields = ['subscribed_at']
    
    actions = ['mark_verified', 'mark_unverified']
    
    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, 'Selected subscribers marked as verified.')
    mark_verified.short_description = 'Mark as verified'
    
    def mark_unverified(self, request, queryset):
        queryset.update(is_verified=False)
        self.message_user(request, 'Selected subscribers marked as unverified.')
    mark_unverified.short_description = 'Mark as unverified'
