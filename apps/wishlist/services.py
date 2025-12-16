"""
Wishlist Services
"""
import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache

from .models import Wishlist, WishlistItem, WishlistShare, WishlistNotification


class WishlistService:
    """Service for wishlist operations."""
    
    @staticmethod
    def get_or_create_wishlist(user):
        """Get or create a wishlist for a user."""
        wishlist, created = Wishlist.objects.get_or_create(user=user)
        return wishlist
    
    @staticmethod
    def get_wishlist_items(user, include_unavailable=False):
        """Get all items in user's wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        items = wishlist.items.select_related('product', 'variant')
        
        if not include_unavailable:
            items = items.filter(product__is_active=True)
        
        return items
    
    @staticmethod
    def add_item(user, product, variant=None, notes='', notify_preferences=None):
        """Add an item to the wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        # Check if already exists
        existing = wishlist.items.filter(product=product, variant=variant).first()
        if existing:
            # Update notes if provided
            if notes:
                existing.notes = notes
                existing.save(update_fields=['notes'])
            return existing, False
        
        # Create new item
        item_data = {
            'wishlist': wishlist,
            'product': product,
            'variant': variant,
            'notes': notes,
        }
        
        if notify_preferences:
            item_data.update({
                'notify_on_sale': notify_preferences.get('notify_on_sale', True),
                'notify_on_restock': notify_preferences.get('notify_on_restock', True),
                'notify_on_price_drop': notify_preferences.get('notify_on_price_drop', True),
            })
        
        item = WishlistItem.objects.create(**item_data)
        
        # Invalidate cache
        cache.delete(f'wishlist_count_{user.id}')
        
        return item, True
    
    @staticmethod
    def remove_item(user, item_id):
        """Remove an item from the wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            item = wishlist.items.get(id=item_id)
            item.delete()
            
            # Invalidate cache
            cache.delete(f'wishlist_count_{user.id}')
            
            return True
        except WishlistItem.DoesNotExist:
            return False
    
    @staticmethod
    def remove_item_by_product(user, product_id, variant_id=None):
        """Remove item by product ID."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        filters = {'product_id': product_id}
        if variant_id:
            filters['variant_id'] = variant_id
        
        deleted, _ = wishlist.items.filter(**filters).delete()
        
        if deleted:
            cache.delete(f'wishlist_count_{user.id}')
        
        return deleted > 0
    
    @staticmethod
    def clear_wishlist(user):
        """Remove all items from wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        deleted, _ = wishlist.items.all().delete()
        
        cache.delete(f'wishlist_count_{user.id}')
        
        return deleted
    
    @staticmethod
    def is_in_wishlist(user, product_id, variant_id=None):
        """Check if product is in user's wishlist."""
        cache_key = f'wishlist_check_{user.id}_{product_id}_{variant_id}'
        cached = cache.get(cache_key)
        
        if cached is not None:
            return cached
        
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        filters = {'product_id': product_id}
        if variant_id:
            filters['variant_id'] = variant_id
        
        exists = wishlist.items.filter(**filters).exists()
        cache.set(cache_key, exists, 300)  # Cache for 5 minutes
        
        return exists
    
    @staticmethod
    def get_wishlist_count(user):
        """Get count of items in wishlist."""
        cache_key = f'wishlist_count_{user.id}'
        count = cache.get(cache_key)
        
        if count is None:
            wishlist = WishlistService.get_or_create_wishlist(user)
            count = wishlist.items.filter(product__is_active=True).count()
            cache.set(cache_key, count, 300)
        
        return count
    
    @staticmethod
    def update_item_notes(user, item_id, notes):
        """Update notes for a wishlist item."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            item = wishlist.items.get(id=item_id)
            item.notes = notes
            item.save(update_fields=['notes'])
            return item
        except WishlistItem.DoesNotExist:
            return None
    
    @staticmethod
    def update_notification_preferences(user, item_id, preferences):
        """Update notification preferences for a wishlist item."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            item = wishlist.items.get(id=item_id)
            
            if 'notify_on_sale' in preferences:
                item.notify_on_sale = preferences['notify_on_sale']
            if 'notify_on_restock' in preferences:
                item.notify_on_restock = preferences['notify_on_restock']
            if 'notify_on_price_drop' in preferences:
                item.notify_on_price_drop = preferences['notify_on_price_drop']
            
            item.save()
            return item
        except WishlistItem.DoesNotExist:
            return None
    
    @staticmethod
    def move_to_cart(user, item_id, quantity=1):
        """Move wishlist item to cart."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            item = wishlist.items.get(id=item_id)
            
            # Add to cart
            from apps.cart.services import CartService
            CartService.add_item(
                user=user,
                product_id=str(item.product.id),
                quantity=quantity,
                variant_id=str(item.variant.id) if item.variant else None
            )
            
            # Remove from wishlist
            item.delete()
            cache.delete(f'wishlist_count_{user.id}')
            
            return True
        except WishlistItem.DoesNotExist:
            return False
    
    @staticmethod
    def get_items_with_price_changes(user):
        """Get items that have price changes."""
        items = WishlistService.get_wishlist_items(user)
        return [item for item in items if item.price_change != 0]
    
    @staticmethod
    def get_out_of_stock_items(user):
        """Get out of stock items."""
        items = WishlistService.get_wishlist_items(user)
        return [item for item in items if not item.is_in_stock]
    
    @staticmethod
    def get_on_sale_items(user):
        """Get items that are on sale."""
        items = WishlistService.get_wishlist_items(user)
        return [item for item in items if item.is_on_sale]


class WishlistShareService:
    """Service for sharing wishlists."""
    
    @staticmethod
    def create_share(user, expires_in_days=None, allow_purchase=False):
        """Create a shareable link for user's wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        share = WishlistShare.objects.create(
            wishlist=wishlist,
            share_token=secrets.token_urlsafe(32),
            allow_purchase=allow_purchase,
            expires_at=timezone.now() + timedelta(days=expires_in_days) if expires_in_days else None
        )
        
        return share
    
    @staticmethod
    def get_shared_wishlist(token):
        """Get wishlist by share token."""
        try:
            share = WishlistShare.objects.select_related('wishlist').get(
                share_token=token,
                is_active=True
            )
            
            if not share.is_valid:
                return None, None
            
            share.record_view()
            return share.wishlist, share
        except WishlistShare.DoesNotExist:
            return None, None
    
    @staticmethod
    def revoke_share(user, share_id):
        """Revoke a wishlist share."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            share = wishlist.shares.get(id=share_id)
            share.is_active = False
            share.save(update_fields=['is_active'])
            return True
        except WishlistShare.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_shares(user):
        """Get all shares for user's wishlist."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        return wishlist.shares.filter(is_active=True)


