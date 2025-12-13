# apps/payments/views.py
"""
Payment Views
"""
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from core.permissions import IsOwner
from .models import PaymentMethod, Payment, Refund
from .serializers import (
    PaymentMethodSerializer, PaymentSerializer, RefundSerializer,
    CreatePaymentSerializer, CreateRefundSerializer
)
from .services import PaymentService


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """
    User payment methods.
    """
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set as default payment method."""
        method = self.get_object()
        method.is_default = True
        method.save()
        
        return Response({
            'message': 'Default payment method updated',
            'method': PaymentMethodSerializer(method).data
        })


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    User payments.
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class InitiatePaymentView(generics.CreateAPIView):
    """
    Initiate payment for an order.
    """
    serializer_class = CreatePaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            result = PaymentService.initiate_payment(
                request.user,
                serializer.validated_data
            )
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentWebhookView(generics.GenericAPIView):
    """
    Handle payment gateway webhooks.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, gateway):
        """Process webhook from payment gateway."""
        try:
            result = PaymentService.process_webhook(gateway, request)
            return Response({'status': 'ok'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdminPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin payment management.
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Payment.objects.all()
    
    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        """Process refund."""
        payment = self.get_object()
        serializer = CreateRefundSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            refund = PaymentService.process_refund(
                payment,
                serializer.validated_data['amount'],
                serializer.validated_data['reason'],
                serializer.validated_data.get('notes', ''),
                request.user
            )
            return Response({
                'message': 'Refund processed',
                'refund': RefundSerializer(refund).data
            })
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Payment statistics."""
        from django.db.models import Sum, Count
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        stats = {
            'total_payments': Payment.objects.filter(status=Payment.Status.COMPLETED).count(),
            'total_revenue': Payment.objects.filter(
                status=Payment.Status.COMPLETED
            ).aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_fees': Payment.objects.filter(
                status=Payment.Status.COMPLETED
            ).aggregate(Sum('gateway_fee'))['gateway_fee__sum'] or 0,
            'total_refunded': Refund.objects.filter(
                status=Refund.Status.COMPLETED
            ).aggregate(Sum('amount'))['amount__sum'] or 0,
            'payments_last_30_days': Payment.objects.filter(
                status=Payment.Status.COMPLETED,
                created_at__date__gte=thirty_days_ago
            ).count(),
            'revenue_last_30_days': Payment.objects.filter(
                status=Payment.Status.COMPLETED,
                created_at__date__gte=thirty_days_ago
            ).aggregate(Sum('amount'))['amount__sum'] or 0,
            'by_gateway': list(
                Payment.objects.filter(status=Payment.Status.COMPLETED)
                .values('gateway')
                .annotate(count=Count('id'), total=Sum('amount'))
            )
        }
        
        return Response(stats)
