"""
FAQ Admin Configuration
"""
from django.contrib import admin
from django.utils.html import format_html

from .models import FAQCategory, FAQQuestion, FAQFeedback, FAQSearch, FAQSuggestion


class FAQQuestionInline(admin.TabularInline):
    """Inline for FAQ questions in category."""
    
    model = FAQQuestion
    extra = 0
    fields = ['question', 'order', 'is_featured', 'is_active', 'view_count']
    readonly_fields = ['view_count']
    show_change_link = True


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    """Admin for FAQCategory model."""
    
    list_display = [
        'name', 'slug', 'order', 'questions_count', 'is_active', 'created_at'
    ]
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [FAQQuestionInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description', 'icon')
        }),
        ('Display', {
            'fields': ('order', 'is_active')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def questions_count(self, obj):
        return obj.questions.filter(is_active=True).count()
    questions_count.short_description = 'Questions'


@admin.register(FAQQuestion)
class FAQQuestionAdmin(admin.ModelAdmin):
    """Admin for FAQQuestion model."""
    
    list_display = [
        'question_short', 'category', 'order', 'is_featured', 'is_active',
        'view_count', 'helpfulness', 'created_at'
    ]
    list_filter = ['category', 'is_featured', 'is_active']
    search_fields = ['question', 'answer']
    prepopulated_fields = {'slug': ('question',)}
    ordering = ['category', 'order']
    readonly_fields = ['view_count', 'helpful_count', 'not_helpful_count', 'created_at', 'updated_at']
    autocomplete_fields = ['category']
    
    fieldsets = (
        (None, {
            'fields': ('category', 'question', 'slug', 'answer')
        }),
        ('Display', {
            'fields': ('order', 'is_featured', 'is_active')
        }),
        ('Analytics', {
            'fields': ('view_count', 'helpful_count', 'not_helpful_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def question_short(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_short.short_description = 'Question'
    
    def helpfulness(self, obj):
        total = obj.helpful_count + obj.not_helpful_count
        if total == 0:
            return '-'
        ratio = (obj.helpful_count / total) * 100
        color = 'green' if ratio >= 70 else 'orange' if ratio >= 50 else 'red'
        return format_html(
            '<span style="color: {};">{:.0f}% ({}/{})</span>',
            color, ratio, obj.helpful_count, total
        )
    helpfulness.short_description = 'Helpfulness'


@admin.register(FAQFeedback)
class FAQFeedbackAdmin(admin.ModelAdmin):
    """Admin for FAQFeedback model."""
    
    list_display = ['question_short', 'feedback_type', 'user', 'has_comment', 'created_at']
    list_filter = ['feedback_type', 'created_at']
    search_fields = ['question__question', 'comment']
    readonly_fields = ['question', 'user', 'session_key', 'feedback_type', 'comment', 'created_at']
    ordering = ['-created_at']
    
    def question_short(self, obj):
        return obj.question.question[:50] + '...' if len(obj.question.question) > 50 else obj.question.question
    question_short.short_description = 'Question'
    
    def has_comment(self, obj):
        return bool(obj.comment)
    has_comment.boolean = True
    has_comment.short_description = 'Has Comment'
    
    def has_add_permission(self, request):
        return False


@admin.register(FAQSearch)
class FAQSearchAdmin(admin.ModelAdmin):
    """Admin for FAQSearch model."""
    
    list_display = ['query', 'results_count', 'clicked_result', 'user', 'created_at']
    list_filter = ['results_count', 'created_at']
    search_fields = ['query']
    readonly_fields = ['query', 'results_count', 'user', 'session_key', 'clicked_result', 'created_at']
    ordering = ['-created_at']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(FAQSuggestion)
class FAQSuggestionAdmin(admin.ModelAdmin):
    """Admin for FAQSuggestion model."""
    
    list_display = ['question_short', 'status', 'category', 'user_or_email', 'created_at', 'reviewed_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['suggested_question', 'suggested_answer', 'email']
    readonly_fields = ['user', 'email', 'created_at', 'reviewed_at', 'reviewed_by', 'published_question']
    ordering = ['-created_at']
    autocomplete_fields = ['category']
    
    fieldsets = (
        (None, {
            'fields': ('suggested_question', 'suggested_answer', 'category')
        }),
        ('Submitter', {
            'fields': ('user', 'email')
        }),
        ('Review', {
            'fields': ('status', 'admin_notes', 'reviewed_at', 'reviewed_by', 'published_question')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def question_short(self, obj):
        return obj.suggested_question[:80] + '...' if len(obj.suggested_question) > 80 else obj.suggested_question
    question_short.short_description = 'Suggested Question'
    
    def user_or_email(self, obj):
        if obj.user:
            return str(obj.user)
        return obj.email or 'Anonymous'
    user_or_email.short_description = 'Submitted By'
    
    actions = ['approve_suggestions', 'reject_suggestions']
    
    def approve_suggestions(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(status='pending').update(
            status='approved',
            reviewed_at=timezone.now(),
            reviewed_by=request.user
        )
        self.message_user(request, f'{count} suggestions approved.')
    approve_suggestions.short_description = 'Approve selected suggestions'
    
    def reject_suggestions(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(status='pending').update(
            status='rejected',
            reviewed_at=timezone.now(),
            reviewed_by=request.user
        )
        self.message_user(request, f'{count} suggestions rejected.')
    reject_suggestions.short_description = 'Reject selected suggestions'
