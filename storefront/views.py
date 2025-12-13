# storefront/views.py
"""
Storefront Views
Public-facing web pages rendered with Django templates.
Data is provided via context and enhanced with JavaScript.
"""
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
# Http404 raised via get_object_or_404


# ============================================================================
# Home & Landing
# ============================================================================

class HomeView(TemplateView):
    """Homepage with featured products, categories, and promotions."""
    template_name = 'storefront/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        from apps.products.models import Product
        from apps.categories.models import Category
        from apps.promotions.models import Sale, FlashDeal
        
        context['featured_products'] = Product.objects.filter(
            is_active=True, is_featured=True
        ).select_related('category', 'brand')[:12]
        
        context['new_arrivals'] = Product.objects.filter(
            is_active=True
        ).order_by('-created_at')[:12]
        
        context['best_sellers'] = Product.objects.filter(
            is_active=True
        ).order_by('-sales_count')[:12]
        
        context['top_categories'] = Category.objects.filter(
            is_active=True, parent__isnull=True
        ).order_by('order')[:8]
        
        context['active_sales'] = Sale.objects.filter(
            is_active=True, is_featured=True
        )[:3]
        
        context['flash_deals'] = FlashDeal.objects.filter(
            is_active=True
        ).select_related('product')[:6]
        
        return context


# ============================================================================
# Catalog
# ============================================================================

class ShopView(TemplateView):
    """Main shop page with filtering and pagination."""
    template_name = 'storefront/shop.html'


class CategoryView(TemplateView):
    """Category page with products."""
    template_name = 'storefront/category.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.categories.models import Category
        
        context['category'] = get_object_or_404(
            Category,
            slug=kwargs['slug'],
            is_active=True
        )
        return context


class ProductDetailView(TemplateView):
    """Product detail page."""
    template_name = 'storefront/product.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.products.models import Product
        
        context['product'] = get_object_or_404(
            Product.objects.select_related('category', 'brand', 'vendor')
            .prefetch_related('images', 'variants', 'attributes__attribute'),
            slug=kwargs['slug'],
            is_active=True
        )
        return context


class BrandsView(TemplateView):
    """All brands page."""
    template_name = 'storefront/brands.html'


class BrandView(TemplateView):
    """Brand detail page with products."""
    template_name = 'storefront/brand.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.products.models import Brand
        
        context['brand'] = get_object_or_404(
            Brand, slug=kwargs['slug'], is_active=True
        )
        return context


# ============================================================================
# Vendors
# ============================================================================

class VendorsView(TemplateView):
    """All vendors page."""
    template_name = 'storefront/vendors.html'


class VendorView(TemplateView):
    """Vendor storefront page."""
    template_name = 'storefront/vendor.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.vendors.models import Vendor
        
        context['vendor'] = get_object_or_404(
            Vendor.objects.prefetch_related('page'),
            slug=kwargs['slug'],
            status='approved'
        )
        return context


# ============================================================================
# Search
# ============================================================================

class SearchView(TemplateView):
    """Search results page."""
    template_name = 'storefront/search.html'


# ============================================================================
# Cart & Checkout
# ============================================================================

class CartView(TemplateView):
    """Shopping cart page."""
    template_name = 'storefront/cart.html'


class CheckoutView(LoginRequiredMixin, TemplateView):
    """Checkout page."""
    template_name = 'storefront/checkout.html'
    login_url = '/login/'


class CheckoutSuccessView(LoginRequiredMixin, TemplateView):
    """Order confirmation page."""
    template_name = 'storefront/checkout_success.html'
    login_url = '/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.orders.models import Order
        
        context['order'] = get_object_or_404(
            Order,
            order_number=kwargs['order_number'],
            user=self.request.user
        )
        return context


# ============================================================================
# User Account
# ============================================================================

class AccountDashboardView(LoginRequiredMixin, TemplateView):
    """User account dashboard."""
    template_name = 'storefront/account/dashboard.html'
    login_url = '/login/'


class OrdersView(LoginRequiredMixin, TemplateView):
    """User orders list."""
    template_name = 'storefront/account/orders.html'
    login_url = '/login/'


class OrderDetailView(LoginRequiredMixin, TemplateView):
    """Order detail page."""
    template_name = 'storefront/account/order_detail.html'
    login_url = '/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.orders.models import Order
        
        context['order'] = get_object_or_404(
            Order.objects.prefetch_related('items', 'status_history'),
            order_number=kwargs['order_number'],
            user=self.request.user
        )
        return context


class AddressesView(LoginRequiredMixin, TemplateView):
    """User addresses page."""
    template_name = 'storefront/account/addresses.html'
    login_url = '/login/'


class WishlistView(LoginRequiredMixin, TemplateView):
    """User wishlist page."""
    template_name = 'storefront/account/wishlist.html'
    login_url = '/login/'


class SettingsView(LoginRequiredMixin, TemplateView):
    """User settings page."""
    template_name = 'storefront/account/settings.html'
    login_url = '/login/'


# ============================================================================
# Authentication
# ============================================================================

class LoginView(TemplateView):
    """Login page."""
    template_name = 'storefront/auth/login.html'
    
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('storefront:account')
        return super().dispatch(request, *args, **kwargs)


class RegisterView(TemplateView):
    """Registration page."""
    template_name = 'storefront/auth/register.html'
    
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('storefront:account')
        return super().dispatch(request, *args, **kwargs)


class LogoutView(TemplateView):
    """Logout - handled by JS."""
    template_name = 'storefront/auth/logout.html'


class ForgotPasswordView(TemplateView):
    """Forgot password page."""
    template_name = 'storefront/auth/forgot_password.html'


class ResetPasswordView(TemplateView):
    """Reset password page."""
    template_name = 'storefront/auth/reset_password.html'


# ============================================================================
# Promotions
# ============================================================================

class SalesView(TemplateView):
    """Active sales page."""
    template_name = 'storefront/sales.html'


class SaleDetailView(TemplateView):
    """Sale detail page with products."""
    template_name = 'storefront/sale.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from apps.promotions.models import Sale
        
        context['sale'] = get_object_or_404(
            Sale, slug=kwargs['slug'], is_active=True
        )
        return context


class FlashDealsView(TemplateView):
    """Flash deals page."""
    template_name = 'storefront/flash_deals.html'


# ============================================================================
# Static Pages
# ============================================================================

class AboutView(TemplateView):
    template_name = 'storefront/pages/about.html'


class ContactView(TemplateView):
    template_name = 'storefront/pages/contact.html'


class FAQView(TemplateView):
    template_name = 'storefront/pages/faq.html'


class PrivacyView(TemplateView):
    template_name = 'storefront/pages/privacy.html'


class TermsView(TemplateView):
    template_name = 'storefront/pages/terms.html'


class ShippingInfoView(TemplateView):
    template_name = 'storefront/pages/shipping.html'


class ReturnsView(TemplateView):
    template_name = 'storefront/pages/returns.html'


# ============================================================================
# Error Pages
# ============================================================================

def error_404(request, exception):
    """Custom 404 page."""
    return render(request, 'storefront/errors/404.html', status=404)


def error_500(request):
    """Custom 500 page."""
    return render(request, 'storefront/errors/500.html', status=500)
