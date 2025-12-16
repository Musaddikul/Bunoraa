"""
Checkout admin configuration
"""
from django.contrib import admin
from .models import CheckoutSession, ShippingRate


@admin.register(CheckoutSession)
class CheckoutSessionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'current_step', 'shipping_method',
        'payment_method', 'created_at', 'expires_at'
    ]
    list_filter = ['current_step', 'shipping_method', 'payment_method', 'created_at']
    search_fields = [
        'user__email', 'shipping_email', 'shipping_first_name',
        'shipping_last_name', 'session_key'
    ]
    readonly_fields = [
        'id', 'stripe_payment_intent_id', 'stripe_client_secret',
        'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Session Info', {
            'fields': ('id', 'user', 'session_key', 'cart', 'current_step')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_first_name', 'shipping_last_name',
                'shipping_email', 'shipping_phone',
                'shipping_address_line_1', 'shipping_address_line_2',
                'shipping_city', 'shipping_state',
                'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Billing Address', {
            'fields': (
                'billing_same_as_shipping',
                'billing_first_name', 'billing_last_name',
                'billing_address_line_1', 'billing_address_line_2',
                'billing_city', 'billing_state',
                'billing_postal_code', 'billing_country'
            ),
            'classes': ('collapse',)
        }),
        ('Shipping & Payment', {
            'fields': (
                'shipping_method', 'shipping_cost',
                'payment_method', 'stripe_payment_intent_id'
            )
        }),
        ('Notes', {
            'fields': ('order_notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'expires_at')
        }),
    )


@admin.register(ShippingRate)
class ShippingRateAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'code', 'base_rate', 'per_item_rate',
        'free_shipping_threshold', 'delivery_estimate', 'is_active', 'sort_order'
    ]
    list_filter = ['is_active']
    search_fields = ['name', 'code', 'description']
    list_editable = ['is_active', 'sort_order']
    ordering = ['sort_order', 'name']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'code', 'description')
        }),
        ('Pricing', {
            'fields': ('base_rate', 'per_item_rate', 'free_shipping_threshold')
        }),
        ('Delivery', {
            'fields': ('min_delivery_days', 'max_delivery_days')
        }),
        ('Status', {
            'fields': ('is_active', 'sort_order')
        }),
    )
