# faq/admin.py
from django.contrib import admin
from .models import Category, FAQ, FAQFeedback, FAQRequest

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display    = ('name','parent')
    prepopulated_fields = {'slug': ('name',)}
    search_fields   = ('name','description')

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display    = ('question','category','is_active','is_featured','view_count','helpful_count','not_helpful_count','created_at')
    search_fields   = ('question','answer','tags__name')
    list_filter     = ('category','is_active','is_featured')
    prepopulated_fields = {'slug': ('question',)}
    actions         = ['feature_faqs','unfeature_faqs','activate_faqs','deactivate_faqs']

    def feature_faqs(self, request, qs):
        qs.update(is_featured=True)
    feature_faqs.short_description = "Mark as featured"

    def unfeature_faqs(self, request, qs):
        qs.update(is_featured=False)
    unfeature_faqs.short_description = "Unmark featured"

    def activate_faqs(self, request, qs):
        qs.update(is_active=True)
    activate_faqs.short_description = "Activate selected"

    def deactivate_faqs(self, request, qs):
        qs.update(is_active=False)
    deactivate_faqs.short_description = "Deactivate selected"

@admin.register(FAQFeedback)
class FAQFeedbackAdmin(admin.ModelAdmin):
    list_display  = ('faq','user','is_helpful','created_at')
    search_fields = ('faq__question','user__username')

@admin.register(FAQRequest)
class FAQRequestAdmin(admin.ModelAdmin):
    list_display    = ('question_text','email','status','created_at','responded_at')
    list_filter     = ('status',)
    actions         = ['mark_answered']

    def mark_answered(self, request, qs):
        qs.update(status=FAQRequest.STATUS_ANSWERED, responded_at=timezone.now())
    mark_answered.short_description = "Mark selected as answered"
