"""
Payments admin configuration
"""
from django.contrib import admin
from .models import Payment, PaymentMethod, Refund


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'card_brand', 'card_last_four', 'is_default', 'is_active', 'created_at']
    list_filter = ['type', 'card_brand', 'is_default', 'is_active']
    search_fields = ['user__email', 'card_last_four', 'paypal_email']
    readonly_fields = ['id', 'stripe_payment_method_id', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'type', 'is_default', 'is_active')
        }),
        ('Card Details', {
            'fields': ('card_brand', 'card_last_four', 'card_exp_month', 'card_exp_year')
        }),
        ('PayPal', {
            'fields': ('paypal_email',)
        }),
        ('Stripe', {
            'fields': ('stripe_payment_method_id',)
        }),
        ('Billing', {
            'fields': ('billing_name', 'billing_address')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'amount', 'currency', 'status', 'paid_at', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['id', 'order__order_number', 'user__email', 'stripe_payment_intent_id']
    readonly_fields = [
        'id', 'order', 'user', 'amount', 'currency', 'payment_method',
        'method_type', 'stripe_payment_intent_id', 'stripe_charge_id',
        'gateway_response', 'refunded_amount', 'created_at', 'updated_at', 'paid_at'
    ]
    
    fieldsets = (
        (None, {
            'fields': ('id', 'order', 'user')
        }),
        ('Amount', {
            'fields': ('amount', 'currency', 'refunded_amount')
        }),
        ('Payment Method', {
            'fields': ('payment_method', 'method_type')
        }),
        ('Status', {
            'fields': ('status', 'failure_reason')
        }),
        ('Stripe', {
            'fields': ('stripe_payment_intent_id', 'stripe_charge_id', 'gateway_response')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at')
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


class RefundInline(admin.TabularInline):
    model = Refund
    extra = 0
    readonly_fields = ['id', 'amount', 'reason', 'status', 'stripe_refund_id', 'created_by', 'created_at', 'processed_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['id', 'payment', 'amount', 'reason', 'status', 'created_by', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['id', 'payment__stripe_payment_intent_id', 'stripe_refund_id']
    readonly_fields = [
        'id', 'payment', 'amount', 'stripe_refund_id',
        'created_by', 'created_at', 'processed_at'
    ]
    
    fieldsets = (
        (None, {
            'fields': ('id', 'payment', 'amount')
        }),
        ('Details', {
            'fields': ('reason', 'notes', 'status')
        }),
        ('Stripe', {
            'fields': ('stripe_refund_id',)
        }),
        ('Admin', {
            'fields': ('created_by', 'created_at', 'processed_at')
        }),
    )
    
    def has_add_permission(self, request):
        return False
