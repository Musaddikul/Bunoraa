# apps/orders/serializers.py
"""
Order serializers.
"""
from decimal import Decimal
from rest_framework import serializers

from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items."""
    
    line_total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    savings = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'variant', 'product_name', 'product_sku',
            'variant_name', 'product_image', 'quantity', 'unit_price',
            'original_price', 'discount_amount', 'line_total', 'savings'
        ]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for order status history."""
    
    changed_by_email = serializers.EmailField(
        source='changed_by.email',
        read_only=True
    )
    
    class Meta:
        model = OrderStatusHistory
        fields = [
            'id', 'old_status', 'new_status', 'notes',
            'changed_by', 'changed_by_email', 'created_at'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for order list view."""
    
    item_count = serializers.IntegerField(read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    payment_status_display = serializers.CharField(
        source='get_payment_status_display', read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'payment_status', 'payment_status_display',
            'total', 'item_count', 'created_at'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for order detail view."""
    
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    payment_status_display = serializers.CharField(
        source='get_payment_status_display', read_only=True
    )
    shipping_full_name = serializers.CharField(read_only=True)
    shipping_full_address = serializers.CharField(read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number',
            'email', 'phone',
            'status', 'status_display',
            'payment_status', 'payment_status_display',
            # Shipping
            'shipping_first_name', 'shipping_last_name',
            'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country',
            'shipping_full_name', 'shipping_full_address',
            # Billing
            'billing_same_as_shipping',
            'billing_first_name', 'billing_last_name',
            'billing_address_line1', 'billing_address_line2',
            'billing_city', 'billing_state',
            'billing_postal_code', 'billing_country',
            # Totals
            'subtotal', 'discount_amount', 'shipping_cost',
            'tax_amount', 'total',
            # Coupon
            'coupon_code',
            # Shipping info
            'shipping_method', 'tracking_number', 'tracking_url',
            # Notes
            'customer_notes',
            # Payment
            'payment_method',
            # Timestamps
            'created_at', 'updated_at', 'paid_at',
            'shipped_at', 'delivered_at', 'cancelled_at',
            # Related
            'items', 'item_count', 'status_history', 'can_cancel'
        ]


class ShippingAddressSerializer(serializers.Serializer):
    """Serializer for shipping address input."""
    
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    address_line1 = serializers.CharField(max_length=255)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='US')


class BillingAddressSerializer(serializers.Serializer):
    """Serializer for billing address input."""
    
    same_as_shipping = serializers.BooleanField(default=True)
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    address_line1 = serializers.CharField(max_length=255, required=False)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False)
    state = serializers.CharField(max_length=100, required=False)
    postal_code = serializers.CharField(max_length=20, required=False)
    country = serializers.CharField(max_length=100, required=False)
    
    def validate(self, attrs):
        if not attrs.get('same_as_shipping', True):
            required_fields = [
                'first_name', 'last_name', 'address_line1',
                'city', 'state', 'postal_code'
            ]
            missing = [f for f in required_fields if not attrs.get(f)]
            if missing:
                raise serializers.ValidationError(
                    f"Required billing fields: {', '.join(missing)}"
                )
        return attrs


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process."""
    
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    shipping_address = ShippingAddressSerializer()
    billing_address = BillingAddressSerializer(required=False)
    shipping_method = serializers.CharField(max_length=100, required=False)
    customer_notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(
        choices=['stripe', 'paypal'],
        default='stripe'
    )
    
    def validate_email(self, value):
        return value.lower()


class OrderCancelSerializer(serializers.Serializer):
    """Serializer for order cancellation."""
    
    reason = serializers.CharField(required=False, allow_blank=True)


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin order updates."""
    
    class Meta:
        model = Order
        fields = [
            'status', 'payment_status', 'admin_notes',
            'tracking_number', 'tracking_url', 'shipping_method'
        ]


class OrderTrackingSerializer(serializers.Serializer):
    """Serializer for order tracking update."""
    
    tracking_number = serializers.CharField(max_length=100)
    tracking_url = serializers.URLField(required=False, allow_blank=True)
    carrier = serializers.CharField(max_length=50, required=False, allow_blank=True)
