# shipping/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
import json

class Region(models.Model):
    """
    Represents a geographical region (e.g., a district or division in Bangladesh).
    Used to define shipping zones.
    """
    name = models.CharField(max_length=100, unique=True, verbose_name=_("Name"))
    description = models.TextField(blank=True, verbose_name=_("Description"))
    
    class Meta:
        verbose_name = _("Region")
        verbose_name_plural = _("Regions")
        ordering = ['name']

    def __str__(self):
        return self.name

class ShippingZone(models.Model):
    """
    Defines a shipping zone, typically a collection of regions,
    with associated base costs and thresholds.
    """
    name = models.CharField(max_length=100, unique=True, verbose_name=_("Zone Name"))
    regions = models.ManyToManyField(Region, related_name='shipping_zones', verbose_name=_("Regions"))
    
    base_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Base Cost")
    )
    
    free_shipping_threshold = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Free Shipping Threshold"),
        help_text=_("Order total above which shipping is free (0 for no free shipping)")
    )
    
    volumetric_divisor = models.PositiveIntegerField(
        default=5000,
        verbose_name=_("Volumetric Divisor"),
        help_text=_("Divisor for calculating volumetric weight (L*W*H / Divisor)")
    )
    
    postal_codes = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Applicable Postal Codes"),
        help_text=_("JSON array of postal codes or ranges (e.g., ['1200', '1205-1210'])")
    )

    is_active = models.BooleanField(default=True, verbose_name=_("Active"))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Shipping Zone")
        verbose_name_plural = _("Shipping Zones")
        ordering = ['name']

    def __str__(self):
        return self.name

class ShippingCarrier(models.Model):
    """
    Represents an actual shipping company (e.g., Pathao, Sundarban Courier).
    Holds general carrier information and API details.
    """
    class AuthType(models.TextChoices):
        NONE = 'NONE', _('None')
        API_KEY = 'API_KEY', _('API Key')
        OAUTH2 = 'OAUTH2', _('OAuth 2.0')
        BASIC = 'BASIC', _('Basic Auth')

    name = models.CharField(max_length=100, unique=True, verbose_name=_("Carrier Name"))
    code = models.CharField(max_length=50, null=True, blank=True, unique=True, verbose_name=_("Carrier Code"),
                            help_text=_("Unique code for API integration or internal reference"))
    
    api_base_url = models.URLField(blank=True, verbose_name=_("API Base URL"),
                                   help_text=_("Base URL for the carrier's API (e.g., https://api.carrier.com/v1)"))
    auth_type = models.CharField(
        max_length=10,
        choices=AuthType.choices,
        default=AuthType.NONE,
        verbose_name=_("Authentication Type")
    )
    api_key = models.CharField(max_length=255, blank=True, verbose_name=_("API Key"),
                               help_text=_("API key for integration with carrier's system (if API_KEY auth)"))
    credentials_json = models.JSONField(
        blank=True, null=True,
        verbose_name=_("API Credentials (JSON)"),
        help_text=_("Additional API credentials in JSON format (e.g., {'client_id': '...', 'client_secret': '...'}). Store securely.")
    )
    tracking_url = models.URLField(blank=True, verbose_name=_("Tracking URL Template"),
                                   help_text=_("URL template for tracking shipments (e.g., https://carrier.com/track/{tracking_number})"))
    
    webhook_secret = models.CharField(max_length=255, blank=True, verbose_name=_("Webhook Secret"),
                                      help_text=_("Secret key for verifying incoming webhooks from this carrier."))
    return_api_url = models.URLField(blank=True, verbose_name=_("Return API URL"),
                                     help_text=_("API endpoint for initiating returns with this carrier."))

    is_active = models.BooleanField(default=True, verbose_name=_("Active"))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Shipping Carrier")
        verbose_name_plural = _("Shipping Carriers")
        ordering = ['name']

    def get_tracking_link(self, tracking_number: str) -> str | None:
        """
        Generates a full tracking URL for a given tracking number using the tracking URL template.
        """
        if self.tracking_url and tracking_number:
            try:
                return self.tracking_url.format(tracking_number=tracking_number)
            except KeyError:
                return None
        return None

    def get_credentials(self) -> dict:
        """
        Returns parsed API credentials from the JSON field.
        """
        return self.credentials_json if self.credentials_json else {}

    def __str__(self):
        return self.name

