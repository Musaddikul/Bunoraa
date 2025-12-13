# apps/carts/admin.py
"""
Cart Admin
"""
from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['line_total', 'current_price', 'is_available']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'item_count', 'total', 'is_active', 'checked_out', 'created_at']
    list_filter = ['is_active', 'checked_out', 'created_at']
    search_fields = ['user__email', 'session_key']
    readonly_fields = ['subtotal', 'discount_amount', 'shipping_cost', 'tax_amount', 'total', 'item_count']
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'variant', 'quantity', 'price', 'line_total']
    list_filter = ['saved_for_later', 'created_at']
    search_fields = ['product__name']
