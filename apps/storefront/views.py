# apps/storefront/views.py
"""
Storefront Views
Customer-facing views for browsing products and shops.
"""
from django.views.generic import TemplateView, ListView, DetailView
from django.shortcuts import get_object_or_404, redirect
from django.db.models import Q, Count, Avg, Prefetch
# cache available when needed
# JsonResponse available when needed
from django.utils import timezone

from apps.products.models import Product, Brand
from apps.categories.models import Category
from apps.vendors.models import Vendor, VendorPage
from apps.reviews.models import Review


class HomeView(TemplateView):
    """
    Homepage with featured products, categories, and vendors.
    """
    template_name = 'storefront/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Featured categories
        context['featured_categories'] = Category.objects.filter(
            is_active=True,
            is_featured=True,
            parent=None
        ).prefetch_related('children')[:8]
        
        # Featured products
        context['featured_products'] = Product.objects.filter(
            is_active=True,
            featured_weight__gte=1
        ).select_related('category', 'brand', 'vendor').prefetch_related(
            'images'
        ).order_by('-featured_weight')[:12]
        
        # New arrivals
        context['new_arrivals'] = Product.objects.filter(
            is_active=True,
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).select_related('category', 'brand', 'vendor').prefetch_related(
            'images'
        ).order_by('-created_at')[:8]
        
        # Best sellers
        context['bestsellers'] = Product.objects.filter(
            is_active=True
        ).select_related('category', 'brand', 'vendor').prefetch_related(
            'images'
        ).order_by('-sales_count')[:8]
        
        # Deals/Discounted products
        context['deals'] = Product.objects.filter(
            is_active=True,
            compare_at_price__isnull=False
        ).select_related('category', 'brand', 'vendor').prefetch_related(
            'images'
        ).order_by('-discount_percentage')[:8]
        
        # Featured vendors
        context['featured_vendors'] = Vendor.objects.filter(
            status='active',
            is_featured=True
        )[:6]
        
        # Featured brands
        context['featured_brands'] = Brand.objects.filter(
            is_active=True,
            is_featured=True
        )[:8]
        
        return context


class CategoryListView(ListView):
    """
    All categories view - directory style.
    """
    model = Category
    template_name = 'storefront/category_list.html'
    context_object_name = 'categories'
    
    def get_queryset(self):
        return Category.objects.filter(
            is_active=True,
            parent=None
        ).prefetch_related(
            Prefetch(
                'children',
                queryset=Category.objects.filter(is_active=True)
            )
        ).order_by('display_order', 'name')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'All Categories'
        return context


