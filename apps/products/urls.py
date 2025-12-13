# apps/products/urls.py
"""
Product URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BrandViewSet,
    ProductViewSet,
    ProductImageViewSet,
    ProductAttributeViewSet,
)

app_name = 'products'

router = DefaultRouter()
router.register('brands', BrandViewSet, basename='brand')
router.register('attributes', ProductAttributeViewSet, basename='attribute')
router.register('images', ProductImageViewSet, basename='image')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
