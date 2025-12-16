"""
Localization Signals
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Language, Timezone, Country, LocalizationSettings


@receiver(post_save, sender=Language)
def language_saved(sender, instance, **kwargs):
    """Clear language cache when language is saved."""
    cache.delete('active_languages')
    cache.delete('default_language')
    cache.delete(f'language_{instance.code}')


@receiver(post_delete, sender=Language)
def language_deleted(sender, instance, **kwargs):
    """Clear language cache when language is deleted."""
    cache.delete('active_languages')
    cache.delete('default_language')
    cache.delete(f'language_{instance.code}')


@receiver(post_save, sender=Timezone)
def timezone_saved(sender, instance, **kwargs):
    """Clear timezone cache when timezone is saved."""
    cache.delete('all_timezones')
    cache.delete('common_timezones')


@receiver(post_delete, sender=Timezone)
def timezone_deleted(sender, instance, **kwargs):
    """Clear timezone cache when timezone is deleted."""
    cache.delete('all_timezones')
    cache.delete('common_timezones')


@receiver(post_save, sender=Country)
def country_saved(sender, instance, **kwargs):
    """Clear country cache when country is saved."""
    cache.delete('all_countries')
    cache.delete('shipping_countries')


@receiver(post_delete, sender=Country)
def country_deleted(sender, instance, **kwargs):
    """Clear country cache when country is deleted."""
    cache.delete('all_countries')
    cache.delete('shipping_countries')


@receiver(post_save, sender=LocalizationSettings)
def settings_saved(sender, instance, **kwargs):
    """Clear settings cache when settings are saved."""
    cache.delete('localization_settings')
