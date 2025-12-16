"""
Wishlist Admin Configuration
"""
from django.contrib import admin
from .models import Wishlist, WishlistItem, WishlistShare, WishlistNotification


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    readonly_fields = ['added_at', 'price_at_add', 'notification_count']
    fields = [
        'product', 'variant', 'added_at', 'price_at_add', 'notes',
        'notify_on_sale', 'notify_on_restock', 'notify_on_price_drop'
    ]


class WishlistShareInline(admin.TabularInline):
    model = WishlistShare
    extra = 0
    readonly_fields = ['share_token', 'created_at', 'view_count', 'last_viewed_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'item_count', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'item_count', 'total_value']
    inlines = [WishlistItemInline, WishlistShareInline]
    
    fieldsets = [
        (None, {
            'fields': ['id', 'user']
        }),
        ('Statistics', {
            'fields': ['item_count', 'total_value']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at']
        }),
    ]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'wishlist', 'product', 'variant', 'added_at',
        'price_at_add', 'current_price', 'is_in_stock', 'is_on_sale'
    ]
    list_filter = [
        'notify_on_sale', 'notify_on_restock', 'notify_on_price_drop',
        'added_at'
    ]
    search_fields = [
        'wishlist__user__email', 'product__name', 'product__sku'
    ]
    readonly_fields = [
        'id', 'added_at', 'current_price', 'price_change',
        'price_change_percentage', 'is_in_stock', 'is_on_sale',
        'last_notified_at', 'notification_count'
    ]
    raw_id_fields = ['wishlist', 'product', 'variant']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'wishlist', 'product', 'variant']
        }),
        ('Details', {
            'fields': ['notes', 'added_at']
        }),
        ('Pricing', {
            'fields': [
                'price_at_add', 'current_price', 'price_change',
                'price_change_percentage'
            ]
        }),
        ('Status', {
            'fields': ['is_in_stock', 'is_on_sale']
        }),
        ('Notifications', {
            'fields': [
                'notify_on_sale', 'notify_on_restock', 'notify_on_price_drop',
                'last_notified_at', 'notification_count'
            ]
        }),
    ]


@admin.register(WishlistShare)
class WishlistShareAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'wishlist', 'share_token', 'is_active', 'is_valid',
        'view_count', 'created_at', 'expires_at'
    ]
    list_filter = ['is_active', 'allow_purchase', 'created_at']
    search_fields = ['wishlist__user__email', 'share_token']
    readonly_fields = [
        'id', 'share_token', 'created_at', 'view_count',
        'last_viewed_at', 'is_valid'
    ]
    raw_id_fields = ['wishlist']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'wishlist', 'share_token']
        }),
        ('Settings', {
            'fields': ['is_active', 'allow_view', 'allow_purchase', 'expires_at']
        }),
        ('Statistics', {
            'fields': ['view_count', 'last_viewed_at']
        }),
        ('Timestamps', {
            'fields': ['created_at']
        }),
    ]


@admin.register(WishlistNotification)
class WishlistNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'wishlist_item', 'notification_type', 'is_sent', 'is_read',
        'created_at', 'sent_at'
    ]
    list_filter = ['notification_type', 'is_sent', 'is_read', 'created_at']
    search_fields = [
        'wishlist_item__product__name',
        'wishlist_item__wishlist__user__email',
        'message'
    ]
    readonly_fields = ['id', 'created_at', 'sent_at', 'read_at']
    raw_id_fields = ['wishlist_item']
    
    fieldsets = [
        (None, {
            'fields': ['id', 'wishlist_item', 'notification_type']
        }),
        ('Message', {
            'fields': ['message']
        }),
        ('Pricing', {
            'fields': ['old_price', 'new_price']
        }),
        ('Status', {
            'fields': ['is_sent', 'sent_at', 'is_read', 'read_at']
        }),
        ('Timestamps', {
            'fields': ['created_at']
        }),
    ]
    
    actions = ['mark_as_sent', 'mark_as_read']
    
    def mark_as_sent(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_sent=True, sent_at=timezone.now())
    mark_as_sent.short_description = "Mark selected notifications as sent"
    
    def mark_as_read(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_read=True, read_at=timezone.now())
    mark_as_read.short_description = "Mark selected notifications as read"