class ShippingMethod(models.Model):
    """
    Defines a specific shipping service offered by a carrier across multiple zones.
    This is what customers choose.
    """
    name = models.CharField(max_length=100, verbose_name=_("Method Name"))
    carrier = models.ForeignKey(
        ShippingCarrier,
        on_delete=models.PROTECT,
        related_name='shipping_methods',
        verbose_name=_("Carrier")
    )
    zones = models.ManyToManyField(
        ShippingZone,
        related_name='shipping_methods',
        verbose_name=_("Applicable Zones"),
        help_text=_("The shipping zones where this method is available.")
    )
    
    price_per_kg = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Price per KG")
    )
    base_charge = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Base Charge"),
        help_text=_("Fixed charge for this method, added to weight-based cost")
    )
    
    estimated_delivery_days = models.CharField(
        max_length=50, blank=True, verbose_name=_("Estimated Delivery Days"),
        help_text=_("e.g., '3-5 business days', 'Next day'")
    )
    guaranteed_delivery_days = models.CharField(
        max_length=50, blank=True, verbose_name=_("Guaranteed Delivery Days"),
        help_text=_("e.g., '2 business days' for guaranteed delivery services")
    )
    is_express = models.BooleanField(default=False, verbose_name=_("Is Express"))
    is_active = models.BooleanField(default=True, verbose_name=_("Active"))

    min_weight_kg = models.DecimalField(
        max_digits=6, decimal_places=2, default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Minimum Weight (kg)"),
        help_text=_("Minimum weight for this shipping method")
    )
    max_weight_kg = models.DecimalField(
        max_digits=6, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Maximum Weight (kg)"),
        help_text=_("Maximum weight for this shipping method")
    )
    min_dims_cm = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Minimum Dimensions (cm)"),
        help_text=_("JSON object: {'l': length, 'w': width, 'h': height}. Min dimensions for this method.")
    )
    max_dims_cm = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Maximum Dimensions (cm)"),
        help_text=_("JSON object: {'l': length, 'w': width, 'h': height}. Max dimensions for this method.")
    )
    service_code = models.CharField(
        max_length=100, blank=True, verbose_name=_("Carrier Service Code"),
        help_text=_("Carrier-specific code for this service (e.g., 'PRIORITY_OVERNIGHT')")
    )

    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Shipping Method")
        verbose_name_plural = _("Shipping Methods")
        ordering = ['name']
        unique_together = ('name', 'carrier')

    def __str__(self):
        zone_names = ", ".join([zone.name for zone in self.zones.all()])
        return f"{self.name} ({self.carrier.name} - Zones: {zone_names or 'N/A'})"

