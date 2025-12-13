# apps/orders/admin.py
"""
Order Admin
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, OrderStatusHistory, OrderNote


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['line_total']


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ['status', 'previous_status', 'note', 'changed_by', 'created_at']


class OrderNoteInline(admin.TabularInline):
    model = OrderNote
    extra = 1


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status_badge', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__email', 'email']
    readonly_fields = ['order_number', 'uuid', 'created_at', 'updated_at']
    inlines = [OrderItemInline, OrderStatusHistoryInline, OrderNoteInline]
    
    fieldsets = (
        ('Order Info', {
            'fields': ('order_number', 'uuid', 'user', 'email', 'phone', 'status', 'payment_status')
        }),
        ('Addresses', {
            'fields': ('shipping_address', 'billing_address')
        }),
        ('Shipping', {
            'fields': ('shipping_method', 'shipping_carrier', 'tracking_number', 'estimated_delivery')
        }),
        ('Amounts', {
            'fields': ('subtotal', 'discount_amount', 'shipping_cost', 'tax_amount', 'total', 'currency')
        }),
        ('Coupon', {
            'fields': ('coupon_code', 'coupon_discount')
        }),
        ('Payment', {
            'fields': ('payment_method', 'payment_id')
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at', 'created_at', 'updated_at')
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'confirmed': 'blue',
            'processing': 'purple',
            'shipped': 'cyan',
            'out_for_delivery': 'teal',
            'delivered': 'green',
            'cancelled': 'red',
            'refunded': 'gray',
            'failed': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    actions = ['mark_confirmed', 'mark_shipped', 'mark_delivered', 'mark_cancelled']
    
    def mark_confirmed(self, request, queryset):
        queryset.filter(status=Order.Status.PENDING).update(status=Order.Status.CONFIRMED)
    mark_confirmed.short_description = 'Mark as Confirmed'
    
    def mark_shipped(self, request, queryset):
        for order in queryset.filter(status__in=[Order.Status.CONFIRMED, Order.Status.PROCESSING]):
            order.mark_shipped()
    mark_shipped.short_description = 'Mark as Shipped'
    
    def mark_delivered(self, request, queryset):
        for order in queryset.filter(status=Order.Status.SHIPPED):
            order.mark_delivered()
    mark_delivered.short_description = 'Mark as Delivered'
    
    def mark_cancelled(self, request, queryset):
        for order in queryset.filter(status__in=[Order.Status.PENDING, Order.Status.CONFIRMED]):
            order.cancel('Bulk cancelled by admin')
    mark_cancelled.short_description = 'Cancel Orders'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product_name', 'quantity', 'unit_price', 'total', 'status']
    list_filter = ['status', 'created_at']
    search_fields = ['order__order_number', 'product_name']
