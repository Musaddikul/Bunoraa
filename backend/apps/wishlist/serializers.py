# apps/wishlist/serializers.py
"""
Wishlist serializers.
"""
from rest_framework import serializers
from .models import Wishlist, WishlistItem
from apps.products.serializers import ProductListSerializer


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items."""
    
    product = ProductListSerializer(read_only=True)
    variant_name = serializers.CharField(
        source='variant.name', read_only=True, allow_null=True
    )
    
    class Meta:
        model = WishlistItem
        fields = [
            'id', 'product', 'variant', 'variant_name',
            'notify_price_drop', 'notify_back_in_stock', 'added_at'
        ]


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for wishlist."""
    
    items = WishlistItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'item_count', 'updated_at']


class WishlistItemCreateSerializer(serializers.Serializer):
    """Serializer for adding item to wishlist."""
    
    product_id = serializers.UUIDField()
    variant_id = serializers.UUIDField(required=False, allow_null=True)
    notify_price_drop = serializers.BooleanField(default=False)
    notify_back_in_stock = serializers.BooleanField(default=False)
    
    def validate_product_id(self, value):
        from apps.products.models import Product
        try:
            Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError('Product not found')
        return value
    
    def validate(self, attrs):
        variant_id = attrs.get('variant_id')
        if variant_id:
            from apps.products.models import ProductVariant
            try:
                ProductVariant.objects.get(
                    id=variant_id,
                    product_id=attrs['product_id']
                )
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError(
                    {'variant_id': 'Variant not found for this product'}
                )
        return attrs


class WishlistItemUpdateSerializer(serializers.Serializer):
    """Serializer for updating wishlist item notifications."""
    
    notify_price_drop = serializers.BooleanField(required=False)
    notify_back_in_stock = serializers.BooleanField(required=False)
