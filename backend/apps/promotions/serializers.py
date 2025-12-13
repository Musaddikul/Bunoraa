# apps/promotions/serializers.py
"""
Promotion serializers.
"""
from rest_framework import serializers
from .models import Coupon, Banner, Sale


class CouponSerializer(serializers.ModelSerializer):
    """Serializer for coupon display."""
    
    discount_display = serializers.CharField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    discount_type_display = serializers.CharField(
        source='get_discount_type_display', read_only=True
    )
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount_type',
            'discount_type_display', 'discount_value',
            'minimum_purchase', 'maximum_discount',
            'valid_from', 'valid_until', 'is_active',
            'discount_display', 'is_expired', 'first_order_only'
        ]


class CouponValidateSerializer(serializers.Serializer):
    """Serializer for coupon validation request."""
    
    code = serializers.CharField(max_length=50)
    
    def validate_code(self, value):
        return value.upper().strip()


class BannerSerializer(serializers.ModelSerializer):
    """Serializer for promotional banners."""
    
    class Meta:
        model = Banner
        fields = [
            'id', 'title', 'subtitle', 'image', 'mobile_image',
            'link_url', 'link_text', 'position', 'order',
            'text_color', 'overlay_color', 'overlay_opacity'
        ]


class SaleSerializer(serializers.ModelSerializer):
    """Serializer for sales."""
    
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Sale
        fields = [
            'id', 'name', 'slug', 'description',
            'discount_percentage', 'banner_image',
            'start_date', 'end_date', 'is_valid'
        ]


class SaleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for sale pages."""
    
    is_valid = serializers.BooleanField(read_only=True)
    products = serializers.SerializerMethodField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'name', 'slug', 'description',
            'discount_percentage', 'banner_image',
            'start_date', 'end_date', 'is_valid', 'products'
        ]
    
    def get_products(self, obj):
        from apps.products.serializers import ProductListSerializer
        
        if obj.apply_to_all:
            from apps.products.models import Product
            products = Product.objects.filter(is_active=True)[:50]
        elif obj.products.exists():
            products = obj.products.filter(is_active=True)
        elif obj.categories.exists():
            from apps.products.models import Product
            category_ids = obj.categories.values_list('id', flat=True)
            products = Product.objects.filter(
                category_id__in=category_ids,
                is_active=True
            )
        else:
            products = []
        
        return ProductListSerializer(products, many=True).data
