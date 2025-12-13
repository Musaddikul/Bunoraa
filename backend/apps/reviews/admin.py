# apps/reviews/admin.py
"""
Reviews admin configuration.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Review, ReviewImage, ReviewResponse


class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0
    readonly_fields = ['preview']
    
    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px;"/>',
                obj.image.url
            )
        return '-'


class ReviewResponseInline(admin.StackedInline):
    model = ReviewResponse
    extra = 0


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'product', 'user', 'rating_stars', 'status', 'status_badge',
        'is_verified_purchase', 'helpfulness', 'created_at'
    ]
    list_filter = ['status', 'rating', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__email', 'title', 'content']
    readonly_fields = [
        'id', 'is_verified_purchase', 'helpful_votes',
        'not_helpful_votes', 'created_at', 'updated_at'
    ]
    list_editable = ['status']
    inlines = [ReviewImageInline, ReviewResponseInline]
    
    fieldsets = (
        ('Review', {
            'fields': ('id', 'product', 'user', 'order')
        }),
        ('Content', {
            'fields': ('rating', 'title', 'content', 'pros', 'cons')
        }),
        ('Status', {
            'fields': ('status', 'is_verified_purchase', 'admin_notes')
        }),
        ('Engagement', {
            'fields': ('helpful_votes', 'not_helpful_votes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * (5 - obj.rating)
    rating_stars.short_description = 'Rating'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'approved': '#28a745',
            'rejected': '#dc3545',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def helpfulness(self, obj):
        return f'+{obj.helpful_votes} / -{obj.not_helpful_votes}'
    helpfulness.short_description = 'Votes'
    
    actions = ['approve_reviews', 'reject_reviews']
    
    def approve_reviews(self, request, queryset):
        count = queryset.update(status=Review.Status.APPROVED)
        self.message_user(request, f'{count} reviews approved.')
    approve_reviews.short_description = 'Approve selected reviews'
    
    def reject_reviews(self, request, queryset):
        count = queryset.update(status=Review.Status.REJECTED)
        self.message_user(request, f'{count} reviews rejected.')
    reject_reviews.short_description = 'Reject selected reviews'


@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ['review', 'image_preview', 'order', 'created_at']
    list_filter = ['created_at']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px;"/>',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'


@admin.register(ReviewResponse)
class ReviewResponseAdmin(admin.ModelAdmin):
    list_display = ['review', 'responder', 'content_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['review__product__name', 'content']
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content'
