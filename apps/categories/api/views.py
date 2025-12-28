"""
Category API views
"""
from rest_framework import viewsets, status
from django.db import models
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from ..models import Category, Facet, ExternalCategoryMapping, ProductCategorySuggestion
from ..services import CategoryService
from .serializers import (
    CategorySerializer,
    CategoryDetailSerializer,
    CategoryTreeSerializer,
    CategoryCreateSerializer,
    CategoryUpdateSerializer,
    CategoryReorderSerializer,
)
from .serializers import FacetSerializer, ExternalCategoryMappingSerializer
from rest_framework import serializers


class FacetViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for facets."""
    queryset = Facet.objects.all().order_by('label')
    serializer_class = FacetSerializer
    lookup_field = 'facet_code'
    permission_classes = [AllowAny]


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Category API endpoints.
    
    list: GET /api/v1/categories/
    retrieve: GET /api/v1/categories/{id}/ or /api/v1/categories/{slug}/
    create: POST /api/v1/categories/ (admin only)
    update: PATCH /api/v1/categories/{id}/ (admin only)
    destroy: DELETE /api/v1/categories/{id}/ (admin only)
    tree: GET /api/v1/categories/tree/
    products: GET /api/v1/categories/{id}/products/
    """

    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategorySerializer
    lookup_field = 'pk'
    lookup_value_regex = '[^/]+'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order', 'created_at']
    ordering = ['order', 'name']
    filterset_fields = ['parent', 'is_active', 'is_featured', 'depth']
    
    def get_object(self):
        """
        Retrieve a category by UUID or slug.
        """
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get('pk')
        
        # Try to parse as UUID first
        try:
            import uuid
            uuid.UUID(str(lookup_value))
            filter_kwargs = {'id': lookup_value}
        except (ValueError, AttributeError):
            # Not a UUID, treat as slug
            filter_kwargs = {'slug': lookup_value}
        
        obj = queryset.filter(**filter_kwargs).first()
        if obj is None:
            from rest_framework.exceptions import NotFound
            raise NotFound('Category not found.')
        
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'reorder']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        elif self.action == 'create':
            return CategoryCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CategoryUpdateSerializer
        elif self.action == 'tree':
            return CategoryTreeSerializer
        return CategorySerializer

    def create(self, request, *args, **kwargs):
        """Ensure slug is generated when not provided to make API create ergonomic."""
        from django.utils.text import slugify
        data = request.data.copy()
        if not data.get('slug') and data.get('name'):
            data['slug'] = slugify(data.get('name'))
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'success': True, 'message': 'Category created.', 'data': serializer.data}, status=201, headers=headers)
    
    def get_queryset(self):
        queryset = Category.objects.filter(is_deleted=False)
        
        # For non-admin users, only show active categories
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        # Filter by parent_id
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            if parent_id == 'null' or parent_id == 'root':
                queryset = queryset.filter(parent__isnull=True)
            else:
                queryset = queryset.filter(parent_id=parent_id)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Categories retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search categories by name or description and return allowed facets."""
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response({'success': False, 'message': 'Query parameter `q` required', 'data': [], 'meta': None}, status=400)
        qs = self.get_queryset().filter(models.Q(name__icontains=q) | models.Q(description__icontains=q))[:50]
        serializer = CategorySerializer(qs, many=True, context={'request': request})
        # include allowed facets for top-level matches
        results = serializer.data
        for i, cat in enumerate(qs):
            facets = cat.categoryallowedfacet_set.select_related('facet').all()
            results[i]['allowed_facets'] = [f.facet.facet_code for f in facets]
        return Response({'success': True, 'message': 'Search complete', 'data': results, 'meta': {'count': qs.count()}})

    @action(detail=False, methods=['get'])
    def export_mappings(self, request):
        """Export category external mappings for marketplace purposes.

        Optional query param: provider (e.g., 'google_shopping')
        """
        provider = request.query_params.get('provider')
        mappings_qs = ExternalCategoryMapping.objects.all()
        if provider:
            mappings_qs = mappings_qs.filter(provider=provider)
        serializer = ExternalCategoryMappingSerializer(mappings_qs, many=True)
        return Response({'success': True, 'message': 'External mappings', 'data': serializer.data, 'meta': {'count': mappings_qs.count()}})

    @action(detail=False, methods=['get'])
    def classify(self, request):
        """Return category suggestions for a product text (name and optional description).

        Params: name=<name>&description=<desc>
        """
        name = request.query_params.get('name', '')
        desc = request.query_params.get('description', '')
        if not name and not desc:
            return Response({'success': False, 'message': 'Provide name or description', 'data': None}, status=400)
        from ..classifier import classify_text
        text = f"{name} {desc}"
        recs = classify_text(text, top_k=5)
        results = []
        for code, conf in recs:
            cat = Category.objects.filter(code=code).first() or Category.objects.filter(slug=code).first()
            if cat:
                results.append({'code': cat.code or str(cat.id), 'name': cat.name, 'slug': cat.slug, 'confidence': conf})
        return Response({'success': True, 'message': 'Classification results', 'data': results})

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """List stored product category suggestions.

        Query params: product_id (optional)
        """
        product_id = request.query_params.get('product_id')
        qs = ProductCategorySuggestion.objects.all()
        if product_id:
            qs = qs.filter(product_id=product_id)
        data = []
        for s in qs.select_related('suggested_category'):
            data.append({'product_id': str(s.product_id), 'category_code': s.suggested_category.code, 'category_name': s.suggested_category.name, 'confidence': s.confidence, 'method': s.method, 'created_at': s.created_at})
        return Response({'success': True, 'data': data, 'meta': {'count': qs.count()}})
    
    @action(detail=False, methods=['get'])
    def root(self, request):
        """Get root categories only."""
        categories = CategoryService.get_root_categories()
        serializer = self.get_serializer(categories, many=True)
        return Response({
            'success': True,
            'message': 'Root categories retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': categories.count()}
        })
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured categories."""
        limit = int(request.query_params.get('limit', 6))
        categories = CategoryService.get_featured_categories(limit=limit)
        serializer = self.get_serializer(categories, many=True)
        return Response({
            'success': True,
            'message': 'Featured categories retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': len(serializer.data)}
        })
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """
        Get products in this category (including descendants).
        GET /api/v1/categories/{id}/products/ or /api/v1/categories/{slug}/products/
        """
        category = self.get_object()
        include_descendants = request.query_params.get('include_descendants', 'true').lower() == 'true'
        
        products = CategoryService.get_category_products(category, include_descendants=include_descendants)
        
        # Apply filters
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        sort = request.query_params.get('sort', '-created_at')
        
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        
        products = products.order_by(sort)
        
        # Pagination
        page = self.paginate_queryset(products)
        if page is not None:
            from apps.products.api.serializers import ProductListSerializer
            serializer = ProductListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        from apps.products.api.serializers import ProductListSerializer
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response({
            'success': True,
            'message': 'Category products retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': products.count()}
        })
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def reorder(self, request):
        """Reorder categories."""
        serializer = CategoryReorderSerializer(data=request.data, many=True)
        if serializer.is_valid():
            CategoryService.reorder_categories(serializer.validated_data)
            return Response({
                'success': True,
                'message': 'Categories reordered successfully.',
                'data': None,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Failed to reorder categories.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def breadcrumbs(self, request, pk=None):
        """Get breadcrumb navigation for a category."""
        category = self.get_object()
        return Response({
            'success': True,
            'message': 'Breadcrumbs retrieved successfully.',
            'data': category.get_breadcrumbs(),
            'meta': None
        })
