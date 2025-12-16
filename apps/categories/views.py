"""
Category views - Frontend pages
"""
from urllib.parse import urlencode

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.generic import ListView, DetailView
from django.core.paginator import Paginator
from .models import Category
from .services import CategoryService


class CategoryListView(ListView):
    """Category listing page."""
    model = Category
    template_name = 'categories/list.html'
    context_object_name = 'categories'
    
    def get_queryset(self):
        return CategoryService.get_root_categories()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'All Categories'
        context['meta_description'] = 'Browse all product categories at Bunoraa.'
        context['category_tree'] = CategoryService.get_category_tree()
        return context


class CategoryDetailView(DetailView):
    """Category detail page with products."""
    model = Category
    template_name = 'categories/detail.html'
    context_object_name = 'category'
    slug_url_kwarg = 'slug'
    
    def get_queryset(self):
        return Category.objects.filter(is_active=True, is_deleted=False)
    
    def get(self, request, *args, **kwargs):
        """Redirect category detail to the product list with prefilled filters."""
        self.object = self.get_object()
        params = request.GET.copy()
        params['category'] = self.object.slug
        params.setdefault('sort', 'popular')
        destination = f"{reverse('products:list')}?{urlencode(params, doseq=True)}"
        return redirect(destination)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category = self.object
        
        # Get products with pagination
        products = CategoryService.get_category_products(category, include_descendants=True)
        
        # Apply filters
        sort = self.request.GET.get('sort', '-created_at')
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        
        products = products.order_by(sort)
        
        # Pagination
        paginator = Paginator(products, 20)
        page_number = self.request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)
        
        context['products'] = page_obj
        context['page_obj'] = page_obj
        context['page_title'] = category.meta_title or category.name
        context['meta_description'] = category.meta_description or f'Shop {category.name} at Bunoraa.'
        context['breadcrumbs'] = category.get_breadcrumbs()
        context['children'] = category.children.filter(is_active=True, is_deleted=False)
        context['siblings'] = category.get_siblings()
        
        return context
