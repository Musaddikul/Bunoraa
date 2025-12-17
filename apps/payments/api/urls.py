"""
Payments API URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PaymentViewSet, PaymentMethodViewSet, RefundAdminViewSet, PaymentGatewayViewSet, stripe_webhook
)

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payments')
router.register(r'methods', PaymentMethodViewSet, basename='payment-methods')
router.register(r'gateways', PaymentGatewayViewSet, basename='payment-gateways')
router.register(r'admin/refunds', RefundAdminViewSet, basename='admin-refunds')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
