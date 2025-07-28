# custom_order/urls.py
from django.urls import path
from . import views
from . import api_views

app_name = "custom_order"

urlpatterns = [
    path("", views.CustomOrderListView.as_view(), name="list"),
    path("new/", views.CustomOrderCreateView.as_view(), name="create"),
    path("<uuid:order_id>/", views.CustomOrderDetailView.as_view(), name="detail"),
    path("<uuid:order_id>/edit/", views.CustomOrderUpdateView.as_view(), name="update"),
    path("<uuid:order_id>/thank-you/", views.thank_you, name="thank_you"),
    
    # API Endpoints
    path("api/categories/", api_views.CategoryListAPIView.as_view(), name="api_categories"),
    path("api/subcategories/<int:category_id>/", api_views.SubCategoryListAPIView.as_view(), name="api_subcategories"),
    path("api/fabrics/", api_views.FabricTypeListAPIView.as_view(), name="api_fabrics"),
    path("api/colors/<int:fabric_id>/", api_views.ColorOptionListAPIView.as_view(), name="api_colors"),
    path("api/sizes/", api_views.SizeOptionListAPIView.as_view(), name="api_sizes"),
    path("api/user/addresses/", api_views.UserAddressListAPIView.as_view(), name="api_user_addresses"),
    path("api/calculate-price/", api_views.CalculatePriceAPIView.as_view(), name="api_calculate_price"),

    # New API endpoint for creating orders, which now handles payment initiation
    path("api/orders/create/", api_views.CustomOrderCreateAPIView.as_view(), name="api_order_create"),
    path("api/orders/<uuid:order_id>/", api_views.CustomOrderDetailAPIView.as_view(), name="api_order_detail"),
    path("api/orders/<uuid:order_id>/update/", api_views.CustomOrderUpdateAPIView.as_view(), name="api_order_update"),
]
