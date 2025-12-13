# apps/reviews/signals.py
"""
Review signals.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review


@receiver(post_save, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    """Update product average rating when review is saved."""
    if instance.status == Review.Status.APPROVED:
        product = instance.product
        # Trigger recalculation (handled in product model)
        product.update_rating_cache()


@receiver(post_delete, sender=Review)
def update_product_rating_on_delete(sender, instance, **kwargs):
    """Update product average rating when review is deleted."""
    product = instance.product
    product.update_rating_cache()
