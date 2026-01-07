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
    """Sitemap for products, including images for image sitemap support."""
    changefreq = 'daily'
    priority = 0.8
    
    def items(self):
        from apps.catalog.models import Product
        return Product.objects.filter(is_active=True, is_deleted=False)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('products:product_detail', kwargs={'slug': obj.slug})

    def images(self, obj):
        imgs = []
        for img in obj.images.all()[:5]:
            if img.image:
                imgs.append({
                    'location': img.image.url,
                    'title': obj.name,
                    'caption': (obj.short_description[:250] if obj.short_description else ''),
                })
        return imgs


class CategorySitemap(Sitemap):
    """Sitemap for categories."""
    changefreq = 'weekly'
    priority = 0.7
    
    def items(self):
        from apps.catalog.models import Category
        return Category.objects.filter(is_active=True, is_deleted=False)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('categories:category_detail', kwargs={'slug': obj.slug})
