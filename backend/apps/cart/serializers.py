# apps/cart/serializers.py
"""
Serializers for shopping cart.
"""
from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items."""
    
    product = ProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    variant_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'variant_id',
            'quantity', 'unit_price', 'line_total',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'unit_price', 'line_total', 'created_at', 'updated_at']


class CartItemCreateSerializer(serializers.Serializer):
    """Serializer for adding items to cart."""
    
    product_id = serializers.UUIDField()
    variant_id = serializers.UUIDField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        from apps.products.models import Product
        try:
            Product.objects.get(pk=value, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or unavailable.")
        return value
    
    def validate(self, attrs):
        from apps.products.models import Product, ProductVariant
        
        product = Product.objects.get(pk=attrs['product_id'])
        variant_id = attrs.get('variant_id')
        
        if variant_id:
            try:
                variant = ProductVariant.objects.get(
                    pk=variant_id,
                    product=product,
                    is_active=True
                )
                attrs['variant'] = variant
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError({
                    'variant_id': "Variant not found or unavailable."
                })
        
        attrs['product'] = product
        
        # Check stock
        if product.track_inventory:
            available_stock = attrs.get('variant', product).stock if variant_id else product.stock
            if attrs['quantity'] > available_stock and not product.allow_backorder:
                raise serializers.ValidationError({
                    'quantity': f"Only {available_stock} items available."
                })
        
        return attrs


class CartItemUpdateSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""
    
    quantity = serializers.IntegerField(min_value=0)
    
    def validate_quantity(self, value):
        item = self.context.get('item')
        if not item:
            return value
        
        product = item.product
        if value > 0 and product.track_inventory:
            available_stock = item.variant.stock if item.variant else product.stock
            if value > available_stock and not product.allow_backorder:
                raise serializers.ValidationError(
                    f"Only {available_stock} items available."
                )
        
        return value


class CartSerializer(serializers.ModelSerializer):
    """Serializer for cart."""
    
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    discount_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    coupon_code = serializers.CharField(
        source='coupon.code', read_only=True, allow_null=True
    )
    
    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'item_count',
            'subtotal', 'discount_amount', 'total',
            'coupon_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon to cart."""
    
    code = serializers.CharField(max_length=50)
    
    def validate_code(self, value):
        from apps.promotions.models import Coupon
        
        try:
            coupon = Coupon.objects.get(code__iexact=value, is_active=True)
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code.")
        
        if not coupon.is_valid:
            raise serializers.ValidationError("This coupon has expired or is no longer valid.")
        
        return value
