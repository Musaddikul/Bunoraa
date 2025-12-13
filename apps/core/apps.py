# apps/core/apps.py
"""
Core App Configuration
"""
from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    label = 'core_app'
    verbose_name = 'Core'
    
    def ready(self):
        # Import signals
        pass
