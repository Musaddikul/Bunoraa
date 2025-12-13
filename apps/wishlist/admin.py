# apps/wishlist/admin.py
"""
Wishlist Admin
"""
from django.contrib import admin
from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_public', 'is_default', 'item_count', 'created_at']
    list_filter = ['is_public', 'is_default', 'created_at']
    search_fields = ['name', 'user__email']
    inlines = [WishlistItemInline]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'wishlist', 'added_price', 'current_price', 'price_dropped', 'created_at']
    list_filter = ['notify_price_drop', 'created_at']
    search_fields = ['product__name', 'wishlist__user__email']
