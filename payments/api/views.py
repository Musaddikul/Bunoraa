# payments/api/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import logging
import json # For webhook payload parsing

from ..models import Payment, PaymentMethod, PaymentEvent
from ..services import (
    create_payment_intent, process_payment, capture_payment,
    initiate_refund, verify_payment_status_with_gateway, handle_payment_webhook
)
from .serializers import (
    PaymentMethodSerializer, PaymentSerializer,
    PaymentIntentCreateSerializer, PaymentProcessSerializer,
    PaymentRefundSerializer, WebhookPayloadSerializer
)
from custom_order.models import CustomOrder # Import CustomOrder for order validation

logger = logging.getLogger(__name__)

class StandardThrottle(UserRateThrottle):
    """
    Standard throttle scope for API views.
    """
    scope = 'standard'

class PaymentMethodListAPIView(generics.ListAPIView):
    """
    API view to list active payment methods.
    """
    serializer_class = PaymentMethodSerializer
    permission_classes = [AllowAny] # Allow anyone to see available payment methods
    throttle_classes = [StandardThrottle]

    def get_queryset(self):
        """
        Returns a queryset of active payment methods.
        """
        return PaymentMethod.objects.filter(is_active=True).order_by('name')

class PaymentIntentAPIView(APIView):
    """
    API view to create and retrieve payment intents.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to create a payment intent.
        """
        serializer = PaymentIntentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order = serializer.validated_data['order']
        payment_method = serializer.validated_data['payment_method']
        amount = serializer.validated_data['amount']
        currency = serializer.validated_data.get('currency', 'BDT')
        is_test = serializer.validated_data.get('is_test', False)

        try:
            # Call the service to create the payment intent
            intent_details = create_payment_intent(
                user=request.user,
                order=order,
                amount=amount,
                payment_method_code=payment_method.code,
                currency=currency,
                is_test=is_test
            )
            return Response(intent_details, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating payment intent: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request, pk, *args, **kwargs):
        """
        Handles GET requests to retrieve a specific payment intent (Payment object).
        """
        try:
            payment = get_object_or_404(Payment, pk=pk)
            # Ensure user has permission to view this payment
            if not request.user.is_staff and payment.user != request.user:
                return Response(
                    {'error': _('You do not have permission to view this payment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving payment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to retrieve payment details: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentProcessAPIView(APIView):
    """
    API view to process/confirm a payment intent after client-side interaction.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, pk, *args, **kwargs):
        """
        Handles POST requests to process a payment (e.g., after 3D Secure, card token submission).
        `pk` is the internal Payment ID.
        """
        serializer = PaymentProcessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment_intent_id = serializer.validated_data['payment_intent_id']
        payment_data = serializer.validated_data.get('payment_data')

        try:
            payment = get_object_or_404(Payment, payment_intent_id=payment_intent_id)
            if not request.user.is_staff and payment.user != request.user:
                return Response(
                    {'error': _('You do not have permission to process this payment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            updated_payment = process_payment(payment, payment_data, request.user)
            response_serializer = PaymentSerializer(updated_payment)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({'error': _('Payment intent not found.')}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error processing payment {payment_intent_id}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during payment processing: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentCaptureAPIView(APIView):
    """
    API view to capture an authorized payment.
    """
    permission_classes = [IsAuthenticated] # Typically staff/admin only
    throttle_classes = [StandardThrottle]

    def post(self, request, pk, *args, **kwargs):
        """
        Handles POST requests to capture an authorized payment.
        `pk` is the internal Payment ID.
        """
        try:
            payment = get_object_or_404(Payment, pk=pk)
            if not request.user.is_staff: # Only staff can capture
                return Response(
                    {'error': _('You do not have permission to capture payments.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            captured_payment = capture_payment(payment, request.user)
            serializer = PaymentSerializer(captured_payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({'error': _('Payment not found.')}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error capturing payment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during payment capture: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentRefundAPIView(APIView):
    """
    API view to initiate a refund for a payment.
    """
    permission_classes = [IsAuthenticated] # Typically staff/admin only
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to initiate a refund.
        """
        serializer = PaymentRefundSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment = serializer.validated_data['payment']
        amount = serializer.validated_data['amount']
        reason = serializer.validated_data.get('reason', '')

        try:
            if not request.user.is_staff: # Only staff can refund
                return Response(
                    {'error': _('You do not have permission to initiate refunds.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            refund = initiate_refund(payment, amount, reason, request.user)
            response_serializer = RefundSerializer(refund)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error initiating refund for payment {payment.id}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during refund initiation: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentStatusCheckAPIView(APIView):
    """
    API view to manually check the status of a payment with the gateway.
    """
    permission_classes = [IsAuthenticated] # Typically staff/admin or payment owner
    throttle_classes = [StandardThrottle]

    def get(self, request, pk, *args, **kwargs):
        """
        Handles GET requests to check payment status.
        `pk` is the internal Payment ID.
        """
        try:
            payment = get_object_or_404(Payment, pk=pk)
            if not request.user.is_staff and payment.user != request.user:
                return Response(
                    {'error': _('You do not have permission to check status for this payment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            updated_payment = verify_payment_status_with_gateway(payment)
            serializer = PaymentSerializer(updated_payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({'error': _('Payment not found.')}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error checking payment status for {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during status check: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentWebhookReceiverAPIView(APIView):
    """
    Generic API endpoint to receive webhook notifications from payment gateways.
    This endpoint should be publicly accessible but secured with a secret key verification
    (implemented within the gateway client's verify_webhook_signature method).
    """
    permission_classes = [AllowAny] # Webhooks are external calls, no auth needed via Django
    throttle_classes = [] # Webhooks typically aren't throttled by user

    def post(self, request, gateway_code):
        """
        Handles POST requests from payment gateway webhooks.
        The `gateway_code` in the URL helps identify the sender and its verification method.
        """
        # Get raw request body for signature verification
        raw_payload = request.body
        headers = dict(request.headers) # Get all headers for verification

        try:
            # Instantiate the correct gateway client to verify signature
            # This is a critical security step. DO NOT skip in production.
            gateway_client = PaymentGatewayFactory.get_client(gateway_code)
            
            # Example: Retrieve signature from headers (e.g., 'stripe-signature', 'x-bkash-signature')
            # You need to know which header each gateway uses.
            # For this mock, we'll just pass a dummy signature.
            webhook_signature = headers.get('X-Gateway-Signature', 'mock_signature') 

            if not gateway_client.verify_webhook_signature(raw_payload, webhook_signature, headers):
                logger.warning(f"Webhook signature verification failed for {gateway_code}.")
                return Response({'error': _('Invalid webhook signature.')}, status=status.HTTP_401_UNAUTHORIZED)

            payload_data = json.loads(raw_payload)
            gateway_event_id = payload_data.get('id') # Common for Stripe-like, adjust for others

            # Process the webhook event asynchronously
            from ..tasks import process_webhook_async
            process_webhook_async.delay(gateway_code, payload_data, gateway_event_id)
            
            return Response({'status': 'success', 'message': _('Webhook received and queued for processing.')}, status=status.HTTP_200_OK)

        except ValidationError as e:
            logger.warning(f"Validation error in WebhookReceiverAPIView for {gateway_code}: {e.message}")
            return Response({'status': 'failed', 'message': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in WebhookReceiverAPIView for {gateway_code}: {str(e)}", exc_info=True)
            return Response(
                {'status': 'error', 'message': _(f'An internal error occurred: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
