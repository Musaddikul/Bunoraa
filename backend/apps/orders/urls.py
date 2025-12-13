# apps/orders/urls.py
"""
Order URL configuration.
"""
from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    # Checkout
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    
    # User orders
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<str:order_number>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/cancel/', views.OrderCancelView.as_view(), name='order-cancel'),
    path('<str:order_number>/tracking/', views.OrderTrackingView.as_view(), name='order-tracking'),
    
    # Guest order lookup
    path('lookup/', views.GuestOrderLookupView.as_view(), name='guest-order-lookup'),
    
    # Admin endpoints
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/orders/<str:order_number>/', views.AdminOrderUpdateView.as_view(), name='admin-order-update'),
    path('admin/orders/<str:order_number>/tracking/', views.AdminAddTrackingView.as_view(), name='admin-add-tracking'),
]
