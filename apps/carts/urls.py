# apps/carts/urls.py
"""
Cart URLs
"""
from django.urls import path
from .views import (
    CartView,
    AddToCartView,
    UpdateCartItemView,
    RemoveCartItemView,
    ClearCartView,
    ApplyCouponView,
    RemoveCouponView,
)

app_name = 'carts'

urlpatterns = [
    path('', CartView.as_view(), name='detail'),
    path('add/', AddToCartView.as_view(), name='add'),
    path('items/<int:item_id>/', UpdateCartItemView.as_view(), name='update_item'),
    path('items/<int:item_id>/remove/', RemoveCartItemView.as_view(), name='remove_item'),
    path('clear/', ClearCartView.as_view(), name='clear'),
    path('coupon/apply/', ApplyCouponView.as_view(), name='apply_coupon'),
    path('coupon/remove/', RemoveCouponView.as_view(), name='remove_coupon'),
]
