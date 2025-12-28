"""
Checkout services - Comprehensive business logic for checkout operations
"""
from decimal import Decimal
from typing import Optional, Tuple, Dict, List, Any
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import timedelta
import logging

try:
    import stripe
except ImportError:
    stripe = None

from .models import (
    CheckoutSession, CheckoutEvent, AbandonedCheckout
)
from apps.shipping.models import ShippingRate, ShippingMethod, ShippingZone
from apps.contacts.models import StoreLocation

logger = logging.getLogger(__name__)


class CheckoutError(Exception):
    """Base exception for checkout errors."""
    def __init__(self, message, code=None, details=None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(message)


class ValidationError(CheckoutError):
    """Validation error during checkout."""
    pass


class PaymentError(CheckoutError):
    """Payment processing error."""
    pass


class CheckoutService:
    """
    Comprehensive service for checkout operations.
    Handles all checkout logic with proper validation,
    error handling, and event tracking.
    """
    
    # Gift wrap now configurable via SiteSettings
    @classmethod
    def get_gift_wrap_fee(cls) -> Decimal:
        """Return configured gift wrap fee from CartSettings (fallback 0)."""
        try:
            from apps.cart.models import CartSettings
            s = CartSettings.get_settings()
            if getattr(s, 'gift_wrap_enabled', False):
                return Decimal(str(s.gift_wrap_amount or '0'))
        except Exception:
            pass
        return Decimal('0')
    
    # Default shipping costs by method
    DEFAULT_SHIPPING_COSTS = {
        CheckoutSession.SHIPPING_STANDARD: Decimal('60.00'),
        CheckoutSession.SHIPPING_EXPRESS: Decimal('120.00'),
        CheckoutSession.SHIPPING_OVERNIGHT: Decimal('200.00'),
        CheckoutSession.SHIPPING_PICKUP: Decimal('0.00'),
        CheckoutSession.SHIPPING_FREE: Decimal('0.00'),
    }
    
    # COD fee
    COD_FEE = Decimal('20.00')
    
    @classmethod
    def get_or_create_session(
        cls,
        cart,
        user=None,
        session_key=None,
        request=None
    ) -> CheckoutSession:
        """
        Get or create checkout session for cart.
        
        Args:
            cart: Cart instance
            user: Optional user
            session_key: Optional session key for guests
            request: Optional HTTP request for analytics
            
        Returns:
            CheckoutSession instance
        """
        active_steps = [
            CheckoutSession.STEP_CART,
            CheckoutSession.STEP_INFORMATION,
            CheckoutSession.STEP_SHIPPING,
            CheckoutSession.STEP_PAYMENT,
            CheckoutSession.STEP_REVIEW,
        ]
        
        # Look for existing active session
        filters = {
            'cart': cart,
            'current_step__in': active_steps,
        }
        
        if user:
            filters['user'] = user
        else:
            filters['session_key'] = session_key
            filters['user__isnull'] = True
        
        checkout_session = CheckoutSession.objects.filter(**filters).first()
        
        if checkout_session:
            # Check if expired
            if checkout_session.is_expired:
                cls._handle_expired_session(checkout_session)
                checkout_session = None
            else:
                # Extend expiry on activity
                checkout_session.extend_expiry(hours=48)
                # Sync checkout currency with user's selected currency (if provided)
                try:
                    if request:
                        from apps.currencies.services import CurrencyService
                        user_currency = CurrencyService.get_user_currency(user=user if user else None, request=request)
                        if user_currency and checkout_session.currency != user_currency.code:
                            checkout_session.currency = user_currency.code
                            # Optionally update exchange rate if provided on currency object
                            if getattr(user_currency, 'exchange_rate', None):
                                checkout_session.exchange_rate = user_currency.exchange_rate
                            checkout_session.save(update_fields=['currency', 'exchange_rate'])
                except Exception:
                    pass
                return checkout_session
        
        # Create new session
        checkout_session = CheckoutSession.objects.create(
            user=user,
            session_key=session_key if not user else None,
            cart=cart,
            expires_at=timezone.now() + timedelta(hours=48)
        )
        
        # Set tax rate from site settings
        cls._apply_tax_rate(checkout_session)
        
        # Pre-fill from user profile if authenticated
        if user:
            cls._prefill_from_user(checkout_session, user)
        
        # Track analytics
        if request:
            cls._capture_analytics(checkout_session, request)
        
        # Sync checkout currency with user's selected currency (if provided) on creation
        try:
            if request:
                from apps.currencies.services import CurrencyService
                user_currency = CurrencyService.get_user_currency(user=user if user else None, request=request)
                if user_currency and checkout_session.currency != user_currency.code:
                    checkout_session.currency = user_currency.code
                    if getattr(user_currency, 'exchange_rate', None):
                        checkout_session.exchange_rate = user_currency.exchange_rate
                    checkout_session.save(update_fields=['currency', 'exchange_rate'])
        except Exception:
            pass

        # Log event
        cls.log_event(
            checkout_session,
            CheckoutEvent.EVENT_STARTED,
            data={'cart_id': str(cart.id), 'item_count': cart.item_count}
        )
        
        return checkout_session
    
    @classmethod
    def _prefill_from_user(cls, checkout_session: CheckoutSession, user) -> None:
        """Pre-fill checkout session from user profile."""
        checkout_session.email = user.email
        checkout_session.shipping_first_name = user.first_name
        checkout_session.shipping_last_name = user.last_name
        checkout_session.shipping_email = user.email
        checkout_session.shipping_phone = getattr(user, 'phone', '') or getattr(user, 'phone_number', '') or ''
        
        # Use default shipping address if available
        try:
            default_address = user.addresses.filter(
                is_default=True,
                address_type__in=['shipping', 'both'],
                is_deleted=False
            ).first()
            
            if not default_address:
                default_address = user.addresses.filter(
                    is_deleted=False
                ).first()
            
            if default_address:
                checkout_session.saved_shipping_address = default_address
                checkout_session.shipping_address_line_1 = default_address.address_line_1
                checkout_session.shipping_address_line_2 = default_address.address_line_2 or ''
                checkout_session.shipping_city = default_address.city
                checkout_session.shipping_state = default_address.state or ''
                checkout_session.shipping_postal_code = default_address.postal_code
                checkout_session.shipping_country = default_address.country
        except Exception as e:
            logger.warning(f"Failed to prefill address: {e}")
        
        checkout_session.save()
    
    @classmethod
    def _apply_tax_rate(cls, checkout_session: CheckoutSession) -> None:
        """Apply tax rate from site settings."""
        try:
            from apps.pages.models import SiteSettings
            site_settings = SiteSettings.get_settings()
            if site_settings and site_settings.tax_rate:
                checkout_session.tax_rate = site_settings.tax_rate
                checkout_session.save(update_fields=['tax_rate'])
        except Exception as e:
            logger.warning(f"Failed to apply tax rate: {e}")
    
    @classmethod
    def _capture_analytics(cls, checkout_session: CheckoutSession, request) -> None:
        """Capture analytics data from request."""
        # UTM parameters
        checkout_session.utm_source = request.GET.get('utm_source', '')[:100]
        checkout_session.utm_medium = request.GET.get('utm_medium', '')[:100]
        checkout_session.utm_campaign = request.GET.get('utm_campaign', '')[:100]
        
        # Referrer
        checkout_session.referrer_url = request.META.get('HTTP_REFERER', '')[:200]
        
        # User agent
        checkout_session.user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        # IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            checkout_session.ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            checkout_session.ip_address = request.META.get('REMOTE_ADDR')
        
        # Device type detection
        user_agent = checkout_session.user_agent.lower()
        if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
            checkout_session.device_type = 'mobile'
        elif 'tablet' in user_agent or 'ipad' in user_agent:
            checkout_session.device_type = 'tablet'
        else:
            checkout_session.device_type = 'desktop'
        
        checkout_session.save()
    
    @classmethod
    def _handle_expired_session(cls, checkout_session: CheckoutSession) -> None:
        """Handle expired checkout session."""
        if checkout_session.customer_email:
            cls.create_abandoned_checkout(checkout_session)
        checkout_session.mark_abandoned('Session expired')
    
    @classmethod
    @transaction.atomic
    def update_contact_information(
        cls,
        checkout_session: CheckoutSession,
        data: Dict[str, Any]
    ) -> CheckoutSession:
        """
        Update contact and shipping information.
        
        Args:
            checkout_session: CheckoutSession instance
            data: Dictionary with contact/address fields
            
        Returns:
            Updated CheckoutSession
        """
        # Validate required fields
        required_fields = ['email', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required", code='required_field')
        
        # Update email
        checkout_session.email = data.get('email', '')
        checkout_session.shipping_email = data.get('email', '')
        
        # Update shipping info
        checkout_session.shipping_first_name = data.get('first_name', '')
        checkout_session.shipping_last_name = data.get('last_name', '')
        checkout_session.shipping_company = data.get('company', '')
        checkout_session.shipping_phone = data.get('phone', '')
        checkout_session.shipping_address_line_1 = data.get('address_line_1', '')
        checkout_session.shipping_address_line_2 = data.get('address_line_2', '')
        checkout_session.shipping_city = data.get('city', '')
        checkout_session.shipping_state = data.get('state', '')
        checkout_session.shipping_postal_code = data.get('postal_code', '')
        checkout_session.shipping_country = data.get('country', 'Bangladesh')
        
        # Gift options - preserve existing values if not explicitly set
        if 'is_gift' in data:
            checkout_session.is_gift = data.get('is_gift', False)
        if 'gift_message' in data:
            checkout_session.gift_message = data.get('gift_message', '')
        if 'gift_wrap' in data:
            checkout_session.gift_wrap = data.get('gift_wrap', False)
            if checkout_session.gift_wrap:
                checkout_session.gift_wrap_cost = cls.get_gift_wrap_fee()
            else:
                checkout_session.gift_wrap_cost = Decimal('0')
        
        # Order notes
        if 'order_notes' in data:
            checkout_session.order_notes = data.get('order_notes', '')
        
        # Marketing preferences
        checkout_session.subscribe_newsletter = data.get('subscribe_newsletter', False)
        checkout_session.accept_marketing = data.get('accept_marketing', False)

        # Persist newsletter subscription: create/reactivate Subscriber and update user preference when applicable.
        try:
            from apps.pages.services import SubscriberService

            # When customer opts in, subscribe them (guest or user)
            if data.get('subscribe_newsletter'):
                try:
                    SubscriberService.subscribe(
                        email=checkout_session.email or data.get('email', ''),
                        name=f"{checkout_session.shipping_first_name or data.get('first_name','')} {checkout_session.shipping_last_name or data.get('last_name','')}".strip(),
                        source='checkout'
                    )
                except Exception:
                    # Don't let subscription failures block checkout
                    logger.exception('SubscriberService.subscribe failed for checkout %s', getattr(checkout_session, 'id', None))

                # Update user preference if this is an authenticated user
                if checkout_session.user:
                    try:
                        user = checkout_session.user
                        user.newsletter_subscribed = True
                        user.save(update_fields=['newsletter_subscribed'])
                    except Exception:
                        logger.exception('Failed to update user.newsletter_subscribed for user %s', getattr(checkout_session.user, 'id', None))

            else:
                # If user explicitly unchecks newsletter during checkout, update their preference and unsubscribe
                if checkout_session.user:
                    try:
                        user = checkout_session.user
                        if user.newsletter_subscribed:
                            user.newsletter_subscribed = False
                            user.save(update_fields=['newsletter_subscribed'])
                            try:
                                SubscriberService.unsubscribe(user.email)
                            except Exception:
                                logger.exception('SubscriberService.unsubscribe failed for user %s', getattr(user, 'id', None))
                    except Exception:
                        logger.exception('Failed to handle unsubscribe for checkout %s', getattr(checkout_session, 'id', None))
        except Exception:
            logger.exception('Failed to process newsletter subscription for checkout %s', getattr(checkout_session, 'id', None))
        
        # Save address if requested
        if data.get('save_address') and checkout_session.user:
            cls._save_address_for_user(checkout_session, data)
        
        # Mark step as complete
        if checkout_session.has_valid_contact_info and checkout_session.has_valid_shipping_address:
            checkout_session.information_completed = True
            checkout_session.information_completed_at = timezone.now()
            checkout_session.current_step = CheckoutSession.STEP_SHIPPING
        
        checkout_session.save()
        
        cls.log_event(
            checkout_session,
            CheckoutEvent.EVENT_STEP_COMPLETED,
            step='information'
        )
        
        return checkout_session
    
    @classmethod
    def _save_address_for_user(cls, checkout_session: CheckoutSession, data: Dict) -> None:
        """Save shipping address to user's address book."""
        from apps.accounts.models import Address
        
        try:
            full_name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            if not full_name:
                full_name = data.get('full_name', '')
            
            Address.objects.create(
                user=checkout_session.user,
                address_type='shipping',
                full_name=full_name,
                phone=data.get('phone', ''),
                address_line_1=data.get('address_line_1', ''),
                address_line_2=data.get('address_line_2', ''),
                city=data.get('city', ''),
                state=data.get('state', ''),
                postal_code=data.get('postal_code', ''),
                country=data.get('country', 'Bangladesh'),
                is_default=data.get('set_as_default', False),
            )
        except Exception as e:
            logger.warning(f"Failed to save address: {e}")
    
    @classmethod
    def update_billing_address(
        cls,
        checkout_session: CheckoutSession,
        data: Dict[str, Any]
    ) -> CheckoutSession:
        """
        Update billing address.
        
        Args:
            checkout_session: CheckoutSession instance
            data: Dictionary with billing address fields
            
        Returns:
            Updated CheckoutSession
        """
        checkout_session.billing_same_as_shipping = data.get('same_as_shipping', True)
        
        if not checkout_session.billing_same_as_shipping:
            checkout_session.billing_first_name = data.get('first_name', '')
            checkout_session.billing_last_name = data.get('last_name', '')
            checkout_session.billing_company = data.get('company', '')
            checkout_session.billing_address_line_1 = data.get('address_line_1', '')
            checkout_session.billing_address_line_2 = data.get('address_line_2', '')
            checkout_session.billing_city = data.get('city', '')
            checkout_session.billing_state = data.get('state', '')
            checkout_session.billing_postal_code = data.get('postal_code', '')
            checkout_session.billing_country = data.get('country', 'Bangladesh')
        
        checkout_session.save()
        return checkout_session
    
    @classmethod
    def set_shipping_method(
        cls,
        checkout_session: CheckoutSession,
        shipping_method: str,
        shipping_rate_id: str = None,
        pickup_location_id: str = None
    ) -> CheckoutSession:
        """
        Set shipping method on checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            shipping_method: Shipping method code
            shipping_rate_id: Optional shipping rate ID
            pickup_location_id: Optional pickup location ID
            
        Returns:
            Updated CheckoutSession
        """
        from apps.cart.services import CartService
        
        # Handle store pickup
        if shipping_method == CheckoutSession.SHIPPING_PICKUP:
            checkout_session.shipping_method = shipping_method
            if pickup_location_id:
                pickup_location = StoreLocation.objects.filter(
                    id=pickup_location_id,
                    is_active=True,
                    is_pickup_location=True
                ).first()
                
                if pickup_location:
                    # Convert pickup fee into checkout currency if needed
                    from apps.currencies.services import CurrencyService, CurrencyConversionService
                    checkout_currency = CurrencyService.get_currency_by_code(checkout_session.currency) if checkout_session.currency else CurrencyService.get_default_currency()
                    try:
                        base_currency = CurrencyService.get_default_currency()
                        if base_currency and checkout_currency and base_currency.code != checkout_currency.code:
                            converted_fee = CurrencyConversionService.convert_by_code(pickup_location.pickup_fee, base_currency.code, checkout_currency.code)
                        else:
                            converted_fee = pickup_location.pickup_fee
                    except Exception:
                        converted_fee = pickup_location.pickup_fee

                    checkout_session.pickup_location = pickup_location
                    checkout_session.shipping_cost = converted_fee
                else:
                    raise ValidationError("Invalid pickup location", code='invalid_pickup')
            else:
                checkout_session.shipping_cost = Decimal('0')
        
        # Handle shipping rate
        elif shipping_rate_id:
            shipping_rate = ShippingRate.objects.filter(
                id=shipping_rate_id,
                is_active=True
            ).select_related('method').first()
            
            if shipping_rate:
                # Get the method code from the rate's method
                checkout_session.shipping_method = shipping_rate.method.code
                
                from apps.currencies.services import CurrencyService, CurrencyConversionService
                checkout_currency = CurrencyService.get_currency_by_code(checkout_session.currency) if checkout_session.currency else CurrencyService.get_default_currency()
                cart_summary = CartService.get_cart_summary(checkout_session.cart, currency=checkout_currency)
                subtotal = Decimal(str(cart_summary.get('subtotal', 0)))
                item_count = cart_summary.get('item_count', 0)
                weight = Decimal(str(cart_summary.get('total_weight', 0)))

                # Convert subtotal to the rate currency for correct threshold checks
                rate_currency_obj = getattr(shipping_rate, 'currency', None)
                rate_currency_code = rate_currency_obj.code if rate_currency_obj else (checkout_currency.code if checkout_currency else None)
                try:
                    if rate_currency_obj and checkout_currency and rate_currency_obj.code != checkout_currency.code:
                        subtotal_in_rate_currency = CurrencyConversionService.convert_by_code(subtotal, checkout_currency.code, rate_currency_obj.code)
                    else:
                        subtotal_in_rate_currency = subtotal
                except Exception:
                    subtotal_in_rate_currency = subtotal

                # Calculate rate (returns amount in rate currency)
                rate_amount = shipping_rate.calculate_rate(
                    subtotal=subtotal_in_rate_currency,
                    weight=weight,
                    item_count=item_count
                )

                # Convert rate_amount back to checkout currency to store
                try:
                    if rate_currency_obj and checkout_currency and rate_currency_obj.code != checkout_currency.code:
                        converted_rate = CurrencyConversionService.convert_by_code(rate_amount, rate_currency_obj.code, checkout_currency.code)
                    else:
                        converted_rate = rate_amount
                except Exception:
                    converted_rate = rate_amount

                checkout_session.shipping_rate = shipping_rate
                checkout_session.shipping_cost = converted_rate
            else:
                raise ValidationError("Invalid shipping method selected", code='invalid_shipping')
        else:
            raise ValidationError("Please select a valid shipping method for your location", code='no_shipping')
        
        # Mark shipping as complete
        checkout_session.shipping_completed = True
        checkout_session.shipping_completed_at = timezone.now()
        checkout_session.current_step = CheckoutSession.STEP_PAYMENT
        
        checkout_session.save()
        
        cls.log_event(
            checkout_session,
            CheckoutEvent.EVENT_SHIPPING_SELECTED,
            data={'method': shipping_method, 'cost': str(checkout_session.shipping_cost)}
        )
        
        return checkout_session
    
    @classmethod
    def set_payment_method(
        cls,
        checkout_session: CheckoutSession,
        payment_method: str,
        saved_payment_method_id: str = None
    ) -> CheckoutSession:
        """
        Set payment method on checkout session with validation against configured gateways.
        
        This validates availability (currency/country/amount) and ensures required
        credentials are present for production gateways (e.g., Stripe keys).
        """
        # Normalize
        pm_code = (payment_method or '').lower()

        # Try to resolve from DB-configured gateways first
        gateway = None
        try:
            from apps.payments.models import PaymentGateway
            gateway = PaymentGateway.objects.filter(code=pm_code, is_active=True).first()
        except Exception:
            gateway = None

        # Ensure checkout totals are up-to-date for amount checks
        try:
            checkout_session.calculate_totals()
        except Exception:
            pass

        # Validate availability if gateway exists
        if gateway:
            currency = checkout_session.currency
            country = checkout_session.shipping_country
            amount = float(checkout_session.total) if hasattr(checkout_session, 'total') else None

            if not gateway.is_available_for(currency=currency, country=country, amount=amount):
                raise CheckoutError('Selected payment method is not available for your order.', code='payment_unavailable')

            # Credential checks for production mode gateways
            if not gateway.is_sandbox:
                # Stripe requires secret key in settings or gateway.api_key
                if gateway.code == PaymentGateway.CODE_STRIPE:
                    stripe_secret = getattr(settings, 'STRIPE_SECRET_KEY', '') or gateway.api_secret
                    stripe_pub = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '') or gateway.api_key
                    if not stripe_secret or not stripe_pub:
                        raise CheckoutError('Stripe credentials are not configured for production. Please contact support.', code='gateway_credentials_missing')

                # Generic check for other providers - require api_key or merchant_id
                elif gateway.code in (PaymentGateway.CODE_BKASH, PaymentGateway.CODE_NAGAD):
                    if not (gateway.api_key or gateway.merchant_id):
                        raise CheckoutError('Payment gateway is not configured. Please contact support.', code='gateway_credentials_missing')

        else:
            # Fallback: only allow known fallback codes and basic availability
            allowed = {CheckoutSession.PAYMENT_STRIPE, CheckoutSession.PAYMENT_BKASH,
                       CheckoutSession.PAYMENT_NAGAD, CheckoutSession.PAYMENT_COD, CheckoutSession.PAYMENT_BANK}
            if pm_code not in allowed:
                raise CheckoutError('Invalid payment method selected', code='invalid_payment')

            # If stripe selected but no settings, prevent selection in production
            if pm_code == CheckoutSession.PAYMENT_STRIPE:
                stripe_secret = getattr(settings, 'STRIPE_SECRET_KEY', '')
                stripe_pub = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '')
                if not stripe_secret or not stripe_pub:
                    # Allow in DEBUG if developer wants to test without keys
                    if not getattr(settings, 'DEBUG', False):
                        raise CheckoutError('Stripe is not configured for production. Please configure STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY.', code='gateway_credentials_missing')

        # Save selection
        checkout_session.payment_method = pm_code

        # Handle saved payment method reference
        if saved_payment_method_id and checkout_session.user:
            from apps.payments.models import PaymentMethod
            saved_method = PaymentMethod.objects.filter(
                id=saved_payment_method_id,
                user=checkout_session.user,
                is_active=True
            ).first()

            if saved_method:
                checkout_session.saved_payment_method = saved_method

        checkout_session.payment_setup_completed = True
        checkout_session.current_step = CheckoutSession.STEP_REVIEW

        checkout_session.save()

        cls.log_event(
            checkout_session,
            CheckoutEvent.EVENT_PAYMENT_SELECTED,
            data={'method': pm_code}
        )

        return checkout_session
    
    @classmethod
    def apply_coupon(
        cls,
        checkout_session: CheckoutSession,
        coupon_code: str
    ) -> Tuple[bool, str]:
        """
        Apply coupon to checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            coupon_code: Coupon code to apply
            
        Returns:
            Tuple of (success, message)
        """
        from apps.promotions.models import Coupon
        from apps.promotions.services import CouponService
        
        try:
            coupon, is_valid, message = CouponService.validate_coupon(
                code=coupon_code,
                user=checkout_session.user,
                subtotal=checkout_session.subtotal
            )
            
            if not is_valid or not coupon:
                return False, message or "Invalid coupon code"
            
            checkout_session.coupon = coupon
            checkout_session.coupon_code = coupon.code
            checkout_session.discount_amount = coupon.calculate_discount(checkout_session.subtotal)
            checkout_session.save()
            
            cls.log_event(
                checkout_session,
                CheckoutEvent.EVENT_COUPON_APPLIED,
                data={'code': coupon_code, 'discount': str(checkout_session.discount_amount)}
            )
            
            return True, f"Coupon applied! You saved ৳{checkout_session.discount_amount}"
        
        except Exception as e:
            logger.error(f"Coupon apply error: {e}")
            return False, "Failed to apply coupon"
    
    @classmethod
    def remove_coupon(cls, checkout_session: CheckoutSession) -> CheckoutSession:
        """Remove coupon from checkout session."""
        old_code = checkout_session.coupon_code
        
        checkout_session.coupon = None
        checkout_session.coupon_code = ''
        checkout_session.discount_amount = Decimal('0')
        checkout_session.save()
        
        cls.log_event(
            checkout_session,
            CheckoutEvent.EVENT_COUPON_REMOVED,
            data={'code': old_code}
        )
        
        return checkout_session
    
    @classmethod
    def set_gift_options(
        cls,
        checkout_session: CheckoutSession,
        is_gift: bool = False,
        gift_message: str = '',
        gift_wrap: bool = False
    ) -> CheckoutSession:
        """Set gift options on checkout session."""
        checkout_session.is_gift = is_gift
        checkout_session.gift_message = gift_message[:500] if gift_message else ''
        # Only enable gift wrap if the site setting allows it
        fee = cls.get_gift_wrap_fee()
        if gift_wrap and fee > 0:
            checkout_session.gift_wrap = True
            checkout_session.gift_wrap_cost = fee
        else:
            checkout_session.gift_wrap = False
            checkout_session.gift_wrap_cost = Decimal('0')
        checkout_session.save()
        
        return checkout_session
    
    @classmethod
    def set_order_notes(
        cls,
        checkout_session: CheckoutSession,
        order_notes: str = '',
        delivery_instructions: str = ''
    ) -> CheckoutSession:
        """Set order notes and delivery instructions."""
        checkout_session.order_notes = order_notes
        checkout_session.delivery_instructions = delivery_instructions
        checkout_session.save()
        
        return checkout_session
    
    @classmethod
    def create_payment_intent(cls, checkout_session: CheckoutSession) -> Optional[Dict]:
        """
        Create Stripe payment intent for checkout.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Payment intent data or None
        """
        if not stripe:
            logger.error("Stripe not installed")
            return None
        
        stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')
        
        if not stripe.api_key:
            logger.error("Stripe API key not configured")
            return None
        
        # Calculate total
        checkout_session.calculate_totals()
        total = checkout_session.total
        
        # Convert to smallest currency unit (paisa for BDT, cents for USD)
        amount = int(total * 100)
        
        if amount <= 0:
            return None
        
        try:
            # Check if we already have a payment intent
            if checkout_session.stripe_payment_intent_id:
                try:
                    intent = stripe.PaymentIntent.modify(
                        checkout_session.stripe_payment_intent_id,
                        amount=amount
                    )
                    checkout_session.stripe_client_secret = intent.client_secret
                    checkout_session.save()
                    return {
                        'id': intent.id,
                        'client_secret': intent.client_secret,
                        'amount': amount
                    }
                except stripe.error.InvalidRequestError:
                    pass
            
            # Create new payment intent
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=checkout_session.currency.lower(),
                automatic_payment_methods={'enabled': True},
                metadata={
                    'checkout_session_id': str(checkout_session.id),
                    'user_id': str(checkout_session.user_id) if checkout_session.user else '',
                    'email': checkout_session.customer_email,
                },
                receipt_email=checkout_session.customer_email if checkout_session.customer_email else None,
            )
            
            checkout_session.stripe_payment_intent_id = intent.id
            checkout_session.stripe_client_secret = intent.client_secret
            checkout_session.save()
            
            cls.log_event(
                checkout_session,
                CheckoutEvent.EVENT_PAYMENT_STARTED,
                data={'intent_id': intent.id, 'amount': amount}
            )
            
            return {
                'id': intent.id,
                'client_secret': intent.client_secret,
                'amount': amount
            }
        
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            checkout_session.last_error = str(e)
            checkout_session.save()
            raise PaymentError(str(e), code='stripe_error')
    
    @classmethod
    def get_shipping_options(
        cls,
        checkout_session: CheckoutSession
    ) -> List[Dict]:
        """
        Get available shipping options with calculated costs.
        Returns only the best matching zone's rates for the customer's location.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            List of shipping options sorted by cost
        """
        from apps.cart.services import CartService
        from apps.currencies.services import CurrencyService, CurrencyConversionService

        checkout_currency = CurrencyService.get_currency_by_code(checkout_session.currency) if checkout_session.currency else None
        cart_summary = CartService.get_cart_summary(checkout_session.cart, currency=checkout_currency)
        subtotal = Decimal(str(cart_summary.get('subtotal', 0)))
        item_count = cart_summary.get('item_count', 0)
        weight = Decimal(str(cart_summary.get('total_weight', 0)))
        country = checkout_session.shipping_country
        state = checkout_session.shipping_state  # Division name in BD (e.g., "Rangpur")
        city = checkout_session.shipping_city     # District/City name (e.g., "Kurigram")
        postal_code = checkout_session.shipping_postal_code
        
        options = []
        matching_zones = []
        
        try:
            # Get all active zones ordered by priority (highest first)
            zones = ShippingZone.objects.filter(is_active=True).order_by('-priority')
            default_zone = None
            
            for zone in zones:
                if zone.is_default:
                    default_zone = zone
                    # Include default zone in matching zones (lowest priority)
                    matching_zones.append(zone)
                    continue
                
                # Use the model's matches_location method which checks
                # postal_codes, cities, states, countries in priority order
                if zone.matches_location(
                    country=country, 
                    state=state, 
                    city=city,
                    postal_code=postal_code
                ):
                    matching_zones.append(zone)
            
            # Sort by priority (highest first) and limit to 5 best matches
            matching_zones.sort(key=lambda z: z.priority, reverse=True)
            matching_zones = matching_zones[:5]
                
        except Exception as e:
            logger.warning(f"Error finding shipping zones: {e}")
        
        # Get shipping rates for all matching zones
        seen_methods = set()  # Avoid duplicate method+zone combinations
        
        for zone in matching_zones:
            shipping_rates = ShippingRate.objects.filter(
                zone=zone,
                is_active=True,
                method__is_active=True
            ).select_related('method', 'method__carrier').order_by('base_rate', 'method__sort_order')
            
            for rate in shipping_rates:
                method_zone_key = f"{rate.method.code}_{zone.name}"
                if method_zone_key in seen_methods:
                    continue
                seen_methods.add(method_zone_key)
                
                # Determine rate amount in the rate's currency then convert to checkout currency for display
                rate_currency_obj = getattr(rate, 'currency', None)

                try:
                    if rate_currency_obj and checkout_currency and rate_currency_obj.code != checkout_currency.code:
                        # Convert subtotal into rate currency for threshold checks/pricing
                        try:
                            subtotal_in_rate_currency = CurrencyConversionService.convert_by_code(subtotal, checkout_currency.code, rate_currency_obj.code)
                        except Exception:
                            subtotal_in_rate_currency = subtotal
                        try:
                            rate_amount_in_rate_currency = rate.calculate_rate(subtotal=subtotal_in_rate_currency, weight=weight, item_count=item_count)
                        except Exception:
                            rate_amount_in_rate_currency = rate.base_rate
                        # Convert rate amount back to checkout currency for display
                        try:
                            display_cost = CurrencyConversionService.convert_by_code(rate_amount_in_rate_currency, rate_currency_obj.code, checkout_currency.code)
                        except Exception:
                            display_cost = rate_amount_in_rate_currency
                    else:
                        # Same currency - calculate directly
                        try:
                            display_cost = rate.calculate_rate(subtotal=subtotal, weight=weight, item_count=item_count)
                        except Exception:
                            display_cost = rate.base_rate
                except Exception:
                    display_cost = rate.base_rate

                try:
                    formatted_cost = checkout_currency.format_amount(display_cost) if (checkout_currency and display_cost > 0) else ('Free' if display_cost == 0 else f"{checkout_currency.symbol if checkout_currency else '৳'}{display_cost:,.2f}")
                except Exception:
                    formatted_cost = f"{checkout_currency.symbol if checkout_currency else '৳'}{display_cost:,.2f}" if display_cost > 0 else 'Free'

                options.append({
                    'id': str(rate.id),
                    'code': rate.method.code,
                    'name': rate.method.name,
                    'description': rate.method.description or f'Delivery to {zone.name}',
                    'carrier': rate.method.carrier.name if rate.method.carrier else '',
                    'cost': float(display_cost),
                    'formatted_cost': formatted_cost,
                    'currency': {
                        'code': rate_currency_obj.code if rate_currency_obj else (checkout_currency.code if checkout_currency else None),
                        'symbol': rate_currency_obj.symbol if rate_currency_obj else (checkout_currency.symbol if checkout_currency else None)
                    } if rate_currency_obj or checkout_currency else None,
                    'delivery_estimate': rate.method.delivery_estimate,
                    'is_free': display_cost == 0,
                    'zone': zone.name,
                    'zone_priority': zone.priority,
                })
        
        # Sort by cost (cheapest first, but free options at top)
        options.sort(key=lambda x: (0 if x['is_free'] else 1, x['cost']))
        
        return options
    
    @classmethod
    def _get_default_delivery_estimate(cls, method: str) -> str:
        """Get default delivery estimate for shipping method."""
        estimates = {
            CheckoutSession.SHIPPING_STANDARD: '5-7 business days',
            CheckoutSession.SHIPPING_EXPRESS: '2-3 business days',
            CheckoutSession.SHIPPING_OVERNIGHT: 'Next business day',
            CheckoutSession.SHIPPING_FREE: '7-10 business days',
        }
        return estimates.get(method, '5-7 business days')
    
    @classmethod
    def get_pickup_locations(cls) -> List[Dict]:
        """Get available pickup locations."""
        locations = StoreLocation.objects.filter(
            is_active=True,
            is_pickup_location=True
        ).order_by('order')
        
        from apps.currencies.services import CurrencyService
        currency = CurrencyService.get_default_currency()
        result = []
        for loc in locations:
            try:
                if loc.pickup_fee and currency:
                    formatted_fee = currency.format_amount(loc.pickup_fee)
                else:
                    formatted_fee = 'Free' if not loc.pickup_fee else f"{loc.pickup_fee:,.2f}"
            except Exception:
                formatted_fee = f"{loc.pickup_fee:,.2f}" if loc.pickup_fee else 'Free'

            result.append({
                'id': str(loc.id),
                'name': loc.name,
                'address': loc.full_address,
                'phone': loc.phone,
                'fee': float(loc.pickup_fee),
                'formatted_fee': formatted_fee if loc.pickup_fee > 0 else 'Free',
                'min_pickup_time': f"{loc.min_pickup_time_hours} hours",
                'opening_hours': loc.get_hours() if hasattr(loc, 'get_hours') else {},
            })
        return result
    
    @classmethod
    def get_checkout_summary(cls, checkout_session: CheckoutSession) -> Dict:
        """
        Get complete checkout summary.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Dictionary with checkout summary
        """
        from apps.cart.services import CartService
        from apps.currencies.services import CurrencyService

        checkout_currency = CurrencyService.get_currency_by_code(checkout_session.currency) if checkout_session.currency else None
        cart_summary = CartService.get_cart_summary(checkout_session.cart, currency=checkout_currency)

        # Recalculate totals
        checkout_session.calculate_totals()

        # Resolve currency formatting
        currency_obj = checkout_currency or CurrencyService.get_default_currency()

        # COD fee
        cod_fee = Decimal('0')
        if checkout_session.payment_method == CheckoutSession.PAYMENT_COD:
            cod_fee = cls.COD_FEE

        total = checkout_session.total + cod_fee

        try:
            formatted_subtotal = currency_obj.format_amount(checkout_session.subtotal)
        except Exception:
            formatted_subtotal = f"{currency_obj.symbol if currency_obj else '৳'}{checkout_session.subtotal:,.2f}"

        try:
            formatted_discount = f"-{currency_obj.format_amount(checkout_session.discount_amount)}" if checkout_session.discount_amount else ''
        except Exception:
            formatted_discount = f"-{currency_obj.symbol if currency_obj else '৳'}{checkout_session.discount_amount:,.2f}" if checkout_session.discount_amount else ''

        try:
            formatted_shipping = currency_obj.format_amount(checkout_session.shipping_cost) if checkout_session.shipping_cost > 0 else 'Free'
        except Exception:
            formatted_shipping = f"{currency_obj.symbol if currency_obj else '৳'}{checkout_session.shipping_cost:,.2f}" if checkout_session.shipping_cost > 0 else 'Free'

        try:
            formatted_tax = currency_obj.format_amount(checkout_session.tax_amount) if checkout_session.tax_amount else ''
        except Exception:
            formatted_tax = f"{currency_obj.symbol if currency_obj else '৳'}{checkout_session.tax_amount:,.2f}" if checkout_session.tax_amount else ''

        return {
            'items': cart_summary.get('items', []),
            'item_count': cart_summary.get('item_count', 0),
            'subtotal': float(checkout_session.subtotal),
            'formatted_subtotal': formatted_subtotal,
            'discount': float(checkout_session.discount_amount),
            'formatted_discount': formatted_discount,
            'coupon_code': checkout_session.coupon_code,
            'shipping_method': checkout_session.get_shipping_method_display(),
            'shipping_cost': float(checkout_session.shipping_cost),
            'formatted_shipping': formatted_shipping,
            'tax': float(checkout_session.tax_amount),
            'formatted_tax': formatted_tax,
            'gift_wrap': checkout_session.gift_wrap,
            'gift_wrap_cost': float(checkout_session.gift_wrap_cost),
            'formatted_gift_wrap': (currency_obj.format_amount(checkout_session.gift_wrap_cost) if checkout_session.gift_wrap_cost else '') if currency_obj else (f"{checkout_session.gift_wrap_cost:,.2f}" if checkout_session.gift_wrap_cost else ''),
            'cod_fee': float(cod_fee),
            'formatted_cod_fee': (currency_obj.format_amount(cod_fee) if cod_fee > 0 else '') if currency_obj else (f"{cod_fee:,.2f}" if cod_fee > 0 else ''),
            'total': float(total),
            'formatted_total': (currency_obj.format_amount(total) if currency_obj else f"{total:,.2f}"),
            'currency': {
                'code': checkout_currency.code if checkout_currency else (currency_obj.code if currency_obj else 'BDT'),
                'symbol': checkout_currency.symbol if checkout_currency else (currency_obj.symbol if currency_obj else '৳'),
                'decimal_places': checkout_currency.decimal_places if checkout_currency else (currency_obj.decimal_places if currency_obj else 2),
                'locale': 'en-BD' if (checkout_currency and getattr(checkout_currency, 'code', '') == 'BDT') or (not checkout_currency and getattr(currency_obj, 'code', '') == 'BDT') else 'en-US'
            },
            'shipping_address': checkout_session.get_shipping_address_dict(),
            'billing_address': checkout_session.get_billing_address_dict(),
            'billing_same_as_shipping': checkout_session.billing_same_as_shipping,
            'payment_method': checkout_session.get_payment_method_display(),
            'payment_method_code': checkout_session.payment_method,
            'is_gift': checkout_session.is_gift,
            'gift_message': checkout_session.gift_message,
            'order_notes': checkout_session.order_notes,
            'delivery_instructions': checkout_session.delivery_instructions,
        }
    
    @classmethod
    def proceed_to_review(cls, checkout_session: CheckoutSession) -> CheckoutSession:
        """Proceed to review step."""
        if checkout_session.can_proceed_to_review:
            checkout_session.current_step = CheckoutSession.STEP_REVIEW
            checkout_session.review_completed = True
            checkout_session.save()
            
            cls.log_event(
                checkout_session,
                CheckoutEvent.EVENT_STEP_COMPLETED,
                step='review'
            )
        
        return checkout_session
    
    @classmethod
    @transaction.atomic
    def complete_checkout(
        cls,
        checkout_session: CheckoutSession,
        payment_intent_id: str = None,
        payment_data: Dict = None
    ) -> Tuple[Optional[Any], Optional[str]]:
        """
        Complete checkout and create order.
        
        Args:
            checkout_session: CheckoutSession instance
            payment_intent_id: Stripe payment intent ID
            payment_data: Additional payment data
            
        Returns:
            Tuple of (Order instance, error message)
        """
        from apps.orders.services import OrderService
        
        # Validate checkout can be completed
        if not checkout_session.can_complete:
            return None, "Checkout is incomplete. Please fill all required information."
        
        # Mark as processing
        checkout_session.current_step = CheckoutSession.STEP_PROCESSING
        checkout_session.save()
        
        # Verify payment if required
        if checkout_session.requires_payment:
            # Stripe: verify via payment intent
            if checkout_session.payment_method == CheckoutSession.PAYMENT_STRIPE:
                verified, error = cls._verify_stripe_payment(checkout_session, payment_intent_id)
                if not verified:
                    checkout_session.mark_failed(error)
                    
                    cls.log_event(
                        checkout_session,
                        CheckoutEvent.EVENT_PAYMENT_FAILED,
                        data={'error': error}
                    )
                    
                    return None, error

            # # bKash / Nagad: ensure the payment request has been created and is marked ready
            # elif checkout_session.payment_method in (CheckoutSession.PAYMENT_BKASH, CheckoutSession.PAYMENT_NAGAD):
            #     if not checkout_session.payment_ready:
            #         error = 'Mobile payment not completed. Please complete the payment via the provider.'
            #         checkout_session.mark_failed(error)
            #         cls.log_event(
            #             checkout_session,
            #             CheckoutEvent.EVENT_PAYMENT_FAILED,
            #             data={'error': error, 'method': checkout_session.payment_method}
            #         )
            #         return None, error
        
        try:
            # Create order
            order = OrderService.create_order_from_checkout(checkout_session)
            
            if order:
                # Mark checkout as complete
                checkout_session.current_step = CheckoutSession.STEP_COMPLETE
                checkout_session.order = order
                checkout_session.order_placed_at = timezone.now()
                checkout_session.save()
                
                # Clear cart
                cls._clear_cart(checkout_session)
                
                cls.log_event(
                    checkout_session,
                    CheckoutEvent.EVENT_ORDER_CREATED,
                    data={'order_id': str(order.id), 'order_number': order.order_number}
                )
                
                # Send confirmation email
                cls._send_order_confirmation(order)
                
                return order, None
            
            return None, "Failed to create order"
        
        except Exception as e:
            logger.error(f"Checkout completion error: {e}")
            checkout_session.mark_failed(str(e))
            return None, str(e)
    
    @classmethod
    def _verify_stripe_payment(
        cls,
        checkout_session: CheckoutSession,
        payment_intent_id: str = None
    ) -> Tuple[bool, Optional[str]]:
        """Verify Stripe payment was successful."""
        if not stripe:
            return False, "Payment service unavailable"
        
        stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')
        
        intent_id = payment_intent_id or checkout_session.stripe_payment_intent_id
        
        if not intent_id:
            return False, "No payment intent found"
        
        try:
            intent = stripe.PaymentIntent.retrieve(intent_id)
            
            if intent.status == 'succeeded':
                cls.log_event(
                    checkout_session,
                    CheckoutEvent.EVENT_PAYMENT_COMPLETED,
                    data={'intent_id': intent_id}
                )
                return True, None
            elif intent.status == 'requires_action':
                return False, "Payment requires additional action"
            elif intent.status == 'requires_payment_method':
                return False, "Payment method failed"
            else:
                return False, f"Payment status: {intent.status}"
        
        except stripe.error.StripeError as e:
            logger.error(f"Stripe verification error: {e}")
            return False, str(e)
    
    @classmethod
    def _clear_cart(cls, checkout_session: CheckoutSession) -> None:
        """Clear cart after successful checkout."""
        try:
            checkout_session.cart.items.all().delete()
            checkout_session.cart.coupon = None
            checkout_session.cart.save()
        except Exception as e:
            logger.warning(f"Failed to clear cart: {e}")
    
    @classmethod
    def _send_order_confirmation(cls, order) -> None:
        """Send order confirmation email."""
        try:
            from apps.notifications.services import EmailService
            EmailService.send_order_confirmation(order)
        except Exception as e:
            logger.warning(f"Failed to send order confirmation: {e}")
    
    @classmethod
    def validate_checkout(cls, checkout_session: CheckoutSession) -> List[Dict]:
        """
        Validate checkout session completely.
        
        Returns:
            List of validation issues
        """
        from apps.cart.services import CartService
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"validate_checkout - Session ID: {checkout_session.id}")
        logger.info(f"validate_checkout - payment_method: '{checkout_session.payment_method}'")
        logger.info(f"validate_checkout - payment_setup_completed: {checkout_session.payment_setup_completed}")
        logger.info(f"validate_checkout - tax_rate: {checkout_session.tax_rate}")
        logger.info(f"validate_checkout - discount_amount: {checkout_session.discount_amount}")
        logger.info(f"validate_checkout - coupon: {checkout_session.coupon}")
        logger.info(f"validate_checkout - is_gift: {checkout_session.is_gift}, gift_wrap: {checkout_session.gift_wrap}")
        
        issues = []
        
        # Validate cart
        if not checkout_session.cart or not checkout_session.cart.items.exists():
            issues.append({
                'field': 'cart',
                'message': 'Your cart is empty',
                'code': 'empty_cart'
            })
            return issues
        
        # Validate cart items
        cart_issues = CartService.validate_cart(checkout_session.cart)
        if cart_issues:
            for issue in cart_issues:
                issues.append({
                    'field': 'cart',
                    'message': issue.get('issue') or str(issue),
                    'code': 'cart_issue',
                    'item': issue.get('product')
                })
        
        # Validate contact info
        if not checkout_session.customer_email:
            issues.append({
                'field': 'email',
                'message': 'Email is required',
                'code': 'required'
            })
        
        if not checkout_session.shipping_first_name:
            issues.append({
                'field': 'first_name',
                'message': 'First name is required',
                'code': 'required'
            })
        
        if not checkout_session.shipping_last_name:
            issues.append({
                'field': 'last_name',
                'message': 'Last name is required',
                'code': 'required'
            })
        
        # Validate shipping address (unless pickup)
        if checkout_session.shipping_method != CheckoutSession.SHIPPING_PICKUP:
            if not checkout_session.shipping_address_line_1:
                issues.append({
                    'field': 'address_line_1',
                    'message': 'Address is required',
                    'code': 'required'
                })
            
            if not checkout_session.shipping_city:
                issues.append({
                    'field': 'city',
                    'message': 'City is required',
                    'code': 'required'
                })
            
            if not checkout_session.shipping_postal_code:
                issues.append({
                    'field': 'postal_code',
                    'message': 'Postal code is required',
                    'code': 'required'
                })
        else:
            if not checkout_session.pickup_location:
                issues.append({
                    'field': 'pickup_location',
                    'message': 'Please select a pickup location',
                    'code': 'required'
                })
        
        # Validate billing address if different
        if not checkout_session.billing_same_as_shipping:
            if not checkout_session.has_valid_billing_address:
                issues.append({
                    'field': 'billing_address',
                    'message': 'Billing address is incomplete',
                    'code': 'incomplete'
                })
        
        # Validate payment method
        logger.info(f"validate_checkout - Checking payment_method: '{checkout_session.payment_method}' (bool: {bool(checkout_session.payment_method)})")
        if not checkout_session.payment_method:
            logger.warning(f"validate_checkout - Payment method is empty/falsy!")
            issues.append({
                'field': 'payment_method',
                'message': 'Please select a payment method',
                'code': 'required'
            })
        
        return issues
    
    @classmethod
    def log_event(
        cls,
        checkout_session: CheckoutSession,
        event_type: str,
        step: str = '',
        data: Dict = None,
        request = None
    ) -> CheckoutEvent:
        """Log checkout event for analytics."""
        event = CheckoutEvent.objects.create(
            checkout_session=checkout_session,
            event_type=event_type,
            step=step or checkout_session.current_step,
            data=data or {},
            ip_address=checkout_session.ip_address,
            user_agent=checkout_session.user_agent,
        )
        return event
    
    @classmethod
    def create_abandoned_checkout(cls, checkout_session: CheckoutSession) -> Optional[AbandonedCheckout]:
        """Create abandoned checkout record for recovery."""
        if not checkout_session.customer_email:
            return None
        
        # Get cart items snapshot
        cart_items = []
        try:
            for item in checkout_session.cart.items.select_related('product', 'variant'):
                cart_items.append({
                    'product_id': str(item.product_id),
                    'product_name': item.product.name if item.product else 'Unknown',
                    'variant_id': str(item.variant_id) if item.variant else None,
                    'variant_name': item.variant.name if item.variant else None,
                    'quantity': item.quantity,
                    'price': float(item.price_at_add),
                })
        except Exception:
            pass
        
        abandoned, created = AbandonedCheckout.objects.update_or_create(
            checkout_session=checkout_session,
            defaults={
                'email': checkout_session.customer_email,
                'first_name': checkout_session.shipping_first_name,
                'cart_items': cart_items,
                'subtotal': checkout_session.subtotal,
                'currency': checkout_session.currency,
                'abandoned_at_step': checkout_session.current_step,
            }
        )
        
        return abandoned
    
    @classmethod
    def cleanup_expired_sessions(cls) -> int:
        """Delete expired checkout sessions and create abandoned records."""
        expired = CheckoutSession.objects.filter(
            expires_at__lt=timezone.now()
        ).exclude(
            current_step__in=[
                CheckoutSession.STEP_COMPLETE,
                CheckoutSession.STEP_ABANDONED,
                CheckoutSession.STEP_FAILED
            ]
        )
        
        count = 0
        for session in expired:
            if session.customer_email:
                cls.create_abandoned_checkout(session)
            session.mark_abandoned('Session expired')
            count += 1
        
        return count
    
    @classmethod
    def recover_checkout(cls, token: str) -> Optional[CheckoutSession]:
        """
        Recover abandoned checkout by token.
        
        Returns:
            New or existing checkout session
        """
        abandoned = AbandonedCheckout.objects.filter(
            recovery_token=token,
            is_recovered=False,
            is_opted_out=False
        ).first()
        
        if not abandoned:
            return None
        
        # Check if original session is still valid
        original = abandoned.checkout_session
        if original and original.is_active:
            original.extend_expiry(hours=48)
            return original
        
        # Cannot recover if cart is gone
        return None


# Legacy compatibility - keep old function signatures working
def get_or_create_session(cart, user=None, session_key=None):
    return CheckoutService.get_or_create_session(cart, user, session_key)

def update_shipping_address(checkout_session, data):
    return CheckoutService.update_contact_information(checkout_session, data)

def set_shipping_method(checkout_session, shipping_method):
    return CheckoutService.set_shipping_method(checkout_session, shipping_method)

def set_payment_method(checkout_session, payment_method):
    return CheckoutService.set_payment_method(checkout_session, payment_method)

def create_payment_intent(checkout_session):
    return CheckoutService.create_payment_intent(checkout_session)

def get_checkout_summary(checkout_session):
    return CheckoutService.get_checkout_summary(checkout_session)

def get_shipping_options(checkout_session):
    return CheckoutService.get_shipping_options(checkout_session)

def proceed_to_review(checkout_session):
    return CheckoutService.proceed_to_review(checkout_session)

def complete_checkout(checkout_session, payment_intent_id=None):
    return CheckoutService.complete_checkout(checkout_session, payment_intent_id)

def cleanup_expired_sessions():
    return CheckoutService.cleanup_expired_sessions()
