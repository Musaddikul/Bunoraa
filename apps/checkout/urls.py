"""
Checkout URL configuration
"""
from django.urls import path
from . import views


app_name = 'checkout'

urlpatterns = [
    path('', views.CheckoutView.as_view(), name='checkout'),
    path('shipping/', views.ShippingView.as_view(), name='shipping'),
    path('payment/', views.PaymentView.as_view(), name='payment'),
    path('review/', views.ReviewView.as_view(), name='review'),
    path('complete/', views.CompleteView.as_view(), name='complete'),
    path('success/<uuid:order_id>/', views.SuccessView.as_view(), name='success'),
]
