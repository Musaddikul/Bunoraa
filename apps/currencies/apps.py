"""
Currencies App Configuration
"""
from django.apps import AppConfig


class CurrenciesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.currencies'
    verbose_name = 'Currencies'
    
    def ready(self):
        import importlib
        importlib.import_module('apps.currencies.signals')