class Shipment(models.Model):
    """
    Represents a single shipment for an order, linking to a specific shipping method.
    """
    class ShipmentStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        BOOKED = 'BOOKED', _('Booked')
        IN_TRANSIT = 'IN_TRANSIT', _('In Transit')
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', _('Out For Delivery')
        DELIVERED = 'DELIVERED', _('Delivered')
        CANCELLED = 'CANCELLED', _('Cancelled')
        FAILED = 'FAILED', _('Failed')
        RETURNED = 'RETURNED', _('Returned')

    order = models.OneToOneField(
        'custom_order.CustomOrder',
        on_delete=models.CASCADE,
        related_name='shipment',
        verbose_name=_("Order")
    )
    shipping_method = models.ForeignKey(
        ShippingMethod,
        on_delete=models.PROTECT,
        related_name='shipments',
        null=True,
        blank=True,
        verbose_name=_("Shipping Method")
    )
    tracking_number = models.CharField(max_length=100, blank=True, verbose_name=_("Tracking Number"))
    tracking_url_generated = models.URLField(blank=True, verbose_name=_("Generated Tracking URL"),
                                             help_text=_("The actual tracking URL generated by the carrier's API."))
    status = models.CharField(
        max_length=20,
        choices=ShipmentStatus.choices,
        default=ShipmentStatus.PENDING,
        verbose_name=_("Status")
    )
    cost = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Cost")
    )
    weight_kg = models.DecimalField(
        max_digits=6, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name=_("Weight (kg)")
    )
    dims_cm = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Dimensions (cm)"),
        help_text=_("JSON object: {'l': length, 'w': width, 'h': height}")
    )
    carrier_response_data = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Carrier API Response Data"),
        help_text=_("Raw JSON response from the carrier's API for booking/tracking.")
    )
    
    delivery_proof_url = models.URLField(blank=True, verbose_name=_("Delivery Proof URL"),
                                         help_text=_("URL to image/document proving delivery."))
    delivery_signature_url = models.URLField(blank=True, verbose_name=_("Delivery Signature URL"),
                                             help_text=_("URL to image of recipient's signature."))

    notes = models.TextField(blank=True, verbose_name=_("Notes"))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Shipment")
        verbose_name_plural = _("Shipments")
        ordering = ['-created_at']

    def get_tracking_link(self) -> str | None:
        """
        Returns the generated tracking URL if available, otherwise attempts to generate it
        from the associated carrier's template.
        """
        if self.tracking_url_generated:
            return self.tracking_url_generated
        if self.tracking_number and self.shipping_method and self.shipping_method.carrier:
            return self.shipping_method.carrier.get_tracking_link(self.tracking_number)
        return None

    def __str__(self):
        return f"Shipment {self.id} for Order {self.order.order_id} - {self.get_status_display()}"

class ShipmentStatusUpdate(models.Model):
    """
    Records historical updates to a shipment's status.
    """
    shipment = models.ForeignKey(
        Shipment,
        on_delete=models.CASCADE,
        related_name='status_updates',
        verbose_name=_("Shipment")
    )
    old_status = models.CharField(max_length=20, verbose_name=_("Old Status"), blank=True, null=True)
    new_status = models.CharField(
        max_length=20,
        choices=Shipment.ShipmentStatus.choices,
        verbose_name=_("New Status")
    )
    notes = models.TextField(blank=True, verbose_name=_("Notes"))
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        verbose_name=_("Updated By")
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))

    class Meta:
        verbose_name = _("Shipment Status Update")
        verbose_name_plural = _("Shipment Status Updates")
        ordering = ['-created_at']

    def __str__(self):
        return f"Status update for Shipment {self.shipment.id}: {self.old_status or 'N/A'} -> {self.new_status}"

class ShipmentEvent(models.Model):
    """
    Records specific events that occur during a shipment's journey (e.g., scanned at facility,
    out for delivery, delivery attempt).
    """
    shipment = models.ForeignKey(
        Shipment,
        on_delete=models.CASCADE,
        related_name='events',
        verbose_name=_("Shipment")
    )
    event_type = models.CharField(max_length=100, verbose_name=_("Event Type"),
                                  help_text=_("e.g., 'SCAN', 'EXCEPTION', 'DELIVERY_ATTEMPT'"))
    description = models.TextField(verbose_name=_("Description"))
    location = models.CharField(max_length=255, blank=True, verbose_name=_("Location"))
    event_timestamp = models.DateTimeField(default=timezone.now, verbose_name=_("Event Timestamp"))
    carrier_raw_data = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Carrier Raw Event Data"),
        help_text=_("Raw JSON data from the carrier's webhook/API for this event.")
    )

    class Meta:
        verbose_name = _("Shipment Event")
        verbose_name_plural = _("Shipment Events")
        ordering = ['-event_timestamp']

    def __str__(self):
        return f"Event for Shipment {self.shipment.id}: {self.event_type} at {self.location} on {self.event_timestamp}"
