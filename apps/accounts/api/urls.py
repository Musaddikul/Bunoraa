"""
Account API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    ProfileView,
    PasswordChangeView,
    PasswordResetRequestView,
    PasswordResetView,
    EmailVerifyView,
    ResendVerificationView,
    AddressViewSet,
)

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('password/reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('email/verify/', EmailVerifyView.as_view(), name='email_verify'),
    path('email/resend/', ResendVerificationView.as_view(), name='resend_verification'),
    path('', include(router.urls)),
]
