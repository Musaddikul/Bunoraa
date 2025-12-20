"""
Bunoraa URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from .sitemaps import StaticViewSitemap, ProductSitemap, CategorySitemap
from .views import HomeView, health_check

sitemaps = {
    'static': StaticViewSitemap,
    'products': ProductSitemap,
    'categories': CategorySitemap,
}

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include('core.urls_api')),
    
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Sitemap
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    
    # Frontend specific paths (must come before catch-all)
    path('', HomeView.as_view(), name='home'),
    path('products/', include('apps.products.urls')),
    path('categories/', include('apps.categories.urls')),
    path('cart/', include('apps.cart.urls')),
    path('wishlist/', include('apps.wishlist.urls')),
    path('checkout/', include('apps.checkout.urls')),
    path('orders/', include('apps.orders.urls')),
    path('payments/', include('apps.payments.urls')),
    path('preorders/', include('apps.preorders.urls')),
    path('support/', include('apps.support.urls')),
    path('contacts/', include('apps.contacts.urls')),
    path('legal/', include('apps.legal.urls')),
    path('faq/', include('apps.faq.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('account/', include('apps.accounts.urls')),
    
    # Pages catch-all (must come last)
    path('', include('apps.pages.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns
    except ImportError:
        pass

# Admin site customization
admin.site.site_header = 'Bunoraa Administration'
admin.site.site_title = 'Bunoraa Admin'
admin.site.index_title = 'Dashboard'
