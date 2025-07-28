# payments/services.py
import uuid
from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
import logging

from .models import Payment, PaymentMethod, PaymentStatus, Refund, PaymentEvent
from .gateways import PaymentGatewayFactory
from custom_order.models import CustomOrder # Assuming CustomOrder is in custom_order app
from django.contrib.auth import get_user_model # To get the User model

logger = logging.getLogger(__name__)
User = get_user_model()

@transaction.atomic
def create_payment_intent(
    user: User,
    order: CustomOrder,
    amount: Decimal,
    payment_method_code: str,
    currency: str = 'BDT',
    is_test: bool = False,
    metadata: dict = None
) -> dict:
    """
    Creates a payment intent with the selected payment gateway.

    Args:
        user (User): The user initiating the payment.
        order (CustomOrder): The associated CustomOrder object.
        amount (Decimal): The amount for the payment.
        payment_method_code (str): The code of the chosen PaymentMethod.
        currency (str, optional): The currency code. Defaults to 'BDT'.
        is_test (bool, optional): Whether this is a test payment. Defaults to False.
        metadata (dict, optional): Additional metadata for the payment. Defaults to None.

    Returns:
        dict: A dictionary containing payment intent details from the gateway,
              including 'payment_intent_id', 'client_secret' (if applicable), 'redirect_url', 'status'.

    Raises:
        ValidationError: If the payment method is invalid or an error occurs with the gateway.
    """
    try:
        payment_method = PaymentMethod.objects.get(code=payment_method_code, is_active=True)
        gateway_client = PaymentGatewayFactory.get_client(payment_method_code)

        # Create a pending Payment record in your system
        payment = Payment.objects.create(
            user=user,
            order_id=str(order.order_id),
            method=payment_method,
            amount=amount,
            currency=currency,
            status=PaymentStatus.PENDING,
            is_test=is_test,
            metadata=metadata
        )
        logger.info(f"Payment record {payment.id} created for order {order.order_id} with status PENDING.")

        # Call gateway to create payment intent/session
        gateway_intent_response = gateway_client.create_payment_intent(
            amount=amount,
            currency=currency,
            order_id=str(order.order_id),
            user_id=str(user.id),
            metadata={'internal_payment_id': str(payment.id), **(metadata or {})}
        )

        if gateway_intent_response.get('success'):
            payment.payment_intent_id = gateway_intent_response.get('payment_intent_id')
            payment.gateway_reference = gateway_intent_response.get('gateway_reference') # Some gateways return this
            
            # Update status based on gateway's initial intent status
            gateway_status = gateway_intent_response.get('status')
            if gateway_status:
                if gateway_status == 'requires_action':
                    payment.status = PaymentStatus.REQUIRES_ACTION
                elif gateway_status == 'requires_payment_method':
                    payment.status = PaymentStatus.PENDING # Still waiting for client-side action
                elif gateway_status == 'created' or gateway_status == 'pending':
                    payment.status = PaymentStatus.PENDING
                elif gateway_status == 'authorized':
                    payment.status = PaymentStatus.AUTHORIZED
                elif gateway_status == 'succeeded': # Rare for initial intent, but possible
                    payment.status = PaymentStatus.COMPLETED
            
            payment.metadata = {**payment.metadata, 'gateway_intent_response': gateway_intent_response.get('raw_response')}
            payment.save(update_fields=['payment_intent_id', 'gateway_reference', 'status', 'metadata', 'updated_at'])
            
            logger.info(f"Payment intent for {payment.id} created successfully with gateway. Intent ID: {payment.payment_intent_id}")
            return {
                'payment_id': str(payment.id),
                'payment_intent_id': payment.payment_intent_id,
                'client_secret': gateway_intent_response.get('client_secret'), # For client-side confirmation
                'redirect_url': gateway_intent_response.get('redirect_url'), # For redirect-based gateways
                'status': payment.status,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'method_code': payment.method.code,
                'message': _('Payment intent created. Awaiting customer action.'),
                'raw_gateway_response': gateway_intent_response.get('raw_response')
            }
        else:
            error_message = gateway_intent_response.get('error_message', _("Unknown error from gateway during intent creation."))
            payment.status = PaymentStatus.FAILED
            payment.error_details = {'message': error_message, 'raw_response': gateway_intent_response.get('raw_response')}
            payment.save(update_fields=['status', 'error_details', 'updated_at'])
            logger.error(f"Payment intent creation failed for {payment.id}: {error_message}")
            raise ValidationError(_(f"Payment initiation failed: {error_message}"))

    except PaymentMethod.DoesNotExist:
        logger.error(f"Invalid payment method code provided: {payment_method_code}")
        raise ValidationError(_("Invalid payment method selected."))
    except ValidationError: # Re-raise ValidationErrors from gateway factory
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating payment intent for order {order.order_id}: {str(e)}", exc_info=True)
        raise ValidationError(_(f"An unexpected error occurred during payment initiation: {str(e)}"))

