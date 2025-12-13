# apps/categories/views.py
"""
Category Views
API views for category browsing and management.
"""
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from core.permissions import IsAdminOrReadOnly
from .models import Category
from .serializers import (
    CategorySerializer,
    CategoryTreeSerializer,
    CategoryDetailSerializer,
    CategoryCreateSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for category CRUD operations.
    - List: All active categories
    - Retrieve: Category details with children
    - Create/Update/Delete: Admin only
    """
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Category.objects.filter(is_active=True)
        
        # Filter by parent
        parent_slug = self.request.query_params.get('parent')
        if parent_slug:
            if parent_slug == 'root':
                queryset = queryset.filter(parent=None)
            else:
                parent = get_object_or_404(Category, slug=parent_slug)
                queryset = queryset.filter(parent=parent)
        
        # Filter featured
        featured = self.request.query_params.get('featured')
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        return queryset.select_related('parent')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CategoryCreateSerializer
        return CategorySerializer
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get full category tree structure."""
        root_categories = Category.objects.filter(
            is_active=True,
            parent=None
        ).order_by('display_order', 'name')
        
        serializer = CategoryTreeSerializer(root_categories, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def menu(self, request):
        """Get categories for navigation menu."""
        categories = Category.get_menu_categories()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products in this category."""
        category = self.get_object()
        include_subcategories = request.query_params.get('include_subcategories', 'true').lower() == 'true'
        
        products = category.get_products(include_descendants=include_subcategories)
        
        # Import here to avoid circular import
        from apps.products.serializers import ProductListSerializer
        from core.pagination import StandardResultsPagination
        
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        
        return paginator.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def ancestors(self, request, slug=None):
        """Get ancestor categories (for breadcrumbs)."""
        category = self.get_object()
        ancestors = category.get_ancestors(include_self=True)
        serializer = CategorySerializer(ancestors, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def descendants(self, request, slug=None):
        """Get all descendant categories."""
        category = self.get_object()
        descendants = category.get_descendants()
        serializer = CategorySerializer(descendants, many=True)
        return Response(serializer.data)


class CategoryByPathView(generics.RetrieveAPIView):
    """
    Retrieve category by full path (e.g., /clothing/men/shirts).
    """
    serializer_class = CategoryDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        category_path = self.kwargs.get('category_path', '')
        slugs = category_path.strip('/').split('/')
        
        category = None
        for slug in slugs:
            if category is None:
                category = get_object_or_404(Category, slug=slug, parent=None, is_active=True)
            else:
                category = get_object_or_404(Category, slug=slug, parent=category, is_active=True)
        
        return category
