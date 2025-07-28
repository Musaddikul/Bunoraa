# promotions/apps.py
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class PromotionsConfig(AppConfig):
    """
    Application configuration for the 'promotions' app.
    Defines the default auto field and verbose name for the app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'promotions'
    verbose_name = _('Promotions & Coupons')

