"""
Orders API URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderAdminViewSet


router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

admin_router = DefaultRouter()
admin_router.register(r'orders', OrderAdminViewSet, basename='admin-order')

urlpatterns = [
    path('', include(router.urls)),
]

# Admin URLs should be included separately in urls_api.py
admin_urlpatterns = [
    path('admin/', include(admin_router.urls)),
]
