# payments/models.py
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from django.core.validators import MinValueValidator

class PaymentMethod(models.Model):
    """
    Represents a payment method available to customers (e.g., 'Bkash', 'Credit Card', 'Cash on Delivery').
    """
    code = models.SlugField(max_length=50, unique=True, help_text=_("Unique code like 'sslcommerz', 'bkash', 'stripe'"))
    name = models.CharField(max_length=100, verbose_name=_("Name"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))
    is_online = models.BooleanField(default=True, verbose_name=_("Is Online Method"))
    icon = models.ImageField(upload_to='payment-icons/', blank=True, null=True, verbose_name=_("Icon"))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))
    
    # New: Gateway-specific configuration
    gateway_code = models.CharField(
        max_length=50, blank=True, null=True,
        help_text=_("Code identifying the payment gateway (e.g., 'stripe', 'bkash', 'sslcommerz').")
    )
    config_json = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Gateway Configuration (JSON)"),
        help_text=_("Gateway-specific configuration details (e.g., public key, secret key, webhook secret). Store securely.")
    )

    class Meta:
        verbose_name = _("Payment Method")
        verbose_name_plural = _("Payment Methods")
        ordering = ['name']

    def __str__(self):
        return self.name

class PaymentStatus(models.TextChoices):
    """
    Defines the possible statuses for a payment.
    """
    PENDING = 'pending', _('Pending')
    AUTHORIZED = 'authorized', _('Authorized') # Funds reserved, not yet captured
    CAPTURED = 'captured', _('Captured') # Funds transferred (for two-step capture)
    COMPLETED = 'completed', _('Completed') # Final successful state (for one-step or after capture)
    FAILED = 'failed', _('Failed')
    REFUNDED = 'refunded', _('Refunded') # Fully refunded
    PARTIALLY_REFUNDED = 'partially_refunded', _('Partially Refunded') # New status
    CANCELLED = 'cancelled', _('Cancelled')
    PROCESSING = 'processing', _('Processing') # Intermediate state
    REQUIRES_ACTION = 'requires_action', _('Requires Customer Action') # e.g., 3D Secure
    DISPUTED = 'disputed', _('Disputed') # New status for chargebacks

class Payment(models.Model):
    """
    Represents a single payment transaction.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name=_("User")
    )
    order_id = models.CharField(max_length=100, db_index=True, verbose_name=_("Order ID"),
                                help_text=_("The ID of the associated order (e.g., from custom_order app)."))
    method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.PROTECT,
        related_name='payments',
        verbose_name=_("Payment Method")
    )
    status = models.CharField(
        max_length=30, # Increased max_length for new statuses
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
        verbose_name=_("Status")
    )
    amount = models.DecimalField(
        max_digits=12, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_("Amount")
    )
    currency = models.CharField(max_length=10, default='BDT', verbose_name=_("Currency"))
    
    payment_intent_id = models.CharField(
        max_length=150, blank=True, null=True, unique=True,
        verbose_name=_("Payment Intent ID"),
        help_text=_("ID from payment gateway for the payment intent/session.")
    )
    transaction_id = models.CharField(
        max_length=150, blank=True, null=True, unique=True,
        verbose_name=_("Transaction ID"),
        help_text=_("Unique transaction ID from payment gateway for the actual charge.")
    )
    gateway_reference = models.CharField(
        max_length=150, blank=True, null=True,
        verbose_name=_("Gateway Reference"),
        help_text=_("Any other reference ID from the payment gateway.")
    )
    
    # New: For two-step payments (authorize then capture)
    capture_status = models.BooleanField(default=False, verbose_name=_("Is Captured"),
                                         help_text=_("True if authorized funds have been captured."))

    is_verified = models.BooleanField(default=False, verbose_name=_("Is Verified"),
                                      help_text=_("Indicates if payment has been verified with the gateway."))
    is_test = models.BooleanField(default=False, verbose_name=_("Is Test Payment"))
    
    # New: For storing gateway-specific error details
    error_details = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Error Details"),
        help_text=_("JSON object containing error information from the payment gateway.")
    )
    metadata = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Metadata"),
        help_text=_("Arbitrary metadata from the payment gateway or for internal use.")
    )

    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name=_("Completed At"))

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['payment_intent_id']),
            models.Index(fields=['transaction_id']),
        ]
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")

    def __str__(self):
        return f"Payment {self.id} for Order {self.order_id} - {self.get_status_display()} - {self.amount} {self.currency}"

class Refund(models.Model):
    """
    Represents a refund transaction associated with a Payment.
    """
    class RefundStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')

    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds',
        verbose_name=_("Payment")
    )
    refund_id = models.CharField(
        max_length=150, unique=True, blank=True, null=True,
        verbose_name=_("Refund ID"),
        help_text=_("Unique refund ID from payment gateway.")
    )
    amount = models.DecimalField(
        max_digits=12, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_("Refund Amount")
    )
    status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.PENDING,
        verbose_name=_("Status")
    )
    reason = models.TextField(blank=True, verbose_name=_("Reason for Refund"))
    gateway_response_data = models.JSONField(
        blank=True, null=True,
        verbose_name=_("Gateway Response Data"),
        help_text=_("Raw JSON response from the payment gateway for the refund.")
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Refund")
        verbose_name_plural = _("Refunds")

    def __str__(self):
        return f"Refund {self.refund_id or self.id} for Payment {self.payment.id} - {self.amount} {self.status}"

class PaymentEvent(models.Model):
    """
    Records granular events received from payment gateways via webhooks or API calls.
    """
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='events',
        verbose_name=_("Payment"),
        null=True, blank=True, # Can be null if event precedes payment creation (e.g., initial webhook)
    )
    event_type = models.CharField(max_length=100, verbose_name=_("Event Type"),
                                  help_text=_("e.g., 'charge.succeeded', 'payment_intent.succeeded', 'refund.created'"))
    gateway_event_id = models.CharField(
        max_length=150, unique=True, blank=True, null=True,
        verbose_name=_("Gateway Event ID"),
        help_text=_("Unique ID of the event from the payment gateway.")
    )
    payload = models.JSONField(
        verbose_name=_("Event Payload"),
        help_text=_("Raw JSON payload received from the payment gateway webhook.")
    )
    processed = models.BooleanField(default=False, verbose_name=_("Processed"),
                                    help_text=_("Indicates if this event has been processed by the system."))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_("Created At"))

    class Meta:
        ordering = ['created_at']
        verbose_name = _("Payment Event")
        verbose_name_plural = _("Payment Events")
        indexes = [
            models.Index(fields=['gateway_event_id']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Event {self.event_type} for Payment {self.payment_id or 'N/A'} at {self.created_at}"
