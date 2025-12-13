# apps/urls.py
"""
Main API URLs Configuration
All app URLs are centralized here.
"""
from django.urls import path, include

app_name = 'api'

urlpatterns = [
    # Core
    path('core/', include('apps.core.urls', namespace='core')),
    
    # Authentication & Accounts
    path('accounts/', include('apps.accounts.urls', namespace='accounts')),
    
    # Catalog
    path('categories/', include('apps.categories.urls', namespace='categories')),
    path('products/', include('apps.products.urls', namespace='products')),
    path('vendors/', include('apps.vendors.urls', namespace='vendors')),
    
    # Shopping
    path('cart/', include('apps.carts.urls', namespace='carts')),
    path('wishlist/', include('apps.wishlist.urls', namespace='wishlist')),
    
    # Checkout & Orders
    path('orders/', include('apps.orders.urls', namespace='orders')),
    path('payments/', include('apps.payments.urls', namespace='payments')),
    path('shipping/', include('apps.shipping.urls', namespace='shipping')),
    
    # Engagement
    path('reviews/', include('apps.reviews.urls', namespace='reviews')),
    path('promotions/', include('apps.promotions.urls', namespace='promotions')),
    
    # Communications
    path('notifications/', include('apps.notifications.urls', namespace='notifications')),
    
    # Admin
    path('analytics/', include('apps.analytics.urls', namespace='analytics')),
]
