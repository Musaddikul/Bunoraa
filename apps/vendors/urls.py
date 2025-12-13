# apps/vendors/urls.py
"""
Vendor URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VendorViewSet,
    VendorRegistrationView,
    VendorDashboardView,
    VendorSettingsView,
    VendorPageViewSet,
    VendorPayoutViewSet,
    VendorAnalyticsView,
)

app_name = 'vendors'

router = DefaultRouter()
router.register('stores', VendorViewSet, basename='store')

# Dashboard routes
dashboard_router = DefaultRouter()
dashboard_router.register('pages', VendorPageViewSet, basename='page')
dashboard_router.register('payouts', VendorPayoutViewSet, basename='payout')

urlpatterns = [
    # Public vendor browsing
    path('', include(router.urls)),
    
    # Vendor registration
    path('register/', VendorRegistrationView.as_view(), name='register'),
    
    # Vendor dashboard
    path('dashboard/', VendorDashboardView.as_view(), name='dashboard'),
    path('dashboard/settings/', VendorSettingsView.as_view(), name='settings'),
    path('dashboard/analytics/', VendorAnalyticsView.as_view(), name='analytics'),
    path('dashboard/', include(dashboard_router.urls)),
]
