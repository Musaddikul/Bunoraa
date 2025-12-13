# apps/categories/views.py
"""
Views for category management.
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category
from .serializers import (
    CategorySerializer,
    CategoryCreateSerializer,
    CategoryUpdateSerializer,
    CategoryListSerializer,
    CategoryTreeSerializer,
)
from .services import CategoryService
from core.pagination import StandardResultsSetPagination


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only access to all, write access to admins only."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CategoryListCreateView(generics.ListCreateAPIView):
    """
    GET: List categories with optional filtering
    POST: Create a new category (admin only)
    """
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['parent', 'is_active', 'is_featured', 'depth']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_queryset(self):
        return Category.objects.filter(is_deleted=False)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CategoryCreateSerializer
        return CategoryListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Category created successfully',
            'data': CategorySerializer(category).data,
            'meta': None
        }, status=status.HTTP_201_CREATED)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve category details
    PATCH/PUT: Update category (admin only)
    DELETE: Soft delete category (admin only)
    """
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Category.objects.filter(is_deleted=False)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CategoryUpdateSerializer
        return CategorySerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Category retrieved successfully',
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
            'message': 'Category updated successfully',
            'data': CategorySerializer(instance).data,
            'meta': None
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        
        return Response({
            'success': True,
            'message': 'Category deleted successfully',
            'data': None,
            'meta': None
        })


class CategoryBySlugView(generics.RetrieveAPIView):
    """Get category by slug."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Category.objects.filter(is_deleted=False, is_active=True)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Category retrieved successfully',
            'data': serializer.data,
            'meta': None
        })


class CategoryTreeView(APIView):
    """
    Get full category tree or tree from a specific root.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        root_id = request.query_params.get('root')
        max_depth = request.query_params.get('depth')
        
        tree = CategoryService.get_category_tree(
            root_id=root_id,
            max_depth=int(max_depth) if max_depth else None
        )
        
        return Response({
            'success': True,
            'message': 'Category tree retrieved successfully',
            'data': tree,
            'meta': None
        })


class CategoryChildrenView(APIView):
    """Get immediate children of a category."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        try:
            category = Category.objects.get(pk=id, is_deleted=False)
        except Category.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Category not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        children = category.get_children().filter(is_active=True)
        serializer = CategoryListSerializer(children, many=True)
        
        return Response({
            'success': True,
            'message': 'Children retrieved successfully',
            'data': serializer.data,
            'meta': {'count': children.count()}
        })


class CategoryAncestorsView(APIView):
    """Get ancestors (breadcrumb) of a category."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        try:
            category = Category.objects.get(pk=id, is_deleted=False)
        except Category.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Category not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        breadcrumb = category.get_breadcrumb()
        
        return Response({
            'success': True,
            'message': 'Ancestors retrieved successfully',
            'data': breadcrumb,
            'meta': None
        })


class CategoryProductsView(generics.ListAPIView):
    """
    Get products in a category and all its descendants.
    """
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        from apps.products.models import Product
        
        category_id = self.kwargs.get('id')
        try:
            category = Category.objects.get(pk=category_id, is_deleted=False)
        except Category.DoesNotExist:
            return Product.objects.none()
        
        # Get all descendant category IDs including self
        category_ids = list(
            category.get_descendants(include_self=True).values_list('id', flat=True)
        )
        
        return Product.objects.filter(
            category_id__in=category_ids,
            is_active=True,
            is_deleted=False
        ).select_related('category')
    
    def get_serializer_class(self):
        from apps.products.serializers import ProductListSerializer
        return ProductListSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Get category info
        category_id = self.kwargs.get('id')
        try:
            category = Category.objects.get(pk=category_id, is_deleted=False)
            category_data = CategorySerializer(category).data
        except Category.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Category not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data['data'] = {
                'category': category_data,
                'products': response.data['data']
            }
            return response
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Products retrieved successfully',
            'data': {
                'category': category_data,
                'products': serializer.data
            },
            'meta': {'count': queryset.count()}
        })


class FeaturedCategoriesView(APIView):
    """Get featured categories."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        
        categories = Category.objects.filter(
            is_featured=True,
            is_active=True,
            is_deleted=False
        )[:limit]
        
        serializer = CategoryListSerializer(categories, many=True)
        
        return Response({
            'success': True,
            'message': 'Featured categories retrieved successfully',
            'data': serializer.data,
            'meta': {'count': categories.count()}
        })


class RootCategoriesView(APIView):
    """Get root categories (no parent)."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        categories = Category.objects.filter(
            parent__isnull=True,
            is_active=True,
            is_deleted=False
        ).order_by('sort_order', 'name')
        
        serializer = CategoryListSerializer(categories, many=True)
        
        return Response({
            'success': True,
            'message': 'Root categories retrieved successfully',
            'data': serializer.data,
            'meta': {'count': categories.count()}
        })
