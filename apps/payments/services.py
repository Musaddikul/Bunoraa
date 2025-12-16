"""
Payments services
"""
import stripe
from decimal import Decimal
from django.conf import settings
from django.utils import timezone

from .models import Payment, PaymentMethod, Refund


# Initialize Stripe
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')


class StripeService:
    """Service for Stripe payment processing."""
    
    @staticmethod
    def create_payment_intent(amount, currency='usd', customer_id=None, metadata=None):
        """
        Create a Stripe PaymentIntent.
        
        Args:
            amount: Amount in smallest currency unit (cents for USD)
            currency: Currency code (default: usd)
            customer_id: Stripe customer ID (optional)
            metadata: Additional metadata dict (optional)
        
        Returns:
            Stripe PaymentIntent object
        """
        params = {
            'amount': int(amount),  # Stripe expects integer amount in cents
            'currency': currency.lower(),
            'automatic_payment_methods': {'enabled': True},
            'metadata': metadata or {}
        }
        
        if customer_id:
            params['customer'] = customer_id
        
        return stripe.PaymentIntent.create(**params)
    
    @staticmethod
    def retrieve_payment_intent(payment_intent_id):
        """Retrieve a PaymentIntent from Stripe."""
        return stripe.PaymentIntent.retrieve(payment_intent_id)
    
    @staticmethod
    def confirm_payment_intent(payment_intent_id, payment_method_id=None):
        """Confirm a PaymentIntent."""
        params = {}
        if payment_method_id:
            params['payment_method'] = payment_method_id
        return stripe.PaymentIntent.confirm(payment_intent_id, **params)
    
    @staticmethod
    def cancel_payment_intent(payment_intent_id):
        """Cancel a PaymentIntent."""
        return stripe.PaymentIntent.cancel(payment_intent_id)
    
    @staticmethod
    def create_customer(email, name=None, metadata=None):
        """Create a Stripe customer."""
        params = {
            'email': email,
            'metadata': metadata or {}
        }
        if name:
            params['name'] = name
        return stripe.Customer.create(**params)
    
    @staticmethod
    def retrieve_customer(customer_id):
        """Retrieve a Stripe customer."""
        return stripe.Customer.retrieve(customer_id)
    
    @staticmethod
    def create_setup_intent(customer_id):
        """Create a SetupIntent for saving payment methods."""
        return stripe.SetupIntent.create(
            customer=customer_id,
            automatic_payment_methods={'enabled': True}
        )
    
    @staticmethod
    def attach_payment_method(payment_method_id, customer_id):
        """Attach a payment method to a customer."""
        return stripe.PaymentMethod.attach(
            payment_method_id,
            customer=customer_id
        )
    
    @staticmethod
    def detach_payment_method(payment_method_id):
        """Detach a payment method from a customer."""
        return stripe.PaymentMethod.detach(payment_method_id)
    
    @staticmethod
    def retrieve_payment_method(payment_method_id):
        """Retrieve a payment method from Stripe."""
        return stripe.PaymentMethod.retrieve(payment_method_id)
    
    @staticmethod
    def create_refund(payment_intent_id, amount=None, reason=None):
        """
        Create a refund.
        
        Args:
            payment_intent_id: The PaymentIntent to refund
            amount: Amount to refund in cents (None for full refund)
            reason: Reason for refund
        
        Returns:
            Stripe Refund object
        """
        params = {'payment_intent': payment_intent_id}
        if amount:
            params['amount'] = int(amount)
        if reason:
            params['reason'] = reason
        return stripe.Refund.create(**params)
    
    @staticmethod
    def construct_webhook_event(payload, sig_header):
        """Construct and verify a webhook event."""
        webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')
        return stripe.Webhook.construct_event(payload, sig_header, webhook_secret)


