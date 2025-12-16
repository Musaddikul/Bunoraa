"""
Currency Signals
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache


@receiver(post_save, sender='currencies.Currency')
def invalidate_currency_cache(sender, instance, **kwargs):
    """Invalidate currency caches when currency is updated."""
    cache.delete('default_currency')
    cache.delete('active_currencies')
    cache.delete(f'currency_{instance.code}')


@receiver(post_save, sender='currencies.ExchangeRate')
def invalidate_exchange_rate_cache(sender, instance, **kwargs):
    """Invalidate exchange rate cache when rate is updated."""
    cache.delete(f'exchange_rate_{instance.from_currency.code}_{instance.to_currency.code}')