@transaction.atomic
def process_payment(
    payment: Payment,
    payment_data: dict = None, # Data from client-side confirmation (e.g., token, 3DS result)
    user: User = None # User performing the action, for auditing
) -> Payment:
    """
    Processes or confirms a payment intent with the selected payment gateway.
    This is typically called after the client-side interaction (e.g., 3D Secure, card input).

    Args:
        payment (Payment): The Payment object to process.
        payment_data (dict, optional): Gateway-specific data from client-side. Defaults to None.
        user (User, optional): The user performing the action. Defaults to None.

    Returns:
        Payment: The updated Payment object.

    Raises:
        ValidationError: If processing fails or payment is not in a valid state.
    """
    if payment.status not in [PaymentStatus.PENDING, PaymentStatus.REQUIRES_ACTION, PaymentStatus.AUTHORIZED]:
        raise ValidationError(_(f"Payment is in an invalid state for processing: {payment.get_status_display()}"))
    
    try:
        gateway_client = PaymentGatewayFactory.get_client(payment.method.code)

        # Update payment status to PROCESSING before calling gateway
        payment.status = PaymentStatus.PROCESSING
        payment.save(update_fields=['status', 'updated_at'])
        logger.info(f"Payment {payment.id} status set to PROCESSING for gateway call.")

        gateway_process_response = gateway_client.process_payment(
            payment_intent_id=payment.payment_intent_id,
            amount=payment.amount,
            currency=payment.currency,
            payment_data=payment_data
        )

        if gateway_process_response.get('success'):
            payment.transaction_id = gateway_process_response.get('transaction_id')
            payment.gateway_reference = gateway_process_response.get('gateway_reference', payment.gateway_reference)
            payment.is_verified = True # Assume success means verified from gateway
            
            gateway_status = gateway_process_response.get('status')
            if gateway_status == 'succeeded' or gateway_status == 'completed':
                payment.status = PaymentStatus.COMPLETED
                payment.completed_at = timezone.now()
                # If gateway supports two-step capture and this was a capture step
                if gateway_process_response.get('captured'):
                    payment.capture_status = True
            elif gateway_status == 'authorized':
                payment.status = PaymentStatus.AUTHORIZED
            elif gateway_status == 'requires_action':
                payment.status = PaymentStatus.REQUIRES_ACTION
            else:
                payment.status = PaymentStatus.PROCESSING # Keep processing if not final

            payment.metadata = {**payment.metadata, 'gateway_process_response': gateway_process_response.get('raw_response')}
            payment.save(update_fields=[
                'transaction_id', 'gateway_reference', 'status', 'is_verified',
                'completed_at', 'capture_status', 'metadata', 'updated_at'
            ])
            logger.info(f"Payment {payment.id} processed successfully. New status: {payment.status}")
            
            # Create a payment event for successful processing
            create_payment_event(
                payment=payment,
                event_type=f"payment.{payment.status}",
                payload=gateway_process_response.get('raw_response', {})
            )
            
            return payment
        else:
            error_message = gateway_process_response.get('error_message', _("Unknown error from gateway during processing."))
            payment.status = PaymentStatus.FAILED
            payment.error_details = {'message': error_message, 'raw_response': gateway_process_response.get('raw_response')}
            payment.save(update_fields=['status', 'error_details', 'updated_at'])
            logger.error(f"Payment {payment.id} processing failed: {error_message}")
            
            # Create a payment event for failed processing
            create_payment_event(
                payment=payment,
                event_type="payment.failed",
                payload=gateway_process_response.get('raw_response', {})
            )
            raise ValidationError(_(f"Payment processing failed: {error_message}"))

    except ValidationError:
        raise # Re-raise validation errors
    except Exception as e:
        logger.error(f"Unexpected error processing payment {payment.id}: {str(e)}", exc_info=True)
        payment.status = PaymentStatus.FAILED # Set to failed on unexpected error
        payment.error_details = {'message': str(e)}
        payment.save(update_fields=['status', 'error_details', 'updated_at'])
        raise ValidationError(_(f"An unexpected error occurred during payment processing: {str(e)}"))

