"""
Checkout services
"""
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import stripe

from .models import CheckoutSession, ShippingRate


class CheckoutService:
    """Service for checkout operations."""
    
    @staticmethod
    def get_or_create_session(cart, user=None, session_key=None):
        """
        Get or create checkout session for cart.
        
        Args:
            cart: Cart instance
            user: Optional user
            session_key: Optional session key for guests
            
        Returns:
            CheckoutSession instance
        """
        # Look for existing active session
        if user:
            checkout_session = CheckoutSession.objects.filter(
                user=user,
                cart=cart,
                current_step__in=[
                    CheckoutSession.STEP_CART,
                    CheckoutSession.STEP_SHIPPING,
                    CheckoutSession.STEP_PAYMENT,
                    CheckoutSession.STEP_REVIEW,
                ]
            ).first()
        else:
            checkout_session = CheckoutSession.objects.filter(
                session_key=session_key,
                cart=cart,
                current_step__in=[
                    CheckoutSession.STEP_CART,
                    CheckoutSession.STEP_SHIPPING,
                    CheckoutSession.STEP_PAYMENT,
                    CheckoutSession.STEP_REVIEW,
                ]
            ).first()
        
        if checkout_session:
            # Check if expired
            if checkout_session.is_expired:
                checkout_session.delete()
            else:
                return checkout_session
        
        # Create new session
        checkout_session = CheckoutSession.objects.create(
            user=user,
            session_key=session_key if not user else None,
            cart=cart,
            expires_at=timezone.now() + timedelta(hours=24)
        )
        
        # Pre-fill from user profile if authenticated
        if user:
            checkout_session.shipping_first_name = user.first_name
            checkout_session.shipping_last_name = user.last_name
            checkout_session.shipping_email = user.email
            checkout_session.shipping_phone = user.phone_number or ''
            
            # Use default shipping address if available
            default_address = user.addresses.filter(
                is_default_shipping=True,
                is_deleted=False
            ).first()
            
            if default_address:
                checkout_session.shipping_address_line_1 = default_address.address_line_1
                checkout_session.shipping_address_line_2 = default_address.address_line_2 or ''
                checkout_session.shipping_city = default_address.city
                checkout_session.shipping_state = default_address.state or ''
                checkout_session.shipping_postal_code = default_address.postal_code
                checkout_session.shipping_country = default_address.country
            
            checkout_session.save()
        
        return checkout_session
    
    @staticmethod
    def update_shipping_address(checkout_session, data):
        """
        Update shipping address on checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            data: Dictionary with address fields
            
        Returns:
            Updated CheckoutSession
        """
        checkout_session.shipping_first_name = data.get('first_name', '')
        checkout_session.shipping_last_name = data.get('last_name', '')
        checkout_session.shipping_email = data.get('email', '')
        checkout_session.shipping_phone = data.get('phone', '')
        checkout_session.shipping_address_line_1 = data.get('address_line_1', '')
        checkout_session.shipping_address_line_2 = data.get('address_line_2', '')
        checkout_session.shipping_city = data.get('city', '')
        checkout_session.shipping_state = data.get('state', '')
        checkout_session.shipping_postal_code = data.get('postal_code', '')
        checkout_session.shipping_country = data.get('country', 'United States')
        
        # Update billing if same as shipping
        checkout_session.billing_same_as_shipping = data.get('billing_same_as_shipping', True)
        
        if not checkout_session.billing_same_as_shipping:
            checkout_session.billing_first_name = data.get('billing_first_name', '')
            checkout_session.billing_last_name = data.get('billing_last_name', '')
            checkout_session.billing_address_line_1 = data.get('billing_address_line_1', '')
            checkout_session.billing_address_line_2 = data.get('billing_address_line_2', '')
            checkout_session.billing_city = data.get('billing_city', '')
            checkout_session.billing_state = data.get('billing_state', '')
            checkout_session.billing_postal_code = data.get('billing_postal_code', '')
            checkout_session.billing_country = data.get('billing_country', 'United States')
        
        checkout_session.current_step = CheckoutSession.STEP_SHIPPING
        checkout_session.save()
        
        return checkout_session
    
    @staticmethod
    def set_shipping_method(checkout_session, shipping_method):
        """
        Set shipping method on checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            shipping_method: Shipping method code
            
        Returns:
            Updated CheckoutSession
        """
        from apps.cart.services import CartService
        
        # Get shipping rate
        shipping_rate = ShippingRate.objects.filter(
            code=shipping_method,
            is_active=True
        ).first()
        
        if shipping_rate:
            # Calculate shipping cost
            cart_summary = CartService.get_cart_summary(checkout_session.cart)
            subtotal = Decimal(cart_summary['subtotal'])
            item_count = cart_summary['item_count']
            
            shipping_cost = shipping_rate.calculate_cost(subtotal, item_count)
            
            checkout_session.shipping_method = shipping_method
            checkout_session.shipping_cost = shipping_cost
        else:
            # Default shipping
            checkout_session.shipping_method = shipping_method
            checkout_session.shipping_cost = CheckoutService.get_default_shipping_cost(
                shipping_method
            )
        
        checkout_session.save()
        return checkout_session
    
    @staticmethod
    def get_default_shipping_cost(shipping_method):
        """Get default shipping cost for method."""
        costs = {
            CheckoutSession.SHIPPING_STANDARD: Decimal('5.99'),
            CheckoutSession.SHIPPING_EXPRESS: Decimal('14.99'),
            CheckoutSession.SHIPPING_OVERNIGHT: Decimal('29.99'),
        }
        return costs.get(shipping_method, Decimal('5.99'))
    
    @staticmethod
    def set_payment_method(checkout_session, payment_method):
        """
        Set payment method on checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            payment_method: Payment method code
            
        Returns:
            Updated CheckoutSession
        """
        checkout_session.payment_method = payment_method
        checkout_session.current_step = CheckoutSession.STEP_PAYMENT
        checkout_session.save()
        
        return checkout_session
    
    @staticmethod
    def create_payment_intent(checkout_session):
        """
        Create Stripe payment intent for checkout.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Stripe PaymentIntent
        """
        from apps.cart.services import CartService
        
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        # Calculate total
        cart_summary = CartService.get_cart_summary(checkout_session.cart)
        subtotal = Decimal(cart_summary['subtotal'])
        discount = Decimal(cart_summary.get('discount', '0'))
        shipping = checkout_session.shipping_cost
        total = subtotal - discount + shipping
        
        # Convert to cents for Stripe
        amount = int(total * 100)
        
        # Check if we already have a payment intent
        if checkout_session.stripe_payment_intent_id:
            try:
                # Update existing intent
                intent = stripe.PaymentIntent.modify(
                    checkout_session.stripe_payment_intent_id,
                    amount=amount
                )
                return intent
            except stripe.error.InvalidRequestError:
                # Intent doesn't exist, create new one
                pass
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            automatic_payment_methods={'enabled': True},
            metadata={
                'checkout_session_id': str(checkout_session.id),
                'user_id': str(checkout_session.user_id) if checkout_session.user else '',
            }
        )
        
        # Save to session
        checkout_session.stripe_payment_intent_id = intent.id
        checkout_session.stripe_client_secret = intent.client_secret
        checkout_session.save()
        
        return intent
    
    @staticmethod
    def get_checkout_summary(checkout_session):
        """
        Get complete checkout summary.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Dictionary with checkout summary
        """
        from apps.cart.services import CartService
        
        cart_summary = CartService.get_cart_summary(checkout_session.cart)
        subtotal = Decimal(cart_summary['subtotal'])
        discount = Decimal(cart_summary.get('discount', '0'))
        shipping = checkout_session.shipping_cost
        total = subtotal - discount + shipping
        
        return {
            'items': cart_summary['items'],
            'item_count': cart_summary['item_count'],
            'subtotal': str(subtotal),
            'discount': str(discount),
            'coupon': cart_summary.get('coupon'),
            'shipping_method': checkout_session.get_shipping_method_display(),
            'shipping_cost': str(shipping),
            'total': str(total),
            'shipping_address': checkout_session.get_shipping_address_dict(),
            'billing_address': checkout_session.get_billing_address_dict(),
            'payment_method': checkout_session.get_payment_method_display(),
        }
    
    @staticmethod
    def get_shipping_options(checkout_session):
        """
        Get available shipping options with calculated costs.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            List of shipping options
        """
        from apps.cart.services import CartService
        
        cart_summary = CartService.get_cart_summary(checkout_session.cart)
        subtotal = Decimal(cart_summary['subtotal'])
        item_count = cart_summary['item_count']
        
        # Get configured shipping rates
        shipping_rates = ShippingRate.objects.filter(is_active=True)
        
        if shipping_rates.exists():
            options = []
            for rate in shipping_rates:
                cost = rate.calculate_cost(subtotal, item_count)
                options.append({
                    'code': rate.code,
                    'name': rate.name,
                    'description': rate.description,
                    'cost': str(cost),
                    'delivery_estimate': rate.delivery_estimate,
                    'is_free': cost == 0,
                })
            return options
        
        # Default options
        return [
            {
                'code': CheckoutSession.SHIPPING_STANDARD,
                'name': 'Standard Shipping',
                'description': 'Delivered in 5-7 business days',
                'cost': str(CheckoutService.get_default_shipping_cost(CheckoutSession.SHIPPING_STANDARD)),
                'delivery_estimate': '5-7 days',
                'is_free': False,
            },
            {
                'code': CheckoutSession.SHIPPING_EXPRESS,
                'name': 'Express Shipping',
                'description': 'Delivered in 2-3 business days',
                'cost': str(CheckoutService.get_default_shipping_cost(CheckoutSession.SHIPPING_EXPRESS)),
                'delivery_estimate': '2-3 days',
                'is_free': False,
            },
            {
                'code': CheckoutSession.SHIPPING_OVERNIGHT,
                'name': 'Overnight Shipping',
                'description': 'Delivered next business day',
                'cost': str(CheckoutService.get_default_shipping_cost(CheckoutSession.SHIPPING_OVERNIGHT)),
                'delivery_estimate': '1 day',
                'is_free': False,
            },
        ]
    
    @staticmethod
    def proceed_to_review(checkout_session):
        """
        Proceed to review step after payment setup.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Updated CheckoutSession
        """
        if checkout_session.can_proceed_to_review:
            checkout_session.current_step = CheckoutSession.STEP_REVIEW
            checkout_session.save()
        
        return checkout_session
    
    @staticmethod
    def complete_checkout(checkout_session, payment_intent_id=None):
        """
        Complete checkout and create order.
        
        Args:
            checkout_session: CheckoutSession instance
            payment_intent_id: Stripe payment intent ID
            
        Returns:
            Order instance or None if failed
        """
        from apps.orders.services import OrderService
        
        # Verify payment if Stripe
        if checkout_session.payment_method == CheckoutSession.PAYMENT_STRIPE:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            intent_id = payment_intent_id or checkout_session.stripe_payment_intent_id
            if intent_id:
                try:
                    intent = stripe.PaymentIntent.retrieve(intent_id)
                    if intent.status != 'succeeded':
                        return None, "Payment not completed"
                except stripe.error.StripeError as e:
                    return None, str(e)
        
        # Create order
        order = OrderService.create_order_from_checkout(checkout_session)
        
        if order:
            # Mark checkout as complete
            checkout_session.current_step = CheckoutSession.STEP_COMPLETE
            checkout_session.save()
            
            # Clear cart
            checkout_session.cart.items.all().delete()
            checkout_session.cart.coupon = None
            checkout_session.cart.save()
        
        return order, None
    
    @staticmethod
    def cleanup_expired_sessions():
        """Delete expired checkout sessions."""
        expired = CheckoutSession.objects.filter(
            expires_at__lt=timezone.now()
        ).exclude(
            current_step=CheckoutSession.STEP_COMPLETE
        )
        count = expired.count()
        expired.delete()
        return count
