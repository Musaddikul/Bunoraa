from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = 'Products'
    
    def ready(self):
        import apps.products.signals  # noqa
        # Ensure image fields use the current default storage (S3 or local) at runtime.
        try:
            from django.conf import settings as _settings
            from django.utils.module_loading import import_string
            from .models import ProductImage, ProductVariant
            storage_path = getattr(_settings, 'DEFAULT_FILE_STORAGE', None)
            from django.core.files.storage import FileSystemStorage
            media_root = getattr(_settings, 'MEDIA_ROOT', None)
            media_url = getattr(_settings, 'MEDIA_URL', None)

            if storage_path:
                storage_cls = import_string(storage_path)
                # If the configured storage is a filesystem storage, pass MEDIA_ROOT
                try:
                    cls_name = storage_cls.__name__.lower()
                except Exception:
                    cls_name = ''
                if 'filesystemstorage' in cls_name or storage_cls is FileSystemStorage:
                    # instantiate with MEDIA_ROOT if available
                    if media_root:
                        storage_instance = storage_cls(location=media_root, base_url=media_url)
                    else:
                        storage_instance = storage_cls()
                else:
                    storage_instance = storage_cls()
            else:
                # Fall back to FileSystemStorage using MEDIA_ROOT
                storage_instance = FileSystemStorage(location=media_root, base_url=media_url)

            ProductImage._meta.get_field('image').storage = storage_instance
            ProductVariant._meta.get_field('image').storage = storage_instance
        except Exception:
            # If models are not yet ready or fields don't exist, ignore silently
            pass
