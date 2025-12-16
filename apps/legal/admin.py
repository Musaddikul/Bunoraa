"""
Legal Admin Configuration
"""
from django.contrib import admin
from .models import (
    LegalDocument, LegalDocumentVersion, UserConsent,
    CookieConsent, GDPRRequest
)


class LegalDocumentVersionInline(admin.TabularInline):
    model = LegalDocumentVersion
    extra = 0
    readonly_fields = ['version', 'effective_date', 'created_at', 'created_by']
    fields = ['version', 'effective_date', 'change_summary', 'created_at', 'created_by']
    ordering = ['-created_at']


@admin.register(LegalDocument)
class LegalDocumentAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'document_type', 'version', 'is_published',
        'requires_acceptance', 'effective_date'
    ]
    list_filter = ['document_type', 'is_published', 'requires_acceptance']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['id', 'created_at', 'updated_at', 'published_at']
    inlines = [LegalDocumentVersionInline]
    
    fieldsets = [
        (None, {
            'fields': ['document_type', 'title', 'slug', 'version']
        }),
        ('Content', {
            'fields': ['summary', 'content']
        }),
        ('SEO', {
            'fields': ['meta_title', 'meta_description'],
            'classes': ['collapse']
        }),
        ('Settings', {
            'fields': ['is_published', 'requires_acceptance', 'effective_date']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at', 'published_at', 'last_updated_by'],
            'classes': ['collapse']
        }),
    ]
    
    def save_model(self, request, obj, form, change):
        obj.last_updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(LegalDocumentVersion)
class LegalDocumentVersionAdmin(admin.ModelAdmin):
    list_display = ['document', 'version', 'effective_date', 'created_at', 'created_by']
    list_filter = ['document', 'effective_date']
    search_fields = ['document__title', 'version']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['document', 'created_by']


@admin.register(UserConsent)
class UserConsentAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'consent_type', 'is_granted', 'document_version',
        'granted_at', 'revoked_at'
    ]
    list_filter = ['consent_type', 'is_granted', 'granted_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = [
        'id', 'granted_at', 'revoked_at', 'updated_at',
        'ip_address', 'user_agent'
    ]
    raw_id_fields = ['user', 'document']
    date_hierarchy = 'granted_at'
    
    fieldsets = [
        (None, {
            'fields': ['user', 'consent_type']
        }),
        ('Document', {
            'fields': ['document', 'document_version']
        }),
        ('Status', {
            'fields': ['is_granted', 'granted_at', 'revoked_at']
        }),
        ('Tracking', {
            'fields': ['ip_address', 'user_agent'],
            'classes': ['collapse']
        }),
    ]


@admin.register(CookieConsent)
class CookieConsentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'visitor_id', 'analytics', 'marketing',
        'preferences', 'updated_at'
    ]
    list_filter = ['analytics', 'marketing', 'preferences', 'updated_at']
    search_fields = ['user__email', 'visitor_id']
    readonly_fields = ['id', 'created_at', 'updated_at', 'ip_address', 'user_agent']
    raw_id_fields = ['user']
    
    fieldsets = [
        ('Identification', {
            'fields': ['user', 'visitor_id']
        }),
        ('Consent Choices', {
            'fields': ['necessary', 'analytics', 'marketing', 'preferences']
        }),
        ('Tracking', {
            'fields': ['ip_address', 'user_agent'],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]


@admin.register(GDPRRequest)
class GDPRRequestAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'email', 'request_type', 'status', 'is_verified',
        'is_overdue', 'deadline', 'created_at'
    ]
    list_filter = ['request_type', 'status', 'is_verified', 'created_at']
    search_fields = ['email', 'user__email', 'description']
    readonly_fields = [
        'id', 'verification_token', 'verified_at', 'created_at',
        'updated_at', 'completed_at', 'is_overdue'
    ]
    raw_id_fields = ['user', 'processed_by']
    date_hierarchy = 'created_at'
    
    fieldsets = [
        (None, {
            'fields': ['user', 'email', 'request_type']
        }),
        ('Request Details', {
            'fields': ['description', 'status', 'deadline']
        }),
        ('Verification', {
            'fields': ['is_verified', 'verification_token', 'verified_at']
        }),
        ('Processing', {
            'fields': ['processed_by', 'response', 'completed_at']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
    
    actions = ['mark_in_progress', 'mark_completed']
    
    def mark_in_progress(self, request, queryset):
        queryset.update(status='in_progress', processed_by=request.user)
    mark_in_progress.short_description = "Mark as in progress"
    
    def mark_completed(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='completed', completed_at=timezone.now())
    mark_completed.short_description = "Mark as completed"
