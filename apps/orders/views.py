# apps/orders/views.py
"""
Order Views
"""
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
# get_object_or_404 and transaction available when needed

from core.permissions import IsOwner
from .models import Order, OrderNote
from .serializers import (
    OrderSerializer, OrderListSerializer, OrderDetailSerializer,
    CreateOrderSerializer, UpdateOrderStatusSerializer, OrderNoteSerializer
)
from .services import OrderService


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Customer order viewset.
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderListSerializer
    
    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order."""
        order = self.get_object()
        
        if not order.can_cancel:
            return Response(
                {'error': 'This order cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reason = request.data.get('reason', '')
        order.cancel(reason)
        
        return Response({
            'message': 'Order cancelled successfully',
            'order': OrderSerializer(order).data
        })
    
    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Get order tracking info."""
        order = self.get_object()
        
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'status_display': order.get_status_display(),
            'tracking_number': order.tracking_number,
            'carrier': order.shipping_carrier,
            'estimated_delivery': order.estimated_delivery,
            'shipped_at': order.shipped_at,
            'delivered_at': order.delivered_at,
            'history': [
                {
                    'status': h.status,
                    'timestamp': h.created_at,
                    'note': h.note
                }
                for h in order.status_history.all()
            ]
        })


class CreateOrderView(generics.CreateAPIView):
    """
    Create order from cart.
    """
    serializer_class = CreateOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            order = OrderService.create_from_cart(
                request.user,
                serializer.validated_data
            )
            return Response({
                'message': 'Order created successfully',
                'order': OrderDetailSerializer(order).data
            }, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderViewSet(viewsets.ModelViewSet):
    """
    Admin order management.
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.all().prefetch_related('items', 'status_history', 'notes')
    
    def get_serializer_class(self):
        if self.action in ['list']:
            return OrderListSerializer
        return OrderDetailSerializer
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status."""
        order = self.get_object()
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        old_status = order.status
        new_status = serializer.validated_data['status']
        
        order.status = new_status
        
        # Handle specific status changes
        if new_status == Order.Status.SHIPPED:
            order.mark_shipped(
                serializer.validated_data.get('tracking_number'),
                serializer.validated_data.get('carrier')
            )
        elif new_status == Order.Status.DELIVERED:
            order.mark_delivered()
        elif new_status == Order.Status.CONFIRMED:
            order.mark_confirmed()
        else:
            order.save()
        
        return Response({
            'message': f'Order status updated from {old_status} to {new_status}',
            'order': OrderDetailSerializer(order).data
        })
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """Add note to order."""
        order = self.get_object()
        
        note = OrderNote.objects.create(
            order=order,
            note=request.data.get('note'),
            is_customer_visible=request.data.get('is_customer_visible', False),
            created_by=request.user
        )
        
        return Response({
            'message': 'Note added',
            'note': OrderNoteSerializer(note).data
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get order statistics."""
        from django.db.models import Sum, Count, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        stats = {
            'total_orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status=Order.Status.PENDING).count(),
            'processing_orders': Order.objects.filter(status=Order.Status.PROCESSING).count(),
            'completed_orders': Order.objects.filter(status=Order.Status.DELIVERED).count(),
            'cancelled_orders': Order.objects.filter(status=Order.Status.CANCELLED).count(),
            'total_revenue': Order.objects.filter(
                payment_status=Order.PaymentStatus.PAID
            ).aggregate(Sum('total'))['total__sum'] or 0,
            'orders_last_30_days': Order.objects.filter(
                created_at__date__gte=thirty_days_ago
            ).count(),
            'revenue_last_30_days': Order.objects.filter(
                created_at__date__gte=thirty_days_ago,
                payment_status=Order.PaymentStatus.PAID
            ).aggregate(Sum('total'))['total__sum'] or 0,
            'average_order_value': Order.objects.filter(
                payment_status=Order.PaymentStatus.PAID
            ).aggregate(Avg('total'))['total__avg'] or 0,
        }
        
        return Response(stats)
