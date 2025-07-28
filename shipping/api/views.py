# shipping/api/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from decimal import Decimal
import logging

from ..models import ShippingMethod, ShippingCarrier, Shipment
from ..services import calculate_shipping_cost, create_shipment_for_order, book_shipment_via_carrier_api, fetch_tracking_status_from_carrier, request_carrier_pickup, generate_shipping_label, cancel_shipment, process_webhook_event
from .serializers import ShippingMethodSerializer, ShippingCarrierSerializer, ShipmentSerializer, ShipmentCreateSerializer
from accounts.models import UserAddress # Assuming UserAddress is in accounts app
from custom_order.models import CustomOrder # Assuming CustomOrder is in custom_order app

logger = logging.getLogger(__name__)

class StandardThrottle(UserRateThrottle):
    """
    Standard throttle scope for API views.
    """
    scope = 'standard'

class ShippingMethodListAPIView(generics.ListAPIView):
    """
    API view to list active shipping methods available for a specific zone (optional).
    Can be filtered by zone_id.
    """
    serializer_class = ShippingMethodSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [StandardThrottle]

    def get_queryset(self):
        """
        Returns a queryset of active shipping methods, optionally filtered by zone.
        """
        queryset = ShippingMethod.objects.filter(is_active=True).select_related('carrier').prefetch_related('zones')
        zone_id = self.request.query_params.get('zone_id')
        if zone_id:
            queryset = queryset.filter(zones__id=zone_id)
        return queryset.order_by('name')

class CalculateShippingCostAPIView(APIView):
    """
    API view to calculate shipping cost based on shipping method, address, and order details.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request):
        """
        Handles POST requests to calculate shipping cost.
        Expects: shipping_method_id, shipping_address_id, weight_kg, order_total, [dims_cm]
        """
        shipping_method_id = request.data.get('shipping_method_id')
        shipping_address_id = request.data.get('shipping_address_id')
        weight_kg = request.data.get('weight_kg', '0.1')
        order_total = request.data.get('order_total', '0.00')
        dims_cm = request.data.get('dims_cm') # This should be a dict like {'l': X, 'w': Y, 'h': Z}

        if not all([shipping_method_id, shipping_address_id]):
            return Response(
                {'error': _('Shipping method and address are required for shipping calculation.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            shipping_method = get_object_or_404(ShippingMethod, pk=shipping_method_id, is_active=True)
            shipping_address = get_object_or_404(UserAddress, pk=shipping_address_id, user=request.user)
            
            # Convert to Decimal
            weight_kg = Decimal(str(weight_kg))
            order_total = Decimal(str(order_total))
            
            if dims_cm:
                dims_cm = {k: Decimal(str(v)) for k, v in dims_cm.items()}

            shipping_cost = calculate_shipping_cost(
                shipping_method=shipping_method,
                address=shipping_address,
                weight_kg=weight_kg,
                dimensions_cm=dims_cm,
                order_total=order_total,
                is_express=shipping_method.is_express # Use method's express status
            )
            
            return Response({
                'shipping_cost': str(shipping_cost.quantize(Decimal('0.01'))),
                'carrier_name': shipping_method.carrier.name,
                'estimated_delivery': shipping_method.estimated_delivery_days
            })
            
        except (ShippingMethod.DoesNotExist, UserAddress.DoesNotExist):
            return Response(
                {'error': _('Invalid shipping method or address selected.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            logger.warning(f"Validation error during shipping calculation: {e.message}")
            return Response(
                {'error': e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error during shipping calculation: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during shipping calculation: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShippingCarrierListAPIView(generics.ListAPIView):
    """
    API view to list active shipping carriers.
    """
    serializer_class = ShippingCarrierSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [StandardThrottle]

    def get_queryset(self):
        """
        Returns a queryset of active shipping carriers.
        """
        return ShippingCarrier.objects.filter(is_active=True).order_by('name')

class ShipmentCreateAPIView(generics.CreateAPIView):
    """
    API view to create a new Shipment record.
    This typically happens after an order is placed and confirmed.
    """
    queryset = Shipment.objects.all()
    serializer_class = ShipmentCreateSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can create shipments
    throttle_classes = [StandardThrottle]

    def perform_create(self, serializer):
        """
        Performs the creation of the shipment and associates it with the order.
        """
        # The serializer's validate method already fetches order and shipping_method
        # and calculates cost.
        shipment = serializer.save()
        logger.info(f"Shipment {shipment.id} created via API for order {shipment.order.order_id}")

class ShipmentDetailAPIView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a single shipment.
    """
    queryset = Shipment.objects.all().select_related('order', 'shipping_method__carrier').prefetch_related('status_updates', 'events')
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can view shipment details
    throttle_classes = [StandardThrottle]
    lookup_field = 'id' # Assuming lookup by primary key (ID)

    def get_queryset(self):
        """
        Filters shipments to only show those belonging to the requesting user's orders,
        or all if the user is a staff member.
        """
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(order__user=self.request.user)

