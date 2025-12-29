"""
Product API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from ..models import Product, ProductImage, ProductVariant, Tag, Attribute
from ..services import ProductService, TagService, AttributeService
import logging

logger = logging.getLogger(__name__)
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
    ProductImageSerializer,
    ProductImageCreateSerializer,
    ProductVariantSerializer,
    TagSerializer,
    AttributeSerializer,
    BulkStockUpdateSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    """
    Product API endpoints.
    
    list: GET /api/v1/products/
    retrieve: GET /api/v1/products/{id}/ or /api/v1/products/{slug}/
    create: POST /api/v1/products/ (admin only)
    update: PATCH /api/v1/products/{id}/ (admin only)
    destroy: DELETE /api/v1/products/{id}/ (admin only)
    """
    
    queryset = Product.objects.filter(is_deleted=False)
    serializer_class = ProductListSerializer
    lookup_field = 'pk'
    lookup_value_regex = '[^/]+'  # Allow both UUID and slug
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['name', 'price', 'created_at', 'sold_count']
    ordering = ['-created_at']
    
    def get_object(self):
        """
        Get product by UUID or slug.
        """
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)
        
        # Try UUID first
        try:
            import uuid
            uuid.UUID(lookup_value)
            filter_kwargs = {'id': lookup_value}
        except (ValueError, AttributeError):
            # Not a UUID, try slug
            filter_kwargs = {'slug': lookup_value}
        
        obj = queryset.filter(**filter_kwargs).first()
        if not obj:
            from rest_framework.exceptions import NotFound
            raise NotFound('Product not found')
        
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_upload', 'bulk_stock_update', 'suggest']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_deleted=False)

        # For non-admin users, only show active products
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)

        # Apply filters
        category = self.request.query_params.get('category')
        categories_param = self.request.query_params.get('categories')
        tag = self.request.query_params.get('tag')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        in_stock = self.request.query_params.get('in_stock')
        is_featured = self.request.query_params.get('is_featured')
        is_on_sale = self.request.query_params.get('is_on_sale')
        is_bestseller = self.request.query_params.get('bestseller')

        def split_values(raw):
            if not raw:
                return []
            return [value.strip() for value in raw.split(',') if value.strip()]

        category_filters = []
        if category:
            category_filters.extend(split_values(category))
        if categories_param:
            category_filters.extend(split_values(categories_param))

        if category_filters:
            from apps.categories.ml import Category
            matched_category_ids = set()
            for value in category_filters:
                try:
                    # Prefer slug lookup; fall back to UUID when needed.
                    try:
                        cat = Category.objects.get(slug=value)
                    except Category.DoesNotExist:
                        cat = Category.objects.get(id=value)
                    matched_category_ids.update(cat.get_descendant_ids(include_self=True))
                except (Category.DoesNotExist, ValueError):
                    continue

            if matched_category_ids:
                queryset = queryset.filter(categories__id__in=matched_category_ids)

        if tag:
            queryset = queryset.filter(tags__id=tag)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if in_stock == 'true':
            queryset = queryset.filter(
                Q(track_inventory=False) |
                Q(stock_quantity__gt=0) |
                Q(allow_backorder=True)
            )
        elif in_stock == 'false':
            queryset = queryset.filter(
                track_inventory=True,
                stock_quantity=0,
                allow_backorder=False
            )

        if is_featured == 'true':
            queryset = queryset.filter(is_featured=True)

        if is_on_sale == 'true':
            from django.db.models import F
            queryset = queryset.filter(
                sale_price__isnull=False,
                sale_price__lt=F('price')
            )

        if is_bestseller == 'true':
            queryset = queryset.filter(is_bestseller=True)

        return queryset.distinct()
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Products retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.increment_view_count()
            serializer = self.get_serializer(instance)
            return Response({
                'success': True,
                'message': 'Product retrieved successfully.',
                'data': serializer.data,
                'meta': None
            })
        except Exception:
            # Log exception and return JSON error so clients can handle gracefully
            logger.exception('Failed to retrieve product for %s', kwargs.get(self.lookup_field))
            return Response({
                'success': False,
                'message': 'Failed to retrieve product.',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response({
                'success': True,
                'message': 'Product created successfully.',
                'data': ProductDetailSerializer(product, context={'request': request}).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Failed to create product.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Product updated successfully.',
                'data': ProductDetailSerializer(instance, context={'request': request}).data,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Failed to update product.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response({
            'success': True,
            'message': 'Product deleted successfully.',
            'data': None,
            'meta': None
        })
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products."""
        limit = int(request.query_params.get('limit', 8))
        products = ProductService.get_featured_products(limit=limit)
        serializer = self.get_serializer(products, many=True)
        return Response({
            'success': True,
            'message': 'Featured products retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get new arrival products."""
        limit = int(request.query_params.get('limit', 8))
        products = ProductService.get_new_arrivals(limit=limit)
        serializer = self.get_serializer(products, many=True)
        return Response({
            'success': True,
            'message': 'New arrivals retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """Get bestselling products."""
        limit = int(request.query_params.get('limit', 8))
        products = ProductService.get_bestsellers(limit=limit)
        serializer = self.get_serializer(products, many=True)
        return Response({
            'success': True,
            'message': 'Bestsellers retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get products on sale."""
        limit = int(request.query_params.get('limit', 8))
        products = ProductService.get_on_sale_products(limit=limit)
        serializer = self.get_serializer(products, many=True)
        return Response({
            'success': True,
            'message': 'Sale products retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products."""
        query = request.query_params.get('q', '')
        limit = int(request.query_params.get('limit', 20))
        
        if not query:
            return Response({
                'success': False,
                'message': 'Search query is required.',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        products = ProductService.search_products(query, limit=limit)
        serializer = self.get_serializer(products, many=True)
        return Response({
            'success': True,
            'message': 'Search completed.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data), 'query': query}
        })
    
    @action(detail=False, methods=['get'])
    def price_range(self, request):
        """Get price range for filtering."""
        price_range = ProductService.get_price_range()
        return Response({
            'success': True,
            'message': 'Price range retrieved.',
            'data': price_range,
            'meta': None
        })
    
    @action(detail=True, methods=['get'])
    def related(self, request, id=None):
        """Get related products."""
        product = self.get_object()
        limit = int(request.query_params.get('limit', 4))
        related = ProductService.get_related_products(product, limit=limit)
        serializer = self.get_serializer(related, many=True)
        return Response({
            'success': True,
            'message': 'Related products retrieved.',
            'data': serializer.data,
            'meta': None
        })
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def images(self, request, id=None):
        """Upload product images."""
        product = self.get_object()
        serializer = ProductImageCreateSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.save(product=product)
            return Response({
                'success': True,
                'message': 'Image uploaded successfully.',
                'data': ProductImageSerializer(image, context={'request': request}).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Failed to upload image.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def bulk_stock_update(self, request):
        """Bulk update product stock."""
        serializer = BulkStockUpdateSerializer(data=request.data, many=True)
        if serializer.is_valid():
            ProductService.bulk_update_stock(serializer.validated_data)
            return Response({
                'success': True,
                'message': 'Stock updated successfully.',
                'data': None,
                'meta': {'updated_count': len(serializer.validated_data)}
            })
        return Response({
            'success': False,
            'message': 'Failed to update stock.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def suggest(self, request):
        """Return auto-fill suggestions for product metadata based on provided fields and uploaded image filenames.

        Payload: {name, description, price, image_filenames: ["file1.jpg", ...]}
        """
        data = request.data.copy()
        # Collect uploaded file names if provided
        image_files = []
        for f in request.FILES.values():
            try:
                image_files.append(f.name)
            except Exception:
                pass
        if 'image_filenames' in data and isinstance(data.get('image_filenames'), list):
            image_files.extend(data.get('image_filenames'))
        data['image_filenames'] = image_files

        try:
            suggestions = ProductService.generate_product_suggestions(data)
            return Response({'success': True, 'message': 'Suggestions generated', 'data': suggestions})
        except Exception as exc:
            logger.exception('Failed to generate suggestions: %s', exc)
            return Response({'success': False, 'message': 'Failed to generate suggestions', 'data': None}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TagViewSet(viewsets.ModelViewSet):
    """Tag API endpoints."""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'id'
    search_fields = ['name']
    ordering = ['name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Tags retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })


class AttributeViewSet(viewsets.ModelViewSet):
    """Attribute API endpoints."""
    
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    lookup_field = 'id'
    search_fields = ['name']
    ordering = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Attributes retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })
