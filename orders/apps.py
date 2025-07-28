# orders/apps.py
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _
import logging

logger = logging.getLogger(__name__)

class OrdersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "orders"
    verbose_name = _("Order Management")

    def ready(self):
        logger.info("Initializing Orders app...")
        try:
            from . import signals  # Connects the signals
            self._customize_admin()
            self._setup_tasks()
        except Exception as e:
            logger.error(f"Error during Orders app initialization: {e}")

    def _customize_admin(self):
        try:
            from django.contrib import admin
            # Assuming these are custom admin actions you've defined
            # from .admin_extras import export_orders_csv, sync_with_erp
            # admin.site.add_action(export_orders_csv)
            # admin.site.add_action(sync_with_erp)
            logger.info("Admin extras for Orders app loaded.")
        except ImportError:
            logger.info("Admin extras not available, skipping.")

    def _setup_tasks(self):
        try:
            import celery
            logger.info("Celery detected, tasks for Orders app will be available.")
        except ImportError:
            logger.info("Celery not installed, asynchronous tasks for Orders will not be available.")