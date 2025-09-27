# accounts/urls.py
from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views
from .api import views as api_views

app_name = 'accounts'

urlpatterns = [
    # Profile URLs (Existing Django views)
    path('profile/', views.profile, name='profile'),
    path('settings/', views.user_settings, name='user_settings'), # New URL for user settings
    path('address/add/', views.add_address, name='add_address'),
    path('address/<int:pk>/edit/', views.edit_address, name='edit_address'),
    path('address/<int:pk>/delete/', views.delete_address, name='delete_address'),
    path('address/<int:pk>/set-default/', views.set_default_address, name='set_default_address'),
    path('orders/', views.user_orders, name='user_orders'),
    
    # API Endpoints for Accounts
    path('api/profile/', api_views.UserProfileAPIView.as_view(), name='api_user_profile'),
    path('api/addresses/', api_views.UserAddressListCreateAPIView.as_view(), name='api_user_addresses'),
    path('api/addresses/<int:pk>/', api_views.UserAddressRetrieveUpdateDestroyAPIView.as_view(), name='api_user_address_detail'),
    path('api/addresses/<int:pk>/set-default/', api_views.set_default_address_api, name='api_set_default_address'),
]