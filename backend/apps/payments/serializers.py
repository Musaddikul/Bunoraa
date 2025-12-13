# apps/payments/serializers.py
"""
Payment serializers.
"""
from rest_framework import serializers
from .models import Payment, Refund


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment display."""
    
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    provider_display = serializers.CharField(
        source='get_provider_display', read_only=True
    )
    card_display = serializers.CharField(read_only=True)
    is_successful = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'provider', 'provider_display',
            'amount', 'currency', 'status', 'status_display',
            'card_brand', 'card_last4', 'card_display',
            'is_successful', 'created_at', 'updated_at'
        ]


class PaymentIntentCreateSerializer(serializers.Serializer):
    """Serializer for creating a payment intent."""
    
    order_id = serializers.UUIDField()
    payment_method = serializers.CharField(required=False)


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for refund display."""
    
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    reason_display = serializers.CharField(
        source='get_reason_display', read_only=True
    )
    
    class Meta:
        model = Refund
        fields = [
            'id', 'payment', 'amount', 'status', 'status_display',
            'reason', 'reason_display', 'notes', 'created_at'
        ]


class RefundCreateSerializer(serializers.Serializer):
    """Serializer for creating a refund."""
    
    payment_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    reason = serializers.CharField(required=False, allow_blank=True)
