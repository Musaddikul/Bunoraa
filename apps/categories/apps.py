from django.apps import AppConfig


class CategoriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.categories'

    def ready(self):
        # import signals if used later
        pass
    verbose_name = 'Product Categories'
