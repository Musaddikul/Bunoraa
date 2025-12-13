# core/urls_api.py
"""
API URL Configuration for all versioned API endpoints.
"""
from django.urls import path, include

from apps.accounts.urls import api_urlpatterns as accounts_api_urls

app_name = 'api'

urlpatterns = [
    # Authentication
    path('auth/', include((accounts_api_urls, 'accounts'))),
    
    # Core Resources
    path('categories/', include('apps.categories.urls')),
    path('products/', include('apps.products.urls')),
    path('cart/', include('apps.cart.urls')),
    path('orders/', include('apps.orders.urls')),
    path('payments/', include('apps.payments.urls')),
    
    # Supporting Resources
    path('pages/', include('apps.pages.urls')),
    path('promotions/', include('apps.promotions.urls')),
    path('reviews/', include('apps.reviews.urls')),
    path('wishlist/', include('apps.wishlist.urls')),
]

