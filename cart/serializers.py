# cart/serializers.py
import logging
from rest_framework import serializers
from decimal import Decimal
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)

from products.models import Product
from products.api.serializers import ProductSerializer, ColorSerializer, SizeSerializer, FabricSerializer # Assuming you have a ProductSerializer
from .models import Cart, CartItem
from promotions.models import Coupon # Import Coupon model
from shipping.models import ShippingMethod # Import ShippingMethod model
# Import the correct ShippingMethodSerializer from shipping app
from shipping.api.serializers import ShippingMethodSerializer as ExternalShippingMethodSerializer 
from accounts.api.serializers import UserAddressSerializer # Assuming this exists
from promotions.services import CouponService # Import CouponService

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    color = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    fabric = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'color', 'size', 'fabric', 'quantity', 'price', 'total_price', 'saved_for_later', 'added_at', 'updated_at']
        read_only_fields = ['id', 'price', 'total_price', 'added_at', 'updated_at']

    def get_color(self, obj):
        if obj.color:
            return ColorSerializer(obj.color).data
        return None

    def get_size(self, obj):
        if obj.size:
            return SizeSerializer(obj.size).data
        return None

    def get_fabric(self, obj):
        if obj.fabric:
            return FabricSerializer(obj.fabric).data
        return None

class CartItemCreateUpdateSerializer(serializers.Serializer):
    """
    Serializer for creating or updating CartItem objects.
    Handles product_id, quantity, override_quantity, and saved_for_later.
    """
    product_id = serializers.IntegerField(help_text=_("ID of the product to add/update."))
    quantity = serializers.IntegerField(min_value=1, help_text=_("Quantity of the product."))
    color_id = serializers.IntegerField(required=False, allow_null=True, help_text=_("ID of the selected color."))
    size_id = serializers.IntegerField(required=False, allow_null=True, help_text=_("ID of the selected size."))
    fabric_id = serializers.IntegerField(required=False, allow_null=True, help_text=_("ID of the selected fabric."))
    override_quantity = serializers.BooleanField(required=False, default=False, help_text=_("If true, overrides existing quantity; otherwise, adds to it."))
    saved_for_later = serializers.BooleanField(required=False, default=False, help_text=_("If true, adds to 'saved for later' instead of active cart."))

    def validate_product_id(self, value):
        """
        Check if the product exists and is available.
        """
        try:
            product = Product.objects.get(id=value, available=True)
            if product.stock <= 0:
                raise serializers.ValidationError(_("This product is out of stock."))
        except Product.DoesNotExist:
            raise serializers.ValidationError(_("Product not found or not available."))
        return value

class CartItemUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating just the quantity of a cart item.
    """
    quantity = serializers.IntegerField(min_value=1)
    color_id = serializers.IntegerField(required=False, allow_null=True)
    size_id = serializers.IntegerField(required=False, allow_null=True)
    fabric_id = serializers.IntegerField(required=False, allow_null=True)

class CouponSerializer(serializers.ModelSerializer):
    """
    Serializer for the Coupon model, for displaying applied coupon details.
    """
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'description', 'discount_type', 'discount_value', 'minimum_order_amount', 'max_discount_amount']
        
# Removed the redundant ShippingMethodSerializer definition from here.
# We will use ExternalShippingMethodSerializer directly.

class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for the Cart model.
    Includes nested active and saved cart items, coupon, and shipping method details.
    Also includes calculated totals.
    """
    active_items = serializers.SerializerMethodField()
    saved_items = serializers.SerializerMethodField()
    
    # Use the ShippingMethodSerializer from the shipping app for consistency
    shipping_method = ExternalShippingMethodSerializer(read_only=True) 
    address = UserAddressSerializer(read_only=True) # Add this line
    
    # Nested Coupon serializer
    coupon = CouponSerializer(read_only=True) # Use the defined CouponSerializer
    coupon_message = serializers.SerializerMethodField() # New field

    # Expose fields directly, relying on Cart model properties for calculation
    # No 'source' argument needed if the field name matches a model property/method
    total_items = serializers.IntegerField(read_only=True)
    is_empty = serializers.BooleanField(read_only=True) 
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    get_discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    get_shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    get_tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    final_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True) 
    is_express = serializers.BooleanField(read_only=True) # From cart model property

    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'session_key', 'created_at', 'updated_at',
            'checked_out', 'abandoned', 'converted', 'abandoned_at', 'converted_at',
            'is_express', 
            'active_items', 'saved_items', 'coupon', 'shipping_method', 'address',
            'total_items', 'is_empty', 'total_price', 'get_discount_amount',
            'get_shipping_cost', 'get_tax_amount', 'final_total', 'tax_rate', 'coupon_message'
        ]
        read_only_fields = [
            'id', 'user', 'session_key', 'created_at', 'updated_at',
            'checked_out', 'abandoned', 'converted', 'abandoned_at', 'converted_at',
            'is_express', 
            'total_items', 'is_empty', 'total_price', 'get_discount_amount',
            'get_shipping_cost', 'get_tax_amount', 'final_total', 'tax_rate', 'address', 'coupon_message'
        ]

    def get_coupon_message(self, obj) -> str:
        """
        Returns a message about the coupon's status.
        """
        if not obj.coupon:
            return "" # No coupon applied

        # Attempt to validate the coupon with the current cart state
        from promotions.services import CouponService # Import here to avoid circular dependency
        from django.core.exceptions import ValidationError

        try:
            # Pass the request object to CouponService.validate_coupon if it needs user context
            # For now, assuming validate_coupon only needs code, total, and user
            user_for_validation = self.context.get('request').user if self.context.get('request') else None
            CouponService.validate_coupon(obj.coupon.code, obj.total_price, user_for_validation)
            return f"Coupon '{obj.coupon.code}' applied."
        except ValidationError as e:
            return f"Coupon '{obj.coupon.code}' is not valid: {e.message}"
        except Exception as e:
            logger.error(f"Error validating coupon {obj.coupon.code} for cart {obj.id}: {e}", exc_info=True)
            return "An error occurred validating your coupon."

    def to_representation(self, instance):
        """
        Override to include custom serialization logic and debug logging.
        """
        data = super().to_representation(instance)
        return data

    def get_active_items(self, obj) -> list:
        """
        Returns serialized active cart items.
        """
        active_items_queryset = obj.items.filter(saved_for_later=False).select_related(
            'product', 'color', 'size', 'fabric',
            'product__category', 'product__brand', 'product__seller'
        ).prefetch_related('product__images')
        return CartItemSerializer(active_items_queryset, many=True, context=self.context).data

    def get_saved_items(self, obj) -> list:
        """
        Returns serialized saved cart items.
        """
        saved_items_queryset = obj.items.filter(saved_for_later=True).select_related(
            'product', 'color', 'size', 'fabric',
            'product__category', 'product__brand', 'product__seller'
        ).prefetch_related('product__images')
        return CartItemSerializer(saved_items_queryset, many=True, context=self.context).data

class CouponApplySerializer(serializers.Serializer):
    """
    Serializer for applying a coupon code.
    """
    code = serializers.CharField(max_length=50)

class ShippingUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating the cart's shipping method.
    """
    shipping_method_id = serializers.IntegerField()
    is_express = serializers.BooleanField(required=False, default=False)
    address_id = serializers.IntegerField(required=False, allow_null=True, help_text="ID of the selected shipping address (optional).")

    def validate_shipping_method_id(self, value):
        """
        Check if the shipping method exists and is active.
        """
        try:
            ShippingMethod.objects.get(id=value, is_active=True)
        except ShippingMethod.DoesNotExist:
            raise serializers.ValidationError(_("Shipping method not found."))
        return value