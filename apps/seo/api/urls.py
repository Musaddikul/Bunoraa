"""
SEO API URL configuration.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SEOMetadataViewSet,
    RedirectViewSet,
    SitemapViewSet,
    SearchRankingViewSet,
    KeywordViewSet,
)

router = DefaultRouter()
router.register(r'metadata', SEOMetadataViewSet, basename='seo-metadata')
router.register(r'redirects', RedirectViewSet, basename='seo-redirects')
router.register(r'sitemap', SitemapViewSet, basename='seo-sitemap')
router.register(r'rankings', SearchRankingViewSet, basename='seo-rankings')
router.register(r'keywords', KeywordViewSet, basename='seo-keywords')

urlpatterns = [
    path('', include(router.urls)),
]
