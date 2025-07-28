# payments/urls.py
from django.urls import path
from .api import views as api_views # Use api views for all new endpoints
from . import views as frontend_views # For success/failure redirect views

app_name = 'payments'

urlpatterns = [
    # API Endpoints
    path('api/methods/', api_views.PaymentMethodListAPIView.as_view(), name='api_payment_methods'),
    path('api/intents/', api_views.PaymentIntentAPIView.as_view(), name='api_payment_intent_create'),
    path('api/intents/<uuid:pk>/', api_views.PaymentIntentAPIView.as_view(), name='api_payment_intent_detail'),
    path('api/process/<uuid:pk>/', api_views.PaymentProcessAPIView.as_view(), name='api_payment_process'), # pk is internal Payment ID
    path('api/capture/<uuid:pk>/', api_views.PaymentCaptureAPIView.as_view(), name='api_payment_capture'), # pk is internal Payment ID
    path('api/refunds/', api_views.PaymentRefundAPIView.as_view(), name='api_payment_refund'),
    path('api/status/<uuid:pk>/', api_views.PaymentStatusCheckAPIView.as_view(), name='api_payment_status_check'), # pk is internal Payment ID

    # Webhook Endpoint (publicly accessible for gateways)
    # The gateway_code helps identify which gateway is sending the webhook
    path('api/webhooks/<str:gateway_code>/', api_views.PaymentWebhookReceiverAPIView.as_view(), name='api_webhook_receiver'),

    # Frontend Redirect URLs (can be kept simple or enhanced)
    path('success/<uuid:payment_id>/', frontend_views.PaymentSuccessView.as_view(), name='success'),
    path('failure/<uuid:payment_id>/', frontend_views.PaymentFailureView.as_view(), name='failure'),
    path('cancel/<uuid:payment_id>/', frontend_views.PaymentCancelView.as_view(), name='cancel'),
]
