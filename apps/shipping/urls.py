# apps/shipping/urls.py
"""
Shipping URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShippingZoneViewSet, ShippingMethodViewSet, CalculateShippingView,
    AdminShippingZoneViewSet, AdminShippingMethodViewSet
)

app_name = 'shipping'

router = DefaultRouter()
router.register('zones', ShippingZoneViewSet, basename='zones')
router.register('methods', ShippingMethodViewSet, basename='methods')
router.register('admin/zones', AdminShippingZoneViewSet, basename='admin-zones')
router.register('admin/methods', AdminShippingMethodViewSet, basename='admin-methods')

urlpatterns = [
    path('', include(router.urls)),
    path('calculate/', CalculateShippingView.as_view(), name='calculate'),
]
