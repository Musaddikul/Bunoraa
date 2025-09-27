
from celery import shared_task
from .models import Currency
from .services import ExchangeRateService

@shared_task
def update_exchange_rates():
    """
    Celery task to update exchange rates for all active currencies.
    """
    service = ExchangeRateService()
    default_currency = Currency.objects.filter(is_default=True).first()
    
    if not default_currency:
        # Log or handle the case where no default currency is set
        return

    rates, error = service.get_exchange_rates(base_currency=default_currency.code)

    if error:
        # Log or handle the error
        return

    for currency in Currency.objects.filter(is_active=True):
        if currency.code in rates:
            currency.exchange_rate = rates[currency.code]
            currency.save()
