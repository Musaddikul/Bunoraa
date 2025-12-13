# apps/shipping/models.py
"""
Shipping Models
Shipping methods, zones, and rates.
"""
from decimal import Decimal
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from apps.core.models import TimeStampedModel


class ShippingZone(TimeStampedModel):
    """
    Geographic shipping zone.
    """
    name = models.CharField(_('name'), max_length=100)
    countries = CountryField(multiple=True, blank=True)  # type: ignore[call-overload]
    
    # For more granular zones
    states = models.TextField(
        _('states/regions'),
        blank=True,
        help_text=_('Comma-separated list of state/region codes')
    )
    postal_codes = models.TextField(
        _('postal codes'),
        blank=True,
        help_text=_('Comma-separated list or ranges (e.g., 10000-10999)')
    )
    
    is_active = models.BooleanField(_('active'), default=True)
    is_default = models.BooleanField(
        _('default zone'),
        default=False,
        help_text=_('Use this zone when no other zone matches')
    )
    
    class Meta:
        verbose_name = _('shipping zone')
        verbose_name_plural = _('shipping zones')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure only one default zone
        if self.is_default:
            ShippingZone.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
    
    @classmethod
    def get_zone_for_address(cls, country, state=None, postal_code=None):
        """Find matching shipping zone for an address."""
        # Try exact country match
        zones = cls.objects.filter(is_active=True, countries__contains=country)
        
        if zones.exists():
            # Further filter by state if provided
            if state:
                state_zones = zones.filter(states__icontains=state)
                if state_zones.exists():
                    zones = state_zones
            
            # Further filter by postal code if provided
            if postal_code:
                for zone in zones:
                    if zone.postal_codes:
                        if cls._postal_code_matches(postal_code, zone.postal_codes):
                            return zone
            
            return zones.first()
        
        # Fall back to default zone
        return cls.objects.filter(is_default=True).first()
    
    @staticmethod
    def _postal_code_matches(postal_code, postal_codes_str):
        """Check if postal code matches zone's postal codes."""
        for code_range in postal_codes_str.split(','):
            code_range = code_range.strip()
            if '-' in code_range:
                start, end = code_range.split('-')
                if start.strip() <= postal_code <= end.strip():
                    return True
            elif code_range == postal_code:
                return True
        return False


class ShippingMethod(TimeStampedModel):
    """
    Shipping method (e.g., Standard, Express, Overnight).
    """
    zone = models.ForeignKey(
        ShippingZone,
        on_delete=models.CASCADE,
        related_name='methods',
        verbose_name=_('zone'),
        null=True,
        blank=True
    )
    
    name = models.CharField(_('name'), max_length=100)
    code = models.CharField(_('code'), max_length=50, blank=True)
    description = models.TextField(_('description'), blank=True)
    
    # Carrier
    carrier = models.CharField(_('carrier'), max_length=100, blank=True)
    
    # Pricing
    class PricingType(models.TextChoices):
        FLAT = 'flat', _('Flat Rate')
        WEIGHT = 'weight', _('Weight Based')
        PRICE = 'price', _('Price Based')
        ITEM = 'item', _('Per Item')
        FREE = 'free', _('Free Shipping')
    
    pricing_type = models.CharField(
        _('pricing type'),
        max_length=20,
        choices=PricingType.choices,
        default=PricingType.FLAT
    )
    base_rate = models.DecimalField(
        _('base rate'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    
    # For weight-based pricing
    rate_per_kg = models.DecimalField(
        _('rate per kg'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    
    # For per-item pricing
    rate_per_item = models.DecimalField(
        _('rate per item'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    
    # For price-based (free above threshold)
    free_shipping_threshold = models.DecimalField(
        _('free shipping threshold'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Delivery time
    min_delivery_days = models.PositiveSmallIntegerField(_('min delivery days'), default=3)
    max_delivery_days = models.PositiveSmallIntegerField(_('max delivery days'), default=7)
    
    # Restrictions
    min_order_amount = models.DecimalField(
        _('min order amount'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    max_order_amount = models.DecimalField(
        _('max order amount'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    max_weight = models.DecimalField(
        _('max weight (kg)'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Status
    is_active = models.BooleanField(_('active'), default=True)
    priority = models.PositiveSmallIntegerField(_('priority'), default=0)
    
    class Meta:
        verbose_name = _('shipping method')
        verbose_name_plural = _('shipping methods')
        ordering = ['priority', 'name']
    
    def __str__(self):
        if self.zone:
            return f'{self.name} ({self.zone.name})'
        return self.name
    
    def calculate_rate(self, order_total=None, weight=None, item_count=None):
        """Calculate shipping rate."""
        if self.pricing_type == self.PricingType.FREE:
            return Decimal('0.00')
        
        if self.pricing_type == self.PricingType.FLAT:
            return self.base_rate
        
        if self.pricing_type == self.PricingType.WEIGHT and weight:
            return self.base_rate + (self.rate_per_kg * Decimal(str(weight)))
        
        if self.pricing_type == self.PricingType.ITEM and item_count:
            return self.base_rate + (self.rate_per_item * item_count)
        
        if self.pricing_type == self.PricingType.PRICE and order_total:
            if self.free_shipping_threshold and order_total >= self.free_shipping_threshold:
                return Decimal('0.00')
            return self.base_rate
        
        return self.base_rate
    
    def is_available_for_order(self, order_total=None, weight=None):
        """Check if this method is available for the given order."""
        if not self.is_active:
            return False
        
        if self.min_order_amount and order_total and order_total < self.min_order_amount:
            return False
        
        if self.max_order_amount and order_total and order_total > self.max_order_amount:
            return False
        
        if self.max_weight and weight and weight > float(self.max_weight):
            return False
        
        return True
    
    @property
    def delivery_estimate(self):
        """Get delivery estimate string."""
        if self.min_delivery_days == self.max_delivery_days:
            return f'{self.min_delivery_days} days'
        return f'{self.min_delivery_days}-{self.max_delivery_days} days'


class ShippingRate(TimeStampedModel):
    """
    Specific shipping rates for weight/price tiers.
    """
    method = models.ForeignKey(
        ShippingMethod,
        on_delete=models.CASCADE,
        related_name='rates',
        verbose_name=_('method')
    )
    
    # Weight range
    min_weight = models.DecimalField(
        _('min weight (kg)'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    max_weight = models.DecimalField(
        _('max weight (kg)'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Price range
    min_price = models.DecimalField(
        _('min price'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    max_price = models.DecimalField(
        _('max price'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    rate = models.DecimalField(
        _('rate'),
        max_digits=10,
        decimal_places=2
    )
    
    class Meta:
        verbose_name = _('shipping rate')
        verbose_name_plural = _('shipping rates')
        ordering = ['min_weight', 'min_price']
    
    def __str__(self):
        return f'{self.method.name}: {self.rate}'