@transaction.atomic
def capture_payment(payment: Payment, user: User = None) -> Payment:
    """
    Captures an authorized payment. This is for two-step payment flows.

    Args:
        payment (Payment): The Payment object to capture.
        user (User, optional): The user performing the action. Defaults to None.

    Returns:
        Payment: The updated Payment object.

    Raises:
        ValidationError: If payment is not in AUTHORIZED state or capture fails.
    """
    if payment.status != PaymentStatus.AUTHORIZED or payment.capture_status:
        raise ValidationError(_("Payment is not in an authorized state or has already been captured."))
    
    if not payment.transaction_id:
        raise ValidationError(_("Payment has no transaction ID to capture."))

    try:
        gateway_client = PaymentGatewayFactory.get_client(payment.method.code)
        
        # Call gateway to capture funds
        capture_response = gateway_client.process_payment( # Reusing process_payment for capture
            payment_intent_id=payment.payment_intent_id, # Or transaction_id, depending on gateway API
            amount=payment.amount,
            currency=payment.currency,
            payment_data={'action': 'capture'} # Indicate capture action
        )

        if capture_response.get('success'):
            payment.status = PaymentStatus.COMPLETED
            payment.capture_status = True
            payment.completed_at = timezone.now()
            payment.metadata = {**payment.metadata, 'gateway_capture_response': capture_response.get('raw_response')}
            payment.save(update_fields=['status', 'capture_status', 'completed_at', 'metadata', 'updated_at'])
            logger.info(f"Payment {payment.id} captured successfully.")
            
            create_payment_event(
                payment=payment,
                event_type="payment.captured",
                payload=capture_response.get('raw_response', {})
            )
            return payment
        else:
            error_message = capture_response.get('error_message', _("Unknown error during capture."))
            payment.error_details = {'message': error_message, 'raw_response': capture_response.get('raw_response')}
            payment.save(update_fields=['error_details', 'updated_at']) # Keep status as AUTHORIZED, but add error
            logger.error(f"Payment {payment.id} capture failed: {error_message}")
            raise ValidationError(_(f"Payment capture failed: {error_message}"))

    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error capturing payment {payment.id}: {str(e)}", exc_info=True)
        raise ValidationError(_(f"An unexpected error occurred during payment capture: {str(e)}"))

