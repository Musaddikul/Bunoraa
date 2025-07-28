# products/tasks.py
from celery import shared_task
from .models import Product
from .processors import ProductImageProcessor
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_product_image_async(self, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        logger.info(f"Starting image processing task for Product ID {product_id}.")

        processor = ProductImageProcessor(product)
        processor.process()

        logger.info(f"Completed image processing for Product ID {product_id}.")
    except Product.DoesNotExist:
        logger.error(f"Product with ID {product_id} does not exist.")
    except Exception as e:
        logger.warning(f"Retrying image processing for Product ID {product_id} due to error: {str(e)}")
        raise self.retry(exc=e)
