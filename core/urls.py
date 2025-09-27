# core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, CategorySitemap
from core.sitemaps import StaticViewSitemap
from accounts.sitemaps import AccountsSitemap
from products.views import HomeView
from .views import health_check # Removed change_language
from django.views.i18n import set_language # Added set_language import

sitemaps = {
    'products': ProductSitemap,
    'categories': CategorySitemap,
    'static': StaticViewSitemap,
    'accounts': AccountsSitemap,
}

urlpatterns = [
    path('set-language/', set_language, name='set_language'), # Changed to use set_language
    path('', HomeView.as_view(), name='home'),
    path('cart/', include('cart.urls')),
    path('wishlist/', include('wishlist.urls')),
    path('promotions/', include('promotions.urls')),
    path('shipping/', include('shipping.urls')),
    path('payments/', include('payments.urls')),
    path('returns/', include('returns.urls')),
    path('reviews/', include('reviews.urls')),
    path('support/', include('support.urls')),
    path('faq/', include('faq.urls')),
    path('legal/', include('legal.urls')),
    path('cms/', include('cms.urls')),
    path('contacts/', include('contacts.urls')),
    path('notifications/', include('notifications.urls')),
    path('analytics/', include('analytics.urls')),
    path('currencies/', include('currencies.urls')),

    path('rosetta/', include('rosetta.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('accounts/', include('allauth.socialaccount.urls')),
    path('accounts/', include('accounts.urls')),

    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
    path('health/', health_check, name='health_check'),

    path('custom-order/', include('custom_order.urls')),

    path('api/products/', include('products.api.urls')),
    path('', include('orders.urls')),
    path('', include('products.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)