from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .constants import GENDER_CHOICES
from currencies.models import Currency # Import the Currency model
from core.models import Language # Import the Language model


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    phone_number = PhoneNumberField(_('phone number'), blank=True)
    gender = models.CharField(_('gender'), max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    address = models.TextField(_('address'), blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)  # often district
    country = CountryField(_('country'), blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20, blank=True)
    date_of_birth = models.DateField(_('date of birth'), null=True, blank=True)

    profile_picture = models.ImageField(
        _('profile picture'),
        upload_to='profiles/%Y/%m/%d/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif'])]
    )

    email_verified = models.BooleanField(_('email verified'), default=False)

    # Social auth fields
    google_id = models.CharField(_('Google ID'), max_length=255, blank=True, null=True)
    facebook_id = models.CharField(_('Facebook ID'), max_length=255, blank=True, null=True)
    microsoft_id = models.CharField(_('Microsoft ID'), max_length=255, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email


class UserAddress(models.Model):
    user = models.ForeignKey(
        User,
        related_name='addresses',
        on_delete=models.CASCADE,
        verbose_name=_('user')
    )
    full_name = models.CharField(_('full name'), max_length=100)
    phone_number = PhoneNumberField(_('phone number'))

    address_line_1 = models.CharField(_('address line 1'), max_length=255)
    address_line_2 = models.CharField(_('address line 2'), max_length=255, blank=True)

    city = models.CharField(_('district'), max_length=100)
    state = models.CharField(_('division'), max_length=100)
    upazila = models.CharField(_('upazila'), max_length=100, blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20)
    country = CountryField(_('country'))

    is_default = models.BooleanField(_('default address'), default=False)
    created_at = models.DateTimeField(_('created at'), default=timezone.now)

    class Meta:
        verbose_name = _('user address')
        verbose_name_plural = _('user addresses')
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.city})"

    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            UserAddress.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Seller(models.Model):
    """
    Represents a seller or vendor on the platform.
    Each seller is linked to a User account.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='seller_profile',
        verbose_name=_('User Account')
    )
    store_name = models.CharField(
        _('Store Name'),
        max_length=255,
        unique=True,
        help_text=_('The name of the seller\'s store or brand.')
    )
    description = models.TextField(
        _('Description'),
        blank=True,
        help_text=_('A brief description of the seller or their store.')
    )
    # You might add a profile picture for the store, business address, etc.
    # For now, using user\'s profile picture as a fallback in templates.
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Seller')
        verbose_name_plural = _('Sellers')
        ordering = ['store_name']

    def __str__(self):
        return self.store_name or str(self.user.email)

    @property
    def get_full_name(self):
        """
        Returns the full name of the associated user.
        """
        return self.user.get_full_name()

    @property
    def email(self):
        """
        Returns the email of the associated user.
        """
        return self.user.email

    @property
    def profile(self):
        """
        Provides a 'profile' object with an 'image' attribute for template compatibility.
        This is a workaround to allow `seller.profile.image.url` to work in templates
        even if Seller doesn't have a direct image field, falling back to User\'s profile_picture.
        If you add a `store_logo` or similar field to `Seller`, you can update this.
        """
        class TempProfile:
            def __init__(self, seller_instance):
                self.seller = seller_instance
            @property
            def image(self):
                class TempImage:
                    def __init__(self, url):
                        self.url = url
                    def __str__(self):
                        return self.url
                # Use seller\'s own logo if available, otherwise user\'s profile picture, then default
                if hasattr(self.seller, 'store_logo') and self.seller.store_logo: # Assuming 'store_logo' field
                    return TempImage(self.seller.store_logo.url)
                elif self.seller.user.profile_picture:
                    return TempImage(self.seller.user.profile_picture.url)
                return TempImage('/static/images/default-store.png')
        return TempProfile(self)


class UserSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='settings',
        verbose_name=_('User')
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Preferred Currency')
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Preferred Language')
    )
    country = CountryField(
        _('Preferred Country'),
        blank=True,
        null=True
    )
    timezone = models.CharField(
        _('Timezone'),
        max_length=50,
        default='Asia/Dhaka',
        blank=True
    )

    class Meta:
        verbose_name = _('User Setting')
        verbose_name_plural = _('User Settings')

    def __str__(self):
        return f"Settings for {self.user.username}"
