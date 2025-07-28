# promotions/urls.py
from django.urls import path
from .api import views as api_views # Assuming your API views are in promotions/api/views.py

app_name = 'promotions' # Namespace for URLs

urlpatterns = [
    # IMPORTANT: Place more specific URL patterns BEFORE more general ones.

    # API endpoint for applying coupons - THIS MUST COME FIRST
    path(
        'api/coupons/apply/',
        api_views.ApplyCouponAPIView.as_view(),
        name='coupon-apply'
    ),
    # API endpoints for listing and retrieving coupons
    path(
        'api/coupons/',
        api_views.CouponListAPIView.as_view(),
        name='coupon-list'
    ),
    path(
        'api/coupons/<str:code>/', # Using 'code' as the lookup field in the URL
        api_views.CouponDetailAPIView.as_view(),
        name='coupon-detail'
    ),
]

