# apps/products/signals.py
"""
Product Signals
Signal handlers for product-related events.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from .models import Product, ProductImage


@receiver(post_save, sender=Product)
def update_product_search_vector(sender, instance, **kwargs):
    """Update search vector when product is saved."""
    # Avoid recursion
    if kwargs.get('update_fields') and 'search_vector' in kwargs['update_fields']:
        return
    
    Product.objects.filter(pk=instance.pk).update(
        search_vector=SearchVector('name', weight='A') +
                     SearchVector('short_description', weight='B') +
                     SearchVector('description', weight='C') +
                     SearchVector('sku', weight='A')
    )


@receiver(post_save, sender=ProductImage)
def ensure_primary_image(sender, instance, created, **kwargs):
    """Ensure product always has a primary image if images exist."""
    if not ProductImage.objects.filter(product=instance.product, is_primary=True).exists():
        first_image = ProductImage.objects.filter(product=instance.product).first()
        if first_image:
            first_image.is_primary = True
            first_image.save(update_fields=['is_primary'])


@receiver(post_delete, sender=ProductImage)
def reassign_primary_image(sender, instance, **kwargs):
    """Reassign primary image when primary is deleted."""
    if instance.is_primary:
        first_image = ProductImage.objects.filter(product=instance.product).first()
        if first_image:
            first_image.is_primary = True
            first_image.save(update_fields=['is_primary'])
