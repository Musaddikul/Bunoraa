"""
Checkout API serializers - Comprehensive serializers for checkout operations
"""
from decimal import Decimal
from rest_framework import serializers
from apps.cart.api.serializers import CartSerializer
from apps.shipping.models import ShippingRate, ShippingZone
from apps.contacts.models import StoreLocation
from ..models import CheckoutSession, CheckoutEvent


class AddressSerializer(serializers.Serializer):
    """Base serializer for address input."""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='Bangladesh')


class ShippingAddressSerializer(AddressSerializer):
    """Serializer for shipping address input."""
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)


class BillingAddressSerializer(AddressSerializer):
    """Serializer for billing address input."""
    pass


class ContactInformationSerializer(serializers.Serializer):
    """Serializer for contact and shipping information."""
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='Bangladesh')
    save_address = serializers.BooleanField(default=False, required=False)
    subscribe_newsletter = serializers.BooleanField(default=False, required=False)
    accept_marketing = serializers.BooleanField(default=False, required=False)
    saved_address_id = serializers.UUIDField(required=False, allow_null=True)


class UpdateShippingSerializer(serializers.Serializer):
    """Serializer for updating shipping info."""
    shipping_address = ShippingAddressSerializer()
    billing_same_as_shipping = serializers.BooleanField(default=True)
    billing_address = BillingAddressSerializer(required=False, allow_null=True)
    
    def validate(self, data):
        if not data.get('billing_same_as_shipping') and not data.get('billing_address'):
            raise serializers.ValidationError({
                'billing_address': 'Billing address is required when different from shipping.'
            })
        return data


class ShippingMethodSerializer(serializers.Serializer):
    """Serializer for setting shipping method."""
    shipping_method = serializers.ChoiceField(choices=CheckoutSession.SHIPPING_CHOICES)
    shipping_rate_id = serializers.UUIDField(required=False, allow_null=True)
    pickup_location_id = serializers.UUIDField(required=False, allow_null=True)
    
    def validate(self, data):
        if data.get('shipping_method') == CheckoutSession.SHIPPING_PICKUP:
            if not data.get('pickup_location_id'):
                raise serializers.ValidationError({
                    'pickup_location_id': 'Pickup location is required for store pickup.'
                })
        return data


class SetPaymentMethodSerializer(serializers.Serializer):
    """Serializer for setting payment method."""
    payment_method = serializers.ChoiceField(choices=CheckoutSession.PAYMENT_CHOICES)
    saved_payment_method_id = serializers.UUIDField(required=False, allow_null=True)
    billing_same_as_shipping = serializers.BooleanField(default=True)
    billing_address = BillingAddressSerializer(required=False, allow_null=True)


class GiftOptionsSerializer(serializers.Serializer):
    """Serializer for gift options."""
    is_gift = serializers.BooleanField(default=False)
    gift_message = serializers.CharField(max_length=500, required=False, allow_blank=True)
    gift_wrap = serializers.BooleanField(default=False)


