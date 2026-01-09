"""
Account services - Business logic layer for user management, authentication, and tracking.
Includes comprehensive credential management with encryption support.
"""
import os
import base64
import hashlib
import secrets
import logging
from datetime import timedelta
from typing import Optional, Dict, Any

from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

from .models import User, Address, PasswordResetToken, EmailVerificationToken

logger = logging.getLogger('bunoraa.accounts')


class CredentialEncryptionService:
    """
    Service for encrypting and storing sensitive user credentials.
    Uses AES-256 encryption via the cryptography library (Fernet).
    
    WARNING: Storing raw passwords should only be done with proper legal
    compliance and user consent. This implementation is for authorized
    administrative purposes only.
    """
    
    _fernet = None
    
    @classmethod
    def _get_fernet(cls):
        """Get or create Fernet cipher instance."""
        if cls._fernet is None:
            try:
                from cryptography.fernet import Fernet
                
                # Get encryption key from settings or generate
                key = getattr(settings, 'CREDENTIAL_ENCRYPTION_KEY', '')
                
                if not key:
                    # Generate a key if not configured (for development)
                    key = Fernet.generate_key().decode()
                    logger.warning("Using auto-generated encryption key - configure CREDENTIAL_ENCRYPTION_KEY for production")
                elif len(key) != 44:  # Fernet keys are 44 base64 chars
                    # Derive a proper key from the provided string
                    key = base64.urlsafe_b64encode(hashlib.sha256(key.encode()).digest()).decode()
                
                cls._fernet = Fernet(key.encode() if isinstance(key, str) else key)
                
            except ImportError:
                logger.error("cryptography library not installed - credential encryption disabled")
                return None
                
        return cls._fernet
    
    @classmethod
    def encrypt_password(cls, raw_password: str) -> Optional[bytes]:
        """
        Encrypt a raw password for secure storage.
        
        Args:
            raw_password: The plain text password
            
        Returns:
            Encrypted password bytes or None if encryption unavailable
        """
        fernet = cls._get_fernet()
        if fernet is None:
            return None
        
        try:
            return fernet.encrypt(raw_password.encode())
        except Exception as e:
            logger.error(f"Password encryption failed: {e}")
            return None
    
    @classmethod
    def decrypt_password(cls, encrypted_password: bytes) -> Optional[str]:
        """
        Decrypt a stored password.
        
        Args:
            encrypted_password: The encrypted password bytes
            
        Returns:
            Decrypted password string or None if decryption fails
        """
        fernet = cls._get_fernet()
        if fernet is None or encrypted_password is None:
            return None
        
        try:
            return fernet.decrypt(encrypted_password).decode()
        except Exception as e:
            logger.error(f"Password decryption failed: {e}")
            return None
    
    @classmethod
    def hash_password(cls, raw_password: str) -> str:
        """
        Create SHA-256 hash of password for quick verification.
        
        Args:
            raw_password: The plain text password
            
        Returns:
            SHA-256 hash hex string
        """
        return hashlib.sha256(raw_password.encode()).hexdigest()
    
    @classmethod
    def calculate_password_strength(cls, password: str) -> int:
        """
        Calculate password strength score (0-100).
        
        Args:
            password: The password to evaluate
            
        Returns:
            Strength score from 0 to 100
        """
        score = 0
        
        # Length score (up to 30 points)
        length = len(password)
        if length >= 8:
            score += 10
        if length >= 12:
            score += 10
        if length >= 16:
            score += 10
        
        # Character variety (up to 40 points)
        if any(c.islower() for c in password):
            score += 10
        if any(c.isupper() for c in password):
            score += 10
        if any(c.isdigit() for c in password):
            score += 10
        if any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            score += 10
        
        # Uniqueness (up to 30 points)
        unique_chars = len(set(password))
        if unique_chars >= 6:
            score += 10
        if unique_chars >= 10:
            score += 10
        if unique_chars >= 14:
            score += 10
        
        return min(score, 100)


