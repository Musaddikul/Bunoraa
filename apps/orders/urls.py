# apps/orders/urls.py
"""
Order URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, AdminOrderViewSet, CreateOrderView

app_name = 'orders'

router = DefaultRouter()
router.register('my-orders', OrderViewSet, basename='my-orders')
router.register('admin', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', CreateOrderView.as_view(), name='checkout'),
]
