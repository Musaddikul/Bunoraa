"""
Category services - Business logic layer
"""
from django.db.models import Count, Q
from .models import Category


class CategoryService:
    """Service class for category operations."""
    
    @staticmethod
    def get_category_tree(parent_id=None, max_depth=None):
        """
        Get category tree structure.
        If parent_id is provided, returns subtree starting from that category.
        """
        queryset = Category.objects.filter(
            is_active=True,
            is_deleted=False,
            parent_id=parent_id
        ).order_by('order', 'name')
        
        def build_tree(categories, current_depth=0):
            result = []
            for category in categories:
                node = {
                    'id': str(category.id),
                    'name': category.name,
                    'slug': category.slug,
                    'level': category.level,
                    'image': category.image.url if category.image else None,
                    'icon': category.icon,
                    'product_count': category.product_count,
                    'children': []
                }
                
                if max_depth is None or current_depth < max_depth:
                    children = category.children.filter(
                        is_active=True,
                        is_deleted=False
                    ).order_by('order', 'name')
                    node['children'] = build_tree(children, current_depth + 1)
                
                result.append(node)
            return result
        
        return build_tree(queryset)
    
    @staticmethod
    def get_root_categories():
        """Get all root (top-level) categories."""
        return Category.objects.filter(
            parent__isnull=True,
            is_active=True,
            is_deleted=False
        ).order_by('order', 'name')
    
    @staticmethod
    def get_featured_categories(limit=6):
        """Get featured categories for homepage."""
        return Category.objects.filter(
            is_featured=True,
            is_active=True,
            is_deleted=False
        ).order_by('order', 'name')[:limit]
    
    @staticmethod
    def get_category_by_slug(slug):
        """Get category by slug with related data."""
        try:
            return Category.objects.get(
                slug=slug,
                is_active=True,
                is_deleted=False
            )
        except Category.DoesNotExist:
            return None
    
    @staticmethod
    def get_category_products(category, include_descendants=True):
        """
        Get products in a category.
        If include_descendants is True, also includes products from child categories.
        """
        from apps.products.models import Product
        
        if include_descendants:
            category_ids = category.get_descendant_ids(include_self=True)
            return Product.objects.filter(
                categories__id__in=category_ids,
                is_active=True,
                is_deleted=False
            ).distinct()
        else:
            return Product.objects.filter(
                categories=category,
                is_active=True,
                is_deleted=False
            )
    
    @staticmethod
    def create_category(name, parent=None, **kwargs):
        """Create a new category."""
        category = Category.objects.create(
            name=name,
            parent=parent,
            **kwargs
        )
        return category
    
    @staticmethod
    def update_category(category, **data):
        """Update a category."""
        for field, value in data.items():
            if hasattr(category, field):
                setattr(category, field, value)
        category.save()
        return category
    
    @staticmethod
    def move_category(category, new_parent):
        """Move a category to a new parent."""
        category.parent = new_parent
        category.save()
        return category
    
    @staticmethod
    def reorder_categories(category_orders):
        """
        Reorder categories.
        category_orders: list of {'id': uuid, 'order': int}
        """
        for item in category_orders:
            Category.objects.filter(pk=item['id']).update(order=item['order'])
    
    @staticmethod
    def search_categories(query, limit=10):
        """Search categories by name."""
        return Category.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            is_active=True,
            is_deleted=False
        ).order_by('order', 'name')[:limit]
    
    @staticmethod
    def get_popular_categories(limit=8):
        """Get categories with most products."""
        return Category.objects.filter(
            is_active=True,
            is_deleted=False
        ).annotate(
            num_products=Count('products', filter=Q(products__is_active=True, products__is_deleted=False))
        ).order_by('-num_products')[:limit]
