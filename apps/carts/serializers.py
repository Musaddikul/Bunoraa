# apps/carts/serializers.py
"""
Cart Serializers
"""
from rest_framework import serializers
from apps.products.serializers import ProductMiniSerializer, ProductVariantSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """Cart item serializer."""
    product = ProductMiniSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'variant', 'quantity', 'price',
            'line_total', 'current_price', 'is_available', 'saved_for_later'
        ]


class CartSerializer(serializers.ModelSerializer):
    """Cart serializer."""
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    is_empty = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'item_count', 'is_empty',
            'subtotal', 'discount_amount', 'shipping_cost', 'tax_amount', 'total',
            'shipping_address', 'shipping_method', 'coupon',
            'created_at', 'updated_at'
        ]


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart."""
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""
    quantity = serializers.IntegerField(min_value=0)


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon."""
    code = serializers.CharField(max_length=50)
