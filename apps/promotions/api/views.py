"""
Promotions API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from ..models import Coupon, Banner, Sale
from ..services import CouponService, BannerService, SaleService
from .serializers import (
    CouponSerializer,
    CouponValidateSerializer,
    BannerSerializer,
    SaleSerializer,
    SaleDetailSerializer,
)


class CouponViewSet(viewsets.ViewSet):
    """
    ViewSet for coupon operations.
    
    Endpoints:
    - POST /api/v1/coupons/validate/ - Validate coupon code
    """
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='validate')
    def validate(self, request):
        """Validate a coupon code."""
        serializer = CouponValidateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code']
        subtotal = serializer.validated_data.get('subtotal', 0)
        
        user = request.user if request.user.is_authenticated else None
        
        coupon, is_valid, message = CouponService.validate_coupon(
            code=code,
            user=user,
            subtotal=subtotal
        )
        
        discount = None
        if coupon and is_valid:
            discount = str(coupon.calculate_discount(subtotal))
        
        return Response({
            'success': is_valid,
            'message': message,
            'data': {
                'is_valid': is_valid,
                'coupon': CouponSerializer(coupon).data if coupon else None,
                'discount': discount
            }
        })


class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for banners.
    
    Endpoints:
    - GET /api/v1/banners/ - List active banners
    - GET /api/v1/banners/{id}/ - Get banner detail
    - GET /api/v1/banners/hero/ - Get hero banners
    - GET /api/v1/banners/secondary/ - Get secondary banners
    """
    permission_classes = [AllowAny]
    serializer_class = BannerSerializer
    
    def get_queryset(self):
        return BannerService.get_active_banners()
    
    def list(self, request):
        """List active banners."""
        position = request.query_params.get('position')
        queryset = BannerService.get_active_banners(position=position)
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Banners retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='hero')
    def hero(self, request):
        """Get hero banners."""
        banners = BannerService.get_hero_banners()
        serializer = self.get_serializer(banners, many=True)
        
        return Response({
            'success': True,
            'message': 'Hero banners retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='secondary')
    def secondary(self, request):
        """Get secondary banners."""
        banners = BannerService.get_secondary_banners()
        serializer = self.get_serializer(banners, many=True)
        
        return Response({
            'success': True,
            'message': 'Secondary banners retrieved',
            'data': serializer.data
        })


class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for sales.
    
    Endpoints:
    - GET /api/v1/sales/ - List active sales
    - GET /api/v1/sales/{slug}/ - Get sale detail with products
    """
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return SaleService.get_active_sales()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SaleDetailSerializer
        return SaleSerializer
    
    def list(self, request):
        """List active sales."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Sales retrieved',
            'data': serializer.data
        })
    
    def retrieve(self, request, slug=None):
        """Get sale detail with products."""
        sale = self.get_object()
        serializer = self.get_serializer(sale)
        
        return Response({
            'success': True,
            'message': 'Sale retrieved',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        """Get all products in a sale with pagination."""
        sale = self.get_object()
        products = SaleService.get_sale_products(sale)
        
        # Paginate
        page = self.paginate_queryset(products)
        if page is not None:
            from apps.products.api.serializers import ProductListSerializer
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        from apps.products.api.serializers import ProductListSerializer
        serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'success': True,
            'message': 'Sale products retrieved',
            'data': serializer.data
        })
