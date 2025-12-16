"""
FAQ Signals
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import FAQCategory, FAQQuestion


@receiver(post_save, sender=FAQCategory)
def category_saved(sender, instance, **kwargs):
    """Clear cache when category is saved."""
    cache.delete('faq_active_categories')


@receiver(post_delete, sender=FAQCategory)
def category_deleted(sender, instance, **kwargs):
    """Clear cache when category is deleted."""
    cache.delete('faq_active_categories')


@receiver(post_save, sender=FAQQuestion)
def question_saved(sender, instance, **kwargs):
    """Clear cache when question is saved."""
    cache.delete('faq_active_categories')
    # Clear featured cache for multiple limits
    for limit in [5, 10, 15, 20]:
        cache.delete(f'faq_featured_{limit}')


@receiver(post_delete, sender=FAQQuestion)
def question_deleted(sender, instance, **kwargs):
    """Clear cache when question is deleted."""
    cache.delete('faq_active_categories')
    for limit in [5, 10, 15, 20]:
        cache.delete(f'faq_featured_{limit}')
