# legal/apps.py
from django.apps import AppConfig

class LegalConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "legal"

    # def ready(self):
    #     import legal.signals  # hook policy update notifications