class CategoryDetailView(ListView):
    """
    Category detail with products from all descendants.
    """
    model = Product
    template_name = 'storefront/category_detail.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_category(self):
        """Get category from path (e.g., 'clothing/men/shirts')."""
        path = self.kwargs.get('category_path', '')
        slugs = path.strip('/').split('/')
        
        category = None
        for slug in slugs:
            if category is None:
                category = get_object_or_404(Category, slug=slug, parent=None, is_active=True)
            else:
                category = get_object_or_404(Category, slug=slug, parent=category, is_active=True)
        
        return category
    
    def get_queryset(self):
        self.category = self.get_category()
        category_ids = self.category.get_all_children_ids()
        
        queryset = Product.objects.filter(
            is_active=True,
            category_id__in=category_ids
        ).select_related(
            'category', 'brand', 'vendor'
        ).prefetch_related('images')
        
        # Filtering
        filters = {}
        
        # Price range
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Brand filter
        brand_slugs = self.request.GET.getlist('brand')
        if brand_slugs:
            queryset = queryset.filter(brand__slug__in=brand_slugs)
        
        # Vendor filter
        vendor_slugs = self.request.GET.getlist('vendor')
        if vendor_slugs:
            queryset = queryset.filter(vendor__slug__in=vendor_slugs)
        
        # In stock only
        if self.request.GET.get('in_stock'):
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # On sale
        if self.request.GET.get('on_sale'):
            queryset = queryset.filter(compare_at_price__isnull=False)
        
        # Sorting
        sort = self.request.GET.get('sort', '-created_at')
        valid_sorts = {
            'newest': '-created_at',
            'oldest': 'created_at',
            'price_low': 'price',
            'price_high': '-price',
            'name_asc': 'name',
            'name_desc': '-name',
            'popular': '-sales_count',
            'rating': '-average_rating',
        }
        sort_field = valid_sorts.get(sort, '-created_at')
        queryset = queryset.order_by(sort_field)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category
        context['breadcrumbs'] = self.category.breadcrumbs
        context['subcategories'] = self.category.get_children().filter(is_active=True)
        
        # Get filter options
        category_ids = self.category.get_all_children_ids()
        products_in_category = Product.objects.filter(
            is_active=True,
            category_id__in=category_ids
        )
        
        context['available_brands'] = Brand.objects.filter(
            products__in=products_in_category
        ).distinct().order_by('name')
        
        context['available_vendors'] = Vendor.objects.filter(
            products__in=products_in_category,
            status='active'
        ).distinct().order_by('store_name')
        
        # Price range
        from django.db.models import Min, Max
        price_range = products_in_category.aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        context['price_range'] = price_range
        
        # Current filters
        context['current_filters'] = {
            'brands': self.request.GET.getlist('brand'),
            'vendors': self.request.GET.getlist('vendor'),
            'min_price': self.request.GET.get('min_price'),
            'max_price': self.request.GET.get('max_price'),
            'in_stock': self.request.GET.get('in_stock'),
            'on_sale': self.request.GET.get('on_sale'),
            'sort': self.request.GET.get('sort', 'newest'),
        }
        
        return context


class ProductListView(ListView):
    """
    All products listing with filters.
    """
    model = Product
    template_name = 'storefront/product_list.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        queryset = Product.objects.filter(
            is_active=True
        ).select_related(
            'category', 'brand', 'vendor'
        ).prefetch_related('images')
        
        # Search
        q = self.request.GET.get('q')
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(sku__icontains=q)
            )
        
        # Category filter
        category_slug = self.request.GET.get('category')
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug, is_active=True)
                category_ids = category.get_all_children_ids()
                queryset = queryset.filter(category_id__in=category_ids)
            except Category.DoesNotExist:
                pass
        
        # Price range
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Brand filter
        brand_slugs = self.request.GET.getlist('brand')
        if brand_slugs:
            queryset = queryset.filter(brand__slug__in=brand_slugs)
        
        # Sorting
        sort = self.request.GET.get('sort', '-created_at')
        valid_sorts = {
            'newest': '-created_at',
            'price_low': 'price',
            'price_high': '-price',
            'popular': '-sales_count',
            'rating': '-average_rating',
        }
        sort_field = valid_sorts.get(sort, '-created_at')
        queryset = queryset.order_by(sort_field)
        
        return queryset


