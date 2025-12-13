# apps/core/models.py
"""
Core Models
Shared models and abstract base classes.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    Abstract base model with timestamp fields.
    """
    created_at = models.DateTimeField(_('created at'), auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        abstract = True


class SoftDeleteManager(models.Manager):
    """
    Manager that excludes soft-deleted objects by default.
    """
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
    
    def with_deleted(self):
        return super().get_queryset()
    
    def deleted_only(self):
        return super().get_queryset().filter(is_deleted=True)


class SoftDeleteModel(models.Model):
    """
    Abstract base model with soft delete functionality.
    """
    is_deleted = models.BooleanField(_('deleted'), default=False, db_index=True)
    deleted_at = models.DateTimeField(_('deleted at'), null=True, blank=True)
    
    objects = SoftDeleteManager()
    all_objects = models.Manager()
    
    class Meta:
        abstract = True
    
    def delete(self, using=None, keep_parents=False, hard=False):
        """
        Soft delete by default. Pass hard=True for permanent deletion.
        """
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])
    
    def restore(self):
        """
        Restore a soft-deleted object.
        """
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])


class UUIDModel(models.Model):
    """
    Abstract base model with UUID primary key.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    class Meta:
        abstract = True


class BaseModel(TimeStampedModel, SoftDeleteModel):
    """
    Combined base model with timestamps and soft delete.
    """
    class Meta:
        abstract = True


class Language(models.Model):
    """
    Supported languages for the platform.
    """
    code = models.CharField(_('code'), max_length=10, unique=True)
    name = models.CharField(_('name'), max_length=100)
    native_name = models.CharField(_('native name'), max_length=100, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_default = models.BooleanField(_('default'), default=False)
    
    class Meta:
        verbose_name = _('language')
        verbose_name_plural = _('languages')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure only one default language
        if self.is_default:
            Language.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Currency(models.Model):
    """
    Supported currencies for the platform.
    """
    code = models.CharField(_('code'), max_length=3, unique=True)
    name = models.CharField(_('name'), max_length=100)
    symbol = models.CharField(_('symbol'), max_length=10)
    exchange_rate = models.DecimalField(
        _('exchange rate'),
        max_digits=12,
        decimal_places=6,
        default=Decimal('1'),
        help_text=_('Exchange rate relative to base currency (BDT)')
    )
    is_active = models.BooleanField(_('active'), default=True)
    is_default = models.BooleanField(_('default'), default=False)
    
    class Meta:
        verbose_name = _('currency')
        verbose_name_plural = _('currencies')
        ordering = ['code']
    
    def __str__(self):
        return f'{self.code} ({self.symbol})'
    
    def save(self, *args, **kwargs):
        # Ensure only one default currency
        if self.is_default:
            Currency.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class SiteSettings(models.Model):
    """
    Global site settings (singleton pattern).
    """
    site_name = models.CharField(_('site name'), max_length=100, default='Bunoraa')
    tagline = models.CharField(_('tagline'), max_length=200, blank=True)
    logo = models.ImageField(_('logo'), upload_to='site/', blank=True)
    favicon = models.ImageField(_('favicon'), upload_to='site/', blank=True)
    
    # Contact Information
    email = models.EmailField(_('contact email'), blank=True)
    phone = models.CharField(_('contact phone'), max_length=20, blank=True)
    address = models.TextField(_('address'), blank=True)
    
    # Social Links
    facebook_url = models.URLField(_('Facebook URL'), blank=True)
    instagram_url = models.URLField(_('Instagram URL'), blank=True)
    twitter_url = models.URLField(_('Twitter URL'), blank=True)
    youtube_url = models.URLField(_('YouTube URL'), blank=True)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=100, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=255, blank=True)
    
    # Business Settings
    default_currency = models.ForeignKey(
        Currency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='site_settings'
    )
    tax_rate = models.DecimalField(
        _('default tax rate'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0'),
        help_text=_('Default tax rate percentage')
    )
    min_order_amount = models.DecimalField(
        _('minimum order amount'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0')
    )
    free_shipping_threshold = models.DecimalField(
        _('free shipping threshold'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0')
    )
    
    # Feature Flags
    enable_reviews = models.BooleanField(_('enable reviews'), default=True)
    enable_wishlist = models.BooleanField(_('enable wishlist'), default=True)
    enable_compare = models.BooleanField(_('enable compare'), default=True)
    enable_guest_checkout = models.BooleanField(_('enable guest checkout'), default=True)
    maintenance_mode = models.BooleanField(_('maintenance mode'), default=False)
    
    class Meta:
        verbose_name = _('site settings')
        verbose_name_plural = _('site settings')
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Ensure singleton pattern
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError('Only one SiteSettings instance is allowed.')
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
