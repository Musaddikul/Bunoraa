# apps/orders/admin.py
"""
Order admin configuration.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = [
        'product_name', 'product_sku', 'variant_name',
        'quantity', 'unit_price', 'line_total_display'
    ]
    can_delete = False
    
    def line_total_display(self, obj):
        return f'${obj.line_total}'
    line_total_display.short_description = 'Line Total'
    
    def has_add_permission(self, request, obj=None):
        return False


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ['old_status', 'new_status', 'notes', 'changed_by', 'created_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'customer_info', 'status_badge', 'payment_badge',
        'total_display', 'item_count', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at', 'payment_method']
    search_fields = [
        'order_number', 'email', 'phone',
        'shipping_first_name', 'shipping_last_name'
    ]
    readonly_fields = [
        'id', 'order_number', 'created_at', 'updated_at',
        'paid_at', 'shipped_at', 'delivered_at', 'cancelled_at'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    
    fieldsets = (
        ('Order Info', {
            'fields': (
                'id', 'order_number', 'status', 'payment_status'
            )
        }),
        ('Customer', {
            'fields': ('user', 'email', 'phone')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_first_name', 'shipping_last_name',
                'shipping_address_line1', 'shipping_address_line2',
                'shipping_city', 'shipping_state',
                'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Billing Address', {
            'fields': (
                'billing_same_as_shipping',
                'billing_first_name', 'billing_last_name',
                'billing_address_line1', 'billing_address_line2',
                'billing_city', 'billing_state',
                'billing_postal_code', 'billing_country'
            ),
            'classes': ('collapse',)
        }),
        ('Totals', {
            'fields': (
                'subtotal', 'discount_amount', 'shipping_cost',
                'tax_amount', 'total'
            )
        }),
        ('Coupon', {
            'fields': ('coupon', 'coupon_code'),
            'classes': ('collapse',)
        }),
        ('Shipping', {
            'fields': (
                'shipping_method', 'tracking_number', 'tracking_url'
            )
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes')
        }),
        ('Payment', {
            'fields': ('payment_method', 'payment_intent_id'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at', 'paid_at',
                'shipped_at', 'delivered_at', 'cancelled_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def customer_info(self, obj):
        if obj.user:
            return f'{obj.email} (registered)'
        return f'{obj.email} (guest)'
    customer_info.short_description = 'Customer'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'confirmed': '#17a2b8',
            'processing': '#007bff',
            'shipped': '#6f42c1',
            'delivered': '#28a745',
            'cancelled': '#dc3545',
            'refunded': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def payment_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'processing': '#17a2b8',
            'paid': '#28a745',
            'failed': '#dc3545',
            'refunded': '#6c757d',
            'partially_refunded': '#fd7e14',
        }
        color = colors.get(obj.payment_status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_payment_status_display()
        )
    payment_badge.short_description = 'Payment'
    
    def total_display(self, obj):
        return f'${obj.total}'
    total_display.short_description = 'Total'
    
    actions = ['mark_as_shipped', 'mark_as_delivered', 'mark_as_processing']
    
    def mark_as_shipped(self, request, queryset):
        from .services import OrderService
        count = 0
        for order in queryset:
            if order.status not in ['shipped', 'delivered', 'cancelled']:
                OrderService.update_order_status(
                    order, Order.Status.SHIPPED,
                    'Marked as shipped from admin', request.user
                )
                count += 1
        self.message_user(request, f'{count} orders marked as shipped.')
    mark_as_shipped.short_description = 'Mark selected orders as shipped'
    
    def mark_as_delivered(self, request, queryset):
        from .services import OrderService
        count = 0
        for order in queryset:
            if order.status == 'shipped':
                OrderService.update_order_status(
                    order, Order.Status.DELIVERED,
                    'Marked as delivered from admin', request.user
                )
                count += 1
        self.message_user(request, f'{count} orders marked as delivered.')
    mark_as_delivered.short_description = 'Mark selected orders as delivered'
    
    def mark_as_processing(self, request, queryset):
        from .services import OrderService
        count = 0
        for order in queryset:
            if order.status in ['pending', 'confirmed']:
                OrderService.update_order_status(
                    order, Order.Status.PROCESSING,
                    'Marked as processing from admin', request.user
                )
                count += 1
        self.message_user(request, f'{count} orders marked as processing.')
    mark_as_processing.short_description = 'Mark selected orders as processing'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        'order', 'product_name', 'variant_name',
        'quantity', 'unit_price', 'line_total_display'
    ]
    list_filter = ['order__status', 'created_at']
    search_fields = ['order__order_number', 'product_name', 'product_sku']
    readonly_fields = [
        'id', 'order', 'product', 'variant', 'created_at'
    ]
    
    def line_total_display(self, obj):
        return f'${obj.line_total}'
    line_total_display.short_description = 'Line Total'
