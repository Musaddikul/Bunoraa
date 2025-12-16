"""
Payments models
"""
import uuid
from django.db import models
from django.conf import settings


class PaymentMethod(models.Model):
    """Saved payment methods for users."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )
    
    # Type
    TYPE_CARD = 'card'
    TYPE_BANK = 'bank'
    TYPE_PAYPAL = 'paypal'
    TYPE_CHOICES = [
        (TYPE_CARD, 'Credit/Debit Card'),
        (TYPE_BANK, 'Bank Account'),
        (TYPE_PAYPAL, 'PayPal'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_CARD)
    
    # Card details (masked)
    card_brand = models.CharField(max_length=20, blank=True, null=True)  # visa, mastercard, etc
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    card_exp_month = models.IntegerField(blank=True, null=True)
    card_exp_year = models.IntegerField(blank=True, null=True)
    
    # PayPal
    paypal_email = models.EmailField(blank=True, null=True)
    
    # Stripe
    stripe_payment_method_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Status
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Billing address
    billing_name = models.CharField(max_length=100, blank=True, null=True)
    billing_address = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        if self.type == self.TYPE_CARD:
            return f"{self.card_brand} ****{self.card_last_four}"
        elif self.type == self.TYPE_PAYPAL:
            return f"PayPal - {self.paypal_email}"
        return f"{self.get_type_display()}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default per user
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Payment(models.Model):
    """Payment transaction records."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payments'
    )
    
    # Amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Payment method
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    method_type = models.CharField(max_length=20, blank=True, null=True)
    
    # Status
    STATUS_PENDING = 'pending'
    STATUS_PROCESSING = 'processing'
    STATUS_SUCCEEDED = 'succeeded'
    STATUS_FAILED = 'failed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_REFUNDED = 'refunded'
    STATUS_PARTIALLY_REFUNDED = 'partially_refunded'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_SUCCEEDED, 'Succeeded'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_REFUNDED, 'Refunded'),
        (STATUS_PARTIALLY_REFUNDED, 'Partially Refunded'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    # Stripe
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    stripe_charge_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Response data
    gateway_response = models.JSONField(default=dict, blank=True)
    failure_reason = models.TextField(blank=True, null=True)
    
    # Refund tracking
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['stripe_payment_intent_id']),
            models.Index(fields=['order', '-created_at']),
        ]
    
    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency} ({self.status})"


class Refund(models.Model):
    """Refund records."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds'
    )
    
    # Amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Reason
    REASON_DUPLICATE = 'duplicate'
    REASON_FRAUDULENT = 'fraudulent'
    REASON_CUSTOMER_REQUEST = 'requested_by_customer'
    REASON_PRODUCT_ISSUE = 'product_issue'
    REASON_OTHER = 'other'
    REASON_CHOICES = [
        (REASON_DUPLICATE, 'Duplicate'),
        (REASON_FRAUDULENT, 'Fraudulent'),
        (REASON_CUSTOMER_REQUEST, 'Requested by Customer'),
        (REASON_PRODUCT_ISSUE, 'Product Issue'),
        (REASON_OTHER, 'Other'),
    ]
    reason = models.CharField(max_length=30, choices=REASON_CHOICES)
    notes = models.TextField(blank=True, null=True)
    
    # Status
    STATUS_PENDING = 'pending'
    STATUS_SUCCEEDED = 'succeeded'
    STATUS_FAILED = 'failed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_SUCCEEDED, 'Succeeded'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    # Stripe
    stripe_refund_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Admin
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='refunds_created'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Refund {self.id} - {self.amount} ({self.status})"
