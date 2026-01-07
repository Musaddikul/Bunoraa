"""
Catalog API URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet, ProductViewSet, CollectionViewSet, BundleViewSet,
    TagViewSet, SpotlightViewSet, BadgeViewSet,
    SearchAPIView, HomepageDataView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='api-category')
router.register(r'products', ProductViewSet, basename='api-product')
router.register(r'collections', CollectionViewSet, basename='api-collection')
router.register(r'bundles', BundleViewSet, basename='api-bundle')
router.register(r'tags', TagViewSet, basename='api-tag')
router.register(r'spotlights', SpotlightViewSet, basename='api-spotlight')
router.register(r'badges', BadgeViewSet, basename='api-badge')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Standalone views
    path('search/', SearchAPIView.as_view(), name='api-search'),
    path('homepage/', HomepageDataView.as_view(), name='api-homepage'),
]
