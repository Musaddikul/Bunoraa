"""
Category API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FacetViewSet

router = DefaultRouter()
router.register(r'', CategoryViewSet, basename='category')
router.register(r'facets', FacetViewSet, basename='facet')

urlpatterns = [
    path('', include(router.urls)),
]
