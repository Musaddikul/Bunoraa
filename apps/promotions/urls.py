# apps/promotions/urls.py
"""
Promotion URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CouponValidateView, SaleViewSet, FlashDealViewSet,
    BundleViewSet, AdminCouponViewSet
)

app_name = 'promotions'

router = DefaultRouter()
router.register('sales', SaleViewSet, basename='sales')
router.register('flash-deals', FlashDealViewSet, basename='flash-deals')
router.register('bundles', BundleViewSet, basename='bundles')
router.register('admin/coupons', AdminCouponViewSet, basename='admin-coupons')

urlpatterns = [
    path('', include(router.urls)),
    path('coupons/validate/', CouponValidateView.as_view(), name='validate-coupon'),
]
