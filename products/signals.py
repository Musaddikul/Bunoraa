# products/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from django.conf import settings
from products.models import Product
from products.tasks import process_product_image_async

@receiver(post_save, sender=Product)
def process_new_product_async(sender, instance, created, **kwargs):
    if created and getattr(settings, 'AUTO_PROCESS_PRODUCTS', False):
        process_product_image_async.delay(instance.pk)

        # Avoid recursion
        from django.db.models.signals import post_save
        post_save.disconnect(process_new_product_async, sender=Product)
        instance.processing_status = 'processing'
        instance.save(update_fields=['processing_status'])
        post_save.connect(process_new_product_async, sender=Product)
