"""
Product views - Frontend pages
"""
import uuid
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView
from django.core.paginator import Paginator
from .models import Product
from .services import ProductService


class ProductListView(ListView):
    """Product listing page."""
    model = Product
    template_name = 'products/list.html'
    context_object_name = 'products'
    paginate_by = 20
    
    # Map user-friendly sort options to actual database fields
    SORT_OPTIONS = {
        'popular': '-sold_count',
        'newest': '-created_at',
        'oldest': 'created_at',
        'price_low': 'price',
        'price_high': '-price',
        'name_asc': 'name',
        'name_desc': '-name',
        'rating': '-view_count',  # Use view_count as proxy for popularity/rating
        'bestselling': '-sold_count',
        'featured': '-is_featured',
    }
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, is_deleted=False)
        
        # Apply filters from query params
        category = self.request.GET.get('category')
        tag = self.request.GET.get('tag')
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        sort_param = self.request.GET.get('sort', 'newest')
        
        # Map sort parameter to valid field
        sort = self.SORT_OPTIONS.get(sort_param, '-created_at')
        
        # Also allow direct field names if they're valid
        valid_fields = ['name', '-name', 'price', '-price', 'created_at', '-created_at', 
                       'sold_count', '-sold_count', 'view_count', '-view_count']
        if sort_param in valid_fields:
            sort = sort_param
        
        if category:
            from apps.categories.models import Category
            try:
                cat = Category.objects.get(slug=category)
                category_ids = cat.get_descendant_ids(include_self=True)
                queryset = queryset.filter(categories__id__in=category_ids)
            except Category.DoesNotExist:
                pass
        
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset.distinct().order_by(sort)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'All Products'
        context['meta_description'] = 'Browse our collection of premium products at Bunoraa.'
        context['price_range'] = ProductService.get_price_range()
        return context


class ProductDetailView(DetailView):
    """Product detail page."""
    model = Product
    template_name = 'products/detail.html'
    context_object_name = 'product'
    slug_url_kwarg = 'slug'
    
    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_deleted=False)
    
    def get_object(self, queryset=None):
        queryset = queryset or self.get_queryset()
        lookup_value = self.kwargs.get(self.slug_url_kwarg)

        if not lookup_value:
            raise Http404('No product specified.')

        try:
            obj = queryset.get(slug=lookup_value)
        except Product.DoesNotExist:
            try:
                uuid.UUID(str(lookup_value))
            except (ValueError, AttributeError):
                raise Http404('No product found matching the query.')
            obj = get_object_or_404(queryset, pk=lookup_value)

        # Increment view count after we have the object
        obj.increment_view_count()
        return obj
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.object
        
        context['page_title'] = product.meta_title or product.name
        context['meta_description'] = product.meta_description or product.short_description
        context['images'] = product.images.all()
        context['variants'] = product.variants.filter(is_active=True)
        context['related_products'] = ProductService.get_related_products(product)
        context['breadcrumbs'] = self._get_breadcrumbs(product)

        # Explicitly provide currency code/symbol for templates (prefer product-level currency)
        try:
            # Prefer product's currency if set
            prod_currency = product.get_currency() if hasattr(product, 'get_currency') else None
            if prod_currency and getattr(prod_currency, 'code', None):
                context['currency_code'] = prod_currency.code
                context['currency_symbol'] = prod_currency.symbol
            else:
                # Fall back to user/request currency or default
                from apps.currencies.services import CurrencyService
                user_currency = CurrencyService.get_user_currency(user=self.request.user if self.request.user.is_authenticated else None, request=self.request)
                context['currency_code'] = user_currency.code if user_currency else context.get('currency_code', 'BDT')
                context['currency_symbol'] = user_currency.symbol if user_currency else context.get('currency_symbol', '৳')
        except Exception:
            # Keep existing context values or sensible defaults
            context['currency_code'] = context.get('currency_code', 'BDT')
            context['currency_symbol'] = context.get('currency_symbol', '৳')

        return context
    
    def _get_breadcrumbs(self, product):
        """Build breadcrumbs from first category."""
        breadcrumbs = [{'name': 'Home', 'url': '/'}]
        category = product.categories.first()
        if category:
            for ancestor in category.get_breadcrumbs():
                breadcrumbs.append({
                    'name': ancestor['name'],
                    'url': f"/categories/{ancestor['slug']}/"
                })
        breadcrumbs.append({'name': product.name, 'url': None})
        return breadcrumbs


class ProductSearchView(TemplateView):
    """Product search page."""
    template_name = 'search/results.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        query = self.request.GET.get('q', '')
        
        if query:
            products = ProductService.search_products(query, limit=50)
            paginator = Paginator(products, 20)
            page_number = self.request.GET.get('page', 1)
            page_obj = paginator.get_page(page_number)
            context['products'] = page_obj
            context['page_obj'] = page_obj
        else:
            context['products'] = []
        
        context['query'] = query
        context['page_title'] = f'Search: {query}' if query else 'Search Products'
        return context
