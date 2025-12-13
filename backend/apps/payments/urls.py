# apps/payments/urls.py
"""
Payment URL configuration.
"""
from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # Payment endpoints
    path('create-intent/', views.CreatePaymentIntentView.as_view(), name='create-intent'),
    path('confirm/', views.ConfirmPaymentView.as_view(), name='confirm'),
    path('history/', views.PaymentHistoryView.as_view(), name='history'),
    path('<uuid:payment_id>/', views.PaymentDetailView.as_view(), name='detail'),
    
    # Stripe webhook
    path('webhook/stripe/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
    
    # Admin
    path('admin/refund/', views.AdminProcessRefundView.as_view(), name='admin-refund'),
]
