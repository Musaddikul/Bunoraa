# apps/carts/views.py
"""
Cart Views
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.products.models import Product, ProductVariant
# Cart and CartItem accessed via services
from .serializers import (
    CartSerializer, CartItemSerializer,
    AddToCartSerializer, UpdateCartItemSerializer, ApplyCouponSerializer
)
from .services import CartService


class CartView(generics.RetrieveAPIView):
    """
    Get current cart.
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        return CartService.get_or_create_cart(self.request)


class AddToCartView(APIView):
    """
    Add item to cart.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = get_object_or_404(Product, pk=serializer.validated_data['product_id'])
        variant = None
        if serializer.validated_data.get('variant_id'):
            variant = get_object_or_404(ProductVariant, pk=serializer.validated_data['variant_id'])
        
        cart = CartService.get_or_create_cart(request)
        item = cart.add_item(product, variant, serializer.validated_data['quantity'])
        
        return Response({
            'message': 'Item added to cart',
            'item': CartItemSerializer(item).data,
            'cart': CartSerializer(cart).data
        }, status=status.HTTP_201_CREATED)


class UpdateCartItemView(APIView):
    """
    Update cart item quantity.
    """
    permission_classes = [permissions.AllowAny]
    
    def put(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = CartService.get_or_create_cart(request)
        item = cart.update_item_quantity(item_id, serializer.validated_data['quantity'])
        
        return Response({
            'message': 'Cart updated',
            'cart': CartSerializer(cart).data
        })


class RemoveCartItemView(APIView):
    """
    Remove item from cart.
    """
    permission_classes = [permissions.AllowAny]
    
    def delete(self, request, item_id):
        cart = CartService.get_or_create_cart(request)
        cart.remove_item(item_id)
        
        return Response({
            'message': 'Item removed',
            'cart': CartSerializer(cart).data
        })


class ClearCartView(APIView):
    """
    Clear all items from cart.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        cart = CartService.get_or_create_cart(request)
        cart.clear()
        
        return Response({
            'message': 'Cart cleared',
            'cart': CartSerializer(cart).data
        })


class ApplyCouponView(APIView):
    """
    Apply coupon to cart.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        from apps.promotions.models import Coupon
        
        try:
            coupon = Coupon.objects.get(
                code__iexact=serializer.validated_data['code'],
                is_active=True
            )
            
            # Validate coupon
            if not coupon.is_valid:
                return Response(
                    {'error': 'This coupon is no longer valid'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart = CartService.get_or_create_cart(request)
            
            # Check minimum order
            if coupon.min_order_amount and cart.subtotal < coupon.min_order_amount:
                return Response(
                    {'error': f'Minimum order amount is {coupon.min_order_amount}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart.apply_coupon(coupon)
            
            return Response({
                'message': 'Coupon applied',
                'cart': CartSerializer(cart).data
            })
            
        except Coupon.DoesNotExist:
            return Response(
                {'error': 'Invalid coupon code'},
                status=status.HTTP_400_BAD_REQUEST
            )


class RemoveCouponView(APIView):
    """
    Remove coupon from cart.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        cart = CartService.get_or_create_cart(request)
        cart.remove_coupon()
        
        return Response({
            'message': 'Coupon removed',
            'cart': CartSerializer(cart).data
        })
