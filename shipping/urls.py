# shipping/urls.py
from django.urls import path
from .api import views as api_views

app_name = 'shipping'

urlpatterns = [
    # Publicly accessible API Endpoints (e.g., for frontend to fetch methods, calculate cost)
    path('api/methods/', api_views.ShippingMethodListAPIView.as_view(), name='api_shipping_methods'),
    path('api/calculate-cost/', api_views.CalculateShippingCostAPIView.as_view(), name='api_calculate_shipping_cost'),
    path('api/carriers/', api_views.ShippingCarrierListAPIView.as_view(), name='api_shipping_carriers'),
    
    # Internal/Authenticated API Endpoints (for creating, managing shipments)
    path('api/shipments/create/', api_views.ShipmentCreateAPIView.as_view(), name='api_shipment_create'),
    path('api/shipments/<int:pk>/', api_views.ShipmentDetailAPIView.as_view(), name='api_shipment_detail'),
    path('api/shipments/<int:pk>/book/', api_views.ShipmentBookingAPIView.as_view(), name='api_shipment_book'),
    path('api/shipments/<int:pk>/track/', api_views.ShipmentTrackingAPIView.as_view(), name='api_shipment_track'),
    path('api/shipments/<int:pk>/label/', api_views.ShipmentLabelAPIView.as_view(), name='api_shipment_label'),
    path('api/shipments/<int:pk>/pickup/', api_views.ShipmentPickupRequestAPIView.as_view(), name='api_shipment_pickup'),
    path('api/shipments/<int:pk>/cancel/', api_views.ShipmentCancellationAPIView.as_view(), name='api_shipment_cancel'),

    # Webhook Endpoint (publicly accessible for carriers)
    path('api/webhooks/<str:carrier_code>/', api_views.WebhookReceiverAPIView.as_view(), name='api_webhook_receiver'),
]
