# apps/wishlist/serializers.py
"""
Wishlist Serializers
"""
from rest_framework import serializers
from apps.products.serializers import ProductMiniSerializer, ProductVariantSerializer
from .models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    """Wishlist item serializer."""
    product = ProductMiniSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    price_dropped = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = WishlistItem
        fields = [
            'id', 'product', 'variant', 'notes', 'priority',
            'added_price', 'current_price', 'price_dropped',
            'notify_price_drop', 'created_at'
        ]


class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist serializer."""
    items = WishlistItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'name', 'is_public', 'is_default', 'item_count', 'items', 'created_at']


class WishlistListSerializer(serializers.ModelSerializer):
    """Simplified wishlist serializer for lists."""
    item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'name', 'is_public', 'is_default', 'item_count']


class AddToWishlistSerializer(serializers.Serializer):
    """Serializer for adding items to wishlist."""
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    wishlist_id = serializers.IntegerField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
