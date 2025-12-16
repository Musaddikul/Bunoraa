"""
Cart API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from ..models import Cart, CartItem
from ..services import CartService
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
    ApplyCouponSerializer,
)


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet for cart operations.
    
    Endpoints:
    - GET /api/v1/cart/ - Get current cart
    - POST /api/v1/cart/add/ - Add item to cart
    - PATCH /api/v1/cart/items/{item_id}/ - Update item quantity
    - DELETE /api/v1/cart/items/{item_id}/ - Remove item from cart
    - POST /api/v1/cart/coupon/ - Apply coupon
    - DELETE /api/v1/cart/coupon/ - Remove coupon
    - GET /api/v1/cart/validate/ - Validate cart for checkout
    - DELETE /api/v1/cart/clear/ - Clear cart
    """
    permission_classes = [AllowAny]
    
    def _get_cart(self, request):
        """Get or create cart for current user/session."""
        if request.user.is_authenticated:
            return CartService.get_or_create_cart(user=request.user)
        
        # Ensure session exists
        if not request.session.session_key:
            request.session.create()
        
        return CartService.get_or_create_cart(session_key=request.session.session_key)
    
    def list(self, request):
        """Get current cart."""
        cart = self._get_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        
        return Response({
            'success': True,
            'message': 'Cart retrieved successfully',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='add')
    def add_item(self, request):
        """Add item to cart."""
        serializer = AddToCartSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart = self._get_cart(request)
        product = serializer.context['product']
        variant = serializer.context.get('variant')
        quantity = serializer.validated_data.get('quantity', 1)
        
        cart_item = CartService.add_item(
            cart=cart,
            product=product,
            variant=variant,
            quantity=quantity
        )
        
        return Response({
            'success': True,
            'message': f'{product.name} added to cart',
            'data': {
                'item': CartItemSerializer(cart_item, context={'request': request}).data,
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['patch'], url_path='items/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """Update cart item quantity."""
        cart = self._get_cart(request)
        
        try:
            cart_item = cart.items.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Cart item not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateCartItemSerializer(
            data=request.data,
            context={'cart_item': cart_item, 'request': request}
        )
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        quantity = serializer.validated_data['quantity']
        updated_item = CartService.update_item_quantity(cart, cart_item.id, quantity)
        
        # Refresh cart
        cart.refresh_from_db()
        
        response_payload = {
            'success': True,
            'message': 'Cart updated',
            'data': {
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        }

        if updated_item:
            response_payload['data']['item'] = CartItemSerializer(
                updated_item,
                context={'request': request}
            ).data
        
        return Response(response_payload)

    @update_item.mapping.delete
    def remove_item(self, request, item_id=None):
        """Remove item from cart."""
        cart = self._get_cart(request)
        
        try:
            cart_item = cart.items.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Cart item not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        product_name = cart_item.product.name
        CartService.remove_item(cart, cart_item.id)
        
        # Refresh cart
        cart.refresh_from_db()
        
        return Response({
            'success': True,
            'message': f'{product_name} removed from cart',
            'data': {
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        })
    
    @action(detail=False, methods=['post'], url_path='coupon')
    def apply_coupon(self, request):
        """Apply coupon to cart."""
        serializer = ApplyCouponSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid coupon',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart = self._get_cart(request)
        coupon = serializer.context['coupon']
        
        success, message = CartService.apply_coupon(cart, coupon)
        
        if not success:
            return Response({
                'success': False,
                'message': message,
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Refresh cart
        cart.refresh_from_db()
        
        return Response({
            'success': True,
            'message': message,
            'data': {
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        })
    
    @apply_coupon.mapping.delete
    def remove_coupon(self, request):
        """Remove coupon from cart."""
        cart = self._get_cart(request)
        
        if cart.coupon:
            cart.coupon = None
            cart.save()
        
        return Response({
            'success': True,
            'message': 'Coupon removed',
            'data': {
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        })
    
    @action(detail=False, methods=['get'], url_path='validate')
    def validate(self, request):
        """Validate cart for checkout."""
        cart = self._get_cart(request)
        issues = CartService.validate_cart(cart)
        
        return Response({
            'success': True,
            'message': 'Cart validated',
            'data': {
                'is_valid': len(issues) == 0,
                'issues': issues,
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        })
    
    @action(detail=False, methods=['delete'], url_path='clear')
    def clear(self, request):
        """Clear all items from cart."""
        cart = self._get_cart(request)
        cart.items.all().delete()
        cart.coupon = None
        cart.save()
        
        return Response({
            'success': True,
            'message': 'Cart cleared',
            'data': {
                'cart': CartSerializer(cart, context={'request': request}).data
            }
        })
    
    @action(detail=False, methods=['post'], url_path='merge')
    def merge_carts(self, request):
        """
        Merge session cart into user cart after login.
        Called automatically after authentication.
        """
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'Authentication required',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        session_key = request.session.session_key
        if not session_key:
            return Response({
                'success': True,
                'message': 'No session cart to merge',
                'data': None
            })
        
        # Get session cart
        session_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
        
        if not session_cart or not session_cart.items.exists():
            return Response({
                'success': True,
                'message': 'No items to merge',
                'data': None
            })
        
        # Get or create user cart
        user_cart = CartService.get_or_create_cart(user=request.user)
        
        # Merge items
        for item in session_cart.items.all():
            existing_item = user_cart.items.filter(
                product=item.product,
                variant=item.variant
            ).first()
            
            if existing_item:
                # Update quantity
                new_quantity = existing_item.quantity + item.quantity
                CartService.update_item_quantity(existing_item, new_quantity)
            else:
                # Move item to user cart
                item.cart = user_cart
                item.save()
        
        # Delete session cart
        session_cart.delete()
        
        return Response({
            'success': True,
            'message': 'Cart merged successfully',
            'data': {
                'cart': CartSerializer(user_cart, context={'request': request}).data
            }
        })