@transaction.atomic
def initiate_refund(
    payment: Payment,
    amount: Decimal,
    reason: str = "",
    user: User = None
) -> Refund:
    """
    Initiates a refund for a payment with the selected payment gateway.

    Args:
        payment (Payment): The Payment object to refund.
        amount (Decimal): The amount to refund.
        reason (str, optional): The reason for the refund. Defaults to "".
        user (User, optional): The user initiating the refund. Defaults to None.

    Returns:
        Refund: The created Refund object.

    Raises:
        ValidationError: If refund fails or payment is not in a refundable state.
    """
    if payment.status not in [PaymentStatus.COMPLETED, PaymentStatus.CAPTURED, PaymentStatus.PARTIALLY_REFUNDED]:
        raise ValidationError(_("Payment is not in a refundable status."))
    
    total_refunded = payment.refunds.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
    if amount <= 0 or (total_refunded + amount) > payment.amount:
        raise ValidationError(_(f"Invalid refund amount. Max refundable: {payment.amount - total_refunded}"))

    try:
        gateway_client = PaymentGatewayFactory.get_client(payment.method.code)

        # Create a pending Refund record
        refund = Refund.objects.create(
            payment=payment,
            amount=amount,
            status=Refund.RefundStatus.PENDING,
            reason=reason
        )
        logger.info(f"Refund record {refund.id} created for payment {payment.id} with status PENDING.")

        gateway_refund_response = gateway_client.initiate_refund(
            transaction_id=payment.transaction_id,
            amount=amount,
            reason=reason
        )

        if gateway_refund_response.get('success'):
            refund.refund_id = gateway_refund_response.get('refund_id')
            refund.status = Refund.RefundStatus.COMPLETED # Assume immediate completion for mock
            refund.gateway_response_data = gateway_refund_response.get('raw_response')
            refund.save(update_fields=['refund_id', 'status', 'gateway_response_data', 'updated_at'])
            
            # Update parent payment status
            if (total_refunded + amount) >= payment.amount:
                payment.status = PaymentStatus.REFUNDED
            else:
                payment.status = PaymentStatus.PARTIALLY_REFUNDED
            payment.save(update_fields=['status', 'updated_at'])
            
            logger.info(f"Refund {refund.id} for payment {payment.id} completed successfully.")
            
            create_payment_event(
                payment=payment,
                event_type="refund.succeeded",
                payload=gateway_refund_response.get('raw_response', {})
            )
            return refund
        else:
            error_message = gateway_refund_response.get('error_message', _("Unknown error during refund."))
            refund.status = Refund.RefundStatus.FAILED
            refund.gateway_response_data = gateway_refund_response.get('raw_response')
            refund.save(update_fields=['status', 'gateway_response_data', 'updated_at'])
            logger.error(f"Refund {refund.id} for payment {payment.id} failed: {error_message}")
            
            create_payment_event(
                payment=payment,
                event_type="refund.failed",
                payload=gateway_refund_response.get('raw_response', {})
            )
            raise ValidationError(_(f"Refund failed: {error_message}"))

    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error initiating refund for payment {payment.id}: {str(e)}", exc_info=True)
        raise ValidationError(_(f"An unexpected error occurred during refund initiation: {str(e)}"))

def verify_payment_status_with_gateway(payment: Payment) -> Payment:
    """
    Fetches the latest status of a payment directly from the payment gateway.

    Args:
        payment (Payment): The Payment object to verify.

    Returns:
        Payment: The updated Payment object.

    Raises:
        ValidationError: If verification fails or gateway API is not configured.
    """
    if not payment.payment_intent_id and not payment.transaction_id:
        raise ValidationError(_("Payment has no gateway reference to verify status."))
    
    try:
        gateway_client = PaymentGatewayFactory.get_client(payment.method.code)
        
        status_response = gateway_client.get_payment_status(
            payment_intent_id=payment.payment_intent_id,
            transaction_id=payment.transaction_id
        )

        if status_response.get('success'):
            gateway_status = status_response.get('status')
            if gateway_status and gateway_status != payment.status:
                payment.status = gateway_status
                payment.is_verified = status_response.get('is_verified', True) # Assume verified if successful status
                if payment.status in [PaymentStatus.COMPLETED, PaymentStatus.CAPTURED]:
                    payment.completed_at = timezone.now()
                payment.metadata = {**payment.metadata, 'gateway_status_check': status_response.get('raw_response')}
                payment.save(update_fields=['status', 'is_verified', 'completed_at', 'metadata', 'updated_at'])
                logger.info(f"Payment {payment.id} status updated to {payment.status} after gateway verification.")
                
                create_payment_event(
                    payment=payment,
                    event_type=f"status.verified.{payment.status}",
                    payload=status_response.get('raw_response', {})
                )
            return payment
        else:
            error_message = status_response.get('error_message', _("Unknown error during status verification."))
            logger.error(f"Failed to verify status for payment {payment.id}: {error_message}")
            raise ValidationError(_(f"Failed to verify payment status: {error_message}"))

    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error verifying payment status {payment.id}: {str(e)}", exc_info=True)
        raise ValidationError(_(f"An unexpected error occurred during status verification: {str(e)}"))

