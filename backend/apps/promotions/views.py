# apps/promotions/views.py
"""
Promotion views.
"""
from django.db import models
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.utils import timezone

from .models import Coupon, Banner, Sale
from .serializers import (
    CouponSerializer,
    CouponValidateSerializer,
    BannerSerializer,
    SaleSerializer,
    SaleDetailSerializer,
)


class ValidateCouponView(APIView):
    """Validate a coupon code."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        code = serializer.validated_data['code']
        
        try:
            coupon = Coupon.objects.get(code__iexact=code)
            
            # Get cart total if available
            cart_total = None
            from apps.cart.services import CartService
            cart = CartService.get_or_create_cart(request)
            cart_total = cart.subtotal
            
            # Validate coupon
            user = request.user if request.user.is_authenticated else None
            is_valid_coupon, message = coupon.is_valid(user=user, cart_total=cart_total)
            
            if is_valid_coupon:
                return Response({
                    'success': True,
                    'message': message,
                    'data': {
                        'coupon': CouponSerializer(coupon).data,
                        'discount_amount': str(coupon.calculate_discount(cart_total))
                    },
                    'meta': None
                })
            else:
                return Response({
                    'success': False,
                    'message': message,
                    'data': None,
                    'meta': None
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Coupon.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid coupon code',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


class BannerListView(ListAPIView):
    """List active banners."""
    
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        position = self.request.query_params.get('position')
        
        queryset = Banner.objects.filter(
            is_active=True,
            valid_from__lte=now
        ).filter(
            models.Q(valid_until__isnull=True) |
            models.Q(valid_until__gte=now)
        )
        
        if position:
            queryset = queryset.filter(position=position)
        
        return queryset.order_by('position', 'order')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Banners retrieved successfully',
            'data': serializer.data,
            'meta': None
        })


class SaleListView(ListAPIView):
    """List active sales."""
    
    serializer_class = SaleSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        return Sale.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Sales retrieved successfully',
            'data': serializer.data,
            'meta': None
        })


class SaleDetailView(RetrieveAPIView):
    """Get sale details with products."""
    
    serializer_class = SaleDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        now = timezone.now()
        return Sale.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            return Response({
                'success': True,
                'message': 'Sale retrieved successfully',
                'data': serializer.data,
                'meta': None
            })
        except Exception:
            return Response({
                'success': False,
                'message': 'Sale not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


# Admin views
class AdminCouponListView(ListAPIView):
    """Admin: List all coupons."""
    
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Coupon.objects.all()


class AdminCouponCreateView(APIView):
    """Admin: Create a coupon."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        # Simple coupon creation
        data = request.data
        
        try:
            coupon = Coupon.objects.create(
                code=data['code'].upper(),
                description=data.get('description', ''),
                discount_type=data.get('discount_type', 'percentage'),
                discount_value=data['discount_value'],
                minimum_purchase=data.get('minimum_purchase'),
                maximum_discount=data.get('maximum_discount'),
                usage_limit=data.get('usage_limit'),
                usage_limit_per_user=data.get('usage_limit_per_user', 1),
                valid_from=data.get('valid_from', timezone.now()),
                valid_until=data.get('valid_until'),
                is_active=data.get('is_active', True),
                first_order_only=data.get('first_order_only', False),
            )
            
            return Response({
                'success': True,
                'message': 'Coupon created successfully',
                'data': CouponSerializer(coupon).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
