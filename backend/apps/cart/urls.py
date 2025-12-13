# apps/cart/urls.py
"""
Cart URL configuration.
"""
from django.urls import path
from . import views

app_name = 'cart'

urlpatterns = [
    # Cart endpoints
    path('', views.CartView.as_view(), name='cart'),
    path('items/', views.CartItemsView.as_view(), name='cart-items'),
    path('items/<uuid:item_id>/', views.CartItemDetailView.as_view(), name='cart-item-detail'),
    path('count/', views.CartCountView.as_view(), name='cart-count'),
    
    # Coupon endpoints
    path('coupon/apply/', views.ApplyCouponView.as_view(), name='apply-coupon'),
    path('coupon/remove/', views.RemoveCouponView.as_view(), name='remove-coupon'),
]
