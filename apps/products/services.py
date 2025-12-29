"""
Product services - Business logic layer
"""
from django.db import models
from django.db.models import Q, Avg, Count
from django.core.paginator import Paginator
from .models import Product, ProductImage, ProductVariant, Tag, Attribute, AttributeValue


class ProductService:
    """Service class for product operations."""
    
    @staticmethod
    def get_product_list(
        categories=None,
        tags=None,
        min_price=None,
        max_price=None,
        in_stock=None,
        is_featured=None,
        is_on_sale=None,
        search=None,
        sort='-created_at',
        page=1,
        page_size=20
    ):
        """Get filtered and paginated product list."""
        queryset = Product.objects.filter(is_active=True, is_deleted=False)
        
        # Category filter
        if categories:
            if isinstance(categories, (list, tuple)):
                queryset = queryset.filter(categories__id__in=categories)
            else:
                queryset = queryset.filter(categories__id=categories)
        
        # Tag filter
        if tags:
            if isinstance(tags, (list, tuple)):
                queryset = queryset.filter(tags__id__in=tags)
            else:
                queryset = queryset.filter(tags__id=tags)
        
        # Price filters
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Stock filter
        if in_stock is not None:
            if in_stock:
                queryset = queryset.filter(
                    Q(track_inventory=False) |
                    Q(stock_quantity__gt=0) |
                    Q(allow_backorder=True)
                )
            else:
                queryset = queryset.filter(
                    track_inventory=True,
                    stock_quantity=0,
                    allow_backorder=False
                )
        
        # Featured filter
        if is_featured is not None:
            queryset = queryset.filter(is_featured=is_featured)
        
        # Sale filter
        if is_on_sale is not None:
            if is_on_sale:
                queryset = queryset.filter(
                    sale_price__isnull=False,
                    sale_price__lt=models.F('price')
                )
        
        # Search
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(sku__icontains=search)
            )
        
        # Distinct (important for M2M filters)
        queryset = queryset.distinct()
        
        # Sorting
        valid_sorts = ['price', '-price', 'name', '-name', 'created_at', '-created_at', 'sold_count', '-sold_count']
        if sort in valid_sorts:
            queryset = queryset.order_by(sort)
        else:
            queryset = queryset.order_by('-created_at')
        
        # Pagination
        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)
        
        return {
            'products': list(page_obj),
            'total': paginator.count,
            'page': page_obj.number,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        }
    
    @staticmethod
    def get_product_by_slug(slug):
        """Get product by slug with related data."""
        try:
            return Product.objects.select_related().prefetch_related(
                'images', 'categories', 'tags', 'variants', 'attributes'
            ).get(slug=slug, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return None
    
    @staticmethod
    def get_product_by_id(product_id):
        """Get product by ID."""
        try:
            return Product.objects.get(pk=product_id, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return None
    
    @staticmethod
    def get_featured_products(limit=8):
        """Get featured products for homepage."""
        return Product.objects.filter(
            is_active=True,
            is_deleted=False,
            is_featured=True
        ).order_by('-created_at')[:limit]
    
    @staticmethod
    def get_new_arrivals(limit=8):
        """Get new arrival products."""
        return Product.objects.filter(
            is_active=True,
            is_deleted=False,
            is_new=True
        ).order_by('-created_at')[:limit]
    
    @staticmethod
    def get_bestsellers(limit=8):
        """Get bestselling products."""
        return Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).order_by('-sold_count')[:limit]
    
    @staticmethod
    def get_on_sale_products(limit=8):
        """Get products on sale."""
        from django.db.models import F
        return Product.objects.filter(
            is_active=True,
            is_deleted=False,
            sale_price__isnull=False,
            sale_price__lt=F('price')
        ).order_by('-created_at')[:limit]
    
    @staticmethod
    def get_related_products(product, limit=4):
        """Get related products."""
        # First try explicit related products
        related = product.related_products.filter(
            is_active=True,
            is_deleted=False
        )[:limit]
        
        if related.count() < limit:
            # Fill with products from same categories
            category_ids = product.categories.values_list('id', flat=True)
            additional = Product.objects.filter(
                categories__id__in=category_ids,
                is_active=True,
                is_deleted=False
            ).exclude(
                pk=product.pk
            ).exclude(
                pk__in=related.values_list('pk', flat=True)
            ).distinct()[:limit - related.count()]
            
            return list(related) + list(additional)
        
        return list(related)
    
    @staticmethod
    def search_products(query, limit=20):
        """Full-text search for products."""
        return Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(sku__icontains=query) |
            Q(tags__name__icontains=query),
            is_active=True,
            is_deleted=False
        ).distinct().order_by('-sold_count', '-created_at')[:limit]
    
    @staticmethod
    def create_product(**data):
        """Create a new product."""
        categories = data.pop('categories', [])
        tags = data.pop('tags', [])
        images = data.pop('images', [])
        
        product = Product.objects.create(**data)
        
        if categories:
            product.categories.set(categories)
        if tags:
            product.tags.set(tags)
        
        # Create images
        for i, image_data in enumerate(images):
            ProductImage.objects.create(
                product=product,
                is_primary=(i == 0),
                order=i,
                **image_data
            )
        
        return product
    
    @staticmethod
    def update_product(product, **data):
        """Update a product."""
        categories = data.pop('categories', None)
        tags = data.pop('tags', None)
        
        for field, value in data.items():
            if hasattr(product, field):
                setattr(product, field, value)
        product.save()
        
        if categories is not None:
            product.categories.set(categories)
        if tags is not None:
            product.tags.set(tags)
        
        return product
    
    @staticmethod
    def bulk_update_stock(updates):
        """
        Bulk update product stock.
        updates: list of {'product_id': uuid, 'quantity': int, 'operation': 'set'|'add'|'subtract'}
        """
        for update in updates:
            try:
                product = Product.objects.get(pk=update['product_id'])
                operation = update.get('operation', 'set')
                
                if operation == 'set':
                    product.stock_quantity = update['quantity']
                elif operation == 'add':
                    product.stock_quantity += update['quantity']
                elif operation == 'subtract':
                    product.stock_quantity = max(0, product.stock_quantity - update['quantity'])
                
                product.save(update_fields=['stock_quantity', 'updated_at'])
            except Product.DoesNotExist:
                pass
    
    @staticmethod
    def get_price_range():
        """Get min and max prices for filtering."""
        from django.db.models import Min, Max
        result = Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        return result

    @staticmethod
    def generate_product_suggestions(payload: dict, top_k: int = 3):
        """Proxy to module-level suggestion generator for easier mocking."""
        return generate_product_suggestions(payload, top_k=top_k)


