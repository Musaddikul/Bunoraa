"""
Wishlist API Views
"""
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from ..models import WishlistItem
from ..services import WishlistService, WishlistShareService, WishlistNotificationService
from .serializers import (
    WishlistSerializer, WishlistItemSerializer, AddToWishlistSerializer,
    UpdateWishlistItemSerializer, MoveToCartSerializer, WishlistShareSerializer,
    CreateShareSerializer, WishlistNotificationSerializer,
    CheckWishlistSerializer
)


class WishlistViewSet(ViewSet):
    """API endpoint for user's wishlist."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get user's wishlist with all items."""
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        serializer = WishlistSerializer(wishlist)
        
        return Response({
            'success': True,
            'message': 'Wishlist retrieved',
            'data': serializer.data
        })
    
    def create(self, request):
        """Add item to wishlist."""
        serializer = AddToWishlistSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Get product
        from apps.products.models import Product, ProductVariant
        try:
            product = Product.objects.get(id=data['product_id'], is_active=True)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Product not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        variant = None
        if data.get('variant_id'):
            try:
                variant = ProductVariant.objects.get(id=data['variant_id'], product=product)
            except ProductVariant.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Variant not found',
                    'data': None
                }, status=status.HTTP_404_NOT_FOUND)
        
        item, created = WishlistService.add_item(
            user=request.user,
            product=product,
            variant=variant,
            notes=data.get('notes', ''),
            notify_preferences={
                'notify_on_sale': data.get('notify_on_sale', True),
                'notify_on_restock': data.get('notify_on_restock', True),
                'notify_on_price_drop': data.get('notify_on_price_drop', True),
            }
        )
        
        return Response({
            'success': True,
            'message': 'Item added to wishlist' if created else 'Item already in wishlist',
            'data': WishlistItemSerializer(item).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        """Remove item from wishlist."""
        success = WishlistService.remove_item(request.user, pk)
        
        if success:
            return Response({
                'success': True,
                'message': 'Item removed from wishlist',
                'data': None
            })
        
        return Response({
            'success': False,
            'message': 'Item not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        """Update wishlist item."""
        serializer = UpdateWishlistItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        
        try:
            item = wishlist.items.get(id=pk)
            
            if 'notes' in data:
                item.notes = data['notes']
            if 'notify_on_sale' in data:
                item.notify_on_sale = data['notify_on_sale']
            if 'notify_on_restock' in data:
                item.notify_on_restock = data['notify_on_restock']
            if 'notify_on_price_drop' in data:
                item.notify_on_price_drop = data['notify_on_price_drop']
            
            item.save()
            
            return Response({
                'success': True,
                'message': 'Item updated',
                'data': WishlistItemSerializer(item).data
            })
        except WishlistItem.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Item not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def move_to_cart(self, request, pk=None):
        """Move wishlist item to cart."""
        serializer = MoveToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        success = WishlistService.move_to_cart(
            request.user, pk, serializer.validated_data['quantity']
        )
        
        if success:
            return Response({
                'success': True,
                'message': 'Item moved to cart',
                'data': None
            })
        
        return Response({
            'success': False,
            'message': 'Item not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from wishlist."""
        deleted = WishlistService.clear_wishlist(request.user)
        
        return Response({
            'success': True,
            'message': f'{deleted} item(s) removed',
            'data': {'deleted_count': deleted}
        })
    
    @action(detail=False, methods=['post'])
    def check(self, request):
        """Check if products are in wishlist."""
        serializer = CheckWishlistSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        product_ids = serializer.validated_data['product_ids']
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        
        in_wishlist = set(
            str(item.product_id)
            for item in wishlist.items.filter(product_id__in=product_ids)
        )
        
        results = {
            str(pid): str(pid) in in_wishlist
            for pid in product_ids
        }
        
        return Response({
            'success': True,
            'message': 'Wishlist check complete',
            'data': results
        })
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get wishlist item count."""
        count = WishlistService.get_wishlist_count(request.user)
        
        return Response({
            'success': True,
            'message': 'Count retrieved',
            'data': {'count': count}
        })
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get items that are on sale."""
        items = WishlistService.get_on_sale_items(request.user)
        
        return Response({
            'success': True,
            'message': f'{len(items)} item(s) on sale',
            'data': WishlistItemSerializer(items, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def price_changes(self, request):
        """Get items with price changes."""
        items = WishlistService.get_items_with_price_changes(request.user)
        
        return Response({
            'success': True,
            'message': f'{len(items)} item(s) with price changes',
            'data': WishlistItemSerializer(items, many=True).data
        })


class WishlistShareViewSet(ViewSet):
    """API endpoint for wishlist sharing."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get all shares for user's wishlist."""
        shares = WishlistShareService.get_user_shares(request.user)
        serializer = WishlistShareSerializer(
            shares, many=True, context={'request': request}
        )
        
        return Response({
            'success': True,
            'message': 'Shares retrieved',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a shareable link."""
        serializer = CreateShareSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        share = WishlistShareService.create_share(
            user=request.user,
            expires_in_days=data.get('expires_in_days'),
            allow_purchase=data.get('allow_purchase', False)
        )
        
        return Response({
            'success': True,
            'message': 'Share link created',
            'data': WishlistShareSerializer(share, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, pk=None):
        """Revoke a share."""
        success = WishlistShareService.revoke_share(request.user, pk)
        
        if success:
            return Response({
                'success': True,
                'message': 'Share revoked',
                'data': None
            })
        
        return Response({
            'success': False,
            'message': 'Share not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)


class SharedWishlistView(APIView):
    """Public endpoint for viewing shared wishlists."""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """View a shared wishlist."""
        wishlist, share = WishlistShareService.get_shared_wishlist(token)
        
        if not wishlist:
            return Response({
                'success': False,
                'message': 'Invalid or expired share link',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'Shared wishlist retrieved',
            'data': {
                'wishlist': WishlistSerializer(wishlist).data,
                'share_info': {
                    'allow_purchase': share.allow_purchase,
                    'expires_at': share.expires_at
                }
            }
        })


class WishlistNotificationViewSet(ViewSet):
    """API endpoint for wishlist notifications."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get all notifications."""
        unread_only = request.query_params.get('unread') == 'true'
        notifications = WishlistNotificationService.get_user_notifications(
            request.user, unread_only=unread_only
        )
        serializer = WishlistNotificationSerializer(notifications, many=True)
        
        return Response({
            'success': True,
            'message': 'Notifications retrieved',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """Mark notification as read."""
        success = WishlistNotificationService.mark_notification_read(request.user, pk)
        
        if success:
            return Response({
                'success': True,
                'message': 'Notification marked as read',
                'data': None
            })
        
        return Response({
            'success': False,
            'message': 'Notification not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def read_all(self, request):
        """Mark all notifications as read."""
        count = WishlistNotificationService.mark_all_read(request.user)
        
        return Response({
            'success': True,
            'message': f'{count} notification(s) marked as read',
            'data': {'count': count}
        })
