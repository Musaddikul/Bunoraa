# apps/payments/models.py
"""
Payment Models
Comprehensive payment processing system.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimeStampedModel


class PaymentMethod(TimeStampedModel):
    """
    Saved payment methods for users.
    """
    class Type(models.TextChoices):
        CARD = 'card', _('Card')
        BANK = 'bank', _('Bank Account')
        PAYPAL = 'paypal', _('PayPal')
        WALLET = 'wallet', _('Digital Wallet')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_methods',
        verbose_name=_('user')
    )
    type = models.CharField(
        _('type'),
        max_length=20,
        choices=Type.choices
    )
    
    # Card details (masked)
    card_brand = models.CharField(_('card brand'), max_length=20, blank=True)
    card_last4 = models.CharField(_('last 4 digits'), max_length=4, blank=True)
    card_exp_month = models.PositiveSmallIntegerField(_('exp month'), null=True, blank=True)
    card_exp_year = models.PositiveSmallIntegerField(_('exp year'), null=True, blank=True)
    
    # Bank details (masked)
    bank_name = models.CharField(_('bank name'), max_length=100, blank=True)
    bank_last4 = models.CharField(_('account last 4'), max_length=4, blank=True)
    
    # Gateway token
    gateway_token = models.CharField(_('gateway token'), max_length=255, blank=True)
    gateway_customer_id = models.CharField(_('gateway customer ID'), max_length=255, blank=True)
    
    # Status
    is_default = models.BooleanField(_('default'), default=False)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_active = models.BooleanField(_('active'), default=True)
    
    # Billing address
    billing_address = models.JSONField(_('billing address'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('payment method')
        verbose_name_plural = _('payment methods')
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        if self.type == self.Type.CARD:
            return f'{self.card_brand} ending in {self.card_last4}'
        elif self.type == self.Type.BANK:
            return f'{self.bank_name} ending in {self.bank_last4}'
        return f'{self.get_type_display()}'
    
    def save(self, *args, **kwargs):
        # Ensure only one default
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Payment(TimeStampedModel):
    """
    Payment transaction record.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        AUTHORIZED = 'authorized', _('Authorized')
        CAPTURED = 'captured', _('Captured')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')
        REFUNDED = 'refunded', _('Refunded')
        PARTIALLY_REFUNDED = 'partially_refunded', _('Partially Refunded')
    
    class Gateway(models.TextChoices):
        STRIPE = 'stripe', _('Stripe')
        PAYPAL = 'paypal', _('PayPal')
        SQUARE = 'square', _('Square')
        RAZORPAY = 'razorpay', _('Razorpay')
        COD = 'cod', _('Cash on Delivery')
        BANK_TRANSFER = 'bank_transfer', _('Bank Transfer')
    
    # Identification
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Relations
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.PROTECT,
        related_name='payments',
        verbose_name=_('order')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='payments',
        verbose_name=_('user')
    )
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('payment method')
    )
    
    # Gateway
    gateway = models.CharField(
        _('gateway'),
        max_length=20,
        choices=Gateway.choices
    )
    gateway_payment_id = models.CharField(_('gateway payment ID'), max_length=255, blank=True)
    gateway_order_id = models.CharField(_('gateway order ID'), max_length=255, blank=True)
    
    # Amount
    amount = models.DecimalField(_('amount'), max_digits=12, decimal_places=2)
    currency = models.CharField(_('currency'), max_length=3, default='USD')
    
    # Fees
    gateway_fee = models.DecimalField(_('gateway fee'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    net_amount = models.DecimalField(_('net amount'), max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Status
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    
    # Refund tracking
    refunded_amount = models.DecimalField(_('refunded'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    # Gateway response
    gateway_response = models.JSONField(_('gateway response'), null=True, blank=True)
    failure_reason = models.TextField(_('failure reason'), blank=True)
    
    # Metadata
    ip_address = models.GenericIPAddressField(_('IP address'), null=True, blank=True)
    
    # Timestamps
    authorized_at = models.DateTimeField(_('authorized at'), null=True, blank=True)
    captured_at = models.DateTimeField(_('captured at'), null=True, blank=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('payment')
        verbose_name_plural = _('payments')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', 'status']),
            models.Index(fields=['gateway_payment_id']),
        ]
    
    def __str__(self):
        return f'Payment {self.uuid} - {self.amount} {self.currency}'
    
    def save(self, *args, **kwargs):
        if self.net_amount is None:
            self.net_amount = self.amount - self.gateway_fee
        super().save(*args, **kwargs)
    
    @property
    def is_successful(self):
        return self.status in [self.Status.CAPTURED, self.Status.COMPLETED]
    
    @property
    def can_refund(self):
        return self.is_successful and self.refunded_amount < self.amount


class Refund(TimeStampedModel):
    """
    Refund record.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
    
    class Reason(models.TextChoices):
        CUSTOMER_REQUEST = 'customer_request', _('Customer Request')
        DUPLICATE = 'duplicate', _('Duplicate Payment')
        FRAUDULENT = 'fraudulent', _('Fraudulent')
        ORDER_CANCELLED = 'order_cancelled', _('Order Cancelled')
        PRODUCT_RETURNED = 'product_returned', _('Product Returned')
        OTHER = 'other', _('Other')
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        related_name='refunds',
        verbose_name=_('payment')
    )
    
    amount = models.DecimalField(_('amount'), max_digits=12, decimal_places=2)
    currency = models.CharField(_('currency'), max_length=3, default='USD')
    
    reason = models.CharField(
        _('reason'),
        max_length=20,
        choices=Reason.choices,
        default=Reason.OTHER
    )
    notes = models.TextField(_('notes'), blank=True)
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    gateway_refund_id = models.CharField(_('gateway refund ID'), max_length=255, blank=True)
    gateway_response = models.JSONField(_('gateway response'), null=True, blank=True)
    failure_reason = models.TextField(_('failure reason'), blank=True)
    
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_refunds',
        verbose_name=_('processed by')
    )
    processed_at = models.DateTimeField(_('processed at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('refund')
        verbose_name_plural = _('refunds')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Refund {self.uuid} - {self.amount} {self.currency}'
