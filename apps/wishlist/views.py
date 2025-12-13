# apps/wishlist/views.py
"""
Wishlist Views
"""
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.products.models import Product, ProductVariant
from .models import Wishlist, WishlistItem
from .serializers import (
    WishlistSerializer, WishlistListSerializer,
    WishlistItemSerializer, AddToWishlistSerializer
)


class WishlistViewSet(viewsets.ModelViewSet):
    """
    User wishlists.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return WishlistListSerializer
        return WishlistSerializer
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).prefetch_related('items__product')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """Get default wishlist."""
        wishlist = self.get_queryset().filter(is_default=True).first()
        if not wishlist:
            wishlist = Wishlist.objects.create(
                user=request.user,
                name='My Wishlist',
                is_default=True
            )
        return Response(WishlistSerializer(wishlist).data)


class WishlistItemView(generics.GenericAPIView):
    """
    Add/remove items from wishlist.
    """
    serializer_class = AddToWishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Add item to wishlist."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get or create default wishlist
        wishlist_id = serializer.validated_data.get('wishlist_id')
        if wishlist_id:
            wishlist = get_object_or_404(Wishlist, pk=wishlist_id, user=request.user)
        else:
            wishlist, _ = Wishlist.objects.get_or_create(
                user=request.user,
                is_default=True,
                defaults={'name': 'My Wishlist'}
            )
        
        product = get_object_or_404(Product, pk=serializer.validated_data['product_id'])
        variant = None
        if serializer.validated_data.get('variant_id'):
            variant = get_object_or_404(ProductVariant, pk=serializer.validated_data['variant_id'])
        
        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product,
            variant=variant,
            defaults={'notes': serializer.validated_data.get('notes', '')}
        )
        
        return Response({
            'message': 'Added to wishlist' if created else 'Already in wishlist',
            'created': created,
            'item': WishlistItemSerializer(item).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    def delete(self, request):
        """Remove item from wishlist."""
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        wishlist_id = request.data.get('wishlist_id')
        
        filters = {
            'wishlist__user': request.user,
            'product_id': product_id,
        }
        if variant_id:
            filters['variant_id'] = variant_id
        if wishlist_id:
            filters['wishlist_id'] = wishlist_id
        
        deleted, _ = WishlistItem.objects.filter(**filters).delete()
        
        return Response({
            'message': 'Removed from wishlist' if deleted else 'Item not found',
            'deleted': deleted > 0
        })


class CheckWishlistView(generics.GenericAPIView):
    """
    Check if product is in wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, product_id):
        """Check if product is wishlisted."""
        in_wishlist = WishlistItem.objects.filter(
            wishlist__user=request.user,
            product_id=product_id
        ).exists()
        
        return Response({'in_wishlist': in_wishlist})


class MoveToCartView(generics.GenericAPIView):
    """
    Move wishlist item to cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, item_id):
        """Move item to cart."""
        item = get_object_or_404(
            WishlistItem,
            pk=item_id,
            wishlist__user=request.user
        )
        
        from apps.carts.services import CartService
        
        cart = CartService.get_or_create_cart(request)
        cart.add_item(item.product, item.variant, 1)
        
        # Optionally remove from wishlist
        if request.data.get('remove_from_wishlist', True):
            item.delete()
        
        return Response({'message': 'Added to cart'})
