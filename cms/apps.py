# cms/apps.py
from django.apps import AppConfig

class CmsConfig(AppConfig):
    name = "cms"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        # hook cache invalidation on save/delete
        import cms.signals  # noqa
