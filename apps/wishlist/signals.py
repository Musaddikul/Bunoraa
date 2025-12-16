"""
Wishlist Signals
"""
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.cache import cache


@receiver(post_save, sender='wishlist.WishlistItem')
def invalidate_wishlist_cache(sender, instance, **kwargs):
    """Invalidate wishlist count cache when item is added/updated."""
    if instance.wishlist and instance.wishlist.user:
        cache.delete(f'wishlist_count_{instance.wishlist.user.id}')
        cache.delete(f'wishlist_check_{instance.wishlist.user.id}_{instance.product_id}_{instance.variant_id}')


@receiver(pre_delete, sender='wishlist.WishlistItem')
def invalidate_wishlist_cache_on_delete(sender, instance, **kwargs):
    """Invalidate wishlist count cache when item is removed."""
    if instance.wishlist and instance.wishlist.user:
        cache.delete(f'wishlist_count_{instance.wishlist.user.id}')
        cache.delete(f'wishlist_check_{instance.wishlist.user.id}_{instance.product_id}_{instance.variant_id}')
