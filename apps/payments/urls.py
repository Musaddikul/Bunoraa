# apps/payments/urls.py
"""
Payment URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentMethodViewSet, PaymentViewSet, AdminPaymentViewSet,
    InitiatePaymentView, PaymentWebhookView
)

app_name = 'payments'

router = DefaultRouter()
router.register('methods', PaymentMethodViewSet, basename='methods')
router.register('history', PaymentViewSet, basename='history')
router.register('admin', AdminPaymentViewSet, basename='admin')

urlpatterns = [
    path('', include(router.urls)),
    path('initiate/', InitiatePaymentView.as_view(), name='initiate'),
    path('webhook/<str:gateway>/', PaymentWebhookView.as_view(), name='webhook'),
]
