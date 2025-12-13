# apps/wishlist/admin.py
"""
Wishlist admin configuration.
"""
from django.contrib import admin
from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    readonly_fields = ['added_at']
    autocomplete_fields = ['product', 'variant']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'created_at', 'updated_at']
    search_fields = ['user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    inlines = [WishlistItemInline]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = [
        'wishlist', 'product', 'variant',
        'notify_price_drop', 'notify_back_in_stock', 'added_at'
    ]
    list_filter = ['notify_price_drop', 'notify_back_in_stock', 'added_at']
    search_fields = ['wishlist__user__email', 'product__name']
    autocomplete_fields = ['wishlist', 'product', 'variant']
