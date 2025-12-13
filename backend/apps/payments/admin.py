# apps/payments/admin.py
"""
Payments admin configuration.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Payment, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id_short', 'order', 'provider', 'amount',
        'status_badge', 'card_info', 'created_at'
    ]
    list_filter = ['status', 'provider', 'created_at']
    search_fields = ['order__order_number', 'provider_payment_id', 'user__email']
    readonly_fields = [
        'id', 'order', 'user', 'provider', 'provider_payment_id',
        'provider_charge_id', 'amount', 'currency', 'status',
        'card_brand', 'card_last4', 'card_exp_month', 'card_exp_year',
        'error_code', 'error_message', 'created_at', 'updated_at'
    ]
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'processing': '#17a2b8',
            'succeeded': '#28a745',
            'failed': '#dc3545',
            'cancelled': '#6c757d',
            'refunded': '#6f42c1',
            'partially_refunded': '#fd7e14',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def card_info(self, obj):
        return obj.card_display or '-'
    card_info.short_description = 'Card'


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = [
        'id_short', 'payment', 'amount', 'status_badge',
        'reason', 'processed_by', 'created_at'
    ]
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['payment__order__order_number', 'provider_refund_id']
    readonly_fields = [
        'id', 'payment', 'provider_refund_id', 'amount',
        'status', 'reason', 'notes', 'processed_by', 'created_at', 'updated_at'
    ]
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'succeeded': '#28a745',
            'failed': '#dc3545',
            'cancelled': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
