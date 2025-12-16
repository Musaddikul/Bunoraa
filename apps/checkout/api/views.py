"""
Checkout API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings

from apps.cart.services import CartService
from ..models import CheckoutSession
from ..services import CheckoutService
from .serializers import (
    CheckoutSessionSerializer,
    UpdateShippingSerializer,
    SetPaymentMethodSerializer,
    ShippingOptionSerializer,
    CheckoutSummarySerializer,
    CompleteCheckoutSerializer,
)


class CheckoutViewSet(viewsets.ViewSet):
    """
    ViewSet for checkout operations.
    
    Endpoints:
    - GET /api/v1/checkout/ - Get current checkout session
    - POST /api/v1/checkout/start/ - Start checkout
    - POST /api/v1/checkout/shipping/ - Update shipping info
    - GET /api/v1/checkout/shipping-options/ - Get shipping options
    - POST /api/v1/checkout/payment-method/ - Set payment method
    - POST /api/v1/checkout/payment-intent/ - Create payment intent
    - GET /api/v1/checkout/summary/ - Get checkout summary
    - POST /api/v1/checkout/complete/ - Complete checkout
    """
    permission_classes = [AllowAny]
    
    def _get_cart(self, request):
        """Get current cart."""
        if request.user.is_authenticated:
            return CartService.get_or_create_cart(user=request.user)
        
        if not request.session.session_key:
            request.session.create()
        
        return CartService.get_or_create_cart(session_key=request.session.session_key)
    
    def _get_checkout_session(self, request):
        """Get checkout session."""
        cart = self._get_cart(request)
        
        if not cart:
            return None
        
        if request.user.is_authenticated:
            return CheckoutService.get_or_create_session(
                cart=cart,
                user=request.user
            )
        else:
            return CheckoutService.get_or_create_session(
                cart=cart,
                session_key=request.session.session_key
            )
    
    def list(self, request):
        """Get current checkout session."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CheckoutSessionSerializer(checkout_session)
        
        return Response({
            'success': True,
            'message': 'Checkout session retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='start')
    def start_checkout(self, request):
        """Start checkout process."""
        cart = self._get_cart(request)
        
        if not cart or not cart.items.exists():
            return Response({
                'success': False,
                'message': 'Cart is empty',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate cart
        issues = CartService.validate_cart(cart)
        if issues:
            return Response({
                'success': False,
                'message': 'Cart validation failed',
                'data': {'issues': issues}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        checkout_session = self._get_checkout_session(request)
        serializer = CheckoutSessionSerializer(checkout_session)
        
        return Response({
            'success': True,
            'message': 'Checkout started',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='shipping')
    def update_shipping(self, request):
        """Update shipping address and method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateShippingSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid shipping data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build address data
        shipping_data = serializer.validated_data['shipping_address']
        shipping_data['billing_same_as_shipping'] = serializer.validated_data['billing_same_as_shipping']
        
        if not shipping_data['billing_same_as_shipping']:
            billing = serializer.validated_data.get('billing_address', {})
            for key, value in billing.items():
                shipping_data[f'billing_{key}'] = value
        
        # Update shipping address
        CheckoutService.update_shipping_address(checkout_session, shipping_data)
        
        # Set shipping method
        shipping_method = serializer.validated_data.get('shipping_method', CheckoutSession.SHIPPING_STANDARD)
        CheckoutService.set_shipping_method(checkout_session, shipping_method)
        
        checkout_session.refresh_from_db()
        
        return Response({
            'success': True,
            'message': 'Shipping information updated',
            'data': CheckoutSessionSerializer(checkout_session).data
        })
    
    @action(detail=False, methods=['get'], url_path='shipping-options')
    def shipping_options(self, request):
        """Get available shipping options."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        options = CheckoutService.get_shipping_options(checkout_session)
        
        return Response({
            'success': True,
            'message': 'Shipping options retrieved',
            'data': options
        })
    
    @action(detail=False, methods=['post'], url_path='payment-method')
    def set_payment_method(self, request):
        """Set payment method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SetPaymentMethodSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid payment method',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        payment_method = serializer.validated_data['payment_method']
        CheckoutService.set_payment_method(checkout_session, payment_method)
        
        checkout_session.refresh_from_db()
        
        return Response({
            'success': True,
            'message': 'Payment method set',
            'data': CheckoutSessionSerializer(checkout_session).data
        })
    
    @action(detail=False, methods=['post'], url_path='payment-intent')
    def create_payment_intent(self, request):
        """Create Stripe payment intent."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not checkout_session.can_proceed_to_payment:
            return Response({
                'success': False,
                'message': 'Please complete shipping information first',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            intent = CheckoutService.create_payment_intent(checkout_session)
            
            return Response({
                'success': True,
                'message': 'Payment intent created',
                'data': {
                    'client_secret': intent.client_secret,
                    'payment_intent_id': intent.id,
                    'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
                }
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def get_summary(self, request):
        """Get checkout summary."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        summary = CheckoutService.get_checkout_summary(checkout_session)
        
        return Response({
            'success': True,
            'message': 'Checkout summary retrieved',
            'data': summary
        })
    
    @action(detail=False, methods=['post'], url_path='complete')
    def complete_checkout(self, request):
        """Complete checkout and create order."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return Response({
                'success': False,
                'message': 'No active checkout session',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompleteCheckoutSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid checkout data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update notes
        if serializer.validated_data.get('order_notes'):
            checkout_session.order_notes = serializer.validated_data['order_notes']
            checkout_session.save()
        
        # Complete checkout
        payment_intent_id = serializer.validated_data.get('payment_intent_id')
        order, error = CheckoutService.complete_checkout(
            checkout_session,
            payment_intent_id=payment_intent_id
        )
        
        if error:
            return Response({
                'success': False,
                'message': error,
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not order:
            return Response({
                'success': False,
                'message': 'Failed to create order',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        from apps.orders.api.serializers import OrderSerializer
        
        return Response({
            'success': True,
            'message': 'Order created successfully',
            'data': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)
