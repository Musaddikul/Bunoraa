"""
Wishlist App Configuration
"""
from django.apps import AppConfig


class WishlistConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.wishlist'
    verbose_name = 'Wishlist'
    
    def ready(self):
        import importlib
        importlib.import_module('apps.wishlist.signals')
