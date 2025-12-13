# apps/cart/admin.py
"""
Cart admin configuration.
"""
from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['created_at', 'line_total']
    autocomplete_fields = ['product', 'variant']
    
    def line_total(self, obj):
        return f'${obj.line_total}'
    line_total.short_description = 'Line Total'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'session_key_short', 'item_count',
        'subtotal_display', 'coupon', 'created_at', 'updated_at'
    ]
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__first_name', 'session_key']
    readonly_fields = ['id', 'created_at', 'updated_at', 'subtotal', 'total']
    autocomplete_fields = ['user', 'coupon']
    inlines = [CartItemInline]
    
    def session_key_short(self, obj):
        if obj.session_key:
            return f'{obj.session_key[:8]}...'
        return '-'
    session_key_short.short_description = 'Session'
    
    def subtotal_display(self, obj):
        return f'${obj.subtotal}'
    subtotal_display.short_description = 'Subtotal'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'cart', 'product', 'variant', 
        'quantity', 'unit_price', 'line_total_display'
    ]
    list_filter = ['created_at']
    search_fields = ['cart__user__email', 'product__name']
    autocomplete_fields = ['cart', 'product', 'variant']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def line_total_display(self, obj):
        return f'${obj.line_total}'
    line_total_display.short_description = 'Line Total'
