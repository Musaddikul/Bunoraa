# apps/accounts/views.py
"""
Account Views
API views for user authentication and profile management.
"""
from typing import Any
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
# JWT views imported from urls.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from .models import UserAddress, UserSettings
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserAddressSerializer,
    UserSettingsSerializer,
    PasswordChangeSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for automatic login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Registration successful. Please verify your email.'
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self) -> Any:
        return self.request.user


class UserAddressViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for user addresses.
    """
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self) -> QuerySet[UserAddress]:
        return UserAddress.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request: Request, pk: int | None = None) -> Response:
        """Set an address as default."""
        address = self.get_object()
        address.is_default = True
        address.save()
        return Response({'status': 'Address set as default'})


class UserSettingsView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update user settings.
    """
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self) -> UserSettings:
        settings, _ = UserSettings.objects.get_or_create(user=self.request.user)
        return settings


class PasswordChangeView(generics.GenericAPIView):
    """
    Change user password.
    """
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Password changed successfully'})


class LogoutView(generics.GenericAPIView):
    """
    Logout and blacklist refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request: Request) -> Response:
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logged out successfully'})
