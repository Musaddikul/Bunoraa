# wishlist/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Wishlist

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_wishlist(sender, instance, created, **kwargs):
    """
    Signal receiver to create a Wishlist object for a new user upon registration.
    Ensures every user has an associated wishlist.
    """
    if created:
        Wishlist.objects.get_or_create(user=instance)

