# apps/accounts/signals.py
"""
Account Signals
Signal handlers for user-related events.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserSettings


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """Create UserSettings when a new user is created."""
    if created:
        UserSettings.objects.get_or_create(user=instance)
