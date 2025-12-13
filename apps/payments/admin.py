# apps/payments/admin.py
"""
Payment Admin
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import PaymentMethod, Payment, Refund


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', '__str__', 'is_default', 'is_verified', 'is_active']
    list_filter = ['type', 'is_default', 'is_verified', 'is_active']
    search_fields = ['user__email']


class RefundInline(admin.TabularInline):
    model = Refund
    extra = 0
    readonly_fields = ['uuid', 'amount', 'status', 'processed_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'uuid', 'order', 'user', 'gateway', 'amount', 'status_badge', 'created_at']
    list_filter = ['gateway', 'status', 'created_at']
    search_fields = ['uuid', 'order__order_number', 'user__email', 'gateway_payment_id']
    readonly_fields = ['uuid', 'created_at', 'updated_at']
    inlines = [RefundInline]
    
    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'processing': 'blue',
            'authorized': 'cyan',
            'captured': 'teal',
            'completed': 'green',
            'failed': 'red',
            'cancelled': 'gray',
            'refunded': 'purple',
            'partially_refunded': 'pink',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['id', 'uuid', 'payment', 'amount', 'reason', 'status', 'processed_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['uuid', 'payment__uuid']
    readonly_fields = ['uuid', 'created_at']
