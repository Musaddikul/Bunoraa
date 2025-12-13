# apps/products/filters.py
"""
Product Filters
Django Filter classes for product filtering.
"""
import django_filters
from django.db.models import Q
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """
    Filter for products.
    """
    # Price range
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    # Category (supports multiple)
    category = django_filters.CharFilter(method='filter_by_category')
    
    # Brand (supports multiple)
    brand = django_filters.CharFilter(method='filter_by_brand')
    
    # Vendor
    vendor = django_filters.CharFilter(field_name='vendor__slug')
    
    # Attributes
    color = django_filters.CharFilter(method='filter_by_attribute')
    size = django_filters.CharFilter(method='filter_by_attribute')
    
    # Flags
    is_new = django_filters.BooleanFilter()
    is_bestseller = django_filters.BooleanFilter()
    is_on_sale = django_filters.BooleanFilter()
    is_featured = django_filters.BooleanFilter(method='filter_featured')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    
    # Rating
    min_rating = django_filters.NumberFilter(method='filter_by_rating')
    
    class Meta:
        model = Product
        fields = ['category', 'brand', 'vendor', 'is_new', 'is_bestseller', 'is_on_sale']
    
    def filter_by_category(self, queryset, name, value):
        """Filter by category slug, including all descendants."""
        from apps.categories.models import Category
        
        slugs = value.split(',')
        category_ids = []
        
        for slug in slugs:
            try:
                category = Category.objects.get(slug=slug.strip())
                category_ids.extend(category.get_all_children_ids())
            except Category.DoesNotExist:
                continue
        
        if category_ids:
            return queryset.filter(category_id__in=category_ids)
        return queryset
    
    def filter_by_brand(self, queryset, name, value):
        """Filter by brand slug (supports multiple)."""
        slugs = [s.strip() for s in value.split(',')]
        return queryset.filter(brand__slug__in=slugs)
    
    def filter_by_attribute(self, queryset, name, value):
        """Filter by attribute values."""
        values = [v.strip() for v in value.split(',')]
        return queryset.filter(
            attributes__attribute__slug=name,
            attributes__slug__in=values
        ).distinct()
    
    def filter_featured(self, queryset, name, value):
        """Filter featured products."""
        if value:
            return queryset.filter(featured_weight__gt=0)
        return queryset
    
    def filter_in_stock(self, queryset, name, value):
        """Filter products in stock."""
        if value:
            return queryset.filter(
                Q(track_inventory=False) |
                Q(stock_quantity__gt=0) |
                Q(allow_backorder=True)
            )
        return queryset
    
    def filter_by_rating(self, queryset, name, value):
        """Filter by minimum average rating."""
        from django.db.models import Avg
        return queryset.annotate(
            avg_rating=Avg('reviews__rating')
        ).filter(avg_rating__gte=value)