class ProductDetailView(DetailView):
    """
    Product detail page.
    """
    model = Product
    template_name = 'storefront/product_detail.html'
    context_object_name = 'product'
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True
        ).select_related(
            'category', 'brand', 'vendor'
        ).prefetch_related(
            'images',
            'variants',
            'variants__attribute_values',
            Prefetch(
                'reviews',
                queryset=Review.objects.filter(is_approved=True).select_related('user')[:10]
            )
        )
    
    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        # Increment view count
        Product.objects.filter(pk=obj.pk).update(view_count=obj.view_count + 1)
        return obj
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.object
        
        # Breadcrumbs
        context['breadcrumbs'] = product.category.breadcrumbs + [
            {'name': product.name, 'url': product.get_absolute_url()}
        ]
        
        # Related products
        context['related_products'] = Product.objects.filter(
            is_active=True,
            category=product.category
        ).exclude(pk=product.pk).select_related(
            'brand', 'vendor'
        ).prefetch_related('images')[:8]
        
        # Same vendor products
        context['vendor_products'] = Product.objects.filter(
            is_active=True,
            vendor=product.vendor
        ).exclude(pk=product.pk).select_related(
            'brand', 'category'
        ).prefetch_related('images')[:4]
        
        # Review statistics
        reviews = product.reviews.filter(is_approved=True)
        context['review_count'] = reviews.count()
        context['average_rating'] = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        context['rating_distribution'] = self._get_rating_distribution(reviews)
        
        return context
    
    def _get_rating_distribution(self, reviews):
        """Get percentage distribution of ratings."""
        total = reviews.count()
        if total == 0:
            return {i: 0 for i in range(1, 6)}
        
        distribution = {}
        for rating in range(1, 6):
            count = reviews.filter(rating=rating).count()
            distribution[rating] = round((count / total) * 100, 1)
        return distribution


class ProductQuickView(DetailView):
    """
    Quick view modal content (AJAX).
    """
    model = Product
    template_name = 'storefront/partials/product_quick_view.html'
    context_object_name = 'product'
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True
        ).select_related('category', 'brand', 'vendor').prefetch_related('images', 'variants')
    
    def render_to_response(self, context, **response_kwargs):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return super().render_to_response(context, **response_kwargs)
        return redirect(self.object.get_absolute_url())


class SearchView(ListView):
    """
    Search results page.
    """
    model = Product
    template_name = 'storefront/search.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        query = self.request.GET.get('q', '').strip()
        if not query:
            return Product.objects.none()
        
        return Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(sku__icontains=query) |
            Q(brand__name__icontains=query),
            is_active=True
        ).select_related(
            'category', 'brand', 'vendor'
        ).prefetch_related('images').distinct()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['query'] = self.request.GET.get('q', '')
        context['result_count'] = self.get_queryset().count()
        return context


class BrandListView(ListView):
    """
    All brands listing.
    """
    model = Brand
    template_name = 'storefront/brand_list.html'
    context_object_name = 'brands'
    
    def get_queryset(self):
        return Brand.objects.filter(is_active=True).annotate(
            product_count=Count('products', filter=Q(products__is_active=True))
        ).order_by('name')


class BrandDetailView(ListView):
    """
    Brand detail with products.
    """
    model = Product
    template_name = 'storefront/brand_detail.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_brand(self):
        return get_object_or_404(Brand, slug=self.kwargs['slug'], is_active=True)
    
    def get_queryset(self):
        self.brand = self.get_brand()
        return Product.objects.filter(
            brand=self.brand,
            is_active=True
        ).select_related('category', 'vendor').prefetch_related('images')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['brand'] = self.brand
        return context


