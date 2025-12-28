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
                    'depth': category.depth,
                    'path': category.path,
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

    @staticmethod
    def classify_text(text: str, top_k: int = 3):
        """Classify input text into category codes with confidences.

        Order of attempts:
        1) External classifier URL (settings.CATEGORY_CLASSIFIER_URL)
        2) Local torch model via apps.categories.classifier._try_use_torch_model
        3) Heuristic keyword matching against category slugs and names
        """
        # 1) external classifier url
        url = getattr(__import__('django.conf').conf.settings, 'CATEGORY_CLASSIFIER_URL', None)
        if url:
            try:
                import requests
                resp = requests.post(url, json={'text': text}, timeout=5)
                resp.raise_for_status()
                data = resp.json()
                return [(r.get('category_code'), float(r.get('confidence', 0))) for r in data[:top_k]]
            except Exception:
                pass

        # 2) try local torch model via classifier shim (best-effort import)
        try:
            import importlib
            classifier = importlib.import_module('apps.categories.classifier')
            results = classifier._try_use_torch_model(text, top_k)
            if results is not None:
                return results[:top_k]
        except Exception:
            # ignore and fall back
            pass

        # 3) local heuristic
        tokens = []
        import re
        WORD_RE = re.compile(r"[\w']+")
        tokens = [w.lower() for w in WORD_RE.findall(text or '')]
        if not tokens:
            return []

        candidates = []
        for cat in Category.objects.filter(is_active=True, is_deleted=False):
            kws = set((cat.slug or '').split('-') + [w.lower() for w in WORD_RE.findall(cat.name or '')])
            score = sum(1 for t in tokens if t in kws)
            if score > 0:
                candidates.append((cat.code or str(cat.id), score))

        if not candidates:
            return []

        counted = Counter()
        for code, score in candidates:
            counted[code] += score
        total = sum(counted.values()) or 1
        ranked = [(code, counted[code] / total) for code in counted]
        ranked.sort(key=lambda x: x[1], reverse=True)
        return ranked[:top_k]
