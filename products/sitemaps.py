# products/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Product, Category
from django.utils import timezone

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9
    protocol = 'https'

    def items(self):
        return Product.objects.filter(available=True).select_related('category').order_by('-updated_at')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()

    def priority(self, obj):
        # Higher priority for trending/new products
        if obj.trending or obj.new_collection:
            return 1.0
        return 0.9

class CategorySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Category.objects.all().prefetch_related('products').order_by('name')

    def lastmod(self, obj):
        latest_product = obj.products.filter(available=True).order_by('-updated_at').first()
        return latest_product.updated_at if latest_product else timezone.now()

    def location(self, obj):
        return obj.get_absolute_url()

class StaticViewSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return [
            'home',
            'products:all_products',
            'products:trending',
            'products:new_arrivals',
            'custom_order:create',
            'contacts:contact',
            'contacts:about',
            'contacts:privacy_policy',
            'contacts:terms_conditions',
        ]

    def location(self, item):
        return reverse(item)