class TagService:
    """Service class for tag operations."""
    
    @staticmethod
    def get_all_tags():
        """Get all tags."""
        return Tag.objects.all().order_by('name')
    
    @staticmethod
    def get_popular_tags(limit=10):
        """Get most used tags."""
        return Tag.objects.annotate(
            product_count=Count('products', filter=Q(products__is_active=True, products__is_deleted=False))
        ).order_by('-product_count')[:limit]
    
    @staticmethod
    def create_tag(name):
        """Create a tag."""
        return Tag.objects.create(name=name)


class AttributeService:
    """Service class for attribute operations."""
    
    @staticmethod
    def get_all_attributes():
        """Get all attributes with their values."""
        return Attribute.objects.prefetch_related('values').all()
    
    @staticmethod
    def get_attribute_values_for_category(category):
        """Get all attribute values used in products of a category."""
        category_ids = category.get_descendant_ids(include_self=True)
        return AttributeValue.objects.filter(
            products__categories__id__in=category_ids,
            products__is_active=True,
            products__is_deleted=False
        ).distinct().select_related('attribute')


# ----------------------------
# Product suggestion helpers
# ----------------------------

import os
import re
from typing import Dict, Any, List, Tuple

# Optional OpenAI client guard
try:
    import openai
except Exception:
    openai = None


def _simple_heuristic_from_image_filename(filename: str) -> Dict[str, Any]:
    """Generate a naive suggestion from an image filename.
    - strips extension, replaces separators with spaces, capitalizes.
    - extracts simple tags (words > 3 letters)
    """
    name = re.sub(r"[_\-]+", ' ', os.path.splitext(os.path.basename(filename))[0]).strip()
    if not name:
        name = 'Product'
    # Title case the name
    title = ' '.join([w.capitalize() for w in name.split()])
    words = [w.lower() for w in re.split(r"\W+", name) if len(w) > 3]
    tags = list({w for w in words})[:5]
    short_desc = f'{title} — handcrafted, thoughtfully made.'
    return {'name': title, 'short_description': short_desc, 'tags': tags}


