# reviews/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Review, ReviewImage, ReviewVote, ReviewFlag

class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0
    readonly_fields = ('uploaded_at',)

class ReviewVoteInline(admin.TabularInline):
    model = ReviewVote
    extra = 0
    readonly_fields = ('user','is_helpful','created_at')

class ReviewFlagInline(admin.TabularInline):
    model = ReviewFlag
    extra = 0
    readonly_fields = ('user','reason','created_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'product_link','user_display','rating_stars',
        'verified','is_approved','pinned',
        'helpful_count','not_helpful_count','flag_count','created_relative'
    )
    list_filter = ('rating','is_approved','verified','pinned','created_at')
    search_fields = ('product__name','user__username','comment','ip_address')
    readonly_fields = ('ip_address','user_agent','sentiment_score','helpful_count','not_helpful_count','flag_count')
    inlines = [ReviewImageInline, ReviewVoteInline, ReviewFlagInline]
    actions = ('approve_reviews','disapprove_reviews','pin_reviews','unpin_reviews')

    def product_link(self,obj):
        url = obj.product.get_absolute_url()
        return format_html('<a href="{}" target="_blank">{}</a>', url, obj.product.name)
    product_link.short_description = 'Product'

    def user_display(self,obj):
        return obj.user.username if obj.user else "Anonymous"
    user_display.short_description = 'User'

    def rating_stars(self,obj):
        full='★'*obj.rating; empty='☆'*(5-obj.rating)
        return format_html('<span style="color:gold;">{}{}</span>', full,empty)
    rating_stars.short_description='Rating'

    def created_relative(self,obj):
        return format_html("<span title='{}'>{} ago</span>", 
                           obj.created_at.strftime("%Y-%m-%d %H:%M"), 
                           obj.created_at.strftime("%b %d"))
    created_relative.short_description='Submitted'

    @admin.action(description='✅ Approve selected')
    def approve_reviews(self,request,qs):
        qs.update(is_approved=True)

    @admin.action(description='🚫 Disapprove selected')
    def disapprove_reviews(self,request,qs):
        qs.update(is_approved=False)

    @admin.action(description='📌 Pin selected')
    def pin_reviews(self,request,qs):
        qs.update(pinned=True)

    @admin.action(description='📌 Unpin selected')
    def unpin_reviews(self,request,qs):
        qs.update(pinned=False)

@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ('review','uploaded_at')
