# apps/analytics/urls.py
"""
Analytics URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardView, RevenueChartView, TopProductsView,
    TopSearchesView, SalesReportViewSet
)

app_name = 'analytics'

router = DefaultRouter()
router.register('reports', SalesReportViewSet, basename='reports')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('revenue-chart/', RevenueChartView.as_view(), name='revenue-chart'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('top-searches/', TopSearchesView.as_view(), name='top-searches'),
]
