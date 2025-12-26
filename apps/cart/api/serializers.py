"""
Cart API serializers
"""
from decimal import Decimal
from rest_framework import serializers
from apps.products.models import Product, ProductVariant
from apps.promotions.models import Coupon
from apps.currencies.services import CurrencyService, CurrencyConversionService
from ..models import Cart, CartItem


class CurrencyContextMixin:
    """Reusable currency helper for serializers."""

    def _get_currency_helper(self):
        helper = self.context.get('_currency_helper')
        if helper:
            return helper

        request = self.context.get('request')
        user = None
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user

        base_currency = CurrencyService.get_default_currency()
        target_currency = CurrencyService.get_user_currency(user=user, request=request) or base_currency

        def convert(amount):
            if amount is None:
                return '0'
            value = Decimal(str(amount))
            if not base_currency or not target_currency or base_currency.id == target_currency.id:
                return str(value)
            try:
                converted = CurrencyConversionService.convert(value, base_currency, target_currency)
                return str(converted)
            except Exception:  # pragma: no cover - fallback when rates missing
                return str(value)

        helper = {
            'base': base_currency,
            'target': target_currency,
            'convert': convert
        }
        self.context['_currency_helper'] = helper
        return helper

    def _convert_amount(self, amount):
        helper = self._get_currency_helper()
        converter = helper.get('convert')
        return converter(amount) if converter else str(amount or 0)

    def _get_currency_payload(self):
        helper = self._get_currency_helper()
        currency = helper.get('target') or helper.get('base')
        if currency:
            return {
                'code': currency.code,
                'symbol': currency.symbol
            }
        return None


class CartProductSerializer(serializers.ModelSerializer):
    """Serializer for product in cart item."""
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'sale_price', 'primary_image', 'stock_quantity', 'is_in_stock']
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        first_image = obj.images.first()
        return first_image.image.url if first_image else None


class CartVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variant in cart item."""
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'name', 'price', 'stock_quantity', 'is_in_stock']


class CartItemSerializer(CurrencyContextMixin, serializers.ModelSerializer):
    """Serializer for cart item."""
    product = CartProductSerializer(read_only=True)
    variant = CartVariantSerializer(read_only=True)
    price_at_add = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()
    current_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'variant', 'quantity',
            'price_at_add', 'current_price', 'line_total', 'created_at'
        ]
    
    def get_price_at_add(self, obj):
        # Convert from product currency to user's target currency
        helper = self._get_currency_helper()
        target = helper.get('target') or helper.get('base')
        from_currency = obj.product.get_currency() if hasattr(obj.product, 'get_currency') else helper.get('base')
        try:
            converted = CurrencyConversionService.convert(obj.price_at_add, from_currency, target)
            return str(converted)
        except Exception:
            return str(obj.price_at_add)

    def get_line_total(self, obj):
        helper = self._get_currency_helper()
        target = helper.get('target') or helper.get('base')
        from_currency = obj.product.get_currency() if hasattr(obj.product, 'get_currency') else helper.get('base')
        try:
            converted_unit = CurrencyConversionService.convert(obj.unit_price, from_currency, target)
            converted_total = (converted_unit * obj.quantity).quantize(Decimal('0.01'))
            return str(converted_total)
        except Exception:
            return str(obj.total)
    
    def get_current_price(self, obj):
        """Get current price of product/variant."""
        helper = self._get_currency_helper()
        target = helper.get('target') or helper.get('base')
        from_currency = obj.product.get_currency() if hasattr(obj.product, 'get_currency') else helper.get('base')
        try:
            if obj.variant:
                return str(CurrencyConversionService.convert(obj.variant.price, from_currency, target))
            return str(CurrencyConversionService.convert(obj.product.sale_price or obj.product.price, from_currency, target))
        except Exception:
            if obj.variant:
                return str(obj.variant.price)
            return str(obj.product.sale_price or obj.product.price)


class CouponSerializer(serializers.ModelSerializer):
    """Serializer for coupon in cart."""
    
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'description']


class CartSerializer(CurrencyContextMixin, serializers.ModelSerializer):
    """Serializer for cart."""
    items = CartItemSerializer(many=True, read_only=True)
    coupon = CouponSerializer(read_only=True)
    summary = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'coupon', 'summary', 'currency', 'created_at', 'updated_at']
    
    def get_summary(self, obj):
        from ..services import CartService
        helper = self._get_currency_helper()
        return CartService.get_cart_summary(obj, currency=helper.get('target'))

    def get_currency(self, obj):
        return self._get_currency_payload()


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding item to cart."""
    product_id = serializers.UUIDField(required=True)
    variant_id = serializers.UUIDField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True, is_deleted=False)
            self.context['product'] = product
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or unavailable.")
    
    def validate(self, data):
        product = self.context.get('product')
        variant_id = data.get('variant_id')
        quantity = data.get('quantity', 1)
        
        if variant_id:
            try:
                variant = ProductVariant.objects.get(
                    id=variant_id,
                    product=product,
                    is_active=True
                )
                if variant.stock_quantity < quantity:
                    raise serializers.ValidationError(
                        f"Only {variant.stock_quantity} items available for this variant."
                    )
                self.context['variant'] = variant
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError({"variant_id": "Variant not found or unavailable."})
        else:
            # Check if product has variants - require selection
            if product.variants.filter(is_active=True).exists():
                raise serializers.ValidationError(
                    {"variant_id": "This product has variants. Please select a variant."}
                )
            if product.stock_quantity < quantity:
                raise serializers.ValidationError(
                    f"Only {product.stock_quantity} items available."
                )
        
        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_quantity(self, value):
        cart_item = self.context.get('cart_item')
        if cart_item:
            # Check stock
            if cart_item.variant:
                if cart_item.variant.stock_quantity < value:
                    raise serializers.ValidationError(
                        f"Only {cart_item.variant.stock_quantity} items available."
                    )
            else:
                if cart_item.product.stock_quantity < value:
                    raise serializers.ValidationError(
                        f"Only {cart_item.product.stock_quantity} items available."
                    )
        return value


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon to cart."""
    code = serializers.CharField(max_length=50)
    
    def validate_code(self, value):
        from apps.promotions.models import Coupon
        from django.utils import timezone
        
        try:
            coupon = Coupon.objects.get(
                code__iexact=value.strip(),
                is_active=True
            )
            
            # Check validity period
            now = timezone.now()
            if coupon.valid_from and now < coupon.valid_from:
                raise serializers.ValidationError("This coupon is not yet valid.")
            if coupon.valid_until and now > coupon.valid_until:
                raise serializers.ValidationError("This coupon has expired.")
            
            # Check usage limit
            if coupon.usage_limit and coupon.times_used >= coupon.usage_limit:
                raise serializers.ValidationError("This coupon has reached its usage limit.")
            
            self.context['coupon'] = coupon
            return value
            
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code.")


class CartValidationSerializer(serializers.Serializer):
    """Serializer for cart validation response."""
    is_valid = serializers.BooleanField()
    issues = serializers.ListField(child=serializers.CharField())