class PaymentService:
    """Service for payment processing."""
    
    @staticmethod
    def create_payment_for_order(order, payment_intent_id=None):
        """Create a payment record for an order."""
        payment = Payment.objects.create(
            order=order,
            user=order.user,
            amount=order.total_amount,
            currency='USD',
            stripe_payment_intent_id=payment_intent_id,
            status=Payment.STATUS_PENDING
        )
        return payment
    
    @staticmethod
    def process_payment_success(payment_intent_id):
        """Process a successful payment."""
        payment = Payment.objects.filter(
            stripe_payment_intent_id=payment_intent_id
        ).first()
        
        if not payment:
            return None
        
        # Get payment intent details
        pi = StripeService.retrieve_payment_intent(payment_intent_id)
        
        payment.status = Payment.STATUS_SUCCEEDED
        payment.paid_at = timezone.now()
        payment.stripe_charge_id = pi.latest_charge if hasattr(pi, 'latest_charge') else None
        payment.gateway_response = {
            'payment_method_types': pi.payment_method_types,
            'status': pi.status
        }
        payment.save()
        
        # Update order status
        if payment.order:
            from apps.orders.services import OrderService
            OrderService.update_order_status(
                payment.order,
                'confirmed',
                notes='Payment confirmed'
            )
        
        return payment
    
    @staticmethod
    def process_payment_failure(payment_intent_id, failure_reason=None):
        """Process a failed payment."""
        payment = Payment.objects.filter(
            stripe_payment_intent_id=payment_intent_id
        ).first()
        
        if not payment:
            return None
        
        payment.status = Payment.STATUS_FAILED
        payment.failure_reason = failure_reason
        payment.save()
        
        return payment
    
    @staticmethod
    def refund_payment(payment, amount=None, reason=None, created_by=None, notes=None):
        """
        Refund a payment (full or partial).
        
        Args:
            payment: Payment instance
            amount: Amount to refund (None for full refund)
            reason: Refund reason
            created_by: User who initiated the refund
            notes: Additional notes
        
        Returns:
            Refund instance
        """
        if payment.status != Payment.STATUS_SUCCEEDED:
            raise ValueError('Can only refund succeeded payments')
        
        refund_amount = Decimal(str(amount)) if amount else payment.amount - payment.refunded_amount
        
        if refund_amount <= 0:
            raise ValueError('Invalid refund amount')
        
        if refund_amount > payment.amount - payment.refunded_amount:
            raise ValueError('Refund amount exceeds remaining payment amount')
        
        # Create refund record
        refund = Refund.objects.create(
            payment=payment,
            amount=refund_amount,
            reason=reason or Refund.REASON_OTHER,
            notes=notes,
            created_by=created_by,
            status=Refund.STATUS_PENDING
        )
        
        try:
            # Process refund with Stripe
            stripe_refund = StripeService.create_refund(
                payment.stripe_payment_intent_id,
                amount=int(refund_amount * 100),  # Convert to cents
                reason=reason
            )
            
            refund.stripe_refund_id = stripe_refund.id
            refund.status = Refund.STATUS_SUCCEEDED
            refund.processed_at = timezone.now()
            refund.save()
            
            # Update payment
            payment.refunded_amount += refund_amount
            if payment.refunded_amount >= payment.amount:
                payment.status = Payment.STATUS_REFUNDED
            else:
                payment.status = Payment.STATUS_PARTIALLY_REFUNDED
            payment.save()
            
            return refund
        
        except stripe.error.StripeError as e:
            refund.status = Refund.STATUS_FAILED
            refund.notes = f"{refund.notes or ''}\nError: {str(e)}"
            refund.save()
            raise
    
    @staticmethod
    def get_payment_by_intent(payment_intent_id):
        """Get payment by Stripe payment intent ID."""
        return Payment.objects.filter(
            stripe_payment_intent_id=payment_intent_id
        ).first()
    
    @staticmethod
    def get_order_payments(order):
        """Get all payments for an order."""
        return Payment.objects.filter(order=order)


class PaymentMethodService:
    """Service for managing saved payment methods."""
    
    @staticmethod
    def save_payment_method(user, stripe_payment_method_id):
        """Save a payment method for a user."""
        # Get payment method details from Stripe
        pm = StripeService.retrieve_payment_method(stripe_payment_method_id)
        
        # Check if already saved
        existing = PaymentMethod.objects.filter(
            user=user,
            stripe_payment_method_id=stripe_payment_method_id
        ).first()
        
        if existing:
            return existing
        
        # Create payment method record
        card = pm.card if pm.type == 'card' else None
        
        is_first = not PaymentMethod.objects.filter(user=user).exists()
        
        payment_method = PaymentMethod.objects.create(
            user=user,
            type=PaymentMethod.TYPE_CARD if pm.type == 'card' else pm.type,
            card_brand=card.brand if card else None,
            card_last_four=card.last4 if card else None,
            card_exp_month=card.exp_month if card else None,
            card_exp_year=card.exp_year if card else None,
            stripe_payment_method_id=stripe_payment_method_id,
            is_default=is_first
        )
        
        return payment_method
    
    @staticmethod
    def delete_payment_method(payment_method):
        """Delete a saved payment method."""
        if payment_method.stripe_payment_method_id:
            try:
                StripeService.detach_payment_method(payment_method.stripe_payment_method_id)
            except stripe.error.StripeError:
                pass
        
        was_default = payment_method.is_default
        user = payment_method.user
        payment_method.delete()
        
        # Set another as default if needed
        if was_default:
            other = PaymentMethod.objects.filter(user=user, is_active=True).first()
            if other:
                other.is_default = True
                other.save()
    
    @staticmethod
    def set_default_payment_method(user, payment_method_id):
        """Set a payment method as default."""
        PaymentMethod.objects.filter(user=user).update(is_default=False)
        PaymentMethod.objects.filter(
            id=payment_method_id,
            user=user
        ).update(is_default=True)
    
    @staticmethod
    def get_user_payment_methods(user):
        """Get all active payment methods for a user."""
        return PaymentMethod.objects.filter(user=user, is_active=True)
    
    @staticmethod
    def get_default_payment_method(user):
        """Get user's default payment method."""
        return PaymentMethod.objects.filter(
            user=user,
            is_active=True,
            is_default=True
        ).first()
