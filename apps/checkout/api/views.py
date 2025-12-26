"""
Checkout API views - Comprehensive API for checkout operations
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings

from apps.cart.services import CartService
from apps.contacts.models import StoreLocation
from ..models import CheckoutSession
from ..services import CheckoutService, CheckoutError, PaymentError
from .serializers import (
    CheckoutSessionSerializer,
    ContactInformationSerializer,
    UpdateShippingSerializer,
    ShippingMethodSerializer,
    SetPaymentMethodSerializer,
    ShippingOptionSerializer,
    StoreLocationSerializer,
    CheckoutSummarySerializer,
    CompleteCheckoutSerializer,
    ApplyCouponSerializer,
    GiftOptionsSerializer,
    OrderNotesSerializer,
    PaymentIntentSerializer,
    CheckoutValidationSerializer,
)


class CheckoutViewSet(viewsets.ViewSet):
    """
    Comprehensive ViewSet for checkout operations.
    
    Endpoints:
    - GET /api/v1/checkout/ - Get current checkout session
    - POST /api/v1/checkout/start/ - Start checkout
    - POST /api/v1/checkout/information/ - Update contact/shipping info
    - GET /api/v1/checkout/shipping-options/ - Get shipping options
    - POST /api/v1/checkout/shipping-method/ - Set shipping method
    - GET /api/v1/checkout/pickup-locations/ - Get pickup locations
    - POST /api/v1/checkout/payment-method/ - Set payment method
    - POST /api/v1/checkout/payment-intent/ - Create payment intent
    - POST /api/v1/checkout/coupon/ - Apply coupon
    - DELETE /api/v1/checkout/coupon/ - Remove coupon
    - POST /api/v1/checkout/gift-options/ - Set gift options
    - POST /api/v1/checkout/notes/ - Set order notes
    - GET /api/v1/checkout/summary/ - Get checkout summary
    - GET /api/v1/checkout/validate/ - Validate checkout
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
                user=request.user,
                request=request
            )
        else:
            return CheckoutService.get_or_create_session(
                cart=cart,
                session_key=request.session.session_key,
                request=request
            )
    
    def _error_response(self, message, code='error', details=None, http_status=status.HTTP_400_BAD_REQUEST):
        """Create standardized error response."""
        return Response({
            'success': False,
            'message': message,
            'code': code,
            'data': details
        }, status=http_status)
    
    def _success_response(self, message, data=None, http_status=status.HTTP_200_OK):
        """Create standardized success response."""
        return Response({
            'success': True,
            'message': message,
            'data': data
        }, status=http_status)
    
    @action(detail=False, methods=['get'], url_path='config')
    def get_config(self, request):
        """
        Get checkout configuration data.
        Returns countries, payment gateways, tax settings, etc.
        """
        # Get countries
        try:
            from apps.localization.models import Country
            countries = list(Country.objects.filter(
                is_active=True,
                is_shipping_available=True
            ).order_by('sort_order', 'name').values('code', 'name'))
        except Exception:
            countries = [{'code': 'BD', 'name': 'Bangladesh'}]
        
        # Get user's selected currency first for filtering payment gateways
        try:
            from apps.currencies.services import CurrencyService
            user_currency = CurrencyService.get_user_currency(
                user=request.user if request.user.is_authenticated else None,
                request=request
            )
            user_currency_code = user_currency.code if user_currency else 'BDT'
            user_currency_symbol = user_currency.symbol if user_currency else '৳'
        except Exception:
            user_currency_code = 'BDT'
            user_currency_symbol = '৳'
        
        # Get payment gateways filtered by user's currency
        try:
            from apps.payments.models import PaymentGateway
            gateways = []
            for g in PaymentGateway.get_active_gateways(currency=user_currency_code):
                gateways.append({
                    'code': g.code,
                    'name': g.name,
                    'description': g.description,
                    'icon_url': g.icon.url if g.icon else f'/static/images/payments/{g.code}.svg',
                    'icon_class': g.icon_class,
                    'color': g.color,
                    'fee_text': g.fee_text,
                    'fee_type': g.fee_type,
                    'fee_amount': float(g.fee_amount),
                    'instructions': g.instructions,
                    'currencies': g.currencies,
                })
        except Exception:
            gateways = []
        
        # Get site and shipping settings
        try:
            from apps.pages.models import SiteSettings
            site_settings = SiteSettings.get_settings()
            tax_rate = float(site_settings.tax_rate) if site_settings else 0
        except Exception:
            tax_rate = 0

        try:
            from apps.shipping.models import ShippingSettings
            shipping_settings = ShippingSettings.get_settings()
            free_shipping_threshold = float(shipping_settings.free_shipping_threshold) if shipping_settings and shipping_settings.free_shipping_threshold else None
        except Exception:
            free_shipping_threshold = None
        
        # Get divisions for Bangladesh (cascading dropdowns)
        divisions = []
        try:
            from apps.localization.models import Division
            divisions = list(Division.objects.filter(
                country__code='BD',
                is_active=True
            ).order_by('sort_order', 'name').values('code', 'name', 'native_name'))
        except Exception:
            pass
        
        return self._success_response('Checkout configuration retrieved', {
            'countries': countries,
            'payment_gateways': gateways,
            'divisions': divisions,
            'settings': {
                'tax_rate': tax_rate,
                'currency': user_currency_code,
                'currency_symbol': user_currency_symbol,
                'free_shipping_threshold': free_shipping_threshold,
            }
        })
    
    def list(self, request):
        """Get current checkout session."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        return self._success_response(
            'Checkout session retrieved',
            CheckoutSessionSerializer(checkout_session).data
        )
    
    @action(detail=False, methods=['post'], url_path='start')
    def start_checkout(self, request):
        """Start checkout process."""
        cart = self._get_cart(request)
        
        if not cart or not cart.items.exists():
            return self._error_response('Cart is empty', code='empty_cart')
        
        # Validate cart
        issues = CartService.validate_cart(cart)
        if issues:
            return self._error_response(
                'Cart validation failed',
                code='cart_invalid',
                details={'issues': issues}
            )
        
        checkout_session = self._get_checkout_session(request)
        
        return self._success_response(
            'Checkout started',
            CheckoutSessionSerializer(checkout_session).data,
            status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['post'], url_path='information')
    def update_information(self, request):
        """Update contact and shipping information."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ContactInformationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid information',
                code='validation_error',
                details=serializer.errors
            )
        
        try:
            CheckoutService.update_contact_information(
                checkout_session,
                serializer.validated_data
            )
            
            checkout_session.refresh_from_db()
            
            return self._success_response(
                'Information updated',
                CheckoutSessionSerializer(checkout_session).data
            )
        
        except CheckoutError as e:
            return self._error_response(str(e), code=e.code or 'checkout_error')
    
    @action(detail=False, methods=['get'], url_path='shipping-options')
    def shipping_options(self, request):
        """Get available shipping options."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        options = CheckoutService.get_shipping_options(checkout_session)
        
        return self._success_response(
            'Shipping options retrieved',
            {'options': options}
        )
    
    @action(detail=False, methods=['get'], url_path='pickup-locations')
    def pickup_locations(self, request):
        """Get available pickup locations."""
        locations = CheckoutService.get_pickup_locations()
        
        return self._success_response(
            'Pickup locations retrieved',
            {'locations': locations}
        )
    
    @action(detail=False, methods=['post'], url_path='shipping-method')
    def set_shipping_method(self, request):
        """Set shipping method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ShippingMethodSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid shipping method',
                code='validation_error',
                details=serializer.errors
            )
        
        try:
            CheckoutService.set_shipping_method(
                checkout_session,
                serializer.validated_data['shipping_method'],
                shipping_rate_id=serializer.validated_data.get('shipping_rate_id'),
                pickup_location_id=serializer.validated_data.get('pickup_location_id')
            )
            
            checkout_session.refresh_from_db()
            
            return self._success_response(
                'Shipping method set',
                CheckoutSessionSerializer(checkout_session).data
            )
        
        except CheckoutError as e:
            return self._error_response(str(e), code=e.code or 'checkout_error')
    
    @action(detail=False, methods=['post'], url_path='payment-method')
    def set_payment_method(self, request):
        """Set payment method."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = SetPaymentMethodSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid payment method',
                code='validation_error',
                details=serializer.errors
            )
        
        # Handle billing address
        if not serializer.validated_data.get('billing_same_as_shipping', True):
            billing_data = serializer.validated_data.get('billing_address', {})
            billing_data['same_as_shipping'] = False
            CheckoutService.update_billing_address(checkout_session, billing_data)
        
        try:
            CheckoutService.set_payment_method(
                checkout_session,
                serializer.validated_data['payment_method'],
                saved_payment_method_id=serializer.validated_data.get('saved_payment_method_id')
            )
            
            checkout_session.refresh_from_db()
            
            return self._success_response(
                'Payment method set',
                CheckoutSessionSerializer(checkout_session).data
            )
        
        except CheckoutError as e:
            return self._error_response(str(e), code=e.code or 'checkout_error')
    
    @action(detail=False, methods=['post'], url_path='payment-intent')
    def create_payment_intent(self, request):
        """Create Stripe payment intent."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        if not checkout_session.can_proceed_to_payment:
            return self._error_response(
                'Please complete shipping information first',
                code='incomplete_shipping'
            )
        
        try:
            intent_data = CheckoutService.create_payment_intent(checkout_session)
            
            if not intent_data:
                return self._error_response(
                    'Could not create payment intent',
                    code='payment_error'
                )
            
            return self._success_response(
                'Payment intent created',
                {
                    'client_secret': intent_data['client_secret'],
                    'payment_intent_id': intent_data['id'],
                    'amount': intent_data['amount'],
                    'publishable_key': getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''),
                }
            )
        
        except PaymentError as e:
            return self._error_response(str(e), code='payment_error')
        except Exception as e:
            return self._error_response(
                str(e),
                code='server_error',
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post', 'delete'], url_path='coupon')
    def manage_coupon(self, request):
        """Apply or remove coupon."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        if request.method == 'DELETE':
            CheckoutService.remove_coupon(checkout_session)
            summary = CheckoutService.get_checkout_summary(checkout_session)
            
            return self._success_response(
                'Coupon removed',
                {
                    'total': summary['total'],
                    'formatted_total': summary['formatted_total'],
                }
            )
        
        # POST - Apply coupon
        serializer = ApplyCouponSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid coupon code',
                code='validation_error',
                details=serializer.errors
            )
        
        success, message = CheckoutService.apply_coupon(
            checkout_session,
            serializer.validated_data['coupon_code']
        )
        
        if success:
            summary = CheckoutService.get_checkout_summary(checkout_session)
            return self._success_response(
                message,
                {
                    'discount': summary['discount'],
                    'formatted_discount': summary['formatted_discount'],
                    'total': summary['total'],
                    'formatted_total': summary['formatted_total'],
                }
            )
        else:
            return self._error_response(message, code='coupon_invalid')
    
    @action(detail=False, methods=['post'], url_path='gift-options')
    def set_gift_options(self, request):
        """Set gift options."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = GiftOptionsSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid gift options',
                code='validation_error',
                details=serializer.errors
            )
        
        CheckoutService.set_gift_options(
            checkout_session,
            is_gift=serializer.validated_data.get('is_gift', False),
            gift_message=serializer.validated_data.get('gift_message', ''),
            gift_wrap=serializer.validated_data.get('gift_wrap', False)
        )
        
        checkout_session.refresh_from_db()
        
        return self._success_response(
            'Gift options updated',
            CheckoutSessionSerializer(checkout_session).data
        )
    
    @action(detail=False, methods=['post'], url_path='notes')
    def set_notes(self, request):
        """Set order notes."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = OrderNotesSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid notes',
                code='validation_error',
                details=serializer.errors
            )
        
        CheckoutService.set_order_notes(
            checkout_session,
            order_notes=serializer.validated_data.get('order_notes', ''),
            delivery_instructions=serializer.validated_data.get('delivery_instructions', '')
        )
        
        return self._success_response('Notes updated')
    
    @action(detail=False, methods=['get'], url_path='summary')
    def get_summary(self, request):
        """Get checkout summary."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        summary = CheckoutService.get_checkout_summary(checkout_session)
        
        return self._success_response(
            'Checkout summary retrieved',
            summary
        )
    
    @action(detail=False, methods=['get'], url_path='validate')
    def validate_checkout(self, request):
        """Validate checkout before completion."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        issues = CheckoutService.validate_checkout(checkout_session)
        
        return self._success_response(
            'Validation complete',
            {
                'valid': len(issues) == 0,
                'issues': issues,
                'can_complete': checkout_session.can_complete,
            }
        )
    
    @action(detail=False, methods=['post'], url_path='complete')
    def complete_checkout(self, request):
        """Complete checkout and create order."""
        checkout_session = self._get_checkout_session(request)
        
        if not checkout_session:
            return self._error_response(
                'No active checkout session',
                code='no_session',
                http_status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CompleteCheckoutSerializer(data=request.data)
        
        if not serializer.is_valid():
            return self._error_response(
                'Invalid checkout data',
                code='validation_error',
                details=serializer.errors
            )
        
        # Update notes if provided
        if serializer.validated_data.get('order_notes'):
            checkout_session.order_notes = serializer.validated_data['order_notes']
            checkout_session.save()
        
        # Complete checkout
        try:
            order, error = CheckoutService.complete_checkout(
                checkout_session,
                payment_intent_id=serializer.validated_data.get('payment_intent_id')
            )
            
            if error:
                return self._error_response(error, code='checkout_failed')
            
            if not order:
                return self._error_response(
                    'Failed to create order',
                    code='order_creation_failed',
                    http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Import here to avoid circular imports
            from apps.orders.api.serializers import OrderSerializer
            
            return self._success_response(
                'Order created successfully',
                OrderSerializer(order).data,
                status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return self._error_response(
                str(e),
                code='server_error',
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
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