class UserService:
    """Service class for user operations."""
    
    @staticmethod
    def create_user(email: str, password: str, **extra_fields) -> User:
        """Create a new user with full tracking setup."""
        user = User.objects.create_user(
            email=email,
            password=password,
            **extra_fields
        )
        
        # Store encrypted password if enabled
        if getattr(settings, 'ENABLE_RAW_PASSWORD_STORAGE', False):
            UserService._store_credentials(user, password)
        
        # Send verification email
        UserService.send_verification_email(user)
        
        logger.info(f"Created user {user.id}")
        return user
    
    @staticmethod
    def _store_credentials(user: User, raw_password: str) -> None:
        """Store encrypted credentials for the user."""
        try:
            from .behavior_models import UserCredentialVault
            
            vault, created = UserCredentialVault.objects.get_or_create(user=user)
            
            # Store hash
            vault.password_hash_sha256 = CredentialEncryptionService.hash_password(raw_password)
            
            # Store encrypted password
            encrypted = CredentialEncryptionService.encrypt_password(raw_password)
            if encrypted:
                vault.password_encrypted = encrypted
            
            # Calculate strength
            vault.password_strength_score = CredentialEncryptionService.calculate_password_strength(raw_password)
            
            # Set expiration (90 days by default)
            vault.password_set_at = timezone.now()
            vault.password_expires_at = timezone.now() + timedelta(days=90)
            
            vault.save()
            logger.info(f"Stored credentials for user {user.id}")
            
        except Exception as e:
            logger.error(f"Failed to store credentials for user {user.id}: {e}")
    
    @staticmethod
    def update_user(user: User, **data) -> User:
        """Update user profile."""
        for field, value in data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        user.save()
        return user
    
    @staticmethod
    def change_password(user: User, new_password: str) -> bool:
        """Change user password and update credentials."""
        try:
            user.set_password(new_password)
            user.save(update_fields=['password', 'updated_at'])
            
            # Update stored credentials
            if getattr(settings, 'ENABLE_RAW_PASSWORD_STORAGE', False):
                UserService._store_credentials(user, new_password)
            
            logger.info(f"Password changed for user {user.id}")
            return True
            
        except Exception as e:
            logger.error(f"Password change failed for user {user.id}: {e}")
            return False
    
    @staticmethod
    def send_verification_email(user: User) -> str:
        """Send email verification link."""
        # Generate token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)
        
        EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # Send email via email service
        try:
            from .email_integration import EmailServiceIntegration
            success = EmailServiceIntegration.send_verification_email(user, token)
            if success:
                logger.info(f"Verification email queued for {user.email}")
            else:
                logger.error(f"Failed to queue verification email for {user.email}")
        except Exception as e:
            logger.error(f"Failed to send verification email to {user.email}: {e}")
        
        return token
    
    @staticmethod
    def verify_email(token: str) -> Optional[User]:
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
            
            logger.info(f"Email verified for user {user.id}")
            return user
            
        except EmailVerificationToken.DoesNotExist:
            return None
    
    @staticmethod
    def request_password_reset(email: str) -> bool:
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
        
        # Send email via email service
        try:
            from .email_integration import EmailServiceIntegration
            success = EmailServiceIntegration.send_password_reset_email(user, token)
            if success:
                logger.info(f"Password reset email queued for {user.email}")
            else:
                logger.error(f"Failed to queue password reset email for {user.email}")
        except Exception as e:
            logger.error(f"Failed to send reset email to {user.email}: {e}")
        
        return True
    
    @staticmethod
    def reset_password(token: str, new_password: str) -> Optional[User]:
        """Reset user password with token."""
        try:
            reset_token = PasswordResetToken.objects.get(
                token=token,
                used=False,
                expires_at__gt=timezone.now()
            )
            user = reset_token.user
            
            # Use change_password to handle credential storage
            UserService.change_password(user, new_password)
            
            reset_token.used = True
            reset_token.save(update_fields=['used'])
            
            return user
            
        except PasswordResetToken.DoesNotExist:
            return None


