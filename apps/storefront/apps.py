# apps/storefront/apps.py
"""
Storefront Application Configuration
"""
from django.apps import AppConfig


class StorefrontConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.storefront'
    verbose_name = 'Storefront'
    
    def ready(self):
        try:
            import apps.storefront.signals  # noqa
        except ImportError:
            pass
