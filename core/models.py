# core/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from decimal import Decimal

class HomeSlide(models.Model):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='slides/')
    link = models.URLField(max_length=300, blank=True)
    button_text = models.CharField(max_length=50, default='Shop Now')
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        return self.image.url if self.image else ''

class SiteSetting(models.Model):
    name = models.CharField(max_length=100, default="BunonMart")
    logo = models.ImageField(upload_to='site/', null=True, blank=True)
    favicon = models.ImageField(upload_to='site/', null=True, blank=True)
    contact_email = models.EmailField(default="musaddikul.amin123@gmail.com")
    phone_number = PhoneNumberField(blank=True)
    address = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    meta_title = models.CharField(max_length=100, blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.name

class TaxSetting(models.Model):
    name = models.CharField(max_length=100, unique=True, default="Default VAT Rate", verbose_name=_("Setting Name"))
    vat_rate = models.DecimalField(
        max_digits=5, decimal_places=4,
        validators=[MinValueValidator(Decimal('0.0000')), MaxValueValidator(Decimal('1.0000'))],
        default=Decimal('0.1000'),
        help_text=_("VAT rate as a decimal (e.g., 0.10 for 10%)")
    )
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Tax Setting")
        verbose_name_plural = _("Tax Settings")

    def __str__(self):
        return f"{self.name} ({self.vat_rate * 100:.2f}%)"
