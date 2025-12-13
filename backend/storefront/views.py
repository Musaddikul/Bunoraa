# storefront/views.py
"""
Storefront views for Bunoraa.
Handles the main storefront pages including home, products, categories, and search.
"""
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView, TemplateView


class HomeView(TemplateView):
    """Home page view."""
    
    template_name = 'storefront/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        try:
            from apps.products.models import Product
            from apps.categories.models import Category
            
            # Featured categories
            context['featured_categories'] = Category.objects.filter(
                is_active=True,
                is_featured=True
            ).order_by('order')[:6]
            
            # Featured products
            context['featured_products'] = Product.objects.filter(
                is_active=True,
                is_deleted=False,
                is_featured=True
            ).select_related('category', 'brand').prefetch_related('images').order_by('-created_at')[:8]
            
            # New arrivals
            context['new_arrivals'] = Product.objects.filter(
                is_active=True,
                is_deleted=False
            ).select_related('category', 'brand').prefetch_related('images').order_by('-created_at')[:8]
            
            # Bestsellers
            context['bestsellers'] = Product.objects.filter(
                is_active=True,
                is_deleted=False
            ).select_related('category', 'brand').prefetch_related('images').order_by('-sales_count')[:8]
            
            # On sale products
            context['sale_products'] = Product.objects.filter(
                is_active=True,
                is_deleted=False,
                sale_price__isnull=False
            ).select_related('category', 'brand').prefetch_related('images').order_by('-created_at')[:8]
            
        except Exception:
            context['featured_categories'] = []
            context['featured_products'] = []
            context['new_arrivals'] = []
            context['bestsellers'] = []
            context['sale_products'] = []
        
        # Promotional banner
        try:
            from apps.promotions.models import Promotion
            from django.utils import timezone
            
            context['promo_banner'] = Promotion.objects.filter(
                is_active=True,
                show_on_homepage=True
            ).filter(
                Q(end_date__isnull=True) | Q(end_date__gte=timezone.now())
            ).order_by('-priority').first()
        except Exception:
            context['promo_banner'] = None
        
        # Testimonials
        try:
            from apps.reviews.models import Review
            
            context['testimonials'] = Review.objects.filter(
                status='approved',
                rating__gte=4
            ).select_related('user', 'product').order_by('-created_at')[:6]
        except Exception:
            context['testimonials'] = []
        
        return context


class ProductListView(ListView):
    """Product listing page view."""
    
    template_name = 'products/product_list.html'
    context_object_name = 'products'
    paginate_by = 12
    
    def get_queryset(self):
        try:
            from apps.products.models import Product
            
            queryset = Product.objects.filter(
                is_active=True,
                is_deleted=False
            ).select_related('category', 'brand').prefetch_related('images')
            
            # Category filter
            category = self.request.GET.get('category')
            if category:
                queryset = queryset.filter(
                    Q(category__slug=category) | Q(category__parent__slug=category)
                )
            
            # Brand filter
            brand = self.request.GET.get('brand')
            if brand:
                queryset = queryset.filter(brand__slug=brand)
            
            # Tag filter
            tag = self.request.GET.get('tag')
            if tag:
                queryset = queryset.filter(tags__slug=tag)
            
            # Price filter
            min_price = self.request.GET.get('min_price')
            max_price = self.request.GET.get('max_price')
            if min_price:
                queryset = queryset.filter(price__gte=min_price)
            if max_price:
                queryset = queryset.filter(price__lte=max_price)
            
            # Availability filter
            availability = self.request.GET.get('availability')
            if availability == 'in_stock':
                queryset = queryset.filter(stock__gt=0)
            elif availability == 'on_sale':
                queryset = queryset.filter(sale_price__isnull=False)
            
            # Featured filter
            featured = self.request.GET.get('featured')
            if featured == 'true':
                queryset = queryset.filter(is_featured=True)
            
            # Sorting
            sort = self.request.GET.get('sort', '-created_at')
            if sort == 'price_asc':
                queryset = queryset.order_by('price')
            elif sort == 'price_desc':
                queryset = queryset.order_by('-price')
            elif sort == 'name':
                queryset = queryset.order_by('name')
            elif sort == 'rating':
                queryset = queryset.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
            elif sort == 'bestselling':
                queryset = queryset.order_by('-sales_count')
            elif sort == 'newest':
                queryset = queryset.order_by('-created_at')
            else:
                queryset = queryset.order_by('-created_at')
            
            return queryset
        except Exception:
            return []
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        try:
            from apps.categories.models import Category
            context['categories'] = Category.objects.filter(
                is_active=True,
                parent__isnull=True
            ).prefetch_related('children').order_by('order', 'name')
        except Exception:
            context['categories'] = []
        
        # Pass filter parameters
        context['current_category'] = self.request.GET.get('category', '')
        context['current_brand'] = self.request.GET.get('brand', '')
        context['current_tag'] = self.request.GET.get('tag', '')
        context['current_sort'] = self.request.GET.get('sort', '-created_at')
        context['min_price'] = self.request.GET.get('min_price', '')
        context['max_price'] = self.request.GET.get('max_price', '')
        context['availability'] = self.request.GET.get('availability', '')
        
        return context


