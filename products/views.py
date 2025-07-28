# products/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.db.models import Q, Count, Avg, Min, Max, F, Value, Case, When, Sum, BooleanField, Exists, OuterRef
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.urls import reverse
from django.core.cache import cache
from django.utils.html import strip_tags
from django.db import transaction
from decimal import Decimal
from core.models import HomeSlide
from .models import Product, Category, Color, Fabric, Size, Fit
from .forms import ProductFilterForm
from cart.forms import CartAddProductForm
from .utils import generate_structured_data
from wishlist.models import Wishlist
from reviews.selectors import get_approved_reviews, get_product_review_stats
from reviews.forms import ReviewForm
from reviews.models import Review
from core.utils.seo import generate_structured_data


class HomeView(TemplateView):
    template_name = 'products/home.html'
    
    # @method_decorator(cache_page(60 * 60 * 2))  # Cache for 2 hours
    # def dispatch(self, *args, **kwargs):
    #     return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        def get_cached_queryset(key, queryset, timeout):
            return cache.get_or_set(
                f'home_{key}_cache',
                lambda: list(queryset),
                timeout
            )
        
        context.update({
            'slides': get_cached_queryset(
                'home_slides',
                HomeSlide.objects.filter(active=True).order_by('order'),
                60 * 60 * 12  # cache for 12 hours
            ),
                    'featured_categories': get_cached_queryset(
                'featured_categories',
                Category.objects.filter(featured=True)
                    .select_related('parent')[:8],
                60 * 60 * 24  # 24 hours
            ),
            'trending_products': get_cached_queryset(
                'trending_products',
                Product.objects.filter(trending=True, available=True, category__active=True)
                    .select_related('category')
                    .prefetch_related('images')
                    .annotate(
                        is_wished=Exists(
                            Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                        ) if self.request.user.is_authenticated else Value(False, output_field=BooleanField())
                    )[:12],
                60 #* 60 * 12  # 12 hours
            ),
            'new_arrivals': get_cached_queryset(
                'new_arrivals',
                Product.objects.filter(new_collection=True, available=True, category__active=True)
                    .order_by('-created_at')
                    .annotate(
                        is_wished=Exists(
                            Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                        ) if self.request.user.is_authenticated else Value(False, output_field=BooleanField())
                    )[:8],
                60 #* 60 * 6  # 6 hours
            ),
            'festive_collection': get_cached_queryset(
                'festive_collection',
                Product.objects.filter(
                    Q(category__name__icontains='festive') | 
                    Q(category__parent__name__icontains='festive'),
                    available=True, category__active=True
                )
                .annotate(
                    is_wished=Exists(
                        Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                    ) if self.request.user.is_authenticated else Value(False, output_field=BooleanField())
                )[:8],
                60 #* 60 * 24  # 24 hours
            )
        })
        
        return context


