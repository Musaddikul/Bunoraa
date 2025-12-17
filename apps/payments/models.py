"""
Payments models
"""
import uuid
from django.db import models
from django.conf import settings


class PaymentGateway(models.Model):
    """
    Payment gateway configuration - managed from admin panel.
    Stores enabled payment methods and their settings.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Gateway identification
    CODE_STRIPE = 'stripe'
    CODE_BKASH = 'bkash'
    CODE_NAGAD = 'nagad'
    CODE_COD = 'cod'
    CODE_BANK = 'bank_transfer'
    CODE_CHOICES = [
        (CODE_STRIPE, 'Credit/Debit Card (Stripe)'),
        (CODE_BKASH, 'bKash'),
        (CODE_NAGAD, 'Nagad'),
        (CODE_COD, 'Cash on Delivery'),
        (CODE_BANK, 'Bank Transfer'),
    ]
    code = models.CharField(max_length=50, choices=CODE_CHOICES, unique=True)
    
    # Display settings
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    icon = models.ImageField(upload_to='payment-icons/', blank=True, null=True)
    icon_class = models.CharField(max_length=50, blank=True, help_text="CSS class for icon (e.g., 'card', 'bkash')")
    color = models.CharField(max_length=20, default='gray', help_text="Color theme: blue, pink, orange, green, gray")
    
    # Fees
    fee_type = models.CharField(
        max_length=20,
        choices=[
            ('none', 'No Fee'),
            ('flat', 'Flat Fee'),
            ('percent', 'Percentage'),
        ],
        default='none'
    )
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fee_text = models.CharField(max_length=50, blank=True, help_text="Display text for fee (e.g., '৳20 fee')")
    
    # Availability
    is_active = models.BooleanField(default=True)
    currencies = models.JSONField(
        default=list,
        blank=True,
        help_text="List of supported currency codes. Empty means all currencies."
    )
    countries = models.JSONField(
        default=list,
        blank=True,
        help_text="List of supported country codes. Empty means all countries."
    )
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # API Configuration (encrypted in production)
    api_key = models.CharField(max_length=255, blank=True)
    api_secret = models.CharField(max_length=255, blank=True)
    merchant_id = models.CharField(max_length=100, blank=True)
    webhook_secret = models.CharField(max_length=255, blank=True)
    is_sandbox = models.BooleanField(default=True, help_text="Use sandbox/test mode")
    
    # Instructions for customers
    instructions = models.TextField(blank=True, help_text="Instructions shown to customer after selecting this payment method")
    
    # Bank details (for bank transfer)
    bank_name = models.CharField(max_length=100, blank=True)
    bank_account_name = models.CharField(max_length=100, blank=True)
    bank_account_number = models.CharField(max_length=50, blank=True)
    bank_routing_number = models.CharField(max_length=50, blank=True)
    bank_branch = models.CharField(max_length=100, blank=True)
    
    # Ordering
    sort_order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Payment Gateway'
        verbose_name_plural = 'Payment Gateways'
    
    def __str__(self):
        return self.name
    
    def is_available_for(self, currency=None, country=None, amount=None):
        """Check if this gateway is available for given parameters."""
        if not self.is_active:
            return False
        
        if currency and self.currencies and currency not in self.currencies:
            return False
        
        if country and self.countries and country not in self.countries:
            return False
        
        if amount:
            if self.min_amount and amount < self.min_amount:
                return False
            if self.max_amount and amount > self.max_amount:
                return False
        
        return True
    
    def calculate_fee(self, amount):
        """Calculate the fee for a given amount."""
        if self.fee_type == 'none':
            return 0
        elif self.fee_type == 'flat':
            return self.fee_amount
        elif self.fee_type == 'percent':
            return (amount * self.fee_amount) / 100
        return 0
    
    def to_dict(self):
        """Convert to dictionary for frontend."""
        return {
            'code': self.code,
            'name': self.name,
            'description': self.description,
            'icon_url': self.icon.url if self.icon else None,
            'icon_class': self.icon_class,
            'color': self.color,
            'fee_text': self.fee_text,
            'fee_type': self.fee_type,
            'fee_amount': float(self.fee_amount),
            'instructions': self.instructions,
            'is_sandbox': self.is_sandbox,
        }
    
    @classmethod
    def get_active_gateways(cls, currency=None, country=None, amount=None):
        """Get all active gateways filtered by parameters."""
        gateways = cls.objects.filter(is_active=True)
        return [g for g in gateways if g.is_available_for(currency, country, amount)]


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