class OrderNotesSerializer(serializers.Serializer):
    """Serializer for order notes."""
    order_notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    delivery_instructions = serializers.CharField(max_length=500, required=False, allow_blank=True)


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon."""
    coupon_code = serializers.CharField(max_length=50)


class ShippingRateSerializer(serializers.ModelSerializer):
    """Serializer for shipping rate."""
    name = serializers.CharField(source='method.name', read_only=True)
    code = serializers.CharField(source='method.code', read_only=True)
    description = serializers.CharField(source='method.description', read_only=True)
    carrier = serializers.CharField(source='method.carrier.name', read_only=True, allow_null=True)
    delivery_estimate = serializers.CharField(source='method.delivery_estimate', read_only=True)
    calculated_cost = serializers.SerializerMethodField()
    formatted_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = ShippingRate
        fields = [
            'id', 'name', 'code', 'description', 'carrier',
            'base_rate', 'per_item_rate', 'per_kg_rate', 'free_shipping_threshold',
            'delivery_estimate', 'is_active', 'calculated_cost', 'formatted_cost'
        ]
    
    def get_calculated_cost(self, obj):
        context = self.context
        subtotal = context.get('subtotal', Decimal('0'))
        item_count = context.get('item_count', 0)
        weight = context.get('weight', Decimal('0'))
        return float(obj.calculate_rate(subtotal=subtotal, weight=weight, item_count=item_count))
    
    def get_formatted_cost(self, obj):
        cost = self.get_calculated_cost(obj)
        if cost == 0:
            return 'Free'
        return f"৳{cost:,.2f}"


class ShippingOptionSerializer(serializers.Serializer):
    """Serializer for shipping option with calculated cost."""
    id = serializers.CharField(allow_null=True)
    code = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    carrier = serializers.CharField(allow_blank=True)
    cost = serializers.FloatField()
    formatted_cost = serializers.CharField()
    delivery_estimate = serializers.CharField()
    is_free = serializers.BooleanField()
    has_locations = serializers.BooleanField(required=False, default=False)


class StoreLocationSerializer(serializers.ModelSerializer):
    """Serializer for store locations."""
    formatted_address = serializers.ReadOnlyField(source='full_address')
    formatted_fee = serializers.SerializerMethodField()
    opening_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = StoreLocation
        fields = [
            'id', 'name', 'slug', 'description',
            'address_line1', 'address_line2', 'city', 'state',
            'postal_code', 'country', 'phone', 'email',
            'latitude', 'longitude', 'opening_hours',
            'pickup_fee', 'formatted_fee', 'min_pickup_time_hours',
            'formatted_address', 'is_pickup_location'
        ]
    
    def get_formatted_fee(self, obj):
        if obj.pickup_fee == 0:
            return 'Free'
        return f"৳{obj.pickup_fee:,.2f}"
    
    def get_opening_hours(self, obj):
        return obj.get_hours() if hasattr(obj, 'get_hours') else {}


class AddressDisplaySerializer(serializers.Serializer):
    """Serializer for displaying address."""
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    full_name = serializers.CharField()
    company = serializers.CharField(allow_blank=True, required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(allow_blank=True, required=False)
    address_line_1 = serializers.CharField()
    address_line_2 = serializers.CharField(allow_blank=True)
    city = serializers.CharField()
    state = serializers.CharField(allow_blank=True)
    postal_code = serializers.CharField()
    country = serializers.CharField()


class CheckoutSummarySerializer(serializers.Serializer):
    """Serializer for checkout summary."""
    items = serializers.ListField()
    item_count = serializers.IntegerField()
    subtotal = serializers.FloatField()
    formatted_subtotal = serializers.CharField()
    discount = serializers.FloatField()
    formatted_discount = serializers.CharField(allow_blank=True)
    coupon_code = serializers.CharField(allow_blank=True)
    shipping_method = serializers.CharField()
    shipping_cost = serializers.FloatField()
    formatted_shipping = serializers.CharField()
    tax = serializers.FloatField()
    formatted_tax = serializers.CharField(allow_blank=True)
    gift_wrap = serializers.BooleanField()
    gift_wrap_cost = serializers.FloatField()
    formatted_gift_wrap = serializers.CharField(allow_blank=True)
    cod_fee = serializers.FloatField()
    formatted_cod_fee = serializers.CharField(allow_blank=True)
    total = serializers.FloatField()
    formatted_total = serializers.CharField()
    currency = serializers.CharField()
    shipping_address = AddressDisplaySerializer()
    billing_address = AddressDisplaySerializer()
    billing_same_as_shipping = serializers.BooleanField()
    payment_method = serializers.CharField()
    payment_method_code = serializers.CharField()
    is_gift = serializers.BooleanField()
    gift_message = serializers.CharField(allow_blank=True)
    order_notes = serializers.CharField(allow_blank=True)
    delivery_instructions = serializers.CharField(allow_blank=True)


class CheckoutSessionSerializer(serializers.ModelSerializer):
    """Serializer for checkout session."""
    shipping_address = serializers.SerializerMethodField()
    billing_address = serializers.SerializerMethodField()
    step_progress = serializers.ReadOnlyField()
    customer_email = serializers.ReadOnlyField()
    can_proceed_to_shipping = serializers.ReadOnlyField()
    can_proceed_to_payment = serializers.ReadOnlyField()
    can_proceed_to_review = serializers.ReadOnlyField()
    can_complete = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = CheckoutSession
        fields = [
            'id', 'email', 'current_step', 'step_progress',
            'customer_email', 'is_active',
            
            # Shipping
            'shipping_method', 'shipping_cost',
            'shipping_address',
            
            # Billing
            'billing_same_as_shipping', 'billing_address',
            
            # Payment
            'payment_method', 'stripe_client_secret',
            
            # Coupon
            'coupon_code', 'discount_amount',
            
            # Gift
            'is_gift', 'gift_message', 'gift_wrap', 'gift_wrap_cost',
            
            # Notes
            'order_notes', 'delivery_instructions',
            
            # Totals
            'subtotal', 'tax_amount', 'total', 'currency',
            
            # Step completion
            'information_completed', 'shipping_completed',
            'payment_setup_completed', 'review_completed',
            
            # Validation
            'can_proceed_to_shipping', 'can_proceed_to_payment',
            'can_proceed_to_review', 'can_complete',
            
            # Timestamps
            'created_at', 'updated_at', 'expires_at',
        ]
        read_only_fields = [
            'id', 'subtotal', 'total', 'created_at', 'updated_at',
            'stripe_client_secret', 'discount_amount', 'tax_amount'
        ]
    
    def get_shipping_address(self, obj):
        return AddressDisplaySerializer(obj.get_shipping_address_dict()).data
    
    def get_billing_address(self, obj):
        return AddressDisplaySerializer(obj.get_billing_address_dict()).data


class CompleteCheckoutSerializer(serializers.Serializer):
    """Serializer for completing checkout."""
    payment_intent_id = serializers.CharField(required=False, allow_blank=True)
    order_notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    accept_terms = serializers.BooleanField(default=True)


class ValidationIssueSerializer(serializers.Serializer):
    """Serializer for validation issues."""
    field = serializers.CharField()
    message = serializers.CharField()
    code = serializers.CharField()
    item = serializers.CharField(required=False, allow_null=True)


class CheckoutValidationSerializer(serializers.Serializer):
    """Serializer for checkout validation response."""
    valid = serializers.BooleanField()
    issues = ValidationIssueSerializer(many=True)
    can_complete = serializers.BooleanField()


class PaymentIntentSerializer(serializers.Serializer):
    """Serializer for payment intent response."""
    id = serializers.CharField()
    client_secret = serializers.CharField()
    amount = serializers.IntegerField()


class CouponResponseSerializer(serializers.Serializer):
    """Serializer for coupon application response."""
    success = serializers.BooleanField()
    message = serializers.CharField()
    discount = serializers.FloatField(required=False)
    formatted_discount = serializers.CharField(required=False)
    total = serializers.FloatField(required=False)
    formatted_total = serializers.CharField(required=False)
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
