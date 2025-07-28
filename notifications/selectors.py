# notifications/selectors.py
from django.core.cache import cache
from .models import Notification

CACHE_TTL = 60  # sec

def get_recent_notifications(user, limit=50):
    qs = Notification.objects.filter(user=user).order_by('-created_at')[:limit]
    return list(qs)

def get_unread_count(user):
    cache_key = f"notif_unread_count_{user.pk}"
    count = cache.get(cache_key)
    if count is None:
        count = Notification.objects.filter(user=user, is_read=False).count()
        cache.set(cache_key, count, CACHE_TTL)
    return count

def get_notifications_grouped_by_date(user):
    """
    Returns notifications in a dict keyed by YYYY-MM-DD.
    """
    qs = Notification.objects.filter(user=user).order_by('-created_at')
    grouped = {}
    for n in qs:
        date = n.created_at.date().isoformat()
        grouped.setdefault(date, []).append(n)
    return grouped
