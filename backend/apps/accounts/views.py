# apps/accounts/views.py
"""
Views for user authentication and account management.
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import secrets

from .models import UserAddress, PasswordResetToken, EmailVerificationToken
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserAddressSerializer,
    UserAddressListSerializer,
)
from .tasks import send_password_reset_email, send_email_verification

User = get_user_model()


class LoginView(TokenObtainPairView):
    """
    User login endpoint.
    Returns access and refresh tokens along with user data.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data = {
                'success': True,
                'message': 'Login successful',
                'data': response.data,
                'meta': None
            }
        return response


class RefreshTokenView(TokenRefreshView):
    """
    Refresh token endpoint.
    Returns new access token using refresh token.
    """
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data = {
                'success': True,
                'message': 'Token refreshed successfully',
                'data': response.data,
                'meta': None
            }
        return response


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Send verification email
        send_email_verification.delay(str(user.id))
        
        return Response({
            'success': True,
            'message': 'Registration successful. Please verify your email.',
            'data': {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            },
            'meta': None
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    """
    User logout endpoint.
    Blacklists the refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout successful',
                'data': None,
                'meta': None
            })
        except Exception:
            return Response({
                'success': True,
                'message': 'Logout successful',
                'data': None,
                'meta': None
            })


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    User profile endpoint.
    GET: Retrieve current user profile
    PATCH/PUT: Update current user profile
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response({
            'success': True,
            'message': 'Profile retrieved successfully',
            'data': serializer.data,
            'meta': None
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': UserSerializer(instance).data,
            'meta': None
        })


class PasswordChangeView(APIView):
    """
    Password change endpoint for authenticated users.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({
            'success': True,
            'message': 'Password changed successfully',
            'data': None,
            'meta': None
        })


class PasswordResetRequestView(APIView):
    """
    Request password reset email.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email, is_active=True, is_deleted=False)
            
            # Generate reset token
            token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=timezone.now() + timedelta(hours=24)
            )
            
            # Send reset email
            send_password_reset_email.delay(str(user.id), token)
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists
        
        return Response({
            'success': True,
            'message': 'If an account exists with this email, a reset link has been sent.',
            'data': None,
            'meta': None
        })


class PasswordResetConfirmView(APIView):
    """
    Confirm password reset with token.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            reset_token = PasswordResetToken.objects.get(
                token=serializer.validated_data['token']
            )
            
            if not reset_token.is_valid():
                return Response({
                    'success': False,
                    'message': 'Invalid or expired reset token',
                    'data': None,
                    'meta': None
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update password
            user = reset_token.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Mark token as used
            reset_token.used = True
            reset_token.save()
            
            return Response({
                'success': True,
                'message': 'Password reset successful',
                'data': None,
                'meta': None
            })
            
        except PasswordResetToken.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid reset token',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyView(APIView):
    """
    Verify email with token.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({
                'success': False,
                'message': 'Token is required',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
            
            if not verification_token.is_valid():
                return Response({
                    'success': False,
                    'message': 'Invalid or expired verification token',
                    'data': None,
                    'meta': None
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify email
            user = verification_token.user
            user.email_verified = True
            user.save()
            
            # Mark token as used
            verification_token.used = True
            verification_token.save()
            
            return Response({
                'success': True,
                'message': 'Email verified successfully',
                'data': None,
                'meta': None
            })
            
        except EmailVerificationToken.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid verification token',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationView(APIView):
    """
    Resend email verification.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if user.email_verified:
            return Response({
                'success': False,
                'message': 'Email is already verified',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Send verification email
        send_email_verification.delay(str(user.id))
        
        return Response({
            'success': True,
            'message': 'Verification email sent',
            'data': None,
            'meta': None
        })


class AddressListCreateView(generics.ListCreateAPIView):
    """
    List and create user addresses.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserAddressSerializer
        return UserAddressListSerializer
    
    def get_queryset(self):
        return UserAddress.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Addresses retrieved successfully',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Address created successfully',
            'data': serializer.data,
            'meta': None
        }, status=status.HTTP_201_CREATED)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a user address.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserAddressSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return UserAddress.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Address retrieved successfully',
            'data': serializer.data,
            'meta': None
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Address updated successfully',
            'data': serializer.data,
            'meta': None
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        
        return Response({
            'success': True,
            'message': 'Address deleted successfully',
            'data': None,
            'meta': None
        }, status=status.HTTP_200_OK)


class SetDefaultAddressView(APIView):
    """
    Set an address as default.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, id):
        try:
            address = UserAddress.objects.get(
                id=id,
                user=request.user,
                is_deleted=False
            )
            address.is_default = True
            address.save()
            
            return Response({
                'success': True,
                'message': 'Default address updated',
                'data': UserAddressSerializer(address).data,
                'meta': None
            })
        except UserAddress.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Address not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
