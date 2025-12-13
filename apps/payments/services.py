# apps/payments/services.py
"""
Payment Services
Business logic for payment processing.
"""
from decimal import Decimal
from django.utils import timezone
from django.conf import settings

from .models import Payment, PaymentMethod, Refund


class PaymentService:
    """Service class for payment operations."""
    
    @staticmethod
    def initiate_payment(user, data):
        """Initiate payment for an order."""
        from apps.orders.models import Order
        
        order = Order.objects.get(pk=data['order_id'], user=user)
        
        if order.payment_status in ['paid', 'refunded']:
            raise ValueError('Order already paid')
        
        gateway = data['gateway']
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            user=user,
            gateway=gateway,
            amount=order.total,
            currency=order.currency,
            status=Payment.Status.PENDING
        )
        
        # Get gateway-specific payment intent
        if gateway == Payment.Gateway.STRIPE:
            return PaymentService._initiate_stripe(payment, user, data)
        elif gateway == Payment.Gateway.PAYPAL:
            return PaymentService._initiate_paypal(payment, user, data)
        elif gateway == Payment.Gateway.COD:
            return PaymentService._initiate_cod(payment)
        else:
            raise ValueError(f'Unsupported gateway: {gateway}')
    
    @staticmethod
    def _initiate_stripe(payment, user, data):
        """Initialize Stripe payment."""
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        # Get or create Stripe customer
        payment_method = None
        if data.get('payment_method_id'):
            payment_method = PaymentMethod.objects.get(
                pk=data['payment_method_id'],
                user=user
            )
        
        intent = stripe.PaymentIntent.create(
            amount=int(payment.amount * 100),  # Stripe uses cents
            currency=payment.currency.lower(),
            customer=payment_method.gateway_customer_id if payment_method else None,
            metadata={
                'order_id': payment.order.id,
                'payment_id': payment.id
            }
        )
        
        payment.gateway_payment_id = intent.id
        payment.status = Payment.Status.PROCESSING
        payment.save()
        
        return {
            'client_secret': intent.client_secret,
            'payment_id': payment.id
        }
    
    @staticmethod
    def _initiate_paypal(payment, user, data):
        """Initialize PayPal payment."""
        # PayPal integration would go here
        return {
            'approval_url': f'https://paypal.com/checkout/{payment.id}',
            'payment_id': payment.id
        }
    
    @staticmethod
    def _initiate_cod(payment):
        """Initialize Cash on Delivery."""
        payment.status = Payment.Status.PENDING
        payment.save()
        
        # Update order
        payment.order.payment_method = 'Cash on Delivery'
        payment.order.mark_confirmed()
        
        return {
            'payment_id': payment.id,
            'message': 'Cash on Delivery order confirmed'
        }
    
    @staticmethod
    def process_webhook(gateway, request):
        """Process payment gateway webhook."""
        if gateway == 'stripe':
            return PaymentService._process_stripe_webhook(request)
        elif gateway == 'paypal':
            return PaymentService._process_paypal_webhook(request)
        else:
            raise ValueError(f'Unknown gateway: {gateway}')
    
    @staticmethod
    def _process_stripe_webhook(request):
        """Process Stripe webhook."""
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        payload = request.body
        sig_header = request.headers.get('Stripe-Signature')
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        
        if event.type == 'payment_intent.succeeded':
            intent = event.data.object
            payment = Payment.objects.get(gateway_payment_id=intent.id)
            
            payment.status = Payment.Status.COMPLETED
            payment.completed_at = timezone.now()
            payment.gateway_response = intent
            payment.gateway_fee = Decimal(str(intent.get('application_fee_amount', 0) / 100))
            payment.save()
            
            # Update order
            payment.order.payment_status = 'paid'
            payment.order.payment_id = intent.id
            payment.order.mark_confirmed()
        
        elif event.type == 'payment_intent.payment_failed':
            intent = event.data.object
            payment = Payment.objects.get(gateway_payment_id=intent.id)
            
            payment.status = Payment.Status.FAILED
            payment.failure_reason = intent.get('last_payment_error', {}).get('message', 'Payment failed')
            payment.gateway_response = intent
            payment.save()
            
            payment.order.payment_status = 'failed'
            payment.order.save()
        
        return {'status': 'processed'}
    
    @staticmethod
    def _process_paypal_webhook(request):
        """Process PayPal webhook."""
        # PayPal webhook processing would go here
        pass
    
    @staticmethod
    def process_refund(payment, amount, reason, notes='', processed_by=None):
        """Process refund for a payment."""
        if not payment.can_refund:
            raise ValueError('Cannot refund this payment')
        
        if amount > (payment.amount - payment.refunded_amount):
            raise ValueError('Refund amount exceeds available amount')
        
        refund = Refund.objects.create(
            payment=payment,
            amount=amount,
            currency=payment.currency,
            reason=reason,
            notes=notes,
            status=Refund.Status.PROCESSING,
            processed_by=processed_by
        )
        
        try:
            if payment.gateway == Payment.Gateway.STRIPE:
                PaymentService._process_stripe_refund(payment, refund)
            elif payment.gateway == Payment.Gateway.PAYPAL:
                PaymentService._process_paypal_refund(payment, refund)
            else:
                # Manual refund
                refund.status = Refund.Status.COMPLETED
                refund.processed_at = timezone.now()
                refund.save()
            
            # Update payment
            payment.refunded_amount += amount
            if payment.refunded_amount >= payment.amount:
                payment.status = Payment.Status.REFUNDED
            else:
                payment.status = Payment.Status.PARTIALLY_REFUNDED
            payment.save()
            
            # Update order
            if payment.refunded_amount >= payment.amount:
                payment.order.payment_status = 'refunded'
            else:
                payment.order.payment_status = 'partially_refunded'
            payment.order.save()
            
            return refund
            
        except Exception as e:
            refund.status = Refund.Status.FAILED
            refund.failure_reason = str(e)
            refund.save()
            raise
    
    @staticmethod
    def _process_stripe_refund(payment, refund):
        """Process Stripe refund."""
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        stripe_refund = stripe.Refund.create(
            payment_intent=payment.gateway_payment_id,
            amount=int(refund.amount * 100)
        )
        
        refund.gateway_refund_id = stripe_refund.id
        refund.gateway_response = stripe_refund
        refund.status = Refund.Status.COMPLETED
        refund.processed_at = timezone.now()
        refund.save()
    
    @staticmethod
    def _process_paypal_refund(payment, refund):
        """Process PayPal refund."""
        # PayPal refund would go here
        pass
