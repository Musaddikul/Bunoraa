# apps/wishlist/urls.py
"""
Wishlist URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, WishlistItemView, CheckWishlistView, MoveToCartView

app_name = 'wishlist'

router = DefaultRouter()
router.register('', WishlistViewSet, basename='wishlists')

urlpatterns = [
    path('', include(router.urls)),
    path('items/', WishlistItemView.as_view(), name='items'),
    path('check/<int:product_id>/', CheckWishlistView.as_view(), name='check'),
    path('items/<int:item_id>/to-cart/', MoveToCartView.as_view(), name='to-cart'),
]
