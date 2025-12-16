"""
Support Admin Configuration
"""
from django.contrib import admin
from .models import (
    TicketCategory, Ticket, TicketMessage, TicketAttachment,
    CannedResponse, HelpArticle, ContactMessage
)


@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'slug', 'is_active', 'requires_order',
        'priority_default', 'response_time_hours', 'sort_order'
    ]
    list_filter = ['is_active', 'requires_order', 'priority_default']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = [
        (None, {
            'fields': ['name', 'slug', 'description', 'icon']
        }),
        ('Settings', {
            'fields': ['is_active', 'requires_order', 'priority_default']
        }),
        ('SLA', {
            'fields': ['response_time_hours', 'resolution_time_hours']
        }),
        ('Auto Response', {
            'fields': ['auto_response'],
            'classes': ['collapse']
        }),
        ('Display', {
            'fields': ['sort_order']
        }),
    ]


class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    readonly_fields = ['created_at', 'is_staff_reply', 'sender_name']
    fields = ['sender_name', 'message', 'is_staff_reply', 'is_internal', 'created_at']


class TicketAttachmentInline(admin.TabularInline):
    model = TicketAttachment
    extra = 0
    readonly_fields = ['filename', 'file_size', 'content_type', 'created_at']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_number', 'subject', 'user', 'status', 'priority',
        'category', 'assigned_to', 'is_overdue', 'created_at'
    ]
    list_filter = [
        'status', 'priority', 'category', 'is_escalated',
        'created_at', 'assigned_to'
    ]
    search_fields = ['ticket_number', 'subject', 'email', 'name', 'description']
    readonly_fields = [
        'id', 'ticket_number', 'created_at', 'updated_at',
        'first_response_at', 'resolved_at', 'closed_at',
        'response_due_at', 'resolution_due_at', 'is_overdue'
    ]
    raw_id_fields = ['user', 'assigned_to', 'order']
    date_hierarchy = 'created_at'
    inlines = [TicketMessageInline, TicketAttachmentInline]
    
    fieldsets = [
        (None, {
            'fields': ['id', 'ticket_number', 'status', 'priority']
        }),
        ('Contact', {
            'fields': ['user', 'name', 'email', 'phone']
        }),
        ('Details', {
            'fields': ['category', 'subject', 'description', 'order']
        }),
        ('Assignment', {
            'fields': ['assigned_to', 'is_escalated']
        }),
        ('SLA Tracking', {
            'fields': [
                'response_due_at', 'resolution_due_at',
                'first_response_at', 'resolved_at', 'closed_at'
            ],
            'classes': ['collapse']
        }),
        ('Feedback', {
            'fields': ['satisfaction_rating', 'rating_feedback'],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
    
    actions = ['mark_resolved', 'mark_closed', 'escalate_tickets']
    
    def mark_resolved(self, request, queryset):
        queryset.update(status='resolved', resolved_at=timezone.now())
    mark_resolved.short_description = "Mark selected tickets as resolved"
    
    def mark_closed(self, request, queryset):
        queryset.update(status='closed', closed_at=timezone.now())
    mark_closed.short_description = "Mark selected tickets as closed"
    
    def escalate_tickets(self, request, queryset):
        queryset.update(is_escalated=True, priority='urgent')
    escalate_tickets.short_description = "Escalate selected tickets"


@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = [
        'ticket', 'sender_name', 'is_staff_reply', 'is_internal', 'created_at'
    ]
    list_filter = ['is_staff_reply', 'is_internal', 'created_at']
    search_fields = ['ticket__ticket_number', 'message', 'sender_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['ticket', 'user']


@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'ticket', 'file_size', 'content_type', 'created_at']
    list_filter = ['content_type', 'created_at']
    search_fields = ['filename', 'ticket__ticket_number']
    readonly_fields = ['id', 'file_size', 'created_at']
    raw_id_fields = ['ticket', 'message', 'uploaded_by']


@admin.register(CannedResponse)
class CannedResponseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'shortcut', 'is_active', 'usage_count']
    list_filter = ['is_active', 'category']
    search_fields = ['title', 'content']
    readonly_fields = ['id', 'usage_count', 'created_at', 'updated_at']
    raw_id_fields = ['category', 'created_by']


@admin.register(HelpArticle)
class HelpArticleAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'is_published', 'is_featured',
        'view_count', 'helpful_percentage', 'published_at'
    ]
    list_filter = ['is_published', 'is_featured', 'category']
    search_fields = ['title', 'content', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = [
        'id', 'view_count', 'helpful_count', 'not_helpful_count',
        'helpful_percentage', 'created_at', 'updated_at'
    ]
    raw_id_fields = ['category', 'author']
    date_hierarchy = 'published_at'
    
    fieldsets = [
        (None, {
            'fields': ['title', 'slug', 'category']
        }),
        ('Content', {
            'fields': ['summary', 'content']
        }),
        ('SEO', {
            'fields': ['meta_title', 'meta_description'],
            'classes': ['collapse']
        }),
        ('Status', {
            'fields': ['is_published', 'is_featured', 'published_at']
        }),
        ('Statistics', {
            'fields': ['view_count', 'helpful_count', 'not_helpful_count', 'helpful_percentage'],
            'classes': ['collapse']
        }),
        ('Display', {
            'fields': ['sort_order', 'author']
        }),
    ]
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        if obj.is_published and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'email', 'subject_type', 'subject',
        'is_read', 'is_replied', 'created_at'
    ]
    list_filter = ['subject_type', 'is_read', 'is_replied', 'is_spam', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = [
        'id', 'ip_address', 'user_agent', 'created_at',
        'replied_at', 'converted_to_ticket'
    ]
    raw_id_fields = ['replied_by', 'converted_to_ticket']
    date_hierarchy = 'created_at'
    
    fieldsets = [
        ('Contact Info', {
            'fields': ['name', 'email', 'phone', 'company']
        }),
        ('Message', {
            'fields': ['subject_type', 'subject', 'message']
        }),
        ('Status', {
            'fields': ['is_read', 'is_replied', 'is_spam', 'replied_by', 'replied_at']
        }),
        ('Conversion', {
            'fields': ['converted_to_ticket']
        }),
        ('Tracking', {
            'fields': ['ip_address', 'user_agent', 'created_at'],
            'classes': ['collapse']
        }),
    ]
    
    actions = ['mark_as_read', 'mark_as_spam', 'convert_to_ticket']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"
    
    def mark_as_spam(self, request, queryset):
        queryset.update(is_spam=True)
    mark_as_spam.short_description = "Mark selected messages as spam"
    
    def convert_to_ticket(self, request, queryset):
        from .services import ContactMessageService
        for message in queryset:
            if not message.converted_to_ticket:
                ContactMessageService.convert_to_ticket(message)
    convert_to_ticket.short_description = "Convert to support tickets"


# Import timezone for admin actions
from django.utils import timezone
