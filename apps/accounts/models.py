# apps/accounts/models.py
"""
User Account Models
User model, profiles, and addresses.
"""
from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import FileExtensionValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField

from apps.core.models import TimeStampedModel


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """
    def create_user(self, email: str, password: str | None = None, **extra_fields: Any) -> 'User':
        if not email:
            raise ValueError(_('Email address is required'))
        
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email: str, password: str | None = None, **extra_fields: Any) -> 'User':
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user model with email as primary identifier.
    """
    class Gender(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')
        OTHER = 'O', _('Other')
        PREFER_NOT_TO_SAY = 'N', _('Prefer not to say')
    
    # Override username to make it optional
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        null=True,
        blank=True,
    )
    
    # Email as primary identifier
    email = models.EmailField(_('email address'), unique=True, db_index=True)
    
    # Profile fields
    phone_number = PhoneNumberField(_('phone number'), blank=True)
    gender = models.CharField(
        _('gender'),
        max_length=1,
        choices=Gender.choices,
        blank=True
    )
    date_of_birth = models.DateField(_('date of birth'), null=True, blank=True)
    
    profile_picture = models.ImageField(
        _('profile picture'),
        upload_to='profiles/%Y/%m/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif', 'webp'])]
    )
    
    # Verification
    email_verified = models.BooleanField(_('email verified'), default=False)
    phone_verified = models.BooleanField(_('phone verified'), default=False)
    
    # Social Auth IDs
    google_id = models.CharField(_('Google ID'), max_length=255, blank=True)
    facebook_id = models.CharField(_('Facebook ID'), max_length=255, blank=True)
    
    # Activity tracking
    last_activity = models.DateTimeField(_('last activity'), null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(_('last login IP'), null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    objects = UserManager()  # type: ignore[assignment]
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self) -> str:
        return self.email
    
    def get_full_name(self) -> str:
        """Return full name or email if not set."""
        full_name = f'{self.first_name} {self.last_name}'.strip()
        return full_name if full_name else self.email.split('@')[0]
    
    def get_short_name(self) -> str:
        """Return first name or email prefix."""
        return self.first_name if self.first_name else self.email.split('@')[0]
    
    @property
    def is_vendor(self) -> bool:
        """Check if user has a vendor profile."""
        return hasattr(self, 'vendor_profile') and self.vendor_profile is not None
    
    @property
    def is_online(self) -> bool:
        """Check if user was active in the last 5 minutes."""
        if not self.last_activity:
            return False
        return (timezone.now() - self.last_activity).seconds < 300


class UserAddress(TimeStampedModel):
    """
    User shipping/billing addresses.
    """
    class AddressType(models.TextChoices):
        SHIPPING = 'shipping', _('Shipping')
        BILLING = 'billing', _('Billing')
        BOTH = 'both', _('Both')
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses',
        verbose_name=_('user')
    )
    
    # Address type
    address_type = models.CharField(
        _('address type'),
        max_length=10,
        choices=AddressType.choices,
        default=AddressType.BOTH
    )
    
    # Recipient info
    full_name = models.CharField(_('full name'), max_length=100)
    phone_number = PhoneNumberField(_('phone number'))
    
    # Address fields
    address_line_1 = models.CharField(_('address line 1'), max_length=255)
    address_line_2 = models.CharField(_('address line 2'), max_length=255, blank=True)
    city = models.CharField(_('city/district'), max_length=100)
    state = models.CharField(_('state/division'), max_length=100)
    postal_code = models.CharField(_('postal code'), max_length=20)
    country = CountryField(_('country'), default='BD')
    
    # Additional fields for Bangladesh
    upazila = models.CharField(_('upazila/thana'), max_length=100, blank=True)
    union = models.CharField(_('union'), max_length=100, blank=True)
    
    # Flags
    is_default = models.BooleanField(_('default address'), default=False)
    label = models.CharField(
        _('label'),
        max_length=50,
        blank=True,
        help_text=_('e.g., "Home", "Office"')
    )
    
    class Meta:
        verbose_name = _('user address')
        verbose_name_plural = _('user addresses')
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_default']),
        ]
    
    def __str__(self) -> str:
        return f'{self.full_name} - {self.city}'
    
    def save(self, *args: Any, **kwargs: Any) -> None:
        # Ensure only one default address per user per type
        if self.is_default:
            UserAddress.objects.filter(
                user=self.user,
                is_default=True,
                address_type=self.address_type
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
    
    @property
    def full_address(self) -> str:
        """Return formatted full address."""
        parts = [self.address_line_1]
        if self.address_line_2:
            parts.append(self.address_line_2)
        if self.upazila:
            parts.append(self.upazila)
        parts.extend([self.city, self.state, self.postal_code])
        return ', '.join(parts)


class UserSettings(models.Model):
    """
    User preferences and settings.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='settings',
        verbose_name=_('user')
    )
    
    # Preferences
    preferred_currency = models.ForeignKey(
        'core_app.Currency',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('preferred currency')
    )
    preferred_language = models.ForeignKey(
        'core_app.Language',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('preferred language')
    )
    timezone = models.CharField(
        _('timezone'),
        max_length=50,
        default='Asia/Dhaka'
    )
    
    # Notifications
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    sms_notifications = models.BooleanField(_('SMS notifications'), default=False)
    push_notifications = models.BooleanField(_('push notifications'), default=True)
    marketing_emails = models.BooleanField(_('marketing emails'), default=False)
    
    # Privacy
    show_profile = models.BooleanField(_('show profile publicly'), default=False)
    show_reviews = models.BooleanField(_('show reviews publicly'), default=True)
    
    class Meta:
        verbose_name = _('user settings')
        verbose_name_plural = _('user settings')
    
    def __str__(self) -> str:
        return f'Settings for {self.user.email}'
