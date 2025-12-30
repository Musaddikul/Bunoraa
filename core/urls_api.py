"""
API URL Configuration - Version 1
All API endpoints under /api/v1/
"""
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

app_name = 'api'

urlpatterns = [
    # Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # App APIs
    path('accounts/', include('apps.accounts.api.urls')),
    path('categories/', include('apps.categories.api.urls')),
    path('products/', include('apps.products.api.urls')),
    path('cart/', include('apps.cart.api.urls')),
    path('checkout/', include('apps.checkout.api.urls')),
    path('orders/', include('apps.orders.api.urls')),
    path('payments/', include('apps.payments.api.urls')),
    path('pages/', include('apps.pages.api.urls')),
    path('promotions/', include('apps.promotions.api.urls')),
    path('reviews/', include('apps.reviews.api.urls')),
    path('notifications/', include('apps.notifications.api.urls')),
    path('analytics/', include('apps.analytics.api.urls')),
    path('shipping/', include('apps.shipping.api.urls')),
    path('wishlist/', include('apps.wishlist.api.urls')),
    path('currencies/', include('apps.currencies.api.urls')),
    path('support/', include('apps.support.api.urls')),
    path('legal/', include('apps.legal.api.urls')),
    path('localization/', include('apps.localization.api.urls')),
    path('faq/', include('apps.faq.api.urls')),
    path('contacts/', include('apps.contacts.api.urls')),
    path('preorders/', include('apps.preorders.api.urls')),
    path('subscriptions/', include('apps.subscriptions.api.urls')),
]
