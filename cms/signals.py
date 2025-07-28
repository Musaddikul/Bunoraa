# cms/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Banner, Page, ContentBlock, SiteSetting
from .services import invalidate_cms_cache

@receiver([post_save, post_delete], sender=Banner)
def clear_banner_cache(sender, instance, **kwargs):
    invalidate_cms_cache()

@receiver([post_save, post_delete], sender=SiteSetting)
def clear_settings_cache(sender, instance, **kwargs):
    invalidate_cms_cache()

@receiver(post_save, sender=Page)
def clear_page_cache_on_save(sender, instance, **kwargs):
    invalidate_cms_cache(slug=instance.slug)

@receiver(post_delete, sender=Page)
def clear_page_cache_on_delete(sender, instance, **kwargs):
    invalidate_cms_cache(slug=instance.slug)
