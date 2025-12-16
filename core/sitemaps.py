"""
Sitemap configuration
"""
from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticViewSitemap(Sitemap):
    """Sitemap for static pages."""
    priority = 0.5
    changefreq = 'weekly'
    
    def items(self):
        return ['home']
    
    def location(self, item):
        return reverse(item)


class ProductSitemap(Sitemap):
    """Sitemap for products."""
    changefreq = 'daily'
    priority = 0.8
    
    def items(self):
        from apps.products.models import Product
        return Product.objects.filter(is_active=True, is_deleted=False)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('products:product_detail', kwargs={'slug': obj.slug})


class CategorySitemap(Sitemap):
    """Sitemap for categories."""
    changefreq = 'weekly'
    priority = 0.7
    
    def items(self):
        from apps.categories.models import Category
        return Category.objects.filter(is_active=True, is_deleted=False)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('categories:category_detail', kwargs={'slug': obj.slug})
