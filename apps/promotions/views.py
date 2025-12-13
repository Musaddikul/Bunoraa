# apps/promotions/views.py
"""
Promotion Views
"""
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, F

from .models import Coupon, Sale, FlashDeal, Bundle
from .serializers import (
    CouponSerializer, CouponValidateSerializer,
    SaleSerializer, FlashDealSerializer, BundleSerializer
)


class CouponValidateView(generics.GenericAPIView):
    """
    Validate a coupon code.
    """
    serializer_class = CouponValidateSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        code = serializer.validated_data['code']
        subtotal = serializer.validated_data.get('subtotal')
        
        try:
            coupon = Coupon.objects.get(code__iexact=code)
            
            if not coupon.is_valid:
                return Response({
                    'valid': False,
                    'error': 'This coupon is no longer valid'
                })
            
            if request.user.is_authenticated:
                if not coupon.is_valid_for_user(request.user):
                    return Response({
                        'valid': False,
                        'error': 'This coupon cannot be used with your account'
                    })
            
            if coupon.min_order_amount and subtotal:
                if subtotal < coupon.min_order_amount:
                    return Response({
                        'valid': False,
                        'error': f'Minimum order amount is {coupon.min_order_amount}'
                    })
            
            discount = None
            if subtotal:
                discount = coupon.calculate_discount(subtotal)
            
            return Response({
                'valid': True,
                'coupon': CouponSerializer(coupon).data,
                'discount': discount
            })
            
        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'Invalid coupon code'
            })


class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Active sales.
    """
    serializer_class = SaleSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        now = timezone.now()
        return Sale.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured sales."""
        sales = self.get_queryset().filter(is_featured=True)[:5]
        return Response(SaleSerializer(sales, many=True).data)
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products in a sale."""
        from apps.products.serializers import ProductListSerializer
        
        sale = self.get_object()
        products = sale.get_products()
        
        # Pagination
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        return Response(ProductListSerializer(products, many=True).data)


class FlashDealViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Flash deals.
    """
    serializer_class = FlashDealSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        return FlashDeal.objects.filter(
            is_active=True,
            start_time__lte=now,
            end_time__gte=now
        ).filter(
            quantity_sold__lt=F('quantity_available')
        ).select_related('product')
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming flash deals."""
        now = timezone.now()
        deals = FlashDeal.objects.filter(
            is_active=True,
            start_time__gt=now
        ).order_by('start_time')[:10]
        return Response(FlashDealSerializer(deals, many=True).data)


class BundleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Product bundles.
    """
    serializer_class = BundleSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        now = timezone.now()
        return Bundle.objects.filter(
            is_active=True
        ).filter(
            Q(valid_from__isnull=True) | Q(valid_from__lte=now)
        ).filter(
            Q(valid_until__isnull=True) | Q(valid_until__gte=now)
        ).prefetch_related('items__product')


class AdminCouponViewSet(viewsets.ModelViewSet):
    """
    Admin coupon management.
    """
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Coupon.objects.all()
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Coupon usage statistics."""
        from django.db.models import Sum, Count
        
        stats = {
            'total_coupons': Coupon.objects.count(),
            'active_coupons': Coupon.objects.filter(is_active=True).count(),
            'total_uses': Coupon.objects.aggregate(Sum('times_used'))['times_used__sum'] or 0,
            'most_used': list(
                Coupon.objects.filter(times_used__gt=0)
                .order_by('-times_used')[:5]
                .values('code', 'times_used')
            )
        }
        
        return Response(stats)
