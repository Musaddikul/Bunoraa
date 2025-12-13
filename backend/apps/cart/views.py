# apps/cart/views.py
"""
Views for shopping cart.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemCreateSerializer,
    CartItemUpdateSerializer,
    ApplyCouponSerializer,
)
from .services import CartService


class CartView(APIView):
    """
    GET: Get current cart
    DELETE: Clear cart
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        cart = CartService.get_or_create_cart(request)
        serializer = CartSerializer(cart)
        
        return Response({
            'success': True,
            'message': 'Cart retrieved successfully',
            'data': serializer.data,
            'meta': None
        })
    
    def delete(self, request):
        cart = CartService.get_or_create_cart(request)
        cart.clear()
        
        return Response({
            'success': True,
            'message': 'Cart cleared successfully',
            'data': CartSerializer(cart).data,
            'meta': None
        })


class CartItemsView(APIView):
    """
    POST: Add item to cart
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = CartService.get_or_create_cart(request)
        item = CartService.add_item(
            cart=cart,
            product=serializer.validated_data['product'],
            variant=serializer.validated_data.get('variant'),
            quantity=serializer.validated_data['quantity']
        )
        
        return Response({
            'success': True,
            'message': 'Item added to cart',
            'data': {
                'item': CartItemSerializer(item).data,
                'cart': CartSerializer(cart).data
            },
            'meta': None
        }, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    """
    PATCH: Update item quantity
    DELETE: Remove item from cart
    """
    permission_classes = [permissions.AllowAny]
    
    def patch(self, request, item_id):
        cart = CartService.get_or_create_cart(request)
        
        try:
            item = cart.items.get(pk=item_id)
        except CartItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found in cart',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartItemUpdateSerializer(
            data=request.data,
            context={'item': item}
        )
        serializer.is_valid(raise_exception=True)
        
        quantity = serializer.validated_data['quantity']
        
        if quantity == 0:
            item.delete()
            message = 'Item removed from cart'
        else:
            item.quantity = quantity
            item.save()
            message = 'Item quantity updated'
        
        return Response({
            'success': True,
            'message': message,
            'data': CartSerializer(cart).data,
            'meta': None
        })
    
    def delete(self, request, item_id):
        cart = CartService.get_or_create_cart(request)
        
        try:
            item = cart.items.get(pk=item_id)
        except CartItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found in cart',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        item.delete()
        
        return Response({
            'success': True,
            'message': 'Item removed from cart',
            'data': CartSerializer(cart).data,
            'meta': None
        })


class ApplyCouponView(APIView):
    """Apply a coupon to the cart."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        cart = CartService.get_or_create_cart(request)
        
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        from apps.promotions.models import Coupon
        try:
            coupon = Coupon.objects.get(code__iexact=serializer.validated_data['code'])
            
            # Check minimum purchase
            if coupon.minimum_purchase and cart.subtotal < coupon.minimum_purchase:
                return Response({
                    'success': False,
                    'message': f'Minimum purchase of ${coupon.minimum_purchase} required',
                    'data': None,
                    'meta': None
                }, status=status.HTTP_400_BAD_REQUEST)
            
            cart.coupon = coupon
            cart.save()
            
            return Response({
                'success': True,
                'message': 'Coupon applied successfully',
                'data': CartSerializer(cart).data,
                'meta': None
            })
            
        except Coupon.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid coupon code',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)


class RemoveCouponView(APIView):
    """Remove coupon from cart."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        cart = CartService.get_or_create_cart(request)
        cart.coupon = None
        cart.save()
        
        return Response({
            'success': True,
            'message': 'Coupon removed',
            'data': CartSerializer(cart).data,
            'meta': None
        })


class CartCountView(APIView):
    """Get cart item count (lightweight endpoint for header display)."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        cart = CartService.get_or_create_cart(request)
        
        return Response({
            'success': True,
            'message': 'Cart count retrieved',
            'data': {
                'count': cart.item_count,
                'total': str(cart.total)
            },
            'meta': None
        })
