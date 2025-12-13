# apps/orders/views.py
"""
Order views.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Order
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    CheckoutSerializer,
    OrderCancelSerializer,
    OrderTrackingSerializer,
)
from .services import OrderService
from apps.cart.services import CartService


class CheckoutView(APIView):
    """
    POST: Create order from cart
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Validate checkout data
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get cart
        cart = CartService.get_or_create_cart(request)
        
        # Validate cart for checkout
        is_valid, errors = CartService.validate_cart_for_checkout(cart)
        if not is_valid:
            return Response({
                'success': False,
                'message': 'Cart validation failed',
                'data': {'errors': errors},
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create order
        try:
            order = OrderService.create_order_from_cart(
                cart=cart,
                checkout_data=serializer.validated_data
            )
            
            return Response({
                'success': True,
                'message': 'Order created successfully',
                'data': OrderDetailSerializer(order).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(ListAPIView):
    """List user's orders."""
    
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            return response
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Orders retrieved successfully',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })


class OrderDetailView(RetrieveAPIView):
    """Get order details."""
    
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'order_number'
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user)
        # Allow guest order lookup by order number + email
        return Order.objects.all()
    
    def get_object(self):
        order_number = self.kwargs.get('order_number')
        queryset = self.get_queryset()
        
        if self.request.user.is_authenticated:
            order = get_object_or_404(queryset, order_number=order_number)
        else:
            # Guest must provide email in query params
            email = self.request.query_params.get('email', '').lower()
            order = get_object_or_404(
                queryset,
                order_number=order_number,
                email=email
            )
        
        return order
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'success': True,
                'message': 'Order retrieved successfully',
                'data': serializer.data,
                'meta': None
            })
        except Exception:
            return Response({
                'success': False,
                'message': 'Order not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


class OrderCancelView(APIView):
    """Cancel an order."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, order_number):
        order = get_object_or_404(
            Order,
            order_number=order_number,
            user=request.user
        )
        
        serializer = OrderCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        success, message = OrderService.cancel_order(
            order,
            reason=serializer.validated_data.get('reason', ''),
            user=request.user
        )
        
        if success:
            return Response({
                'success': True,
                'message': message,
                'data': OrderDetailSerializer(order).data,
                'meta': None
            })
        
        return Response({
            'success': False,
            'message': message,
            'data': None,
            'meta': None
        }, status=status.HTTP_400_BAD_REQUEST)


class GuestOrderLookupView(APIView):
    """Look up order by order number and email."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        order_number = request.data.get('order_number', '').strip()
        email = request.data.get('email', '').lower().strip()
        
        if not order_number or not email:
            return Response({
                'success': False,
                'message': 'Order number and email are required',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(
                order_number=order_number,
                email=email
            )
            
            return Response({
                'success': True,
                'message': 'Order found',
                'data': OrderDetailSerializer(order).data,
                'meta': None
            })
            
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Order not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


class OrderTrackingView(APIView):
    """Get order tracking information."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, order_number):
        email = request.query_params.get('email', '').lower()
        
        try:
            if request.user.is_authenticated:
                order = Order.objects.get(
                    order_number=order_number,
                    user=request.user
                )
            else:
                if not email:
                    return Response({
                        'success': False,
                        'message': 'Email required for guest order tracking',
                        'data': None,
                        'meta': None
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                order = Order.objects.get(
                    order_number=order_number,
                    email=email
                )
            
            return Response({
                'success': True,
                'message': 'Tracking information retrieved',
                'data': {
                    'order_number': order.order_number,
                    'status': order.status,
                    'status_display': order.get_status_display(),
                    'tracking_number': order.tracking_number,
                    'tracking_url': order.tracking_url,
                    'shipping_method': order.shipping_method,
                    'shipped_at': order.shipped_at,
                    'delivered_at': order.delivered_at,
                    'estimated_delivery': None,  # TODO: Calculate based on shipping method
                },
                'meta': None
            })
            
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Order not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


# Admin Views
class AdminOrderListView(ListAPIView):
    """Admin: List all orders with filtering."""
    
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Order.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(email__icontains=search) |
                Q(shipping_first_name__icontains=search) |
                Q(shipping_last_name__icontains=search)
            )
        
        return queryset


class AdminOrderUpdateView(APIView):
    """Admin: Update order status."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def patch(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status:
            order = OrderService.update_order_status(
                order,
                new_status=new_status,
                notes=notes,
                user=request.user
            )
        
        # Update other fields
        for field in ['admin_notes', 'tracking_number', 'tracking_url']:
            if field in request.data:
                setattr(order, field, request.data[field])
        
        order.save()
        
        return Response({
            'success': True,
            'message': 'Order updated successfully',
            'data': OrderDetailSerializer(order).data,
            'meta': None
        })


class AdminAddTrackingView(APIView):
    """Admin: Add tracking info to order."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        
        serializer = OrderTrackingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order = OrderService.add_tracking(
            order,
            tracking_number=serializer.validated_data['tracking_number'],
            tracking_url=serializer.validated_data.get('tracking_url', ''),
            carrier=serializer.validated_data.get('carrier', '')
        )
        
        return Response({
            'success': True,
            'message': 'Tracking information added',
            'data': OrderDetailSerializer(order).data,
            'meta': None
        })
