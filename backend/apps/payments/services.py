# apps/payments/services.py
"""
Payment service layer - Stripe integration.
"""
import logging
from decimal import Decimal
from django.conf import settings

from .models import Payment, Refund

logger = logging.getLogger(__name__)


class PaymentService:
    """Service class for payment operations."""
    
    @classmethod
    def get_stripe_client(cls):
        """Get Stripe client."""
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        return stripe
    
    @classmethod
    def create_payment_intent(cls, order, payment_method=None):
        """
        Create a Stripe PaymentIntent for an order.
        Returns tuple (success, payment_intent/error_message).
        """
        stripe = cls.get_stripe_client()
        
        try:
            # Amount in cents
            amount = int(order.total * 100)
            
            intent_data = {
                'amount': amount,
                'currency': 'usd',
                'metadata': {
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                },
                'receipt_email': order.email,
            }
            
            if payment_method:
                intent_data['payment_method'] = payment_method
                intent_data['confirm'] = True
            
            payment_intent = stripe.PaymentIntent.create(**intent_data)
            
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                user=order.user,
                provider=Payment.Provider.STRIPE,
                provider_payment_id=payment_intent.id,
                amount=order.total,
                status=Payment.Status.PROCESSING
            )
            
            return True, {
                'payment_id': str(payment.id),
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
            }
            
        except Exception as e:
            logger.error(f'Stripe PaymentIntent creation failed: {e}')
            return False, str(e)
    
    @classmethod
    def confirm_payment(cls, payment_intent_id):
        """
        Confirm a payment was successful.
        Called by webhook or after client-side confirmation.
        """
        stripe = cls.get_stripe_client()
        
        try:
            # Get PaymentIntent from Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            # Get our payment record
            try:
                payment = Payment.objects.get(provider_payment_id=payment_intent_id)
            except Payment.DoesNotExist:
                logger.error(f'Payment record not found for {payment_intent_id}')
                return False, 'Payment record not found'
            
            if payment_intent.status == 'succeeded':
                payment.status = Payment.Status.SUCCEEDED
                
                # Store card info if available
                if payment_intent.payment_method:
                    pm = stripe.PaymentMethod.retrieve(payment_intent.payment_method)
                    if pm.card:
                        payment.card_brand = pm.card.brand
                        payment.card_last4 = pm.card.last4
                        payment.card_exp_month = pm.card.exp_month
                        payment.card_exp_year = pm.card.exp_year
                
                payment.save()
                
                # Update order
                from apps.orders.services import OrderService
                OrderService.mark_as_paid(
                    payment.order,
                    payment_intent_id=payment_intent_id
                )
                
                return True, payment
                
            elif payment_intent.status == 'requires_payment_method':
                payment.status = Payment.Status.FAILED
                payment.error_message = 'Payment requires a valid payment method'
                payment.save()
                return False, 'Payment method required'
                
            else:
                payment.status = Payment.Status.PENDING
                payment.save()
                return False, f'Payment status: {payment_intent.status}'
                
        except Exception as e:
            logger.error(f'Payment confirmation failed: {e}')
            return False, str(e)
    
    @classmethod
    def process_refund(cls, payment, amount, reason='', processed_by=None):
        """
        Process a refund for a payment.
        Returns tuple (success, refund/error_message).
        """
        stripe = cls.get_stripe_client()
        
        if not payment.provider_payment_id:
            return False, 'No payment intent to refund'
        
        if amount > payment.amount:
            return False, 'Refund amount exceeds payment amount'
        
        try:
            # Calculate total already refunded
            existing_refunds = payment.refunds.filter(
                status=Refund.Status.SUCCEEDED
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0')
            
            if existing_refunds + amount > payment.amount:
                return False, 'Total refund amount would exceed payment amount'
            
            # Create Stripe refund
            stripe_refund = stripe.Refund.create(
                payment_intent=payment.provider_payment_id,
                amount=int(amount * 100),  # Convert to cents
            )
            
            # Create refund record
            refund = Refund.objects.create(
                payment=payment,
                provider_refund_id=stripe_refund.id,
                amount=amount,
                status=Refund.Status.SUCCEEDED if stripe_refund.status == 'succeeded' else Refund.Status.PENDING,
                reason=Refund.Reason.CUSTOMER_REQUEST,
                notes=reason,
                processed_by=processed_by
            )
            
            # Update payment status
            total_refunded = existing_refunds + amount
            if total_refunded >= payment.amount:
                payment.status = Payment.Status.REFUNDED
            else:
                payment.status = Payment.Status.PARTIALLY_REFUNDED
            payment.save()
            
            # Update order payment status
            order = payment.order
            if total_refunded >= payment.amount:
                order.payment_status = 'refunded'
            else:
                order.payment_status = 'partially_refunded'
            order.save()
            
            return True, refund
            
        except Exception as e:
            logger.error(f'Refund processing failed: {e}')
            return False, str(e)
    
    @classmethod
    def handle_webhook(cls, payload, sig_header):
        """
        Handle Stripe webhook events.
        """
        stripe = cls.get_stripe_client()
        
        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return False, 'Invalid payload'
        except stripe.error.SignatureVerificationError:
            return False, 'Invalid signature'
        
        # Handle the event
        event_type = event['type']
        data = event['data']['object']
        
        if event_type == 'payment_intent.succeeded':
            cls.confirm_payment(data['id'])
            
        elif event_type == 'payment_intent.payment_failed':
            try:
                payment = Payment.objects.get(provider_payment_id=data['id'])
                payment.status = Payment.Status.FAILED
                payment.error_message = data.get('last_payment_error', {}).get('message', '')
                payment.save()
            except Payment.DoesNotExist:
                pass
        
        elif event_type == 'charge.refunded':
            # Handle refund confirmation
            pass
        
        return True, 'Webhook handled'
