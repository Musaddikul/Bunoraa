"""
Analytics API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser

from ..models import DailyStat
from ..services import DashboardService, AnalyticsService
from .serializers import (
    DailyStatSerializer, OverviewStatSerializer, RevenueChartSerializer,
    TopProductSerializer, PopularSearchSerializer, DeviceBreakdownSerializer,
    CartAnalyticsSerializer, TrackEventSerializer
)


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for dashboard analytics (admin only).
    
    GET /api/v1/analytics/dashboard/ - Get overview stats
    GET /api/v1/analytics/dashboard/revenue/ - Get revenue chart data
    GET /api/v1/analytics/dashboard/top-products/ - Get top products
    GET /api/v1/analytics/dashboard/searches/ - Get popular searches
    GET /api/v1/analytics/dashboard/devices/ - Get device breakdown
    GET /api/v1/analytics/dashboard/cart/ - Get cart analytics
    """
    permission_classes = [IsAdminUser]
    
    def list(self, request):
        """Get overview statistics."""
        days = int(request.query_params.get('days', 30))
        stats = DashboardService.get_overview_stats(days)
        serializer = OverviewStatSerializer(stats)
        
        return Response({
            'success': True,
            'message': 'Overview statistics retrieved successfully',
            'data': serializer.data,
            'meta': {}
        })
    
    @action(detail=False, methods=['get'])
    def revenue(self, request):
        """Get revenue chart data."""
        days = int(request.query_params.get('days', 30))
        data = DashboardService.get_revenue_chart_data(days)
        
        return Response({
            'success': True,
            'message': 'Revenue data retrieved successfully',
            'data': data,
            'meta': {'days': days}
        })
    
    @action(detail=False, methods=['get'], url_path='top-products')
    def top_products(self, request):
        """Get top performing products."""
        days = int(request.query_params.get('days', 30))
        limit = int(request.query_params.get('limit', 10))
        data = DashboardService.get_top_products(days, limit)
        
        return Response({
            'success': True,
            'message': 'Top products retrieved successfully',
            'data': data,
            'meta': {'days': days, 'limit': limit}
        })
    
    @action(detail=False, methods=['get'])
    def searches(self, request):
        """Get popular search queries."""
        days = int(request.query_params.get('days', 7))
        limit = int(request.query_params.get('limit', 20))
        data = DashboardService.get_popular_searches(days, limit)
        
        return Response({
            'success': True,
            'message': 'Popular searches retrieved successfully',
            'data': data,
            'meta': {'days': days, 'limit': limit}
        })
    
    @action(detail=False, methods=['get'])
    def devices(self, request):
        """Get device type breakdown."""
        days = int(request.query_params.get('days', 30))
        data = DashboardService.get_device_breakdown(days)
        
        return Response({
            'success': True,
            'message': 'Device breakdown retrieved successfully',
            'data': data,
            'meta': {'days': days}
        })
    
    @action(detail=False, methods=['get'])
    def cart(self, request):
        """Get cart analytics."""
        days = int(request.query_params.get('days', 30))
        data = DashboardService.get_cart_analytics(days)
        serializer = CartAnalyticsSerializer(data)
        
        return Response({
            'success': True,
            'message': 'Cart analytics retrieved successfully',
            'data': serializer.data,
            'meta': {'days': days}
        })


class DailyStatViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for daily statistics (admin only).
    
    GET /api/v1/analytics/daily/ - List daily stats
    GET /api/v1/analytics/daily/{date}/ - Get specific date stats
    """
    queryset = DailyStat.objects.all()
    serializer_class = DailyStatSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'date'
    
    def list(self, request, *args, **kwargs):
        days = int(request.query_params.get('days', 30))
        queryset = self.get_queryset()[:days]
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Daily statistics retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Daily statistics retrieved successfully',
            'data': serializer.data,
            'meta': {}
        })


class TrackingViewSet(viewsets.ViewSet):
    """
    ViewSet for tracking events (public).
    
    POST /api/v1/analytics/track/ - Track an event
    """
    permission_classes = [AllowAny]
    
    def create(self, request):
        """Track an event."""
        serializer = TrackEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        event_type = serializer.validated_data['event_type']
        
        try:
            if event_type == 'page_view':
                AnalyticsService.track_page_view(request)
            
            elif event_type == 'product_view':
                product_id = serializer.validated_data.get('product_id')
                if product_id:
                    from apps.products.models import Product
                    product = Product.objects.filter(id=product_id).first()
                    if product:
                        source = serializer.validated_data.get('source')
                        AnalyticsService.track_product_view(product, request, source)
            
            elif event_type == 'search':
                query = serializer.validated_data.get('query')
                if query:
                    metadata = serializer.validated_data.get('metadata', {})
                    results_count = metadata.get('results_count', 0)
                    AnalyticsService.track_search(query, results_count, request)
            
            elif event_type == 'cart_add':
                product_id = serializer.validated_data.get('product_id')
                metadata = serializer.validated_data.get('metadata', {})
                from apps.products.models import Product
                product = Product.objects.filter(id=product_id).first() if product_id else None
                from ..models import CartEvent
                AnalyticsService.track_cart_event(
                    CartEvent.EVENT_ADD,
                    request,
                    product=product,
                    quantity=metadata.get('quantity', 1),
                    cart_value=metadata.get('cart_value', 0)
                )
            
            elif event_type == 'cart_remove':
                product_id = serializer.validated_data.get('product_id')
                from apps.products.models import Product
                product = Product.objects.filter(id=product_id).first() if product_id else None
                from ..models import CartEvent
                AnalyticsService.track_cart_event(CartEvent.EVENT_REMOVE, request, product=product)
            
            elif event_type == 'checkout_start':
                metadata = serializer.validated_data.get('metadata', {})
                from ..models import CartEvent
                AnalyticsService.track_cart_event(
                    CartEvent.EVENT_CHECKOUT_START,
                    request,
                    cart_value=metadata.get('cart_value', 0)
                )
            
            return Response({
                'success': True,
                'message': 'Event tracked successfully',
                'data': {},
                'meta': {}
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Failed to track event',
                'data': {'error': str(e)},
                'meta': {}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
