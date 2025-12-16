"""
Checkout API serializers
"""
from rest_framework import serializers
from apps.cart.api.serializers import CartSerializer
from ..models import CheckoutSession, ShippingRate


class ShippingAddressSerializer(serializers.Serializer):
    """Serializer for shipping address input."""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='United States')


class BillingAddressSerializer(serializers.Serializer):
    """Serializer for billing address input."""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='United States')


class UpdateShippingSerializer(serializers.Serializer):
    """Serializer for updating shipping info."""
    shipping_address = ShippingAddressSerializer()
    billing_same_as_shipping = serializers.BooleanField(default=True)
    billing_address = BillingAddressSerializer(required=False)
    shipping_method = serializers.ChoiceField(
        choices=CheckoutSession.SHIPPING_CHOICES,
        default=CheckoutSession.SHIPPING_STANDARD
    )
    
    def validate(self, data):
        if not data.get('billing_same_as_shipping') and not data.get('billing_address'):
            raise serializers.ValidationError({
                'billing_address': 'Billing address is required when different from shipping.'
            })
        return data


class SetPaymentMethodSerializer(serializers.Serializer):
    """Serializer for setting payment method."""
    payment_method = serializers.ChoiceField(
        choices=CheckoutSession.PAYMENT_CHOICES,
        default=CheckoutSession.PAYMENT_STRIPE
    )


class ShippingRateSerializer(serializers.ModelSerializer):
    """Serializer for shipping rate."""
    delivery_estimate = serializers.ReadOnlyField()
    
    class Meta:
        model = ShippingRate
        fields = [
            'id', 'name', 'code', 'description',
            'base_rate', 'per_item_rate', 'free_shipping_threshold',
            'delivery_estimate', 'is_active'
        ]


class ShippingOptionSerializer(serializers.Serializer):
    """Serializer for shipping option with calculated cost."""
    code = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    cost = serializers.CharField()
    delivery_estimate = serializers.CharField()
    is_free = serializers.BooleanField()


class CheckoutSessionSerializer(serializers.ModelSerializer):
    """Serializer for checkout session."""
    cart = CartSerializer(read_only=True)
    shipping_address = serializers.SerializerMethodField()
    billing_address = serializers.SerializerMethodField()
    shipping_method_display = serializers.CharField(
        source='get_shipping_method_display',
        read_only=True
    )
    payment_method_display = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )
    current_step_display = serializers.CharField(
        source='get_current_step_display',
        read_only=True
    )
    can_proceed_to_shipping = serializers.ReadOnlyField()
    can_proceed_to_payment = serializers.ReadOnlyField()
    can_proceed_to_review = serializers.ReadOnlyField()
    
    class Meta:
        model = CheckoutSession
        fields = [
            'id', 'cart', 'current_step', 'current_step_display',
            'shipping_address', 'billing_address', 'billing_same_as_shipping',
            'shipping_method', 'shipping_method_display', 'shipping_cost',
            'payment_method', 'payment_method_display',
            'order_notes',
            'can_proceed_to_shipping', 'can_proceed_to_payment', 'can_proceed_to_review',
            'created_at', 'updated_at', 'expires_at'
        ]
    
    def get_shipping_address(self, obj):
        return obj.get_shipping_address_dict()
    
    def get_billing_address(self, obj):
        return obj.get_billing_address_dict()


class CheckoutSummarySerializer(serializers.Serializer):
    """Serializer for checkout summary."""
    items = serializers.ListField()
    item_count = serializers.IntegerField()
    subtotal = serializers.CharField()
    discount = serializers.CharField()
    coupon = serializers.DictField(required=False, allow_null=True)
    shipping_method = serializers.CharField()
    shipping_cost = serializers.CharField()
    total = serializers.CharField()
    shipping_address = serializers.DictField()
    billing_address = serializers.DictField()
    payment_method = serializers.CharField()


class CompleteCheckoutSerializer(serializers.Serializer):
    """Serializer for completing checkout."""
    payment_intent_id = serializers.CharField(required=False, allow_blank=True)
    order_notes = serializers.CharField(required=False, allow_blank=True, max_length=1000)