@transaction.atomic
def handle_payment_webhook(carrier_code: str, payload: dict, gateway_event_id: str = None) -> PaymentEvent:
    """
    Processes an incoming webhook event from a payment gateway.
    This function should be called by the webhook receiver view.

    Args:
        carrier_code (str): The code of the payment method's gateway (e.g., 'stripe', 'bkash').
        payload (dict): The raw JSON payload from the webhook.
        gateway_event_id (str, optional): The unique ID of the event from the gateway.
                                          Used to prevent duplicate processing.

    Returns:
        PaymentEvent: The created and processed PaymentEvent object.

    Raises:
        ValidationError: If the webhook cannot be processed (e.g., invalid event, duplicate).
    """
    if gateway_event_id and PaymentEvent.objects.filter(gateway_event_id=gateway_event_id).exists():
        logger.info(f"Duplicate webhook event received for ID: {gateway_event_id}. Skipping processing.")
        # Optionally, retrieve and return the existing event if needed
        raise ValidationError(_("Duplicate webhook event. Already processed."))

    try:
        # Attempt to find the payment method associated with the carrier_code
        payment_method = PaymentMethod.objects.filter(gateway_code=carrier_code, is_active=True).first()
        if not payment_method:
            logger.warning(f"Webhook received for unknown or inactive gateway code: {carrier_code}")
            raise ValidationError(_(f"Unknown or inactive gateway: {carrier_code}"))

        # Create a raw event record first
        payment_event = PaymentEvent.objects.create(
            event_type=payload.get('type', 'unknown'), # Or parse from payload based on gateway
            gateway_event_id=gateway_event_id,
            payload=payload,
            processed=False
        )
        logger.info(f"Raw webhook event {payment_event.id} recorded for gateway {carrier_code}.")

        # Determine the associated Payment object
        # This logic needs to be robust and gateway-specific
        payment = None
        if 'payment_intent' in payload and isinstance(payload['payment_intent'], dict):
            intent_id = payload['payment_intent'].get('id')
            payment = Payment.objects.filter(payment_intent_id=intent_id).first()
        elif 'data' in payload and 'object' in payload['data'] and 'id' in payload['data']['object']:
            # Common for Stripe-like structures where data.object is the main entity
            obj_id = payload['data']['object']['id']
            payment = Payment.objects.filter(
                models.Q(payment_intent_id=obj_id) | models.Q(transaction_id=obj_id)
            ).first()
        # Add more logic to find payment based on other payload keys (e.g., 'tran_id' for SSLCommerz)
        elif payload.get('tran_id'): # SSLCommerz
            payment = Payment.objects.filter(transaction_id=payload['tran_id']).first()
        elif payload.get('trxID'): # bKash
            payment = Payment.objects.filter(transaction_id=payload['trxID']).first()
        elif payload.get('paymentID'): # bKash intent
            payment = Payment.objects.filter(payment_intent_id=payload['paymentID']).first()

        if payment:
            payment_event.payment = payment
            payment_event.save(update_fields=['payment'])
            logger.info(f"Webhook event {payment_event.id} linked to payment {payment.id}.")
        else:
            logger.warning(f"Webhook event {payment_event.id} could not be linked to an existing payment. Payload: {payload}")
            # If payment cannot be linked, it might be an event for a new payment that needs to be created
            # or an event for a different system. For now, we just log.

        # Process the event and update payment status
        # This part will be highly dependent on the gateway's event types
        event_type = payload.get('type', '').lower()

        if payment:
            current_payment_status = payment.status # Get current status before update

            if 'charge.succeeded' in event_type or 'payment_intent.succeeded' in event_type or payload.get('status') == 'VALID':
                if payment.status != PaymentStatus.COMPLETED:
                    payment.status = PaymentStatus.COMPLETED
                    payment.is_verified = True
                    payment.completed_at = timezone.now()
                    payment.transaction_id = payload.get('data', {}).get('object', {}).get('id', payment.transaction_id) # Stripe-like
                    # Add other gateway-specific transaction ID parsing
                    if payload.get('tran_id'): # SSLCommerz
                        payment.transaction_id = payload['tran_id']
                    elif payload.get('trxID'): # bKash
                        payment.transaction_id = payload['trxID']
                    payment.metadata = {**payment.metadata, 'latest_webhook_payload': payload}
                    payment.save(update_fields=['status', 'is_verified', 'completed_at', 'transaction_id', 'metadata', 'updated_at'])
                    logger.info(f"Payment {payment.id} status updated to COMPLETED via webhook.")
            
            elif 'charge.failed' in event_type or 'payment_intent.payment_failed' in event_type or payload.get('status') == 'FAILED':
                if payment.status != PaymentStatus.FAILED:
                    payment.status = PaymentStatus.FAILED
                    payment.error_details = {'webhook_error': payload}
                    payment.metadata = {**payment.metadata, 'latest_webhook_payload': payload}
                    payment.save(update_fields=['status', 'error_details', 'metadata', 'updated_at'])
                    logger.info(f"Payment {payment.id} status updated to FAILED via webhook.")

            elif 'charge.refunded' in event_type or 'refund.succeeded' in event_type:
                refund_amount = Decimal(str(payload.get('data', {}).get('object', {}).get('amount', '0'))) / 100 # Stripe amount is in cents
                refund_id = payload.get('data', {}).get('object', {}).get('id')
                # Find or create refund record
                refund_obj = Refund.objects.filter(refund_id=refund_id, payment=payment).first()
                if not refund_obj:
                    refund_obj = Refund.objects.create(
                        payment=payment,
                        refund_id=refund_id,
                        amount=refund_amount,
                        status=Refund.RefundStatus.COMPLETED,
                        reason=_("Refund initiated via gateway webhook."),
                        gateway_response_data=payload
                    )
                else:
                    refund_obj.status = Refund.RefundStatus.COMPLETED
                    refund_obj.gateway_response_data = payload
                    refund_obj.save(update_fields=['status', 'gateway_response_data', 'updated_at'])

                # Update payment status
                total_refunded = payment.refunds.exclude(id=refund_obj.id).aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
                if (total_refunded + refund_amount) >= payment.amount:
                    payment.status = PaymentStatus.REFUNDED
                else:
                    payment.status = PaymentStatus.PARTIALLY_REFUNDED
                payment.metadata = {**payment.metadata, 'latest_webhook_payload': payload}
                payment.save(update_fields=['status', 'metadata', 'updated_at'])
                logger.info(f"Payment {payment.id} partially/fully REFUNDED via webhook. Refund ID: {refund_id}")
            
            elif 'charge.dispute.created' in event_type:
                payment.status = PaymentStatus.DISPUTED
                payment.error_details = {'dispute_details': payload}
                payment.metadata = {**payment.metadata, 'latest_webhook_payload': payload}
                payment.save(update_fields=['status', 'error_details', 'metadata', 'updated_at'])
                logger.warning(f"Payment {payment.id} DISPUTED via webhook.")
            
            # Add more event type handling as needed (e.g., 'charge.authorized', 'payment_intent.processing')
            # Ensure the order status is updated if payment is completed
            if payment.status == PaymentStatus.COMPLETED and payment.order_id:
                from custom_order.models import CustomOrder # Import here to avoid circular dependency
                order = CustomOrder.objects.filter(order_id=payment.order_id).first()
                if order and order.status != CustomOrder.Status.CONFIRMED:
                    order.status = CustomOrder.Status.CONFIRMED
                    order.save(update_fields=['status', 'updated_at'])
                    logger.info(f"Order {order.order_id} status updated to CONFIRMED due to payment completion.")


        payment_event.processed = True
        payment_event.save(update_fields=['processed'])
        logger.info(f"Webhook event {payment_event.id} successfully processed.")
        return payment_event

    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Error processing webhook payload from {carrier_code}: {str(e)}", exc_info=True)
        # If an error occurs during processing, mark the event as not processed
        if 'payment_event' in locals() and payment_event.pk:
            payment_event.processed = False
            payment_event.save(update_fields=['processed'])
        raise ValidationError(_(f"Failed to process webhook: {str(e)}"))

def create_payment_event(
    payment: Payment | None,
    event_type: str,
    payload: dict,
    gateway_event_id: str = None,
    processed: bool = True
) -> PaymentEvent:
    """
    Helper function to create a PaymentEvent record.

    Args:
        payment (Payment | None): The associated Payment object, or None if not yet linked.
        event_type (str): The type of event.
        payload (dict): The raw payload/data for the event.
        gateway_event_id (str, optional): Unique ID from the gateway. Defaults to None.
        processed (bool, optional): Whether the event has been processed. Defaults to True.

    Returns:
        PaymentEvent: The created PaymentEvent object.
    """
    return PaymentEvent.objects.create(
        payment=payment,
        event_type=event_type,
        payload=payload,
        gateway_event_id=gateway_event_id,
        processed=processed
    )