class ProductDetailView(DetailView):
    """Product detail page view."""
    
    template_name = 'products/product_detail.html'
    context_object_name = 'product'
    
    def get_object(self):
        from apps.products.models import Product
        return get_object_or_404(
            Product.objects.select_related('category', 'brand').prefetch_related(
                'images', 'variants', 'tags', 'reviews'
            ),
            slug=self.kwargs['slug'],
            is_active=True,
            is_deleted=False
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.object
        
        # Product variants
        try:
            context['variants'] = product.variants.filter(is_active=True)
        except Exception:
            context['variants'] = []
        
        # Product images
        try:
            context['images'] = product.images.all().order_by('-is_primary', 'sort_order')
        except Exception:
            context['images'] = []
        
        # Reviews
        try:
            from apps.reviews.models import Review
            reviews = Review.objects.filter(
                product=product,
                status='approved'
            ).select_related('user').order_by('-created_at')
            
            context['reviews'] = reviews[:10]
            context['review_count'] = reviews.count()
            
            # Rating breakdown
            if context['review_count'] > 0:
                rating_counts = reviews.values('rating').annotate(count=Count('rating'))
                breakdown = {i: 0 for i in range(1, 6)}
                for item in rating_counts:
                    breakdown[item['rating']] = item['count']
                context['rating_breakdown'] = breakdown
            else:
                context['rating_breakdown'] = {i: 0 for i in range(1, 6)}
        except Exception:
            context['reviews'] = []
            context['review_count'] = 0
            context['rating_breakdown'] = {i: 0 for i in range(1, 6)}
        
        # Related products
        try:
            from apps.products.models import Product
            context['related_products'] = Product.objects.filter(
                category=product.category,
                is_active=True,
                is_deleted=False
            ).exclude(pk=product.pk).select_related('category', 'brand').prefetch_related('images')[:4]
        except Exception:
            context['related_products'] = []
        
        # Add to recently viewed
        recently_viewed = self.request.session.get('recently_viewed', [])
        product_id_str = str(product.id)
        if product_id_str in recently_viewed:
            recently_viewed.remove(product_id_str)
        recently_viewed.insert(0, product_id_str)
        self.request.session['recently_viewed'] = recently_viewed[:10]
        
        return context


class CategoryView(ListView):
    """Category page view."""
    
    template_name = 'products/product_list.html'
    context_object_name = 'products'
    paginate_by = 12
    
    def get_queryset(self):
        from apps.products.models import Product
        from apps.categories.models import Category
        
        self.category = get_object_or_404(
            Category,
            slug=self.kwargs['slug'],
            is_active=True
        )
        
        # Get products from this category and its children
        categories = [self.category.id]
        children = self.category.children.filter(is_active=True)
        categories.extend(children.values_list('id', flat=True))
        
        queryset = Product.objects.filter(
            is_active=True,
            is_deleted=False,
            category_id__in=categories
        ).select_related('category', 'brand').prefetch_related('images')
        
        # Sorting
        sort = self.request.GET.get('sort', '-created_at')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort == 'name':
            queryset = queryset.order_by('name')
        elif sort == 'bestselling':
            queryset = queryset.order_by('-sales_count')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by('-created_at')
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category
        context['page_title'] = self.category.name
        
        try:
            from apps.categories.models import Category
            context['categories'] = Category.objects.filter(
                is_active=True,
                parent__isnull=True
            ).prefetch_related('children').order_by('order', 'name')
        except Exception:
            context['categories'] = []
        
        context['current_category'] = self.category.slug
        context['current_sort'] = self.request.GET.get('sort', '-created_at')
        
        return context


class SaleView(ListView):
    """Sale products page view."""
    
    template_name = 'products/sale.html'
    context_object_name = 'products'
    paginate_by = 12
    
    def get_queryset(self):
        try:
            from apps.products.models import Product
            
            queryset = Product.objects.filter(
                is_active=True,
                is_deleted=False,
                sale_price__isnull=False
            ).select_related('category', 'brand').prefetch_related('images')
            
            # Sorting
            sort = self.request.GET.get('sort', '-created_at')
            if sort == 'price_asc':
                queryset = queryset.order_by('sale_price')
            elif sort == 'price_desc':
                queryset = queryset.order_by('-sale_price')
            elif sort == 'newest':
                queryset = queryset.order_by('-created_at')
            else:
                queryset = queryset.order_by('-created_at')
            
            return queryset
        except Exception:
            return []
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Sale'
        context['is_sale_page'] = True
        context['current_sort'] = self.request.GET.get('sort', '-created_at')
        
        try:
            from apps.categories.models import Category
            context['categories'] = Category.objects.filter(
                is_active=True,
                parent__isnull=True
            ).prefetch_related('children').order_by('order', 'name')
        except Exception:
            context['categories'] = []
        
        return context


class SearchView(ListView):
    """Search results page view."""
    
    template_name = 'storefront/search.html'
    context_object_name = 'products'
    paginate_by = 12
    
    def get_queryset(self):
        try:
            from apps.products.models import Product
            
            query = self.request.GET.get('q', '')
            
            if not query:
                return []
            
            queryset = Product.objects.filter(
                is_active=True,
                is_deleted=False
            ).filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(sku__icontains=query) |
                Q(category__name__icontains=query) |
                Q(brand__name__icontains=query) |
                Q(tags__name__icontains=query)
            ).select_related('category', 'brand').prefetch_related('images').distinct()
            
            # Sorting
            sort = self.request.GET.get('sort', 'relevance')
            if sort == 'price_asc':
                queryset = queryset.order_by('price')
            elif sort == 'price_desc':
                queryset = queryset.order_by('-price')
            elif sort == 'newest':
                queryset = queryset.order_by('-created_at')
            
            return queryset
        except Exception:
            return []
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        query = self.request.GET.get('q', '')
        context['query'] = query
        context['page_title'] = f'Search results for "{query}"'
        context['is_search'] = True
        context['current_sort'] = self.request.GET.get('sort', 'relevance')
        
        try:
            from apps.categories.models import Category
            context['categories'] = Category.objects.filter(
                is_active=True,
                parent__isnull=True
            ).prefetch_related('children').order_by('order', 'name')
        except Exception:
            context['categories'] = []
        
        return context


