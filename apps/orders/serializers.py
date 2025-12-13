# apps/orders/serializers.py
"""
Order Serializers
"""
from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from .models import Order, OrderItem, OrderStatusHistory, OrderNote


class OrderItemSerializer(serializers.ModelSerializer):
    """Order item serializer."""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'variant', 'vendor',
            'product_name', 'product_sku', 'product_image', 'variant_name',
            'quantity', 'unit_price', 'discount', 'tax', 'total',
            'status', 'fulfilled_quantity'
        ]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Order status history serializer."""
    changed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'previous_status', 'note', 'changed_by', 'changed_by_name', 'created_at']
    
    def get_changed_by_name(self, obj):
        return obj.changed_by.get_full_name() if obj.changed_by else None


class OrderNoteSerializer(serializers.ModelSerializer):
    """Order note serializer."""
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderNote
        fields = ['id', 'note', 'is_customer_visible', 'created_by', 'created_by_name', 'created_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None


class OrderSerializer(serializers.ModelSerializer):
    """Order serializer."""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    can_refund = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'uuid', 'user',
            'email', 'phone', 'status', 'status_display',
            'payment_status', 'payment_status_display',
            'shipping_address', 'billing_address',
            'shipping_method', 'shipping_carrier', 'tracking_number', 'estimated_delivery',
            'subtotal', 'discount_amount', 'shipping_cost', 'tax_amount', 'total',
            'currency', 'coupon_code', 'coupon_discount',
            'payment_method', 'payment_id',
            'customer_notes', 'items',
            'can_cancel', 'can_refund',
            'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at',
            'created_at', 'updated_at'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order lists."""
    item_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    first_item_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'total', 'currency', 'item_count', 'first_item_image',
            'created_at'
        ]
    
    def get_item_count(self, obj):
        return obj.items.count()
    
    def get_first_item_image(self, obj):
        first_item = obj.items.first()
        return first_item.product_image if first_item else None


class OrderDetailSerializer(OrderSerializer):
    """Detailed order serializer with history."""
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    notes = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    
    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ['status_history', 'notes', 'admin_notes']
    
    def get_notes(self, obj):
        request = self.context.get('request')
        notes = obj.notes.all()
        if request and not request.user.is_staff:
            notes = notes.filter(is_customer_visible=True)
        return OrderNoteSerializer(notes, many=True).data


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders from cart."""
    shipping_address_id = serializers.IntegerField()
    billing_address_id = serializers.IntegerField(required=False)
    shipping_method_id = serializers.IntegerField()
    payment_method = serializers.CharField()
    customer_notes = serializers.CharField(required=False, allow_blank=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Serializer for updating order status."""
    status = serializers.ChoiceField(choices=Order.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True)
    tracking_number = serializers.CharField(required=False, allow_blank=True)
    carrier = serializers.CharField(required=False, allow_blank=True)
