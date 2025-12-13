# apps/payments/views.py
"""
Payment views.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

from .models import Payment
from .serializers import (
    PaymentSerializer,
    PaymentIntentCreateSerializer,
    RefundCreateSerializer,
)
from .services import PaymentService
from apps.orders.models import Order


class CreatePaymentIntentView(APIView):
    """Create a Stripe PaymentIntent for checkout."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PaymentIntentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Order not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify order belongs to user if authenticated
        if request.user.is_authenticated and order.user:
            if order.user != request.user:
                return Response({
                    'success': False,
                    'message': 'Unauthorized',
                    'data': None,
                    'meta': None
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Create payment intent
        success, result = PaymentService.create_payment_intent(
            order,
            payment_method=serializer.validated_data.get('payment_method')
        )
        
        if success:
            return Response({
                'success': True,
                'message': 'Payment intent created',
                'data': result,
                'meta': None
            })
        
        return Response({
            'success': False,
            'message': result,
            'data': None,
            'meta': None
        }, status=status.HTTP_400_BAD_REQUEST)


class ConfirmPaymentView(APIView):
    """Confirm a payment was successful."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response({
                'success': False,
                'message': 'Payment intent ID required',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        success, result = PaymentService.confirm_payment(payment_intent_id)
        
        if success:
            return Response({
                'success': True,
                'message': 'Payment confirmed',
                'data': PaymentSerializer(result).data,
                'meta': None
            })
        
        return Response({
            'success': False,
            'message': result,
            'data': None,
            'meta': None
        }, status=status.HTTP_400_BAD_REQUEST)


class PaymentHistoryView(APIView):
    """Get user's payment history."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        payments = Payment.objects.filter(user=request.user)
        serializer = PaymentSerializer(payments, many=True)
        
        return Response({
            'success': True,
            'message': 'Payment history retrieved',
            'data': serializer.data,
            'meta': {'count': payments.count()}
        })


class PaymentDetailView(APIView):
    """Get payment details."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, payment_id):
        payment = get_object_or_404(
            Payment,
            id=payment_id,
            user=request.user
        )
        
        return Response({
            'success': True,
            'message': 'Payment retrieved',
            'data': PaymentSerializer(payment).data,
            'meta': None
        })


# Admin views
class AdminProcessRefundView(APIView):
    """Admin: Process a refund."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        serializer = RefundCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment_id = serializer.validated_data['payment_id']
        amount = serializer.validated_data['amount']
        reason = serializer.validated_data.get('reason', '')
        
        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Payment not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        success, result = PaymentService.process_refund(
            payment,
            amount,
            reason=reason,
            processed_by=request.user
        )
        
        if success:
            return Response({
                'success': True,
                'message': 'Refund processed',
                'data': {
                    'refund_id': str(result.id),
                    'amount': str(result.amount),
                    'status': result.status
                },
                'meta': None
            })
        
        return Response({
            'success': False,
            'message': result,
            'data': None,
            'meta': None
        }, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Handle Stripe webhook events."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        success, message = PaymentService.handle_webhook(payload, sig_header)
        
        if success:
            return HttpResponse(status=200)
        
        return HttpResponse(status=400)
