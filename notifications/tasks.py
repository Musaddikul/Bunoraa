# notifications/tasks.py
from celery import shared_task
from .models import Notification
import time

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_notification_task(self, notification_id):
    """
    Celery task to send a single notification.
    Includes retries for transient errors.
    """
    try:
        notif = Notification.objects.get(pk=notification_id)
        
        # Mock sending logic - replace with actual provider integration
        print(f"Sending {notif.channel} notification to {notif.user}: {notif.title}")
        time.sleep(2) # Simulate network latency
        
        # For now, we'll just mark it as delivered.
        # In a real implementation, this would be based on the provider's response.
        notif.mark_delivered()
        
    except Notification.DoesNotExist:
        # If the notification has been deleted, don't retry.
        return
        
    except Exception as exc:
        # Retry for other exceptions (e.g., network issues)
        raise self.retry(exc=exc)