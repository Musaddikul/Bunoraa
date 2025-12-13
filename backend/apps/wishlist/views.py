# apps/wishlist/views.py
"""
Wishlist views.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Wishlist, WishlistItem
from .serializers import (
    WishlistSerializer,
    WishlistItemSerializer,
    WishlistItemCreateSerializer,
    WishlistItemUpdateSerializer,
)
from apps.products.models import Product, ProductVariant


class WishlistView(APIView):
    """
    GET: Get user's wishlist
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        
        return Response({
            'success': True,
            'message': 'Wishlist retrieved',
            'data': serializer.data,
            'meta': None
        })


class WishlistItemsView(APIView):
    """
    POST: Add item to wishlist
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = WishlistItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        
        product_id = serializer.validated_data['product_id']
        variant_id = serializer.validated_data.get('variant_id')
        
        product = Product.objects.get(id=product_id)
        variant = None
        if variant_id:
            variant = ProductVariant.objects.get(id=variant_id)
        
        # Check if already in wishlist
        existing = wishlist.items.filter(product=product, variant=variant).first()
        if existing:
            return Response({
                'success': False,
                'message': 'Product already in wishlist',
                'data': WishlistItemSerializer(existing).data,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add to wishlist
        item = WishlistItem.objects.create(
            wishlist=wishlist,
            product=product,
            variant=variant,
            notify_price_drop=serializer.validated_data.get('notify_price_drop', False),
            notify_back_in_stock=serializer.validated_data.get('notify_back_in_stock', False)
        )
        
        return Response({
            'success': True,
            'message': 'Product added to wishlist',
            'data': WishlistItemSerializer(item).data,
            'meta': {'item_count': wishlist.item_count}
        }, status=status.HTTP_201_CREATED)


class WishlistItemDetailView(APIView):
    """
    PATCH: Update item notifications
    DELETE: Remove item from wishlist
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, item_id):
        try:
            item = WishlistItem.objects.get(
                id=item_id,
                wishlist__user=request.user
            )
        except WishlistItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found in wishlist',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = WishlistItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if 'notify_price_drop' in serializer.validated_data:
            item.notify_price_drop = serializer.validated_data['notify_price_drop']
        if 'notify_back_in_stock' in serializer.validated_data:
            item.notify_back_in_stock = serializer.validated_data['notify_back_in_stock']
        
        item.save()
        
        return Response({
            'success': True,
            'message': 'Wishlist item updated',
            'data': WishlistItemSerializer(item).data,
            'meta': None
        })
    
    def delete(self, request, item_id):
        try:
            item = WishlistItem.objects.get(
                id=item_id,
                wishlist__user=request.user
            )
        except WishlistItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found in wishlist',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        item.delete()
        
        wishlist = Wishlist.objects.get(user=request.user)
        
        return Response({
            'success': True,
            'message': 'Item removed from wishlist',
            'data': None,
            'meta': {'item_count': wishlist.item_count}
        })


class WishlistCheckView(APIView):
    """Check if product is in wishlist."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, product_id):
        try:
            wishlist = Wishlist.objects.get(user=request.user)
            in_wishlist = wishlist.items.filter(product_id=product_id).exists()
        except Wishlist.DoesNotExist:
            in_wishlist = False
        
        return Response({
            'success': True,
            'message': 'Check complete',
            'data': {'in_wishlist': in_wishlist},
            'meta': None
        })


class WishlistClearView(APIView):
    """Clear all items from wishlist."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.items.all().delete()
        
        return Response({
            'success': True,
            'message': 'Wishlist cleared',
            'data': None,
            'meta': None
        })


class WishlistMoveToCartView(APIView):
    """Move wishlist item to cart."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, item_id):
        try:
            item = WishlistItem.objects.get(
                id=item_id,
                wishlist__user=request.user
            )
        except WishlistItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found in wishlist',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Add to cart
        from apps.cart.services import CartService
        cart = CartService.get_or_create_cart(request)
        
        cart_item = CartService.add_item(
            cart=cart,
            product=item.product,
            variant=item.variant,
            quantity=1
        )
        
        # Remove from wishlist
        item.delete()
        
        return Response({
            'success': True,
            'message': 'Item moved to cart',
            'data': {
                'cart_item_id': str(cart_item.id),
                'cart_count': cart.item_count
            },
            'meta': None
        })
