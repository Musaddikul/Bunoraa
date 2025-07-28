# shipping/apps.py
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class ShippingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shipping'
    verbose_name = _('Shipping Management')

    def ready(self):
        # Import signals here to ensure they are registered
        # import shipping.signals # Uncomment if you add specific signals to shipping app
        pass