"""
Cart admin configuration
"""
from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    """Inline for cart items."""
    model = CartItem
    extra = 0
    raw_id_fields = ['product', 'variant']
    readonly_fields = ['unit_price', 'total']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Cart admin."""
    
    list_display = ['id', 'user', 'session_key', 'item_count', 'subtotal', 'coupon', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'session_key']
    raw_id_fields = ['user', 'coupon']
    readonly_fields = ['item_count', 'subtotal', 'discount_amount', 'total', 'created_at', 'updated_at']
    inlines = [CartItemInline]
    
    def item_count(self, obj):
        return obj.item_count
    item_count.short_description = 'Items'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Cart item admin."""
    
    list_display = ['cart', 'product', 'variant', 'quantity', 'unit_price', 'total', 'created_at']
    list_filter = ['created_at']
    search_fields = ['cart__user__email', 'product__name']
    raw_id_fields = ['cart', 'product', 'variant']