class ProductListView(ListView):
    model = Product
    template_name = 'products/product_list.html'
    context_object_name = 'products'
    paginate_by = 24

    def get_queryset(self):
        qs = Product.objects.filter(available=True, category__active=True)\
            .select_related('category')\
            .prefetch_related('images', 'reviews', 'colors', 'sizes', 'fabric', 'fit')

        if self.request.user.is_authenticated:
            qs = qs.annotate(
                is_wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))

        qs = self.apply_category_filters(qs)
        qs = self.apply_attribute_filters(qs)
        qs = self.apply_price_filters(qs)
        qs = self.apply_sorting(qs)

        return qs

    def apply_category_filters(self, qs):
        selected_slugs = self.request.GET.getlist('category')
        if selected_slugs:
            selected_categories = Category.objects.filter(slug__in=selected_slugs)
            all_ids = set()
            for cat in selected_categories:
                all_ids |= set(cat.get_descendants(include_self=True).values_list('id', flat=True))
            return qs.filter(category__id__in=all_ids)

        category_slug = self.kwargs.get('category_slug')
        subcategory_slug = self.kwargs.get('subcategory_slug')

        if category_slug:
            RESERVED = ['admin', 'accounts', 'orders', 'cart', 'custom-order', 'contacts', 'sitemap.xml', 'robots.txt', 'ckeditor5']
            if category_slug in RESERVED:
                from django.http import Http404
                raise Http404("Reserved path")

            if subcategory_slug:
                category = get_object_or_404(Category, slug=subcategory_slug, parent__slug=category_slug)
            else:
                category = get_object_or_404(Category, slug=category_slug)

            return qs.filter(category__in=category.get_descendants(include_self=True))

        return qs

    def apply_attribute_filters(self, qs):
        filter_map = {
            'color': 'colors__id__in',
            'fabric': 'fabric__id__in',
            'size': 'sizes__id__in',
            'fit': 'fit__id__in'
        }
        for key, lookup in filter_map.items():
            values = self.request.GET.getlist(key)
            if values:
                qs = qs.filter(**{lookup: values})
        return qs.distinct()

    def apply_price_filters(self, qs):
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        if min_price and min_price.isdigit():
            qs = qs.filter(price__gte=int(min_price))
        if max_price and max_price.isdigit():
            qs = qs.filter(price__lte=int(max_price))
        return qs

    def apply_sorting(self, qs):
        sort_map = {
            'price_asc': 'price',
            'price_desc': '-price',
            'newest': '-created_at',
            'popular': '-review_count',
            'rating': '-avg_rating'
        }
        sort_by = self.request.GET.get('sort_by')
        if sort_by == 'popular':
            qs = qs.annotate(review_count=Count('reviews'))
        elif sort_by == 'rating':
            qs = qs.annotate(avg_rating=Avg('reviews__rating'))
        return qs.order_by(sort_map.get(sort_by, '-created_at'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        qs = self.get_queryset()
        price_range = qs.aggregate(min=Min('price'), max=Max('price'))
    
        # Get current category from URL
        category_slug = self.kwargs.get('subcategory_slug') or self.kwargs.get('category_slug')
        current_category = None
        if category_slug:
            try:
                current_category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                current_category = None
    
        # === Context-Aware Sidebar Logic ===
        if not current_category:
            top_level = Category.objects.filter(parent=None)
            sidebar_categories = []
            for cat in top_level:
                sidebar_categories.append(cat)
                children = list(cat.get_children())
                sidebar_categories.extend(children)
        elif current_category.parent is None:
            sidebar_categories = current_category.get_children()
        else:
            sidebar_categories = current_category.get_children()
    
        # === Filter Options ===
        filter_options = {
            'color': Color.objects.all(),
            'fabric': Fabric.objects.all(),
            'size': Size.objects.all(),
            'fit': Fit.objects.all(),
        }
    
        context.update({
            'min_price': price_range['min'] or 0,
            'max_price': price_range['max'] or 0,
            'categories_list': sidebar_categories,  # used in template
            'filter_options': filter_options,
            'current_filters': self.request.GET,
        })
    
        for p in context['products']:
            if p.discounted_price and p.price > 0:
                p.computed_discount = round((p.price - p.discounted_price) / p.price * 100)
            else:
                p.computed_discount = 0
    
        self.add_category_context(context)
    
        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'products_html': render_to_string('products/partials/_product_grid.html', context, request=self.request),
                'pagination_html': render_to_string('products/partials/_pagination.html', context, request=self.request),
                'total_count': context['page_obj'].paginator.count,
            })
    
        return context

    def add_category_context(self, context):
        category_slug = self.kwargs.get('category_slug')
        parent_slug = self.kwargs.get('parent_slug')

        if category_slug:
            category = get_object_or_404(Category, slug=category_slug)
            context['category'] = category
            if parent_slug:
                parent = get_object_or_404(Category, slug=parent_slug)
                context['parent_category'] = parent
                context['breadcrumbs'] = self.get_breadcrumbs(parent, category)
            else:
                context['breadcrumbs'] = self.get_breadcrumbs(category)

    def get_breadcrumbs(self, *categories):
        base = [
            {'name': 'Home', 'url': reverse('home')},
            {'name': 'Products', 'url': reverse('products:all_products')}
        ]
        return base + [{'name': c.name, 'url': c.get_absolute_url()} for c in categories]