class CartView(TemplateView):
    """Shopping cart page view."""
    
    template_name = 'cart/cart.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Shopping Cart'
        return context


class CheckoutView(TemplateView):
    """Checkout page view."""
    
    template_name = 'checkout/checkout.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Checkout'
        
        # Get user addresses if authenticated
        if self.request.user.is_authenticated:
            try:
                from apps.accounts.models import Address
                context['addresses'] = Address.objects.filter(
                    user=self.request.user
                ).order_by('-is_default', '-created_at')
            except Exception:
                context['addresses'] = []
        
        return context


class OrderConfirmationView(TemplateView):
    """Order confirmation page view."""
    
    template_name = 'orders/order_confirmation.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        order_id = kwargs.get('order_id')
        
        try:
            from apps.orders.models import Order
            
            order = Order.objects.select_related('user').prefetch_related('items__product').get(
                id=order_id
            )
            
            # Verify the user can view this order
            if self.request.user.is_authenticated:
                if order.user != self.request.user:
                    order = None
            else:
                # For guest orders, check session
                guest_order_id = self.request.session.get('guest_order_id')
                if str(order.id) != str(guest_order_id):
                    order = None
            
            context['order'] = order
        except Exception:
            context['order'] = None
        
        context['page_title'] = 'Order Confirmation'
        return context


class ContactView(TemplateView):
    """Contact page view."""
    
    template_name = 'pages/contact.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Contact Us'
        return context
    
    def post(self, request, *args, **kwargs):
        from django.contrib import messages
        from django.utils.translation import gettext_lazy as _
        
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # TODO: Save contact message or send email
        
        messages.success(request, _('Thank you for your message. We will get back to you soon.'))
        return self.get(request, *args, **kwargs)


class AboutView(TemplateView):
    """About page view."""
    
    template_name = 'pages/about.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'About Us'
        return context


class NewsletterSubscribeView(TemplateView):
    """Newsletter subscription handler."""
    
    template_name = 'storefront/home.html'
    
    def post(self, request, *args, **kwargs):
        from django.contrib import messages
        from django.shortcuts import redirect
        from django.utils.translation import gettext_lazy as _
        
        email = request.POST.get('email')
        
        if email:
            # TODO: Save newsletter subscription to database or send to email service
            messages.success(request, _('Thank you for subscribing to our newsletter!'))
        else:
            messages.error(request, _('Please enter a valid email address.'))
        
        return redirect('storefront:home')


class FAQListView(TemplateView):
    """FAQ page view."""
    
    template_name = 'pages/faq.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Frequently Asked Questions'
        return context


class ShippingInfoView(TemplateView):
    """Shipping info page view."""
    
    template_name = 'pages/shipping.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Shipping Information'
        return context


class ReturnsPolicyView(TemplateView):
    """Returns policy page view."""
    
    template_name = 'pages/returns.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Returns Policy'
        return context


class OrderTrackingView(TemplateView):
    """Order tracking page view."""
    
    template_name = 'pages/order_tracking.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Track Your Order'
        return context


class CMSPageView(TemplateView):
    """CMS page view."""
    
    template_name = 'pages/cms_page.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        slug = kwargs.get('slug', '')
        context['page_title'] = slug.replace('-', ' ').title()
        context['page_slug'] = slug
        return context


class PrivacyPolicyView(TemplateView):
    """Privacy policy page view."""
    
    template_name = 'pages/privacy.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Privacy Policy'
        return context


class TermsOfServiceView(TemplateView):
    """Terms of service page view."""
    
    template_name = 'pages/terms.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Terms of Service'
        return context


class CookiePolicyView(TemplateView):
    """Cookie policy page view."""
    
    template_name = 'pages/cookies.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Cookie Policy'
        return context
