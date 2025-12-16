"""
Orders admin configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'variant', 'product_name', 'variant_name', 'unit_price', 'quantity', 'line_total']
    can_delete = False
    
    def line_total(self, obj):
        return obj.line_total
    line_total.short_description = 'Line Total'


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ['old_status', 'new_status', 'changed_by', 'notes', 'created_at']
    can_delete = False
    ordering = ['-created_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user_email', 'status_badge', 'item_count',
        'total', 'payment_status', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'payment_method', 'shipping_method', 'created_at']
    search_fields = ['order_number', 'email', 'user__email', 'shipping_first_name', 'shipping_last_name']
    readonly_fields = [
        'id', 'order_number', 'subtotal', 'discount', 'tax', 'total',
        'stripe_payment_intent_id', 'created_at', 'updated_at',
        'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at'
    ]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    
    fieldsets = (
        ('Order Info', {
            'fields': ('id', 'order_number', 'user', 'email', 'phone', 'status')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_first_name', 'shipping_last_name',
                'shipping_address_line_1', 'shipping_address_line_2',
                'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Billing Address', {
            'fields': (
                'billing_first_name', 'billing_last_name',
                'billing_address_line_1', 'billing_address_line_2',
                'billing_city', 'billing_state', 'billing_postal_code', 'billing_country'
            ),
            'classes': ('collapse',)
        }),
        ('Shipping', {
            'fields': ('shipping_method', 'shipping_cost', 'tracking_number', 'tracking_url')
        }),
        ('Payment', {
            'fields': ('payment_method', 'payment_status', 'stripe_payment_intent_id')
        }),
        ('Amounts', {
            'fields': ('subtotal', 'discount', 'coupon', 'coupon_code', 'tax', 'total')
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_confirmed', 'mark_processing', 'mark_shipped', 'mark_delivered']
    
    def user_email(self, obj):
        return obj.user.email if obj.user else obj.email
    user_email.short_description = 'Customer'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'confirmed': '#3b82f6',
            'processing': '#8b5cf6',
            'shipped': '#06b6d4',
            'delivered': '#10b981',
            'cancelled': '#ef4444',
            'refunded': '#6b7280',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 4px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def mark_confirmed(self, request, queryset):
        updated = queryset.filter(status=Order.STATUS_PENDING).update(status=Order.STATUS_CONFIRMED)
        self.message_user(request, f'{updated} orders marked as confirmed.')
    mark_confirmed.short_description = 'Mark selected orders as confirmed'
    
    def mark_processing(self, request, queryset):
        updated = queryset.filter(status=Order.STATUS_CONFIRMED).update(status=Order.STATUS_PROCESSING)
        self.message_user(request, f'{updated} orders marked as processing.')
    mark_processing.short_description = 'Mark selected orders as processing'
    
    def mark_shipped(self, request, queryset):
        from django.utils import timezone
        updated = queryset.filter(
            status__in=[Order.STATUS_CONFIRMED, Order.STATUS_PROCESSING]
        ).update(status=Order.STATUS_SHIPPED, shipped_at=timezone.now())
        self.message_user(request, f'{updated} orders marked as shipped.')
    mark_shipped.short_description = 'Mark selected orders as shipped'
    
    def mark_delivered(self, request, queryset):
        from django.utils import timezone
        updated = queryset.filter(status=Order.STATUS_SHIPPED).update(
            status=Order.STATUS_DELIVERED, delivered_at=timezone.now()
        )
        self.message_user(request, f'{updated} orders marked as delivered.')
    mark_delivered.short_description = 'Mark selected orders as delivered'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'variant_name', 'unit_price', 'quantity', 'line_total']
    list_filter = ['order__status', 'created_at']
    search_fields = ['order__order_number', 'product_name', 'product_sku']
    readonly_fields = ['order', 'product', 'variant', 'line_total']
    
    def line_total(self, obj):
        return obj.line_total
    line_total.short_description = 'Line Total'


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['order', 'old_status', 'new_status', 'changed_by', 'created_at']
    list_filter = ['new_status', 'created_at']
    search_fields = ['order__order_number', 'notes']
    readonly_fields = ['order', 'old_status', 'new_status', 'changed_by', 'notes', 'created_at']
