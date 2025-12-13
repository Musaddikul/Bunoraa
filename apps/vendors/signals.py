# apps/vendors/signals.py
"""
Vendor Signals
Signal handlers for vendor-related events.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Vendor, VendorSettings


@receiver(post_save, sender=Vendor)
def create_vendor_settings(sender, instance, created, **kwargs):
    """Create VendorSettings when a new vendor is created."""
    if created:
        VendorSettings.objects.get_or_create(vendor=instance)
