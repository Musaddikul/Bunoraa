# apps/accounts/urls.py
"""
Account URLs
URL routing for authentication and user management.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView,
    ProfileView,
    UserAddressViewSet,
    UserSettingsView,
    PasswordChangeView,
    LogoutView,
)

app_name = 'accounts'

router = DefaultRouter()
router.register('addresses', UserAddressViewSet, basename='address')

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('settings/', UserSettingsView.as_view(), name='settings'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
    
    # Addresses
    path('', include(router.urls)),
]
