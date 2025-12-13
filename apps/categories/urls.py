# apps/categories/urls.py
"""
Category URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CategoryByPathView

app_name = 'categories'

router = DefaultRouter()
router.register('', CategoryViewSet, basename='category')

urlpatterns = [
    path('by-path/<path:category_path>/', CategoryByPathView.as_view(), name='by_path'),
    path('', include(router.urls)),
]
