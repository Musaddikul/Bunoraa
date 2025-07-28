# cart/urls.py
from django.urls import path
from . import views
from .api import views as api_views

app_name = "cart"

urlpatterns = [
    # Frontend HTML Views (for initial page load)
    path("", views.cart_detail, name="detail"),
    path("sidebar/", views.cart_sidebar, name="sidebar"),
    path("related-products/", views.related_products_partial, name="related_products"),
    
    # API Endpoints (for JavaScript frontend)
    path("api/", api_views.CartDetailAPIView.as_view(), name="api_cart_detail"),
    path("api/items/", api_views.CartItemAPIView.as_view(), name="api_cart_item_add"), # POST for add
    path("api/items/<int:product_id>/", api_views.CartItemAPIView.as_view(), name="api_cart_item_detail"), # PUT/DELETE for item
    path("api/items/<int:product_id>/toggle-saved/", api_views.CartItemToggleSavedAPIView.as_view(), name="api_cart_item_toggle_saved"),
    
    path("api/shipping/", api_views.CartShippingAPIView.as_view(), name="api_cart_shipping"), # POST for update
    path("api/checkout/", api_views.CartCheckoutAPIView.as_view(), name="api_cart_checkout"),
    path("api/empty/", api_views.CartClearAPIView.as_view(), name="api_cart_empty"),
    path("api/coupons/apply/", api_views.CartCouponApplyAPIView.as_view(), name="api_cart_coupon_apply"),
    # The sync endpoint will also be handled via API now, no direct HTML view for it
]
