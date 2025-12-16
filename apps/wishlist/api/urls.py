"""
Wishlist API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WishlistViewSet, WishlistShareViewSet, SharedWishlistView,
    WishlistNotificationViewSet
)

router = DefaultRouter()
router.register(r'', WishlistViewSet, basename='wishlist')
router.register(r'shares', WishlistShareViewSet, basename='wishlist-share')
router.register(r'notifications', WishlistNotificationViewSet, basename='wishlist-notification')

urlpatterns = [
    path('', include(router.urls)),
    path('shared/<str:token>/', SharedWishlistView.as_view(), name='shared-wishlist'),
]