def _build_prompt_from_payload(payload: Dict[str, Any]) -> str:
    """Create a concise prompt for AI model from given payload."""
    lines = []
    if payload.get('name'):
        lines.append(f"Name: {payload.get('name')}")
    if payload.get('description'):
        lines.append(f"Description: {payload.get('description')}")
    if payload.get('price'):
        lines.append(f"Price: {payload.get('price')}")
    imgs = payload.get('image_filenames') or []
    if imgs:
        lines.append(f"Image filenames: {', '.join(imgs[:3])}")

    lines.append("\nGenerate a JSON object with keys: name, short_description, tags (array of short tags), and optional category_suggestions (array of {code, confidence}). Keep descriptions short and SEO-friendly.")
    return '\n'.join(lines)


def _normalize_ai_parsed(parsed: Dict[str, Any]) -> Dict[str, Any]:
    out = {}
    out['name'] = parsed.get('name') or parsed.get('title') or 'Product'
    out['short_description'] = parsed.get('short_description') or parsed.get('description') or ''
    tags = parsed.get('tags') or parsed.get('keywords') or []
    out['tags'] = list(tags) if isinstance(tags, (list, tuple)) else [str(tags)]
    if 'category_suggestions' in parsed:
        out['category_suggestions'] = parsed['category_suggestions']
    return out


def generate_product_suggestions(payload: Dict[str, Any], top_k: int = 3) -> List[Dict[str, Any]]:
    """Generate suggestions for a product. payload may include: name, description, image_filenames (list), price, etc.

    Returns a list of suggestion dicts with keys: name, short_description, tags, category_suggestions (list of codes/names with confidence)
    """
    name = (payload.get('name') or '').strip()
    description = (payload.get('description') or '').strip()
    images = payload.get('image_filenames') or []

    suggestions: List[Dict[str, Any]] = []

    # If OpenAI enabled, call it to get structured suggestions
    if openai and os.environ.get('OPENAI_API_KEY'):
        try:
            prompt = _build_prompt_from_payload(payload)
            resp = openai.ChatCompletion.create(
                model=os.environ.get('OPENAI_MODEL', 'gpt-4o-mini'),
                messages=[{'role': 'system', 'content': 'You are a helpful product metadata assistant.'},
                          {'role': 'user', 'content': prompt}],
                max_tokens=350,
                n=1,
            )
            text = resp.choices[0].message.content
            # Expect JSON-like response; try to parse
            import json
            parsed = None
            try:
                parsed = json.loads(text)
            except Exception:
                # Attempt to extract JSON substring
                m = re.search(r"\{.*\}", text, re.DOTALL)
                if m:
                    try:
                        parsed = json.loads(m.group(0))
                    except Exception:
                        parsed = None
            if parsed and isinstance(parsed, dict):
                suggestions.append(_normalize_ai_parsed(parsed))
                return suggestions
        except Exception:
            # Fall back to heuristics
            pass

    # Heuristic path: derive from name/description and images
    if not name and images:
        # Use first image filename for heuristic
        suggestions.append(_simple_heuristic_from_image_filename(images[0]))
    else:
        base = {
            'name': name or (images and _simple_heuristic_from_image_filename(images[0])['name']) or 'Product',
            'short_description': description or 'Handcrafted product.',
            'tags': []
        }
        # derive tags from description
        words = re.findall(r"\w{4,}", f"{name} {description}")
        tags = sorted(set([w.lower() for w in words if not w.isdigit()]))[:6]
        base['tags'] = tags
        suggestions.append(base)

    # Add lightweight category suggestions by keyword matching against category slugs (if categories app available)
    try:
        from apps.categories.ml import Category
        cat_suggestions: List[Tuple[str, float]] = []
        text = f"{name} {description}".lower()
        cats = Category.objects.filter(is_active=True, is_deleted=False).all()[:200]
        for c in cats:
            score = sum(1 for kw in (c.slug or '').split('-') if kw and kw in text)
            if score > 0:
                cat_suggestions.append((c.code or c.slug, float(min(1.0, score / 3))))
        # attach top_k
        if cat_suggestions:
            cat_suggestions = sorted(cat_suggestions, key=lambda x: x[1], reverse=True)[:top_k]
            suggestions[0]['category_suggestions'] = [{'code': code, 'confidence': conf} for code, conf in cat_suggestions]
    except Exception:
        # categories not available or DB error -- skip
        pass

    return suggestions
