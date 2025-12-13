# apps/products/signals.py
"""
Signals for products app.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Product


@receiver(pre_save, sender=Product)
def product_pre_save(sender, instance, **kwargs):
    """Handle product pre-save operations."""
    # Auto-generate meta title if not set
    if not instance.meta_title:
        instance.meta_title = instance.name[:150]
    
    # Auto-generate meta description if not set
    if not instance.meta_description:
        if instance.short_description:
            instance.meta_description = instance.short_description
        elif instance.description:
            # Strip HTML and truncate
            import re
            clean_text = re.sub(r'<[^>]+>', '', instance.description)
            instance.meta_description = clean_text[:300]


@receiver(post_save, sender=Product)
def product_post_save(sender, instance, created, **kwargs):
    """Handle product post-save operations."""
    if created:
        # Log analytics event for new product
        from apps.analytics.services import AnalyticsService
        try:
            AnalyticsService.track_event(
                event_type='product_created',
                data={'product_id': str(instance.id)}
            )
        except Exception:
            pass  # Don't fail on analytics error
