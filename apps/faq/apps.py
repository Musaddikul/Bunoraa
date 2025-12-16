"""
FAQ App Configuration
"""
from django.apps import AppConfig


class FaqConfig(AppConfig):
    """FAQ app configuration."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.faq'
    verbose_name = 'FAQ'
    
    def ready(self):
        """Import signals when app is ready."""
        try:
            import importlib
            importlib.import_module('apps.faq.signals')
        except ImportError:
            pass
