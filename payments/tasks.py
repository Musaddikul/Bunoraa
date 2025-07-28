# payments/tasks.py
import uuid
from celery import shared_task
import logging
from django.core.exceptions import ValidationError
import json

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_webhook_async(self, gateway_code: str, payload_data: dict, gateway_event_id: str = None):
    """
    Asynchronously processes an incoming payment gateway webhook.
    Retries on failure.

    Args:
        gateway_code (str): The code of the payment method's gateway.
        payload_data (dict): The raw JSON payload from the webhook.
        gateway_event_id (str, optional): The unique ID of the event from the gateway.
    """
    from .services import handle_payment_webhook # Import inside task to avoid circular imports at app startup
    try:
        logger.info(f"Processing webhook asynchronously for gateway {gateway_code}, event ID {gateway_event_id or 'N/A'}")
        handle_payment_webhook(gateway_code, payload_data, gateway_event_id)
        logger.info(f"Webhook for gateway {gateway_code}, event ID {gateway_event_id or 'N/A'} processed successfully.")
    except ValidationError as e:
        logger.error(f"Validation error processing webhook for {gateway_code}, event ID {gateway_event_id or 'N/A'}: {e.message}")
        # Do not retry for validation errors, as they indicate bad data
    except Exception as e:
        logger.error(f"Error processing webhook for {gateway_code}, event ID {gateway_event_id or 'N/A'}: {e}", exc_info=True)
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.critical(f"Max retries exceeded for webhook processing for {gateway_code}, event ID {gateway_event_id or 'N/A'}. Manual intervention required.")

@shared_task(bind=True, max_retries=3, default_retry_delay=300)
def fetch_payment_status_async(self, payment_id: uuid.UUID):
    """
    Asynchronously fetches the latest status of a payment from the gateway.
    Retries on failure.

    Args:
        payment_id (uuid.UUID): The UUID of the Payment object to check.
    """
    from .services import verify_payment_status_with_gateway
    from .models import Payment
    try:
        payment = Payment.objects.get(id=payment_id)
        logger.info(f"Fetching status asynchronously for payment {payment_id}.")
        verify_payment_status_with_gateway(payment)
        logger.info(f"Status for payment {payment_id} updated successfully.")
    except Payment.DoesNotExist:
        logger.warning(f"Payment {payment_id} not found for async status fetch. Skipping.")
    except Exception as e:
        logger.error(f"Error fetching status for payment {payment_id}: {e}", exc_info=True)
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.critical(f"Max retries exceeded for payment status fetch for {payment_id}. Manual intervention required.")

