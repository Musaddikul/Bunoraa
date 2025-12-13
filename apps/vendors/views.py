# apps/vendors/views.py
"""
Vendor Views
API views for vendor storefronts and dashboards.
"""
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
# get_object_or_404 available via DRF
from django.db.models import Q

from core.permissions import IsVendor
from core.pagination import StandardResultsPagination
from .models import Vendor, VendorPage, VendorSettings, VendorReview, VendorPayout
from .serializers import (
    VendorListSerializer,
    VendorDetailSerializer,
    VendorDashboardSerializer,
    VendorRegistrationSerializer,
    VendorPageSerializer,
    VendorSettingsSerializer,
    VendorReviewSerializer,
    VendorPayoutSerializer,
)


class VendorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing vendors/stores.
    """
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Vendor.objects.filter(status=Vendor.Status.ACTIVE)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(store_name__icontains=search) |
                Q(tagline__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Filter featured
        if self.request.query_params.get('featured'):
            queryset = queryset.filter(is_featured=True)
        
        # Filter verified
        if self.request.query_params.get('verified'):
            queryset = queryset.filter(is_verified=True)
        
        return queryset.order_by('-is_featured', '-average_rating', 'store_name')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VendorDetailSerializer
        return VendorListSerializer
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get vendor's products."""
        vendor = self.get_object()
        from apps.products.models import Product
        from apps.products.serializers import ProductListSerializer
        
        products = Product.objects.filter(
            vendor=vendor,
            is_active=True,
            status=Product.Status.ACTIVE
        )
        
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        """Get vendor reviews."""
        vendor = self.get_object()
        reviews = vendor.reviews.filter(is_approved=True)
        
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(reviews, request)
        serializer = VendorReviewSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def write_review(self, request, slug=None):
        """Write a review for vendor."""
        vendor = self.get_object()
        
        # Check if user already reviewed this vendor
        if VendorReview.objects.filter(vendor=vendor, user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this store.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = VendorReviewSerializer(
            data=request.data,
            context={'request': request, 'vendor': vendor}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VendorRegistrationView(generics.CreateAPIView):
    """
    Register as a vendor.
    """
    serializer_class = VendorRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        # Check if user already has a vendor profile
        if hasattr(request.user, 'vendor_profile'):
            return Response(
                {'error': 'You already have a vendor profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor = serializer.save()
        
        return Response({
            'message': 'Vendor registration submitted successfully. Pending approval.',
            'vendor': VendorDetailSerializer(vendor).data
        }, status=status.HTTP_201_CREATED)


class VendorDashboardView(generics.RetrieveUpdateAPIView):
    """
    Vendor dashboard - view and update own vendor profile.
    """
    serializer_class = VendorDashboardSerializer
    permission_classes = [IsVendor]
    
    def get_object(self):
        return self.request.user.vendor_profile


class VendorSettingsView(generics.RetrieveUpdateAPIView):
    """
    Vendor settings management.
    """
    serializer_class = VendorSettingsSerializer
    permission_classes = [IsVendor]
    
    def get_object(self):
        settings, _ = VendorSettings.objects.get_or_create(
            vendor=self.request.user.vendor_profile
        )
        return settings


class VendorPageViewSet(viewsets.ModelViewSet):
    """
    Vendor custom pages management.
    """
    serializer_class = VendorPageSerializer
    permission_classes = [IsVendor]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return VendorPage.objects.filter(vendor=self.request.user.vendor_profile)
    
    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor_profile)


class VendorPayoutViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vendor payout history.
    """
    serializer_class = VendorPayoutSerializer
    permission_classes = [IsVendor]
    
    def get_queryset(self):
        return VendorPayout.objects.filter(vendor=self.request.user.vendor_profile)


class VendorAnalyticsView(generics.GenericAPIView):
    """
    Vendor analytics dashboard data.
    """
    permission_classes = [IsVendor]
    
    def get(self, request):
        vendor = request.user.vendor_profile
        
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Sum, Count, Avg
        from django.db.models.functions import TruncDate
        
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        # Sales over time
        daily_sales = vendor.order_items.filter(
            order__created_at__gte=thirty_days_ago,
            order__status__name__in=['completed', 'delivered']
        ).annotate(
            date=TruncDate('order__created_at')
        ).values('date').annotate(
            total=Sum('subtotal'),
            count=Count('id')
        ).order_by('date')
        
        # Top products
        top_products = vendor.products.filter(
            is_active=True
        ).order_by('-sale_count')[:10].values('id', 'name', 'sale_count', 'view_count')
        
        # Recent orders
        recent_orders = vendor.order_items.select_related(
            'order', 'product'
        ).order_by('-order__created_at')[:10]
        
        # Summary
        summary = {
            'total_products': vendor.product_count,
            'total_orders': vendor.order_count,
            'total_revenue': float(vendor.total_sales),
            'average_rating': float(vendor.average_rating),
            'review_count': vendor.review_count,
            'pending_orders': vendor.order_items.filter(
                order__status__name__in=['pending', 'processing']
            ).values('order').distinct().count(),
        }
        
        return Response({
            'summary': summary,
            'daily_sales': list(daily_sales),
            'top_products': list(top_products),
            'recent_orders': [
                {
                    'id': str(item.order.id),
                    'order_number': item.order.order_number,
                    'product': item.product.name if item.product else 'N/A',
                    'quantity': item.quantity,
                    'amount': float(item.subtotal),
                    'status': item.order.status.name if item.order.status else 'N/A',
                    'date': item.order.created_at
                }
                for item in recent_orders
            ]
        })