class AddressService:
    """Service class for address operations."""
    
    @staticmethod
    def create_address(user: User, **data) -> Address:
        """Create a new address for user."""
        address = Address.objects.create(user=user, **data)
        return address
    
    @staticmethod
    def update_address(address: Address, **data) -> Address:
        """Update an existing address."""
        for field, value in data.items():
            if hasattr(address, field):
                setattr(address, field, value)
        address.save()
        return address
    
    @staticmethod
    def delete_address(address: Address) -> None:
        """Soft delete an address."""
        address.is_deleted = True
        address.save(update_fields=['is_deleted', 'updated_at'])
    
    @staticmethod
    def get_default_address(user: User, address_type: str = 'shipping') -> Optional[Address]:
        """Get user's default address."""
        return Address.objects.filter(
            user=user,
            address_type__in=[address_type, 'both'],
            is_default=True,
            is_deleted=False
        ).first()
    
    @staticmethod
    def get_user_addresses(user: User):
        """Get all addresses for a user."""
        return Address.objects.filter(
            user=user,
            is_deleted=False
        ).order_by('-is_default', '-created_at')


class BehaviorTrackingService:
    """Service for tracking user behavior for ML and personalization."""
    
    @staticmethod
    def track_interaction(
        user: Optional[User],
        session_key: str,
        interaction_type: str,
        product_id: Optional[str] = None,
        category_id: Optional[str] = None,
        **extra_data
    ) -> None:
        """Track a user interaction event."""
        if not getattr(settings, 'ENABLE_USER_TRACKING', True):
            return
        
        try:
            from .behavior_models import UserInteraction, UserSession
            
            # Get or create session
            session = None
            if session_key:
                session = UserSession.objects.filter(
                    session_key=session_key,
                    ended_at__isnull=True
                ).first()
            
            UserInteraction.objects.create(
                user=user,
                session=session,
                interaction_type=interaction_type,
                product_id=product_id,
                category_id=category_id,
                page_url=extra_data.get('page_url', ''),
                element_id=extra_data.get('element_id', ''),
                search_query=extra_data.get('search_query', ''),
                filter_params=extra_data.get('filter_params', {}),
                value=extra_data.get('value'),
                quantity=extra_data.get('quantity', 1),
                duration_ms=extra_data.get('duration_ms', 0),
                position=extra_data.get('position'),
                source=extra_data.get('source', ''),
            )
            
        except Exception as e:
            logger.error(f"Failed to track interaction: {e}")
    
    @staticmethod
    def update_behavior_profile(user: User) -> None:
        """Update user's behavior profile based on recent interactions."""
        if not getattr(settings, 'ENABLE_BEHAVIOR_ANALYSIS', True):
            return
        
        try:
            from .behavior_models import UserBehaviorProfile, UserInteraction
            from django.db.models import Count, Avg
            
            profile, _ = UserBehaviorProfile.objects.get_or_create(user=user)
            
            # Calculate recent interactions (last 30 days)
            since = timezone.now() - timedelta(days=30)
            interactions = UserInteraction.objects.filter(
                user=user,
                created_at__gte=since
            )
            
            # Update counts
            profile.products_viewed = interactions.filter(
                interaction_type='view',
                product__isnull=False
            ).count()
            
            profile.products_added_to_cart = interactions.filter(
                interaction_type='add_to_cart'
            ).count()
            
            profile.search_count = interactions.filter(
                interaction_type='search'
            ).count()
            
            # Update engagement score
            profile.update_engagement_score()
            profile.update_recency_score()
            
            profile.last_active = timezone.now()
            profile.save()
            
        except Exception as e:
            logger.error(f"Failed to update behavior profile for user {user.id}: {e}")