class WishlistNotificationService:
    """Service for wishlist notifications."""
    
    @staticmethod
    def check_price_drops():
        """Check for price drops on wishlist items and create notifications."""
        from apps.products.models import Product
        
        items = WishlistItem.objects.filter(
            notify_on_price_drop=True,
            product__is_active=True
        ).select_related('product', 'wishlist__user')
        
        notifications_created = 0
        
        for item in items:
            current_price = item.current_price
            
            if item.price_at_add and current_price < item.price_at_add:
                # Price has dropped
                price_drop = item.price_at_add - current_price
                percentage = (price_drop / item.price_at_add) * 100
                
                # Check if we already notified about this price
                existing = WishlistNotification.objects.filter(
                    wishlist_item=item,
                    notification_type='price_drop',
                    new_price=current_price
                ).exists()
                
                if not existing:
                    WishlistNotification.objects.create(
                        wishlist_item=item,
                        notification_type='price_drop',
                        message=f"{item.product.name} price dropped by {percentage:.0f}%!",
                        old_price=item.price_at_add,
                        new_price=current_price
                    )
                    notifications_created += 1
        
        return notifications_created
    
    @staticmethod
    def check_back_in_stock():
        """Check for items back in stock."""
        items = WishlistItem.objects.filter(
            notify_on_restock=True,
            product__is_active=True
        ).select_related('product', 'wishlist__user')
        
        notifications_created = 0
        
        for item in items:
            if item.is_in_stock:
                # Check if we recently notified
                recent = WishlistNotification.objects.filter(
                    wishlist_item=item,
                    notification_type='back_in_stock',
                    created_at__gte=timezone.now() - timedelta(days=1)
                ).exists()
                
                if not recent:
                    # Check if item was out of stock before
                    prev_out_of_stock = WishlistNotification.objects.filter(
                        wishlist_item=item,
                        notification_type='back_in_stock'
                    ).exists() or item.notification_count == 0
                    
                    if prev_out_of_stock:
                        WishlistNotification.objects.create(
                            wishlist_item=item,
                            notification_type='back_in_stock',
                            message=f"{item.product.name} is back in stock!"
                        )
                        notifications_created += 1
        
        return notifications_created
    
    @staticmethod
    def check_sales():
        """Check for items on sale."""
        items = WishlistItem.objects.filter(
            notify_on_sale=True,
            product__is_active=True,
            product__sale_price__isnull=False
        ).select_related('product', 'wishlist__user')
        
        notifications_created = 0
        
        for item in items:
            if item.is_on_sale:
                # Check if we already notified about this sale
                existing = WishlistNotification.objects.filter(
                    wishlist_item=item,
                    notification_type='sale',
                    new_price=item.product.sale_price
                ).exists()
                
                if not existing:
                    discount = item.product.price - item.product.sale_price
                    percentage = (discount / item.product.price) * 100
                    
                    WishlistNotification.objects.create(
                        wishlist_item=item,
                        notification_type='sale',
                        message=f"{item.product.name} is on sale - {percentage:.0f}% off!",
                        old_price=item.product.price,
                        new_price=item.product.sale_price
                    )
                    notifications_created += 1
        
        return notifications_created
    
    @staticmethod
    def get_user_notifications(user, unread_only=False):
        """Get notifications for a user."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        notifications = WishlistNotification.objects.filter(
            wishlist_item__wishlist=wishlist
        ).select_related('wishlist_item__product')
        
        if unread_only:
            notifications = notifications.filter(is_read=False)
        
        return notifications
    
    @staticmethod
    def mark_notification_read(user, notification_id):
        """Mark a notification as read."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        try:
            notification = WishlistNotification.objects.get(
                id=notification_id,
                wishlist_item__wishlist=wishlist
            )
            notification.mark_as_read()
            return True
        except WishlistNotification.DoesNotExist:
            return False
    
    @staticmethod
    def mark_all_read(user):
        """Mark all notifications as read."""
        wishlist = WishlistService.get_or_create_wishlist(user)
        
        updated = WishlistNotification.objects.filter(
            wishlist_item__wishlist=wishlist,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        
        return updated
