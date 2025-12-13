# apps/accounts/signals.py
"""
Signals for accounts app.
"""
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from .tasks import send_welcome_email

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def user_created_handler(sender, instance, created, **kwargs):
    """Handle new user creation."""
    if created:
        # Send welcome email (async)
        try:
            send_welcome_email.delay(str(instance.id))
        except Exception as e:
            # If Celery broker is not available, log and skip
            logger.warning(f"Could not queue welcome email for user {instance.email}: {e}")