class VendorStorefrontView(TemplateView):
    """
    Vendor shop homepage.
    """
    template_name = 'storefront/vendor/storefront.html'
    
    def get_vendor(self):
        return get_object_or_404(
            Vendor.objects.select_related('user'),
            slug=self.kwargs['vendor_slug'],
            status='active'
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        vendor = self.get_vendor()
        context['vendor'] = vendor
        
        # Featured products
        context['featured_products'] = Product.objects.filter(
            vendor=vendor,
            is_active=True,
            featured_weight__gte=1
        ).prefetch_related('images')[:8]
        
        # New arrivals
        context['new_products'] = Product.objects.filter(
            vendor=vendor,
            is_active=True
        ).order_by('-created_at').prefetch_related('images')[:8]
        
        # Categories with products
        context['categories'] = Category.objects.filter(
            products__vendor=vendor,
            products__is_active=True
        ).distinct()[:10]
        
        # Vendor pages
        context['pages'] = vendor.pages.filter(is_published=True).order_by('display_order')
        
        # Reviews
        from django.db.models import Avg
        context['review_stats'] = {
            'average': vendor.average_rating,
            'count': vendor.review_count
        }
        
        return context


class VendorProductsView(ListView):
    """
    All products from a vendor.
    """
    model = Product
    template_name = 'storefront/vendor/products.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_vendor(self):
        return get_object_or_404(
            Vendor,
            slug=self.kwargs['vendor_slug'],
            status='active'
        )
    
    def get_queryset(self):
        self.vendor = self.get_vendor()
        queryset = Product.objects.filter(
            vendor=self.vendor,
            is_active=True
        ).select_related('category', 'brand').prefetch_related('images')
        
        # Category filter
        category_slug = self.request.GET.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Sorting
        sort = self.request.GET.get('sort', '-created_at')
        valid_sorts = {
            'newest': '-created_at',
            'price_low': 'price',
            'price_high': '-price',
            'popular': '-sales_count',
        }
        queryset = queryset.order_by(valid_sorts.get(sort, '-created_at'))
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['vendor'] = self.vendor
        context['categories'] = Category.objects.filter(
            products__vendor=self.vendor,
            products__is_active=True
        ).distinct()
        return context


class VendorAboutView(DetailView):
    """
    Vendor about page.
    """
    model = Vendor
    template_name = 'storefront/vendor/about.html'
    context_object_name = 'vendor'
    slug_url_kwarg = 'vendor_slug'
    
    def get_queryset(self):
        return Vendor.objects.filter(status='active')


class VendorReviewsView(ListView):
    """
    Vendor reviews page.
    """
    model = Review
    template_name = 'storefront/vendor/reviews.html'
    context_object_name = 'reviews'
    paginate_by = 20
    
    def get_vendor(self):
        return get_object_or_404(Vendor, slug=self.kwargs['vendor_slug'], status='active')
    
    def get_queryset(self):
        self.vendor = self.get_vendor()
        return Review.objects.filter(
            product__vendor=self.vendor,
            is_approved=True
        ).select_related('user', 'product').order_by('-created_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['vendor'] = self.vendor
        return context


class VendorPageView(DetailView):
    """
    Custom vendor page.
    """
    model = VendorPage
    template_name = 'storefront/vendor/page.html'
    context_object_name = 'page'
    
    def get_object(self, queryset=None):
        vendor = get_object_or_404(Vendor, slug=self.kwargs['vendor_slug'], status='active')
        return get_object_or_404(VendorPage, vendor=vendor, slug=self.kwargs['page_slug'], is_published=True)


class NewArrivalsView(ListView):
    """
    New arrivals collection.
    """
    model = Product
    template_name = 'storefront/collection.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True,
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).select_related('category', 'brand', 'vendor').prefetch_related('images').order_by('-created_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['collection_title'] = 'New Arrivals'
        context['collection_description'] = 'Discover our latest products'
        return context


class BestsellersView(ListView):
    """
    Bestsellers collection.
    """
    model = Product
    template_name = 'storefront/collection.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True
        ).select_related('category', 'brand', 'vendor').prefetch_related('images').order_by('-sales_count')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['collection_title'] = 'Bestsellers'
        context['collection_description'] = 'Our most popular products'
        return context


class FeaturedView(ListView):
    """
    Featured products collection.
    """
    model = Product
    template_name = 'storefront/collection.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True,
            featured_weight__gte=1
        ).select_related('category', 'brand', 'vendor').prefetch_related('images').order_by('-featured_weight')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['collection_title'] = 'Featured Products'
        context['collection_description'] = 'Hand-picked products just for you'
        return context


class DealsView(ListView):
    """
    Deals/Discounted products.
    """
    model = Product
    template_name = 'storefront/collection.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        return Product.objects.filter(
            is_active=True,
            compare_at_price__isnull=False
        ).select_related('category', 'brand', 'vendor').prefetch_related('images').order_by('-discount_percentage')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['collection_title'] = 'Deals & Offers'
        context['collection_description'] = 'Amazing discounts on top products'
        return context