class ShipmentBookingAPIView(APIView):
    """
    API view to trigger the booking of a shipment with the external carrier.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, pk):
        """
        Handles POST requests to book a shipment.
        """
        try:
            shipment = get_object_or_404(Shipment, pk=pk)
            # Ensure the user has permission to book this shipment (e.g., owner or staff)
            if not request.user.is_staff and shipment.order.user != request.user:
                return Response(
                    {'error': _('You do not have permission to book this shipment.')},
                    status=status.HTTP_403_FORBIDDEN
                )

            booked_shipment = book_shipment_via_carrier_api(shipment)
            serializer = ShipmentSerializer(booked_shipment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error booking shipment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to book shipment: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShipmentTrackingAPIView(APIView):
    """
    API view to fetch the latest tracking status for a shipment from the carrier.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def get(self, request, pk):
        """
        Handles GET requests to fetch tracking status.
        """
        try:
            shipment = get_object_or_404(Shipment, pk=pk)
            if not request.user.is_staff and shipment.order.user != request.user:
                return Response(
                    {'error': _('You do not have permission to track this shipment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            updated_shipment = fetch_tracking_status_from_carrier(shipment)
            serializer = ShipmentSerializer(updated_shipment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error fetching tracking for shipment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to fetch tracking status: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShipmentLabelAPIView(APIView):
    """
    API view to generate and retrieve a shipping label for a shipment.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, pk):
        """
        Handles POST requests to generate a shipping label.
        """
        try:
            shipment = get_object_or_404(Shipment, pk=pk)
            if not request.user.is_staff and shipment.order.user != request.user:
                return Response(
                    {'error': _('You do not have permission to generate label for this shipment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            label_url = generate_shipping_label(shipment)
            if label_url:
                return Response({'label_url': label_url}, status=status.HTTP_200_OK)
            else:
                return Response({'error': _('Failed to generate label.')}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error generating label for shipment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to generate label: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShipmentPickupRequestAPIView(APIView):
    """
    API view to request a pickup for a shipment from the carrier.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, pk):
        """
        Handles POST requests to request a pickup.
        """
        try:
            shipment = get_object_or_404(Shipment, pk=pk)
            if not request.user.is_staff and shipment.order.user != request.user:
                return Response(
                    {'error': _('You do not have permission to request pickup for this shipment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            pickup_details = request_carrier_pickup(shipment)
            return Response(pickup_details, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error requesting pickup for shipment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to request pickup: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShipmentCancellationAPIView(APIView):
    """
    API view to cancel a shipment.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request, pk):
        """
        Handles POST requests to cancel a shipment.
        """
        try:
            shipment = get_object_or_404(Shipment, pk=pk)
            if not request.user.is_staff and shipment.order.user != request.user:
                return Response(
                    {'error': _('You do not have permission to cancel this shipment.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            cancelled_shipment = cancel_shipment(shipment)
            serializer = ShipmentSerializer(cancelled_shipment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error cancelling shipment {pk}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Failed to cancel shipment: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class WebhookReceiverAPIView(APIView):
    """
    Generic API endpoint to receive webhook notifications from shipping carriers.
    This endpoint should be publicly accessible but secured with a secret key verification.
    """
    permission_classes = [] # No authentication needed, relies on webhook_secret
    throttle_classes = [] # Webhooks typically aren't throttled by user

    def post(self, request, carrier_code):
        """
        Handles POST requests from carrier webhooks.
        The carrier_code in the URL helps identify the sender.
        """
        payload = request.data # Expecting JSON payload
        
        # In a real scenario, you'd verify the signature using carrier.webhook_secret
        # For example:
        # signature = request.headers.get('X-Carrier-Signature')
        # if not verify_webhook_signature(carrier_code, payload, signature):
        #     return Response({'error': 'Invalid signature'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            success = process_webhook_event(carrier_code, payload)
            if success:
                return Response({'status': 'success', 'message': _('Webhook processed successfully.')}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'failed', 'message': _('Failed to process webhook event.')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in WebhookReceiverAPIView for carrier {carrier_code}: {str(e)}", exc_info=True)
            return Response(
                {'status': 'error', 'message': _(f'An internal error occurred: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
