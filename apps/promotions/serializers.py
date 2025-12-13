# apps/promotions/serializers.py
"""
Promotion Serializers
"""
from rest_framework import serializers
from apps.products.serializers import ProductMiniSerializer
from .models import Coupon, Sale, FlashDeal, Bundle, BundleItem


class CouponSerializer(serializers.ModelSerializer):
    """Coupon serializer."""
    is_valid_coupon = serializers.BooleanField(source='is_valid', read_only=True)
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description',
            'discount_type', 'discount_value', 'max_discount',
            'min_order_amount', 'is_valid_coupon',
            'valid_from', 'valid_until'
        ]


class CouponValidateSerializer(serializers.Serializer):
    """Serializer for coupon validation."""
    code = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)


class SaleSerializer(serializers.ModelSerializer):
    """Sale serializer."""
    is_valid_sale = serializers.BooleanField(source='is_valid', read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'name', 'slug', 'description',
            'discount_percentage', 'banner_image',
            'badge_text', 'badge_color',
            'start_date', 'end_date', 'is_valid_sale',
            'is_featured', 'product_count'
        ]
    
    def get_product_count(self, obj):
        return obj.get_products().count()


class FlashDealSerializer(serializers.ModelSerializer):
    """Flash deal serializer."""
    product = ProductMiniSerializer(read_only=True)
    is_valid_deal = serializers.BooleanField(source='is_valid', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    quantity_remaining = serializers.IntegerField(read_only=True)
    sold_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = FlashDeal
        fields = [
            'id', 'product', 'deal_price',
            'quantity_available', 'quantity_sold',
            'quantity_remaining', 'sold_percentage',
            'discount_percentage', 'start_time', 'end_time',
            'is_valid_deal'
        ]


class BundleItemSerializer(serializers.ModelSerializer):
    """Bundle item serializer."""
    product = ProductMiniSerializer(read_only=True)
    
    class Meta:
        model = BundleItem
        fields = ['id', 'product', 'quantity']


class BundleSerializer(serializers.ModelSerializer):
    """Bundle serializer."""
    items = BundleItemSerializer(many=True, read_only=True)
    original_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    savings = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Bundle
        fields = [
            'id', 'name', 'slug', 'description',
            'bundle_price', 'original_price', 'savings', 'discount_percentage',
            'image', 'items',
            'valid_from', 'valid_until', 'is_active'
        ]
