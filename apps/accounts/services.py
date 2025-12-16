"""
Account services - Business logic layer
"""
import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import User, Address, PasswordResetToken, EmailVerificationToken


class UserService:
    """Service class for user operations."""
    
    @staticmethod
    def create_user(email, password, **extra_fields):
        """Create a new user."""
        user = User.objects.create_user(
            email=email,
            password=password,
            **extra_fields
        )
        # Send verification email
        UserService.send_verification_email(user)
        return user
    
    @staticmethod
    def update_user(user, **data):
        """Update user profile."""
        for field, value in data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        user.save()
        return user
    
    @staticmethod
    def send_verification_email(user):
        """Send email verification link."""
        # Generate token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)
        
        EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # TODO: Implement email sending with SendGrid
        # verification_url = f"{settings.SITE_URL}/account/verify-email/{token}/"
        # send_mail(
        #     subject='Verify your email - Bunoraa',
        #     message=f'Click here to verify: {verification_url}',
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        # )
        
        return token
    
    @staticmethod
    def verify_email(token):
        """Verify user email with token."""
        try:
            verification = EmailVerificationToken.objects.get(
                token=token,
                used=False,
                expires_at__gt=timezone.now()
            )
            user = verification.user
            user.is_verified = True
            user.save(update_fields=['is_verified', 'updated_at'])
            verification.used = True
            verification.save(update_fields=['used'])
            return user
        except EmailVerificationToken.DoesNotExist:
            return None
    
    @staticmethod
    def request_password_reset(email):
        """Send password reset email."""
        try:
            user = User.objects.get(email=email, is_active=True, is_deleted=False)
        except User.DoesNotExist:
            return False
        
        # Invalidate existing tokens
        PasswordResetToken.objects.filter(user=user, used=False).update(used=True)
        
        # Generate new token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=1)
        
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # TODO: Implement email sending with SendGrid
        # reset_url = f"{settings.SITE_URL}/account/reset-password/{token}/"
        # send_mail(
        #     subject='Reset your password - Bunoraa',
        #     message=f'Click here to reset: {reset_url}',
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        # )
        
        return True
    
    @staticmethod
    def reset_password(token, new_password):
        """Reset user password with token."""
        try:
            reset_token = PasswordResetToken.objects.get(
                token=token,
                used=False,
                expires_at__gt=timezone.now()
            )
            user = reset_token.user
            user.set_password(new_password)
            user.save(update_fields=['password', 'updated_at'])
            reset_token.used = True
            reset_token.save(update_fields=['used'])
            return user
        except PasswordResetToken.DoesNotExist:
            return None


class AddressService:
    """Service class for address operations."""
    
    @staticmethod
    def create_address(user, **data):
        """Create a new address for user."""
        address = Address.objects.create(user=user, **data)
        return address
    
    @staticmethod
    def update_address(address, **data):
        """Update an existing address."""
        for field, value in data.items():
            if hasattr(address, field):
                setattr(address, field, value)
        address.save()
        return address
    
    @staticmethod
    def delete_address(address):
        """Soft delete an address."""
        address.is_deleted = True
        address.save(update_fields=['is_deleted', 'updated_at'])
    
    @staticmethod
    def get_default_address(user, address_type='shipping'):
        """Get user's default address."""
        return Address.objects.filter(
            user=user,
            address_type__in=[address_type, 'both'],
            is_default=True,
            is_deleted=False
        ).first()
    
    @staticmethod
    def get_user_addresses(user):
        """Get all addresses for a user."""
        return Address.objects.filter(
            user=user,
            is_deleted=False
        ).order_by('-is_default', '-created_at')
