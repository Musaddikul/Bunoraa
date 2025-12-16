"""
Product signals
"""
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Product


@receiver(m2m_changed, sender=Product.categories.through)
def product_categories_changed(sender, instance, action, pk_set, **kwargs):
    """
    When a product is assigned to a category, also associate it with
    all ancestor categories.
    """
    if action == 'post_add' and pk_set:
        from apps.categories.models import Category
        
        ancestor_ids = set()
        for category_id in pk_set:
            try:
                category = Category.objects.get(pk=category_id)
                for ancestor in category.get_ancestors():
                    ancestor_ids.add(ancestor.id)
            except Category.DoesNotExist:
                pass
        
        # Add ancestor categories (this won't trigger the signal again for existing ones)
        if ancestor_ids:
            instance.categories.add(*ancestor_ids)


@receiver(post_save, sender=Product)
def product_post_save(sender, instance, created, **kwargs):
    """Handle product creation/update."""
    if created:
        # Track analytics event
        pass
