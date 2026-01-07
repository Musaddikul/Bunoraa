"""
Commerce API Views
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from ..models import (
    Cart, CartItem, Wishlist, WishlistItem, WishlistShare,
    CheckoutSession
)
from ..services import CartService, WishlistService, CheckoutService
from .serializers import (
    CartSerializer, CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    ApplyCouponSerializer,
    WishlistSerializer, WishlistItemSerializer, AddToWishlistSerializer,
    WishlistShareSerializer, CreateWishlistShareSerializer,
    CheckoutSessionSerializer, CheckoutShippingInfoSerializer,
    CheckoutShippingMethodSerializer, CheckoutPaymentMethodSerializer
)


# =============================================================================
# Permission Classes
# =============================================================================

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow owners to edit, others to read."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


# =============================================================================
# Cart ViewSet
# =============================================================================

class CartViewSet(viewsets.ViewSet):
    """ViewSet for cart operations."""
    
    permission_classes = [permissions.AllowAny]
    
    def _get_cart(self, request):
        """Get cart for current user/session."""
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        return CartService.get_or_create_cart(user=user, session_key=session_key)
    
    def list(self, request):
        """Get current cart."""
        cart = self._get_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add(self, request):
        """Add item to cart."""
        from apps.catalog.models import Product, ProductVariant
        
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            product = Product.objects.get(
                id=serializer.validated_data['product_id'],
                is_active=True,
                is_deleted=False
            )
            
            variant = None
            if serializer.validated_data.get('variant_id'):
                variant = ProductVariant.objects.get(id=serializer.validated_data['variant_id'])
            
            cart = self._get_cart(request)
            item = CartService.add_item(
                cart=cart,
                product=product,
                quantity=serializer.validated_data['quantity'],
                variant=variant
            )
            
            return Response({
                'success': True,
                'message': f'{product.name} added to cart',
                'item': CartItemSerializer(item, context={'request': request}).data,
                'cart': CartSerializer(cart, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
            
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='update/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """Update cart item quantity."""
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            cart = self._get_cart(request)
            item = CartService.update_item_quantity(
                cart=cart,
                item_id=item_id,
                quantity=serializer.validated_data['quantity']
            )
            
            return Response({
                'success': True,
                'message': 'Cart updated',
                'cart': CartSerializer(cart, context={'request': request}).data
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='remove/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        """Remove item from cart."""
        cart = self._get_cart(request)
        removed = CartService.remove_item(cart, item_id)
        
        if removed:
            return Response({
                'success': True,
                'message': 'Item removed',
                'cart': CartSerializer(cart, context={'request': request}).data
            })
        
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from cart."""
        cart = self._get_cart(request)
        CartService.clear_cart(cart)
        
        return Response({
            'success': True,
            'message': 'Cart cleared',
            'cart': CartSerializer(cart, context={'request': request}).data
        })
    
    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        """Apply coupon to cart."""
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            cart = self._get_cart(request)
            CartService.apply_coupon(cart, serializer.validated_data['coupon_code'])
            
            return Response({
                'success': True,
                'message': 'Coupon applied',
                'cart': CartSerializer(cart, context={'request': request}).data
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def remove_coupon(self, request):
        """Remove coupon from cart."""
        cart = self._get_cart(request)
        CartService.remove_coupon(cart)
        
        return Response({
            'success': True,
            'message': 'Coupon removed',
            'cart': CartSerializer(cart, context={'request': request}).data
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get cart summary."""
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if cart:
            return Response(CartService.get_cart_summary(cart))
        
        return Response({
            'items': [],
            'item_count': 0,
            'subtotal': '0',
            'discount_amount': '0',
            'total': '0',
            'coupon_code': None,
            'currency': 'BDT'
        })


# =============================================================================
# Wishlist ViewSet
# =============================================================================

class WishlistViewSet(viewsets.ViewSet):
    """ViewSet for wishlist operations."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Get current user's wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add(self, request):
        """Add item to wishlist."""
        from apps.catalog.models import Product, ProductVariant
        
        serializer = AddToWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            product = Product.objects.get(
                id=serializer.validated_data['product_id'],
                is_active=True,
                is_deleted=False
            )
            
            variant = None
            if serializer.validated_data.get('variant_id'):
                variant = ProductVariant.objects.get(id=serializer.validated_data['variant_id'])
            
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            item = WishlistService.add_item(
                wishlist=wishlist,
                product=product,
                variant=variant,
                notes=serializer.validated_data.get('notes', '')
            )
            
            return Response({
                'success': True,
                'message': f'{product.name} added to wishlist',
                'item': WishlistItemSerializer(item, context={'request': request}).data,
                'wishlist': WishlistSerializer(wishlist, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
            
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='remove/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        """Remove item from wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        removed = WishlistService.remove_item(wishlist, item_id)
        
        if removed:
            return Response({
                'success': True,
                'message': 'Item removed',
                'wishlist': WishlistSerializer(wishlist, context={'request': request}).data
            })
        
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='move-to-cart/(?P<item_id>[^/.]+)')
    def move_to_cart(self, request, item_id=None):
        """Move wishlist item to cart."""
        try:
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            item = wishlist.items.get(id=item_id)
            
            if not request.session.session_key:
                request.session.create()
            
            cart = CartService.get_or_create_cart(
                user=request.user,
                session_key=request.session.session_key
            )
            
            cart_item = WishlistService.move_to_cart(item, cart)
            
            return Response({
                'success': True,
                'message': 'Item moved to cart',
                'wishlist': WishlistSerializer(wishlist, context={'request': request}).data,
                'cart': CartSerializer(cart, context={'request': request}).data
            })
            
        except WishlistItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def share(self, request):
        """Create shareable wishlist link."""
        serializer = CreateWishlistShareSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        share = WishlistService.create_share_link(
            wishlist,
            expires_days=serializer.validated_data['expires_days'],
            allow_purchase=serializer.validated_data['allow_purchase']
        )
        
        return Response({
            'success': True,
            'share': WishlistShareSerializer(share, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def price_drops(self, request):
        """Get items with price drops."""
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        items = WishlistService.get_items_with_price_drops(wishlist)
        
        return Response({
            'items': WishlistItemSerializer(items, many=True, context={'request': request}).data
        })
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle product in wishlist."""
        from apps.catalog.models import Product
        
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            
            existing = wishlist.items.filter(product=product).first()
            
            if existing:
                WishlistService.remove_item(wishlist, existing.id)
                return Response({
                    'success': True,
                    'in_wishlist': False,
                    'message': 'Removed from wishlist'
                })
            else:
                WishlistService.add_item(wishlist, product)
                return Response({
                    'success': True,
                    'in_wishlist': True,
                    'message': 'Added to wishlist'
                })
                
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


class SharedWishlistView(APIView):
    """View a shared wishlist."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, token):
        """Get shared wishlist by token."""
        wishlist = WishlistService.get_shared_wishlist(token)
        
        if not wishlist:
            return Response({'error': 'Wishlist not found or expired'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'wishlist': WishlistSerializer(wishlist, context={'request': request}).data
        })


# =============================================================================
# Checkout ViewSet
# =============================================================================

class CheckoutViewSet(viewsets.ViewSet):
    """ViewSet for checkout operations."""
    
    permission_classes = [permissions.AllowAny]
    
    def _get_checkout_session(self, request):
        """Get or create checkout session."""
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart or not cart.items.exists():
            return None
        
        return CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key,
            request=request
        )
    
    def list(self, request):
        """Get current checkout session."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({'error': 'No active cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            CheckoutSessionSerializer(checkout_session, context={'request': request}).data
        )
    
    @action(detail=False, methods=['post'])
    def shipping_info(self, request):
        """Update shipping information."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({'error': 'No active cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CheckoutShippingInfoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        CheckoutService.update_shipping_info(checkout_session, serializer.validated_data)
        
        return Response({
            'success': True,
            'message': 'Shipping information saved',
            'checkout': CheckoutSessionSerializer(checkout_session, context={'request': request}).data
        })
    
    @action(detail=False, methods=['post'])
    def shipping_method(self, request):
        """Select shipping method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({'error': 'No active cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CheckoutShippingMethodSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        CheckoutService.select_shipping_method(
            checkout_session,
            serializer.validated_data['shipping_method']
        )
        
        return Response({
            'success': True,
            'message': 'Shipping method selected',
            'checkout': CheckoutSessionSerializer(checkout_session, context={'request': request}).data
        })
    
    @action(detail=False, methods=['post'])
    def payment_method(self, request):
        """Select payment method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({'error': 'No active cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CheckoutPaymentMethodSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        CheckoutService.select_payment_method(
            checkout_session,
            serializer.validated_data['payment_method']
        )
        
        return Response({
            'success': True,
            'message': 'Payment method selected',
            'checkout': CheckoutSessionSerializer(checkout_session, context={'request': request}).data
        })
    
    @action(detail=False, methods=['post'])
    def complete(self, request):
        """Complete checkout and place order."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({'error': 'No active cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = CheckoutService.complete_checkout(checkout_session)
            
            # Return basic order info - clients should use orders API for full details
            return Response({
                'success': True,
                'message': 'Order placed successfully',
                'order_number': order.order_number,
                'order_id': str(order.id),
                'total': str(order.total),
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
