"""
Currency Tasks
"""
from celery import shared_task


@shared_task
def update_exchange_rates():
    """Update exchange rates from configured provider."""
    from .services import ExchangeRateUpdateService
    
    count = ExchangeRateUpdateService.update_rates()
    return f"Updated {count} exchange rates"


@shared_task
def cleanup_old_exchange_rates():
    """Clean up old inactive exchange rates."""
    from datetime import timedelta
    from django.utils import timezone
    from .models import ExchangeRate
    
    # Delete inactive rates older than 30 days
    cutoff = timezone.now() - timedelta(days=30)
    deleted, _ = ExchangeRate.objects.filter(
        is_active=False,
        updated_at__lt=cutoff
    ).delete()
    
    return f"Deleted {deleted} old exchange rates"


@shared_task
def cleanup_old_rate_history():
    """Clean up old exchange rate history."""
    from datetime import timedelta
    from django.utils import timezone
    from .models import ExchangeRateHistory
    
    # Keep last 365 days of history
    cutoff = (timezone.now() - timedelta(days=365)).date()
    deleted, _ = ExchangeRateHistory.objects.filter(date__lt=cutoff).delete()
    
    return f"Deleted {deleted} old history records"
