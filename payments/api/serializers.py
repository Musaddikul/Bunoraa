# payments/api/serializers.py
from rest_framework import serializers
from decimal import Decimal
from ..models import Payment, PaymentMethod, PaymentStatus, Refund, PaymentEvent
from django.utils.translation import gettext_lazy as _

class PaymentMethodSerializer(serializers.ModelSerializer):
    """
    Serializer for the PaymentMethod model.
    Excludes sensitive config_json for public API.
    """
    class Meta:
        model = PaymentMethod
        fields = ['id', 'code', 'name', 'is_active', 'is_online', 'icon', 'gateway_code']
        read_only_fields = ['id']

class RefundSerializer(serializers.ModelSerializer):
    """
    Serializer for the Refund model.
    """
    class Meta:
        model = Refund
        fields = ['id', 'payment', 'refund_id', 'amount', 'status', 'reason', 'created_at']
        read_only_fields = ['id', 'payment', 'refund_id', 'status', 'created_at']

class PaymentEventSerializer(serializers.ModelSerializer):
    """
    Serializer for the PaymentEvent model.
    """
    class Meta:
        model = PaymentEvent
        fields = ['id', 'payment', 'event_type', 'gateway_event_id', 'payload', 'processed', 'created_at']
        read_only_fields = ['id', 'payment', 'gateway_event_id', 'payload', 'processed', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for the Payment model, including nested refunds and events.
    Used for retrieving payment details.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    method_name = serializers.CharField(source='method.name', read_only=True)
    refunds = RefundSerializer(many=True, read_only=True)
    events = PaymentEventSerializer(many=True, read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'order_id', 'method', 'method_name', 'status', 'status_display',
            'amount', 'currency', 'payment_intent_id', 'transaction_id', 'gateway_reference',
            'capture_status', 'is_verified', 'is_test', 'error_details', 'metadata',
            'created_at', 'updated_at', 'completed_at', 'refunds', 'events'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'status_display', 'created_at', 'updated_at', 'completed_at',
            'payment_intent_id', 'transaction_id', 'gateway_reference', 'capture_status',
            'is_verified', 'error_details', 'refunds', 'events'
        ]

class PaymentIntentCreateSerializer(serializers.Serializer):
    """
    Serializer for creating a payment intent.
    """
    order_id = serializers.CharField(max_length=100, help_text=_("The ID of the order for which to create a payment intent."))
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'), help_text=_("The amount to be paid."))
    payment_method_code = serializers.CharField(max_length=50, help_text=_("The code of the payment method to use (e.g., 'bkash', 'stripe_card')."))
    currency = serializers.CharField(max_length=10, default='BDT', help_text=_("The currency for the payment (default: BDT)."))
    is_test = serializers.BooleanField(default=False, help_text=_("Set to true for test payments."))

    def validate(self, data):
        """
        Validates the existence and activeness of the payment method.
        """
        try:
            payment_method = PaymentMethod.objects.get(code=data['payment_method_code'], is_active=True)
            data['payment_method'] = payment_method
        except PaymentMethod.DoesNotExist:
            raise serializers.ValidationError({'payment_method_code': _("Invalid or inactive payment method.")})
        
        # Ensure order exists (assuming CustomOrder is in custom_order app)
        from custom_order.models import CustomOrder
        try:
            order = CustomOrder.objects.get(order_id=data['order_id'])
            data['order'] = order
        except CustomOrder.DoesNotExist:
            raise serializers.ValidationError({'order_id': _("Order not found.")})

        # Basic check: amount should not exceed order total if order total is known
        if hasattr(data['order'], 'total_amount') and data['amount'] > data['order'].total_amount:
            raise serializers.ValidationError({'amount': _("Payment amount cannot exceed order total.")})

        return data

class PaymentProcessSerializer(serializers.Serializer):
    """
    Serializer for processing/confirming a payment intent.
    """
    payment_intent_id = serializers.CharField(max_length=150, help_text=_("The payment intent ID to process."))
    # Add any other data required by the gateway for confirmation (e.g., source token, 3D Secure verification result)
    # For a real integration, this would include client-side generated tokens/data.
    payment_data = serializers.JSONField(required=False, help_text=_("Additional payment data from client (e.g., card token, 3D Secure result)."))

class PaymentRefundSerializer(serializers.Serializer):
    """
    Serializer for initiating a refund.
    """
    payment_id = serializers.UUIDField(help_text=_("The ID of the payment to refund."))
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'), required=False, help_text=_("The amount to refund. If not provided, full amount will be refunded."))
    reason = serializers.CharField(max_length=255, required=False, help_text=_("Reason for the refund."))

    def validate(self, data):
        """
        Validates the payment and refund amount.
        """
        try:
            payment = Payment.objects.get(id=data['payment_id'])
            data['payment'] = payment
        except Payment.DoesNotExist:
            raise serializers.ValidationError({'payment_id': _("Payment not found.")})
        
        if payment.status not in [PaymentStatus.COMPLETED, PaymentStatus.CAPTURED, PaymentStatus.PARTIALLY_REFUNDED]:
            raise serializers.ValidationError({'payment_id': _("Payment is not in a refundable status.")})
        
        refund_amount = data.get('amount')
        if refund_amount:
            total_refunded = payment.refunds.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
            available_for_refund = payment.amount - total_refunded
            if refund_amount > available_for_refund:
                raise serializers.ValidationError({'amount': _(f"Refund amount exceeds available refundable amount ({available_for_refund}).")})
        else:
            # If no amount is provided, assume full refund of remaining amount
            total_refunded = payment.refunds.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
            data['amount'] = payment.amount - total_refunded
            if data['amount'] <= 0:
                 raise serializers.ValidationError({'amount': _("No refundable amount remaining for this payment.")})

        return data

class WebhookPayloadSerializer(serializers.Serializer):
    """
    Generic serializer for validating incoming webhook payloads.
    This should be customized based on specific gateway webhook structures.
    """
    event_id = serializers.CharField(max_length=150, required=True, help_text=_("Unique ID of the event from the gateway."))
    event_type = serializers.CharField(max_length=100, required=True, help_text=_("Type of the event (e.g., 'charge.succeeded')."))
    data = serializers.JSONField(required=True, help_text=_("The main data object of the webhook event."))
    timestamp = serializers.DateTimeField(required=False, help_text=_("Timestamp of the event."))
    # Add more fields as per specific gateway's webhook structure
