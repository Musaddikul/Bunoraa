# apps/payments/serializers.py
"""
Payment Serializers
"""
from rest_framework import serializers
from .models import PaymentMethod, Payment, Refund


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Payment method serializer."""
    display_name = serializers.CharField(source='__str__', read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'type', 'display_name',
            'card_brand', 'card_last4', 'card_exp_month', 'card_exp_year',
            'bank_name', 'bank_last4',
            'is_default', 'is_verified', 'is_active',
            'billing_address', 'created_at'
        ]
        read_only_fields = ['is_verified']


class PaymentSerializer(serializers.ModelSerializer):
    """Payment serializer."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    gateway_display = serializers.CharField(source='get_gateway_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'uuid', 'order', 'gateway', 'gateway_display',
            'amount', 'currency', 'gateway_fee', 'net_amount',
            'status', 'status_display', 'refunded_amount',
            'is_successful', 'can_refund',
            'authorized_at', 'captured_at', 'completed_at', 'created_at'
        ]


class RefundSerializer(serializers.ModelSerializer):
    """Refund serializer."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'uuid', 'payment', 'amount', 'currency',
            'reason', 'reason_display', 'notes',
            'status', 'status_display',
            'processed_at', 'created_at'
        ]


class CreatePaymentSerializer(serializers.Serializer):
    """Create payment serializer."""
    order_id = serializers.IntegerField()
    payment_method_id = serializers.IntegerField(required=False)
    gateway = serializers.ChoiceField(choices=Payment.Gateway.choices)


class CreateRefundSerializer(serializers.Serializer):
    """Create refund serializer."""
    payment_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    reason = serializers.ChoiceField(choices=Refund.Reason.choices)
    notes = serializers.CharField(required=False, allow_blank=True)
