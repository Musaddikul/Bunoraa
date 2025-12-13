# apps/vendors/apps.py
"""
Vendors App Configuration
"""
from django.apps import AppConfig


class VendorsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.vendors'
    label = 'vendors'
    verbose_name = 'Vendors'
    
    def ready(self):
        from . import signals  # noqa