class ProductDetailView(DetailView):
    model = Product
    template_name = 'products/product_detail.html'
    context_object_name = 'product'
    slug_url_kwarg = 'product_slug'

    def get_queryset(self):
        category_slug = self.kwargs.get('category_slug')
        subcategory_slug = self.kwargs.get('subcategory_slug')
        product_slug = self.kwargs.get('product_slug')

        return Product.objects.filter(
            slug=product_slug,
            category__slug=subcategory_slug,
            category__parent__slug=category_slug,
            available=True,
            category__active=True
        ).select_related('category', 'category__parent') \
         .prefetch_related('images', 'reviews__user') \
         .annotate(
            is_wished=Exists(
                Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
            ) if self.request.user.is_authenticated else Value(False, output_field=BooleanField())
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = context['product']

        # Atomically increment views
        Product.objects.filter(pk=product.pk).update(views=F('views') + 1)
        product.refresh_from_db(fields=['views'])

        # Review stats
        reviews = product.reviews.all()
        review_stats = get_product_review_stats(product)

        # Existing review for current user (edit mode)
        existing_review = None
        if self.request.user.is_authenticated:
            existing_review = reviews.filter(user=self.request.user).first()

        context.update({
            'structured_data': generate_structured_data(product, self.request),
            'form': ReviewForm(instance=existing_review),
            'existing_review': existing_review,
            'approved_reviews': get_approved_reviews(product),
            'cart_product_form': CartAddProductForm(),
            'similar_products': self.get_similar_products(product),
            'breadcrumbs': self.get_breadcrumbs(product),
            'average_rating': review_stats.get('average', 0),
            'rating_percentage': review_stats.get('percentage', {}),
            'rating_breakdown': review_stats.get('breakdown', {}),
            'total_reviews': review_stats.get('total', 0),
        })

        return context

    def get_similar_products(self, product):
        qs = Product.objects.filter(
            category=product.category,
            available=True,
            category__active=True
        ).exclude(id=product.id).select_related('category')[:4]

        if self.request.user.is_authenticated:
            qs = qs.annotate(
                wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(wished=Value(False, output_field=BooleanField()))
        return qs

    def get_breadcrumbs(self, product):
        return list(filter(None, [
            {'name': 'Home', 'url': reverse('home')},
            {'name': 'Products', 'url': reverse('products:all_products')},
            {'name': product.category.parent.name, 'url': product.category.parent.get_absolute_url()} if product.category.parent else None,
            {'name': product.category.name, 'url': product.category.get_absolute_url()},
            {'name': product.name, 'url': product.get_absolute_url()},
        ]))

    def get_review_stats(self, reviews):
        if not reviews.exists():
            return {
                'average_rating': 0,
                'rating_percentage': {i: 0 for i in range(1, 6)}
            }

        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']
        rating_distribution = reviews.values('rating').annotate(count=Count('rating'))
        total = reviews.count()
        percent_map = {i: 0 for i in range(1, 6)}

        for entry in rating_distribution:
            star = entry['rating']
            count = entry['count']
            percent_map[star] = round((count / total) * 100, 2)

        return {
            'average_rating': round(avg_rating, 1),
            'rating_percentage': percent_map
        }


@method_decorator(cache_page(60 * 15), name='dispatch')
class BaseProductListView(ListView):
    template_name = 'products/product_list.html'
    context_object_name = 'products'
    paginate_by = 24
    
    def get_queryset(self):
        qs = self.model.objects.filter(available=True)\
            .select_related('category')\
            .prefetch_related('images')\
            .order_by('-created_at')

        if self.request.user.is_authenticated:
            qs = qs.annotate(
                is_wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))
        return qs


@method_decorator(cache_page(60 * 15), name='dispatch')
class TrendingProductsView(BaseProductListView):
    model = Product
    
    def get_queryset(self):
        qs = super().get_queryset().filter(
            trending=True, 
            category__active=True,
            available=True
        ).order_by('-views')
        if self.request.user.is_authenticated:
            qs = qs.annotate(
                is_wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))
        return qs

@method_decorator(cache_page(60 * 15), name='dispatch')
class NewArrivalsView(BaseProductListView):
    model = Product
    
    def get_queryset(self):
        qs = super().get_queryset().filter(new_collection=True, category__active=True, available=True).order_by('-created_at')
        if self.request.user.is_authenticated:
            qs = qs.annotate(
                is_wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))
        return qs

@method_decorator(cache_page(60 * 15), name='dispatch')
class FestivalsView(BaseProductListView):
    model = Product
    
    def get_queryset(self):
        qs = super().get_queryset().filter(new_collection=True, category__active=True, available=True).order_by('-created_at')
        if self.request.user.is_authenticated:
            qs = qs.annotate(
                is_wished=Exists(
                    Wishlist.objects.filter(user=self.request.user, products=OuterRef('pk'))
                )
            )
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))
        return qs

class CategoryListView(ListView):
    model = Category
    template_name = 'products/category_list.html'
    context_object_name = 'categories'
    
    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True)\
            .prefetch_related('children')\
            .order_by('name')


@method_decorator(cache_page(60 * 15), name='dispatch')
class ProductSearchView(ListView):
    template_name = 'products/search_results.html'
    context_object_name = 'products'
    paginate_by = 24

    def get_queryset(self):
        query = self.request.GET.get('q', '').strip()
        if not query:
            return Product.objects.none()

        search_query = SearchQuery(query)
        
        # Base queryset with essential filters and prefetching
        qs = Product.objects.filter(
            available=True, 
            category__active=True
        ).select_related('category').prefetch_related('images')

        # Annotate with search vector and rank
        qs = qs.annotate(
            search=SearchVector('name', weight='A') + SearchVector('description', weight='B'),
            rank=SearchRank(SearchVector('name', 'description'), search_query)
        )
        
        # Filter based on search query
        qs = qs.filter(search=search_query)

        # Annotate with wishlist status
        if self.request.user.is_authenticated:
            wishlist_subquery = Wishlist.objects.filter(
                user=self.request.user, 
                products=OuterRef('pk')
            )
            qs = qs.annotate(is_wished=Exists(wishlist_subquery))
        else:
            qs = qs.annotate(is_wished=Value(False, output_field=BooleanField()))
            
        # Order by rank and creation date
        return qs.order_by('-rank', '-created_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['query'] = self.request.GET.get('q', '')
        return context


def quick_view(request, product_id):
    product = get_object_or_404(
        Product.objects.select_related('category').prefetch_related('images').annotate(
            is_wished=Exists(
                Wishlist.objects.filter(user=request.user, products=OuterRef('pk'))
            ) if request.user.is_authenticated else Value(False, output_field=BooleanField())
        ), 
        id=product_id
    )

    # Optional: track view count on quick view modal
    Product.objects.filter(id=product.id).update(views=F('views') + 1)

    return render(request, 'products/partials/_quick_view_content.html', {
        'product': product,
        'cart_product_form': CartAddProductForm()
    })
