# apps/products/filters.py
"""
Filters for product queries.
"""
import django_filters
from django.db.models import Q
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """Filter for products."""
    
    # Price range
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    # Category - supports both exact and descendant matching
    category = django_filters.UUIDFilter(method='filter_category')
    
    # Brand
    brand = django_filters.UUIDFilter(field_name='brand_id')
    
    # Tags (comma-separated list of tag IDs or slugs)
    tags = django_filters.CharFilter(method='filter_tags')
    
    # Status filters
    is_featured = django_filters.BooleanFilter()
    is_on_sale = django_filters.BooleanFilter(method='filter_on_sale')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    
    # Attribute filtering (e.g., color=red, size=large)
    attributes = django_filters.CharFilter(method='filter_attributes')
    
    class Meta:
        model = Product
        fields = [
            'category', 'brand', 'tags',
            'min_price', 'max_price',
            'is_featured', 'is_on_sale', 'in_stock'
        ]
    
    def filter_category(self, queryset, name, value):
        """Filter by category including all descendants."""
        from apps.categories.models import Category
        
        try:
            category = Category.objects.get(pk=value, is_deleted=False)
            # Get all descendant category IDs
            category_ids = list(
                category.get_descendants(include_self=True).values_list('id', flat=True)
            )
            return queryset.filter(category_id__in=category_ids)
        except Category.DoesNotExist:
            return queryset.none()
    
    def filter_tags(self, queryset, name, value):
        """Filter by tags (comma-separated)."""
        tag_values = [v.strip() for v in value.split(',') if v.strip()]
        if not tag_values:
            return queryset
        
        # Try UUID first, then fall back to slug
        q = Q()
        for tag_value in tag_values:
            try:
                import uuid
                uuid.UUID(tag_value)
                q |= Q(tags__id=tag_value)
            except ValueError:
                q |= Q(tags__slug=tag_value)
        
        return queryset.filter(q).distinct()
    
    def filter_on_sale(self, queryset, name, value):
        """Filter products on sale."""
        from django.db.models import F
        
        if value:
            return queryset.filter(
                sale_price__isnull=False,
                sale_price__lt=F('price')
            )
        return queryset.filter(
            Q(sale_price__isnull=True) | Q(sale_price__gte=F('price'))
        )
    
    def filter_in_stock(self, queryset, name, value):
        """Filter products in stock."""
        if value:
            return queryset.filter(
                Q(track_inventory=False) |
                Q(stock__gt=0) |
                Q(allow_backorder=True)
            )
        return queryset.filter(
            track_inventory=True,
            stock=0,
            allow_backorder=False
        )
    
    def filter_attributes(self, queryset, name, value):
        """
        Filter by attributes.
        Format: attribute_type:value,attribute_type:value
        Example: color:red,size:large
        """
        if not value:
            return queryset
        
        from .models import AttributeValue
        
        for attr_filter in value.split(','):
            if ':' not in attr_filter:
                continue
            
            attr_type, attr_value = attr_filter.split(':', 1)
            attr_type = attr_type.strip()
            attr_value = attr_value.strip()
            
            if attr_type and attr_value:
                queryset = queryset.filter(
                    attributes__attribute_value__attribute_type__slug=attr_type,
                    attributes__attribute_value__value__iexact=attr_value
                )
        
        return queryset.distinct()
