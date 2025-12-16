"""
Product API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, TagViewSet, AttributeViewSet

router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'attributes', AttributeViewSet, basename='attribute')

urlpatterns = [
    path('', include(router.urls)),
]
