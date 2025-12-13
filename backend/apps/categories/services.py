# apps/categories/services.py
"""
Business logic services for categories.
"""
from .models import Category


class CategoryService:
    """Service class for category operations."""
    
    @staticmethod
    def get_category_tree(root_id=None, max_depth=None):
        """
        Build category tree structure.
        
        Args:
            root_id: Start from this category (None for full tree)
            max_depth: Maximum depth to traverse
        
        Returns:
            List of category dictionaries with nested children
        """
        def build_tree(categories, parent_id=None, current_depth=0):
            tree = []
            for category in categories:
                if category.parent_id == parent_id:
                    node = {
                        'id': str(category.id),
                        'name': category.name,
                        'slug': category.slug,
                        'image': category.image.url if category.image else None,
                        'icon': category.icon,
                        'is_featured': category.is_featured,
                        'product_count': category.product_count,
                        'children': []
                    }
                    
                    if max_depth is None or current_depth < max_depth:
                        node['children'] = build_tree(
                            categories,
                            parent_id=category.id,
                            current_depth=current_depth + 1
                        )
                    
                    tree.append(node)
            
            return tree
        
        queryset = Category.objects.filter(
            is_active=True,
            is_deleted=False
        ).order_by('sort_order', 'name')
        
        if root_id:
            try:
                root = Category.objects.get(pk=root_id, is_deleted=False)
                descendant_ids = list(
                    root.get_descendants(include_self=True).values_list('id', flat=True)
                )
                queryset = queryset.filter(pk__in=descendant_ids)
                return build_tree(list(queryset), parent_id=root.parent_id)
            except Category.DoesNotExist:
                return []
        
        return build_tree(list(queryset))
    
    @staticmethod
    def get_category_path(category_id):
        """
        Get full path from root to category.
        
        Args:
            category_id: Category ID
        
        Returns:
            List of category dictionaries representing the path
        """
        try:
            category = Category.objects.get(pk=category_id, is_deleted=False)
            return category.get_breadcrumb()
        except Category.DoesNotExist:
            return []
    
    @staticmethod
    def move_category(category_id, new_parent_id=None):
        """
        Move a category to a new parent.
        
        Args:
            category_id: Category to move
            new_parent_id: New parent ID (None for root)
        
        Returns:
            Updated category instance
        
        Raises:
            ValueError: If move would create a cycle
        """
        try:
            category = Category.objects.get(pk=category_id, is_deleted=False)
        except Category.DoesNotExist:
            raise ValueError("Category not found")
        
        if new_parent_id:
            try:
                new_parent = Category.objects.get(pk=new_parent_id, is_deleted=False)
            except Category.DoesNotExist:
                raise ValueError("New parent category not found")
            
            # Check for cycle
            descendant_ids = list(
                category.get_descendants().values_list('id', flat=True)
            )
            if new_parent_id in descendant_ids or str(new_parent_id) == str(category_id):
                raise ValueError("Cannot move category to its own descendant")
            
            category.parent = new_parent
        else:
            category.parent = None
        
        category.save()
        return category
    
    @staticmethod
    def reorder_categories(category_orders):
        """
        Reorder categories within their parent.
        
        Args:
            category_orders: List of dicts with 'id' and 'sort_order'
        """
        for item in category_orders:
            Category.objects.filter(pk=item['id']).update(
                sort_order=item['sort_order']
            )
    
    @staticmethod
    def get_popular_categories(limit=10):
        """
        Get categories with most products.
        
        Args:
            limit: Maximum number of categories to return
        
        Returns:
            QuerySet of categories ordered by product count
        """
        from django.db.models import Count
        
        return Category.objects.filter(
            is_active=True,
            is_deleted=False
        ).annotate(
            product_count_annotated=Count('products')
        ).order_by('-product_count_annotated')[:limit]
