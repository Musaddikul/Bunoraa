# analytics/tasks.py
from celery import shared_task
from .services import compute_daily_metrics
from datetime import datetime, timedelta

@shared_task
def daily_metrics_task(date_str=None):
    """
    Should be scheduled via Celery Beat at 00:30 each day.
    """
    compute_daily_metrics(date_str=date_str)
