# apps/payments/models.py
"""
Payment models.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings


class Payment(models.Model):
    """
    Payment transaction record.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        SUCCEEDED = 'succeeded', 'Succeeded'
        FAILED = 'failed', 'Failed'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'
        PARTIALLY_REFUNDED = 'partially_refunded', 'Partially Refunded'
    
    class Provider(models.TextChoices):
        STRIPE = 'stripe', 'Stripe'
        PAYPAL = 'paypal', 'PayPal'
        MANUAL = 'manual', 'Manual'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Related order
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    
    # Provider info
    provider = models.CharField(
        max_length=20,
        choices=Provider.choices,
        default=Provider.STRIPE
    )
    provider_payment_id = models.CharField(max_length=255, blank=True)  # e.g., Stripe PaymentIntent ID
    provider_charge_id = models.CharField(max_length=255, blank=True)
    
    # Amount
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Card info (masked)
    card_brand = models.CharField(max_length=20, blank=True)  # visa, mastercard, etc.
    card_last4 = models.CharField(max_length=4, blank=True)
    card_exp_month = models.PositiveSmallIntegerField(null=True, blank=True)
    card_exp_year = models.PositiveSmallIntegerField(null=True, blank=True)
    
    # Error info
    error_code = models.CharField(max_length=50, blank=True)
    error_message = models.TextField(blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['provider_payment_id']),
            models.Index(fields=['order', 'status']),
        ]
    
    def __str__(self):
        return f'Payment {self.id} - {self.order.order_number} - {self.status}'
    
    @property
    def is_successful(self):
        return self.status == self.Status.SUCCEEDED
    
    @property
    def card_display(self):
        if self.card_brand and self.card_last4:
            return f'{self.card_brand.title()} ****{self.card_last4}'
        return ''


class Refund(models.Model):
    """
    Refund record.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCEEDED = 'succeeded', 'Succeeded'
        FAILED = 'failed', 'Failed'
        CANCELLED = 'cancelled', 'Cancelled'
    
    class Reason(models.TextChoices):
        CUSTOMER_REQUEST = 'customer_request', 'Customer Request'
        DUPLICATE = 'duplicate', 'Duplicate'
        FRAUDULENT = 'fraudulent', 'Fraudulent'
        ORDER_CANCELLED = 'order_cancelled', 'Order Cancelled'
        OTHER = 'other', 'Other'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds'
    )
    
    # Provider info
    provider_refund_id = models.CharField(max_length=255, blank=True)
    
    # Amount
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    reason = models.CharField(
        max_length=30,
        choices=Reason.choices,
        default=Reason.CUSTOMER_REQUEST
    )
    notes = models.TextField(blank=True)
    
    # Admin who processed
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_refunds'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Refund {self.id} - ${self.amount}'
