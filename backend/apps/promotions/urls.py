# apps/promotions/urls.py
"""
Promotions URL configuration.
"""
from django.urls import path
from . import views

app_name = 'promotions'

urlpatterns = [
    # Public endpoints
    path('coupons/validate/', views.ValidateCouponView.as_view(), name='validate-coupon'),
    path('banners/', views.BannerListView.as_view(), name='banner-list'),
    path('sales/', views.SaleListView.as_view(), name='sale-list'),
    path('sales/<slug:slug>/', views.SaleDetailView.as_view(), name='sale-detail'),
    
    # Admin endpoints
    path('admin/coupons/', views.AdminCouponListView.as_view(), name='admin-coupon-list'),
    path('admin/coupons/create/', views.AdminCouponCreateView.as_view(), name='admin-coupon-create'),
]
