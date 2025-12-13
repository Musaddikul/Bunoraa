# apps/products/views.py
"""
Views for product management.
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Avg, Count

from .models import Product, ProductImage, Tag, Brand, AttributeType, AttributeValue
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
    ProductImageSerializer,
    TagSerializer,
    BrandSerializer,
    AttributeTypeSerializer,
    AttributeValueSerializer,
    BulkProductSerializer,
)
from .filters import ProductFilter
from core.pagination import StandardResultsSetPagination


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only access to all, write access to admins only."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ProductListCreateView(generics.ListCreateAPIView):
    """
    GET: List products with filtering, search, and pagination
    POST: Create a new product (admin only)
    """
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = ['name', 'price', 'created_at', 'views', 'sales_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_deleted=False)
        
        # For non-admin users, only show active products
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset.select_related('category', 'brand').prefetch_related(
            'images', 'tags'
        )
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Product created successfully',
            'data': ProductDetailSerializer(product).data,
            'meta': None
        }, status=status.HTTP_201_CREATED)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve product details
    PATCH/PUT: Update product (admin only)
    DELETE: Soft delete product (admin only)
    """
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_deleted=False)
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset.select_related('category', 'brand').prefetch_related(
            'images', 'tags', 'variants', 'attributes__attribute_value__attribute_type'
        )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductUpdateSerializer
        return ProductDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count (async in production)
        if not request.user.is_staff:
            instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Product retrieved successfully',
            'data': serializer.data,
            'meta': None
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Product updated successfully',
            'data': ProductDetailSerializer(instance).data,
            'meta': None
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        
        return Response({
            'success': True,
            'message': 'Product deleted successfully',
            'data': None,
            'meta': None
        })


class ProductBySlugView(generics.RetrieveAPIView):
    """Get product by slug."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Product.objects.filter(
            is_deleted=False,
            is_active=True
        ).select_related('category', 'brand').prefetch_related(
            'images', 'tags', 'variants', 'attributes__attribute_value__attribute_type'
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Product retrieved successfully',
            'data': serializer.data,
            'meta': None
        })


class FeaturedProductsView(APIView):
    """Get featured products."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 12))
        
        products = Product.objects.filter(
            is_featured=True,
            is_active=True,
            is_deleted=False
        ).select_related('category', 'brand').prefetch_related(
            'images'
        ).order_by('-featured_weight', '-created_at')[:limit]
        
        serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'success': True,
            'message': 'Featured products retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })


class NewArrivalsView(APIView):
    """Get new arrival products."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 12))
        
        products = Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).select_related('category', 'brand').prefetch_related(
            'images'
        ).order_by('-created_at')[:limit]
        
        serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'success': True,
            'message': 'New arrivals retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })


class BestSellersView(APIView):
    """Get best selling products."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 12))
        
        products = Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).select_related('category', 'brand').prefetch_related(
            'images'
        ).order_by('-sales_count')[:limit]
        
        serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'success': True,
            'message': 'Best sellers retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })


class OnSaleProductsView(APIView):
    """Get products on sale."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 12))
        
        products = Product.objects.filter(
            is_active=True,
            is_deleted=False,
            sale_price__isnull=False,
            sale_price__lt=models.F('price')
        ).select_related('category', 'brand').prefetch_related(
            'images'
        ).order_by('-created_at')[:limit]
        
        serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'success': True,
            'message': 'Sale products retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })


class ProductSearchView(generics.ListAPIView):
    """
    Search products with full-text search.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()
        
        if not query:
            return Product.objects.none()
        
        return Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(sku__icontains=query) |
            Q(tags__name__icontains=query) |
            Q(brand__name__icontains=query),
            is_active=True,
            is_deleted=False
        ).select_related('category', 'brand').prefetch_related(
            'images'
        ).distinct()
    
    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data['data'] = {
                'query': query,
                'products': response.data['data']
            }
            return response
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Search results retrieved',
            'data': {
                'query': query,
                'products': serializer.data
            },
            'meta': {'count': queryset.count()}
        })


class RelatedProductsView(APIView):
    """Get related products for a product."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        try:
            product = Product.objects.get(pk=id, is_deleted=False)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Product not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        limit = int(request.query_params.get('limit', 8))
        
        # Get explicitly set related products first
        related_ids = list(
            product.related_products.values_list('related_id', flat=True)
        )
        
        # Fill with products from same category
        if len(related_ids) < limit:
            category_products = Product.objects.filter(
                category=product.category,
                is_active=True,
                is_deleted=False
            ).exclude(
                pk=product.pk
            ).exclude(
                pk__in=related_ids
            ).values_list('id', flat=True)[:limit - len(related_ids)]
            
            related_ids.extend(category_products)
        
        related = Product.objects.filter(
            id__in=related_ids,
            is_active=True,
            is_deleted=False
        ).select_related('category', 'brand').prefetch_related('images')[:limit]
        
        serializer = ProductListSerializer(related, many=True)
        
        return Response({
            'success': True,
            'message': 'Related products retrieved successfully',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })


class ProductImageUploadView(APIView):
    """Upload images for a product."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, id):
        try:
            product = Product.objects.get(pk=id, is_deleted=False)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Product not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        images = request.FILES.getlist('images')
        
        if not images:
            return Response({
                'success': False,
                'message': 'No images provided',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        created_images = []
        existing_count = product.images.count()
        
        for i, image in enumerate(images):
            product_image = ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=(existing_count == 0 and i == 0),
                sort_order=existing_count + i
            )
            created_images.append(product_image)
        
        serializer = ProductImageSerializer(created_images, many=True)
        
        return Response({
            'success': True,
            'message': f'{len(created_images)} images uploaded successfully',
            'data': serializer.data,
            'meta': None
        }, status=status.HTTP_201_CREATED)


class ProductImageDeleteView(APIView):
    """Delete a product image."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def delete(self, request, id, image_id):
        try:
            image = ProductImage.objects.get(pk=image_id, product_id=id)
        except ProductImage.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Image not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        was_primary = image.is_primary
        image.delete()
        
        # Set new primary if deleted was primary
        if was_primary:
            first_image = ProductImage.objects.filter(product_id=id).first()
            if first_image:
                first_image.is_primary = True
                first_image.save()
        
        return Response({
            'success': True,
            'message': 'Image deleted successfully',
            'data': None,
            'meta': None
        })


class BulkProductCreateView(APIView):
    """Bulk create products."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        serializer = BulkProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        products = serializer.save()
        
        return Response({
            'success': True,
            'message': f'{len(products)} products created successfully',
            'data': ProductListSerializer(products, many=True).data,
            'meta': {'count': len(products)}
        }, status=status.HTTP_201_CREATED)


# Tag views
class TagListCreateView(generics.ListCreateAPIView):
    """List and create tags."""
    
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TagSerializer
    
    def get_queryset(self):
        return Tag.objects.all()


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete tag."""
    
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TagSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return Tag.objects.all()


# Brand views
class BrandListCreateView(generics.ListCreateAPIView):
    """List and create brands."""
    
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BrandSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']
    
    def get_queryset(self):
        return Brand.objects.filter(is_active=True)


class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete brand."""
    
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BrandSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return Brand.objects.all()


# Attribute views
class AttributeTypeListView(generics.ListAPIView):
    """List attribute types."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = AttributeTypeSerializer
    
    def get_queryset(self):
        return AttributeType.objects.all()


class AttributeValueListView(generics.ListAPIView):
    """List attribute values for a type."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = AttributeValueSerializer
    
    def get_queryset(self):
        type_id = self.kwargs.get('type_id')
        return AttributeValue.objects.filter(attribute_type_id=type_id)
