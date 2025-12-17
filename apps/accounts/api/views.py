"""
Account API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from ..models import Address
from ..services import UserService, AddressService
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetSerializer,
    AddressSerializer,
    AddressCreateSerializer,
)

User = get_user_model()


class RegisterView(APIView):
    """User registration endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Account created successfully. Please verify your email.',
                'data': UserSerializer(user).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Registration failed.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """User profile endpoint."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'message': 'Profile retrieved successfully.',
            'data': serializer.data,
            'meta': None
        })
    
    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully.',
                'data': UserSerializer(request.user).data,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Update failed.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    """Upload and update user avatar."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('avatar')
        if not file_obj:
            return Response({
                'success': False,
                'message': 'No avatar file provided.',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.avatar = file_obj
        user.save(update_fields=['avatar'])

        return Response({
            'success': True,
            'message': 'Avatar updated successfully.',
            'data': {'avatar': user.avatar.url if user.avatar else None},
            'meta': None
        })


class PasswordChangeView(APIView):
    """Password change endpoint."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({
                'success': True,
                'message': 'Password changed successfully.',
                'data': None,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Password change failed.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Password reset request endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            UserService.request_password_reset(serializer.validated_data['email'])
            # Always return success to prevent email enumeration
            return Response({
                'success': True,
                'message': 'If an account exists with this email, a reset link will be sent.',
                'data': None,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Invalid request.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """Password reset endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            user = UserService.reset_password(
                serializer.validated_data['token'],
                serializer.validated_data['new_password']
            )
            if user:
                return Response({
                    'success': True,
                    'message': 'Password reset successfully.',
                    'data': None,
                    'meta': None
                })
            return Response({
                'success': False,
                'message': 'Invalid or expired reset token.',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'success': False,
            'message': 'Invalid request.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyView(APIView):
    """Email verification endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({
                'success': False,
                'message': 'Token is required.',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserService.verify_email(token)
        if user:
            return Response({
                'success': True,
                'message': 'Email verified successfully.',
                'data': UserSerializer(user).data,
                'meta': None
            })
        return Response({
            'success': False,
            'message': 'Invalid or expired verification token.',
            'data': None,
            'meta': None
        }, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationView(APIView):
    """Resend email verification endpoint."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if request.user.is_verified:
            return Response({
                'success': False,
                'message': 'Email is already verified.',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        UserService.send_verification_email(request.user)
        return Response({
            'success': True,
            'message': 'Verification email sent.',
            'data': None,
            'meta': None
        })


class AddressViewSet(viewsets.ModelViewSet):
    """Address CRUD endpoints."""
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    
    def get_queryset(self):
        return Address.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).order_by('-is_default', '-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AddressCreateSerializer
        return AddressSerializer
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Addresses retrieved successfully.',
            'data': serializer.data,
            'meta': {'count': queryset.count()}
        })
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            address = serializer.save()
            return Response({
                'success': True,
                'message': 'Address created successfully.',
                'data': AddressSerializer(address).data,
                'meta': None
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Failed to create address.',
            'data': None,
            'meta': {'errors': serializer.errors}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            address = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(address)
            return Response({
                'success': True,
                'message': 'Address retrieved successfully.',
                'data': serializer.data,
                'meta': None
            })
        except Address.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Address not found.',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        try:
            address = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(address, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Address updated successfully.',
                    'data': serializer.data,
                    'meta': None
                })
            return Response({
                'success': False,
                'message': 'Failed to update address.',
                'data': None,
                'meta': {'errors': serializer.errors}
            }, status=status.HTTP_400_BAD_REQUEST)
        except Address.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Address not found.',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        try:
            address = self.get_queryset().get(pk=pk)
            AddressService.delete_address(address)
            return Response({
                'success': True,
                'message': 'Address deleted successfully.',
                'data': None,
                'meta': None
            })
        except Address.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Address not found.',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set address as default."""
        try:
            address = self.get_queryset().get(pk=pk)
            address.is_default = True
            address.save()
            return Response({
                'success': True,
                'message': 'Address set as default.',
                'data': AddressSerializer(address).data,
                'meta': None
            })
        except Address.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Address not found.',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)
