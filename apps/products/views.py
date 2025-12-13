# apps/products/views.py
"""
Product Views
API views for product listing and management.
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.shortcuts import get_object_or_404

from core.pagination import StandardResultsPagination
from core.permissions import IsVendor, IsVendorOwner
from .models import Brand, Product, ProductImage, ProductAttribute
from .serializers import (
    BrandSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
    ProductImageSerializer,
    ProductAttributeSerializer,
)
from .filters import ProductFilter


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing brands.
    """
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products by brand."""
        brand = self.get_object()
        products = Product.objects.filter(
            brand=brand,
            is_active=True,
            status=Product.Status.ACTIVE
        )
        
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for product CRUD operations.
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'short_description', 'sku', 'tags__name']
    ordering_fields = ['price', 'created_at', 'sale_count', 'view_count', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.select_related(
            'category', 'vendor', 'brand'
        ).prefetch_related(
            'images', 'variants', 'attributes', 'tags'
        )
        
        # For public views, only show active products
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(
                is_active=True,
                status=Product.Status.ACTIVE
            )
        
        # For vendor management, filter by their products
        if self.action in ['update', 'partial_update', 'destroy']:
            if hasattr(self.request.user, 'vendor_profile'):
                queryset = queryset.filter(vendor=self.request.user.vendor_profile)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductListSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [IsVendor()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsVendorOwner()]
        return [permissions.AllowAny()]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products."""
        products = self.get_queryset().filter(
            featured_weight__gt=0
        ).order_by('-featured_weight', '-created_at')[:12]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get new arrival products."""
        products = self.get_queryset().filter(
            is_new=True
        ).order_by('-created_at')[:12]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """Get bestseller products."""
        products = self.get_queryset().filter(
            is_bestseller=True
        ).order_by('-sale_count')[:12]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get products on sale."""
        products = self.get_queryset().filter(
            compare_at_price__isnull=False,
            compare_at_price__gt=F('price')
        ).order_by('-created_at')[:12]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced product search."""
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'results': []})
        
        products = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(short_description__icontains=query) |
            Q(sku__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()
        
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """Get related products."""
        product = self.get_object()
        related = self.get_queryset().filter(
            category=product.category
        ).exclude(pk=product.pk)[:8]
        
        serializer = ProductListSerializer(related, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        """Get product reviews."""
        product = self.get_object()
        from apps.reviews.serializers import ReviewSerializer
        from core.pagination import SmallResultsPagination
        
        reviews = product.reviews.filter(is_approved=True).select_related('user')
        
        paginator = SmallResultsPagination()
        page = paginator.paginate_queryset(reviews, request)
        serializer = ReviewSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing product images (vendor).
    """
    serializer_class = ProductImageSerializer
    permission_classes = [IsVendor]
    
    def get_queryset(self):
        return ProductImage.objects.filter(
            product__vendor=self.request.user.vendor_profile
        )
    
    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = get_object_or_404(
            Product,
            pk=product_id,
            vendor=self.request.user.vendor_profile
        )
        serializer.save(product=product)


class ProductAttributeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing product attributes.
    """
    queryset = ProductAttribute.objects.prefetch_related('values')
    serializer_class = ProductAttributeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
