# orders/urls.py
from django.urls import path
from .views import create_order, CheckoutView, OrderSuccessView, OrderDetailView, cancel_order_api, OrderListView

app_name = "orders"

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name="checkout"),
    path('api/checkout/', create_order, name="confirm"),
    path('checkout/success/<uuid:order_id>/', OrderSuccessView.as_view(), name="success"),
    path('orders/<uuid:order_id>/cancel/', cancel_order_api, name="order_cancel"),
    path('orders/<uuid:order_id>/', OrderDetailView.as_view(), name="order_detail"),
    path('my-orders/', OrderListView.as_view(), name="order_list"),
]
