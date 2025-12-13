# apps/accounts/urls.py
"""
URL configuration for accounts app.
- Web pages (template rendering) - urlpatterns
- API routes (JSON responses) - api_urlpatterns
"""
from django.urls import path

from . import views, views_web

app_name = 'accounts'

# Web page routes (included by core/urls.py at /account/)
urlpatterns = [
    # Authentication
    path('login/', views_web.LoginView.as_view(), name='login'),
    path('register/', views_web.RegisterView.as_view(), name='register'),
    path('logout/', views_web.LogoutView.as_view(), name='logout'),
    
    # Password Reset
    path('password/reset/', views_web.PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/done/', views_web.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password/reset/<uidb64>/<token>/', views_web.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password/reset/complete/', views_web.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # Dashboard
    path('', views_web.DashboardView.as_view(), name='dashboard'),
    
    # Profile
    path('profile/', views_web.ProfileView.as_view(), name='profile'),
    path('password/change/', views_web.ChangePasswordView.as_view(), name='change_password'),
    path('delete/', views_web.DeleteAccountView.as_view(), name='delete_account'),
    
    # Orders
    path('orders/', views_web.OrdersView.as_view(), name='orders'),
    path('orders/<uuid:order_id>/', views_web.OrderDetailView.as_view(), name='order_detail'),
    
    # Addresses
    path('addresses/', views_web.AddressesView.as_view(), name='addresses'),
    path('addresses/add/', views_web.AddAddressView.as_view(), name='add_address'),
    path('addresses/<uuid:pk>/edit/', views_web.EditAddressView.as_view(), name='edit_address'),
    path('addresses/<uuid:pk>/delete/', views_web.DeleteAddressView.as_view(), name='delete_address'),
    path('addresses/<uuid:pk>/default/', views_web.SetDefaultAddressView.as_view(), name='set_default_address'),
    
    # Wishlist
    path('wishlist/', views_web.WishlistView.as_view(), name='wishlist'),
]

# API routes (included by core/urls_api.py at /api/v1/auth/)
api_urlpatterns = [
    # Authentication
    path('login/', views.LoginView.as_view(), name='api_login'),
    path('register/', views.RegisterView.as_view(), name='api_register'),
    path('logout/', views.LogoutView.as_view(), name='api_logout'),
    path('token/refresh/', views.RefreshTokenView.as_view(), name='api_token_refresh'),
    
    # Profile
    path('profile/', views.ProfileView.as_view(), name='api_profile'),
    
    # Password management
    path('password/change/', views.PasswordChangeView.as_view(), name='api_password_change'),
    path('password/reset/', views.PasswordResetRequestView.as_view(), name='api_password_reset_request'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='api_password_reset_confirm'),
    
    # Email verification
    path('email/verify/', views.EmailVerifyView.as_view(), name='api_email_verify'),
    path('email/resend/', views.ResendVerificationView.as_view(), name='api_email_resend'),
    
    # Addresses
    path('addresses/', views.AddressListCreateView.as_view(), name='api_address_list'),
    path('addresses/<uuid:id>/', views.AddressDetailView.as_view(), name='api_address_detail'),
    path('addresses/<uuid:id>/default/', views.SetDefaultAddressView.as_view(), name='api_address_set_default'),
]
