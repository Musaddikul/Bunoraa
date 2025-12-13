# apps/reviews/admin.py
"""
Review Admin
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Review, ReviewImage, ReviewReport


class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'user', 'rating_stars', 'status_badge', 'is_verified_purchase', 'helpful_count', 'created_at']
    list_filter = ['status', 'rating', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__email', 'title', 'content']
    readonly_fields = ['helpful_count', 'not_helpful_count', 'created_at', 'updated_at']
    inlines = [ReviewImageInline]
    
    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * (5 - obj.rating)
    rating_stars.short_description = 'Rating'
    
    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    actions = ['approve_reviews', 'reject_reviews']
    
    def approve_reviews(self, request, queryset):
        queryset.update(status=Review.Status.APPROVED)
    approve_reviews.short_description = 'Approve selected reviews'
    
    def reject_reviews(self, request, queryset):
        queryset.update(status=Review.Status.REJECTED)
    reject_reviews.short_description = 'Reject selected reviews'


@admin.register(ReviewReport)
class ReviewReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'review', 'reported_by', 'reason', 'status', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['review__content', 'reported_by__email', 'details']
    
    actions = ['resolve_reports', 'dismiss_reports']
    
    def resolve_reports(self, request, queryset):
        from django.utils import timezone
        queryset.update(
            status=ReviewReport.Status.RESOLVED,
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
    resolve_reports.short_description = 'Mark as resolved'
    
    def dismiss_reports(self, request, queryset):
        from django.utils import timezone
        queryset.update(
            status=ReviewReport.Status.DISMISSED,
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
    dismiss_reports.short_description = 'Dismiss reports'
