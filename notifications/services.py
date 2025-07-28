# notifications/services.py
import json
from django.template import Template, Context
from django.core.exceptions import PermissionDenied
from django.conf import settings
from django.utils import timezone
from .models import (
    Notification, NotificationTemplate, NotificationPreference, NotificationChannel
)
from .selectors import get_unread_count

# Celery task stub (should live in tasks.py)
def send_notification_task(notification_id):
    from .models import Notification
    notif = Notification.objects.get(pk=notification_id)
    # integrate with external providers here (email/SMS/push)
    notif.mark_delivered()

def send_notification(user, notif_type, context, channels=None, priority=0, link=None, payload=None):
    """
    Create & queue notification(s) for a user.
    """
    prefs = NotificationPreference.objects.filter(
        user=user, notif_type=notif_type
    )
    for pref in prefs:
        if not pref.enabled:
            continue
        ch = pref.channel
        if channels and ch not in channels:
            continue

        tmpl = NotificationTemplate.objects.filter(
            notif_type=notif_type, channel=ch
        ).first()
        subject = body = ''
        if tmpl:
            # render templates
            subject = Template(tmpl.subject).render(Context(context))
            body_html = Template(tmpl.body_html).render(Context(context))
            body_plain = Template(tmpl.body_plain or tmpl.body_html).render(Context(context))
        else:
            # fallback
            subject = context.get('title','Notification')
            body_html = body_plain = context.get('message','')

        notif = Notification.objects.create(
            user=user,
            template=tmpl,
            notif_type=notif_type,
            channel=ch,
            title=subject,
            message=body_html,
            link=link or context.get('link',''),
            payload=payload or {},
            priority=priority
        )
        # enqueue send
        from .tasks import send_notification_task
        send_notification_task.delay(notif.id)

    # invalidate unread count cache
    cache_key = f"notif_unread_count_{user.pk}"
    from django.core.cache import cache
    cache.delete(cache_key)
