# custom_order/apps.py
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class CustomOrderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'custom_order'
    verbose_name = _('Custom Order Management')

    def ready(self):
        # Import signals here to ensure they are connected when Django starts
        # This prevents circular import issues if signals.py imports models or services
        import custom_order.signals
        # Ensure the signals are connected only once
        # (Django's AppConfig.ready() is called once per app load)
