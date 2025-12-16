"""
Localization App Configuration
"""
from django.apps import AppConfig


class LocalizationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.localization'
    verbose_name = 'Localization'
    
    def ready(self):
        import importlib
        importlib.import_module('apps.localization.signals')
