"""
Payments API serializers
"""
from rest_framework import serializers

from ..models import Payment, PaymentMethod, Refund, PaymentGateway


class PaymentGatewaySerializer(serializers.ModelSerializer):
    """Serializer for payment gateways (public facing)."""
    icon_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentGateway
        fields = [
            'code', 'name', 'description', 'icon_url', 'icon_class',
            'color', 'fee_type', 'fee_amount', 'fee_text', 'instructions'
        ]
    
    def get_icon_url(self, obj):
        if obj.icon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon.url)
            return obj.icon.url
        return None


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for payment methods."""
    display_name = serializers.CharField(source='__str__', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'type', 'type_display', 'display_name',
            'card_brand', 'card_last_four', 'card_exp_month', 'card_exp_year',
            'paypal_email', 'is_default', 'created_at'
        ]
        read_only_fields = [
            'id', 'card_brand', 'card_last_four', 'card_exp_month',
            'card_exp_year', 'paypal_email', 'created_at'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_number', 'amount', 'currency',
            'status', 'status_display', 'method_type',
            'refunded_amount', 'paid_at', 'created_at'
        ]
        read_only_fields = fields


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for refunds."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'amount', 'reason', 'reason_display', 'notes',
            'status', 'status_display', 'created_at', 'processed_at'
        ]
        read_only_fields = fields


class CreatePaymentIntentSerializer(serializers.Serializer):
    """Serializer for creating payment intent."""
    order_id = serializers.UUIDField()


class SavePaymentMethodSerializer(serializers.Serializer):
    """Serializer for saving payment method."""
    payment_method_id = serializers.CharField(max_length=100)


class SetDefaultPaymentMethodSerializer(serializers.Serializer):
    """Serializer for setting default payment method."""
    payment_method_id = serializers.UUIDField()


class RefundCreateSerializer(serializers.Serializer):
    """Serializer for creating refunds."""
    payment_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    reason = serializers.ChoiceField(choices=Refund.REASON_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
