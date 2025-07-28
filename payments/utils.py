# payments/utils.py
from django.conf import settings
from payments.models import Payment
from datetime import datetime, timedelta
import requests
import json

def initiate_payment(request, order, payment_option='full'):
    """
    Initiate payment with the configured payment gateway
    """
    # Calculate amount based on payment option
    if payment_option == 'full':
        amount = order.total_amount
    else:  # partial payment (50% advance)
        amount = order.total_amount / 2
    
    # Create payment transaction record
    transaction = Payment.objects.create(
        order=order,
        user=request.user,
        payment_method=order.payment_method,
        amount=amount,
        currency='BDT',
        status='initiated'
    )
    
    # For Bkash integration (example)
    if order.payment_method.gateway == 'bkash':
        return initiate_bkash_payment(request, transaction)
    
    # For Stripe integration (example)
    elif order.payment_method.gateway == 'stripe':
        return initiate_stripe_payment(request, transaction)
    
    # Add other payment gateways as needed
    else:
        # Default/fallback payment processing
        return {
            'success': False,
            'message': 'Selected payment method is currently unavailable'
        }

def initiate_bkash_payment(request, transaction):
    """
    Example Bkash payment integration
    """
    try:
        # In a real implementation, you would call Bkash's API
        # This is a simplified example
        headers = {
            'Authorization': f'Bearer {settings.BKASH_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'mode': '0011',  # Checkout mode
            'payerReference': str(request.user.id),
            'callbackURL': request.build_absolute_uri(
                f'/payments/bkash/callback/{transaction.id}/'
            ),
            'amount': str(transaction.amount),
            'currency': 'BDT',
            'intent': 'sale',
            'merchantInvoiceNumber': transaction.invoice_number
        }
        
        response = requests.post(
            settings.BKASH_CHECKOUT_URL,
            headers=headers,
            data=json.dumps(payload))
        
        if response.status_code == 200:
            data = response.json()
            transaction.gateway_reference = data.get('paymentID')
            transaction.save()
            
            return {
                'success': True,
                'payment_url': data.get('bkashURL'),
                'transaction_id': transaction.id
            }
        else:
            transaction.status = 'failed'
            transaction.save()
            return {
                'success': False,
                'message': 'Payment initiation failed'
            }
            
    except Exception as e:
        transaction.status = 'failed'
        transaction.save()
        return {
            'success': False,
            'message': str(e)
        }

def handle_payment_webhook(request, transaction_id):
    """
    Handle payment gateway webhook notifications
    """
    try:
        transaction = Payment.objects.get(id=transaction_id)
        payload = json.loads(request.body)
        
        # Verify the webhook signature (implementation varies by gateway)
        if not verify_webhook_signature(request):
            return JsonResponse({'status': 'invalid signature'}, status=400)
        
        # Update transaction status based on gateway response
        if payload.get('status') == 'completed':
            transaction.status = 'completed'
            transaction.gateway_response = payload
            transaction.completed_at = timezone.now()
            transaction.save()
            
            # Update order status
            order = transaction.order
            if order.payment_status != 'paid':
                order.payment_status = 'paid'
                order.payment_date = timezone.now()
                
                if order.status == 'pending_confirmation':
                    order.status = 'confirmed'
                
                order.save()
                
                # Send confirmation email
                order.send_confirmation_email()
        
        return JsonResponse({'status': 'success'})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)