"""
Analytics API URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DashboardViewSet, DailyStatViewSet, TrackingViewSet

router = DefaultRouter()
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'daily', DailyStatViewSet, basename='daily-stats')
router.register(r'track', TrackingViewSet, basename='tracking')

urlpatterns = [
    path('', include(router.urls)),
]
