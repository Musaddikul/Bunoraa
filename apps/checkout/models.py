"""
Checkout models - Robust checkout system with advanced features
"""
import uuid
import hashlib
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class CheckoutSession(models.Model):
    """
    Comprehensive checkout session that holds checkout state
    before order is created. Supports multi-step checkout with
    full state management, validation, and security features.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Security token for guest access
    security_token = models.CharField(max_length=64, blank=True, db_index=True)
    
    # User or session
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='checkout_sessions',
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    
    # Cart reference
    cart = models.ForeignKey(
        'cart.Cart',
        on_delete=models.CASCADE,
        related_name='checkout_sessions'
    )
    
    # Email for guest checkout and communication
    email = models.EmailField(blank=True)
    
    # Shipping address
    shipping_first_name = models.CharField(max_length=100, blank=True)
    shipping_last_name = models.CharField(max_length=100, blank=True)
    shipping_company = models.CharField(max_length=200, blank=True)
    shipping_email = models.EmailField(blank=True)
    shipping_phone = models.CharField(max_length=20, blank=True)
    shipping_address_line_1 = models.CharField(max_length=255, blank=True)
    shipping_address_line_2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100, blank=True)
    shipping_state = models.CharField(max_length=100, blank=True)
    shipping_postal_code = models.CharField(max_length=20, blank=True)
    shipping_country = models.CharField(max_length=100, default='Bangladesh')
    
    # Saved address reference
    saved_shipping_address = models.ForeignKey(
        'accounts.Address',
        on_delete=models.SET_NULL,
        related_name='checkout_shipping_uses',
        null=True,
        blank=True
    )
    
    # Billing address (if different)
    billing_same_as_shipping = models.BooleanField(default=True)
    billing_first_name = models.CharField(max_length=100, blank=True)
    billing_last_name = models.CharField(max_length=100, blank=True)
    billing_company = models.CharField(max_length=200, blank=True)
    billing_address_line_1 = models.CharField(max_length=255, blank=True)
    billing_address_line_2 = models.CharField(max_length=255, blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_postal_code = models.CharField(max_length=20, blank=True)
    billing_country = models.CharField(max_length=100, default='Bangladesh')
    
    # Saved billing address reference
    saved_billing_address = models.ForeignKey(
        'accounts.Address',
        on_delete=models.SET_NULL,
        related_name='checkout_billing_uses',
        null=True,
        blank=True
    )
    
    # Shipping method
    SHIPPING_STANDARD = 'standard'
    SHIPPING_EXPRESS = 'express'
    SHIPPING_OVERNIGHT = 'overnight'
    SHIPPING_PICKUP = 'pickup'
    SHIPPING_FREE = 'free'
    SHIPPING_CHOICES = [
        (SHIPPING_STANDARD, 'Standard Shipping (5-7 days)'),
        (SHIPPING_EXPRESS, 'Express Shipping (2-3 days)'),
        (SHIPPING_OVERNIGHT, 'Overnight Shipping'),
        (SHIPPING_PICKUP, 'Store Pickup'),
        (SHIPPING_FREE, 'Free Shipping'),
    ]
    shipping_method = models.CharField(
        max_length=20,
        choices=SHIPPING_CHOICES,
        default=SHIPPING_STANDARD
    )
    shipping_rate = models.ForeignKey(
        'shipping.ShippingRate',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checkout_sessions'
    )
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Store pickup location
    pickup_location = models.ForeignKey(
        'contacts.StoreLocation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checkout_pickups'
    )
    
    # Payment methods
    PAYMENT_STRIPE = 'stripe'
    PAYMENT_PAYPAL = 'paypal'
    PAYMENT_COD = 'cod'
    PAYMENT_BKASH = 'bkash'
    PAYMENT_NAGAD = 'nagad'
    PAYMENT_BANK = 'bank_transfer'
    PAYMENT_CHOICES = [
        (PAYMENT_STRIPE, 'Credit/Debit Card (Stripe)'),
        (PAYMENT_PAYPAL, 'PayPal'),
        (PAYMENT_COD, 'Cash on Delivery'),
        (PAYMENT_BKASH, 'bKash'),
        (PAYMENT_NAGAD, 'Nagad'),
        (PAYMENT_BANK, 'Bank Transfer'),
    ]
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default=PAYMENT_COD
    )
    
    # Saved payment method reference
    saved_payment_method = models.ForeignKey(
        'payments.PaymentMethod',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checkout_uses'
    )
    
    # Payment gateway references
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_client_secret = models.CharField(max_length=255, blank=True)
    paypal_order_id = models.CharField(max_length=255, blank=True)
    bkash_payment_id = models.CharField(max_length=255, blank=True)
    nagad_payment_id = models.CharField(max_length=255, blank=True)
    
    # Coupon/Discount
    coupon = models.ForeignKey(
        'promotions.Coupon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checkout_sessions'
    )
    coupon_code = models.CharField(max_length=50, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Gift options
    is_gift = models.BooleanField(default=False)
    gift_message = models.TextField(blank=True, max_length=500)
    gift_wrap = models.BooleanField(default=False)
    gift_wrap_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Order notes
    order_notes = models.TextField(blank=True)
    delivery_instructions = models.TextField(blank=True)
    
    # Tax calculation
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_included = models.BooleanField(default=False)
    
    # Pricing snapshot
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Currency
    currency = models.CharField(max_length=3, default='BDT')
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=6, default=1)
    
    # Status
    STEP_CART = 'cart'
    STEP_INFORMATION = 'information'
    STEP_SHIPPING = 'shipping'
    STEP_PAYMENT = 'payment'
    STEP_REVIEW = 'review'
    STEP_PROCESSING = 'processing'
    STEP_COMPLETE = 'complete'
    STEP_ABANDONED = 'abandoned'
    STEP_FAILED = 'failed'
    STEP_CHOICES = [
        (STEP_CART, 'Cart Review'),
        (STEP_INFORMATION, 'Customer Information'),
        (STEP_SHIPPING, 'Shipping Method'),
        (STEP_PAYMENT, 'Payment'),
        (STEP_REVIEW, 'Review Order'),
        (STEP_PROCESSING, 'Processing'),
        (STEP_COMPLETE, 'Complete'),
        (STEP_ABANDONED, 'Abandoned'),
        (STEP_FAILED, 'Failed'),
    ]
    current_step = models.CharField(
        max_length=20,
        choices=STEP_CHOICES,
        default=STEP_CART
    )
    
    # Step completion tracking
    information_completed = models.BooleanField(default=False)
    shipping_completed = models.BooleanField(default=False)
    payment_setup_completed = models.BooleanField(default=False)
    review_completed = models.BooleanField(default=False)
    
    # Marketing preferences
    subscribe_newsletter = models.BooleanField(default=False)
    accept_marketing = models.BooleanField(default=False)
    
    # Analytics and tracking
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    referrer_url = models.URLField(blank=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_type = models.CharField(max_length=20, blank=True)
    
    # Fraud prevention
    fraud_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    fraud_flags = models.JSONField(default=list, blank=True)
    is_flagged = models.BooleanField(default=False)
    
    # A/B testing
    checkout_variant = models.CharField(max_length=50, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Step timestamps for analytics
    information_completed_at = models.DateTimeField(null=True, blank=True)
    shipping_completed_at = models.DateTimeField(null=True, blank=True)
    payment_completed_at = models.DateTimeField(null=True, blank=True)
    order_placed_at = models.DateTimeField(null=True, blank=True)
    
    # Related order (after completion)
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checkout_session'
    )
    
    # Failure tracking
    failure_reason = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    last_error = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Checkout Session'
        verbose_name_plural = 'Checkout Sessions'
        indexes = [
            models.Index(fields=['user', 'current_step']),
            models.Index(fields=['session_key', 'current_step']),
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['current_step', 'expires_at']),
        ]
    
    def __str__(self):
        if self.user:
            return f"Checkout for {self.user.email} ({self.current_step})"
        return f"Guest checkout {self.id} ({self.current_step})"
    
    def save(self, *args, **kwargs):
        # Generate security token for guest access
        if not self.security_token:
            self.security_token = self.generate_security_token()
        
        # Set expiry if not set
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=48)
        
        # Recalculate totals
        self.calculate_totals()
        
        super().save(*args, **kwargs)
    
    def generate_security_token(self):
        """Generate a secure token for guest checkout access."""
        data = f"{self.id}{timezone.now().isoformat()}{settings.SECRET_KEY}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def calculate_totals(self):
        """Calculate and update all totals."""
        from apps.cart.services import CartService
        
        if self.cart:
            try:
                cart_summary = CartService.get_cart_summary(self.cart)
                self.subtotal = Decimal(str(cart_summary.get('subtotal', 0)))
                
                # Apply discount
                discount = Decimal(str(cart_summary.get('discount', 0)))
                if self.coupon and not cart_summary.get('coupon'):
                    discount = self.coupon.calculate_discount(self.subtotal)
                self.discount_amount = discount
                
                # Calculate tax
                taxable_amount = self.subtotal - self.discount_amount
                if self.tax_rate > 0 and not self.tax_included:
                    self.tax_amount = taxable_amount * (self.tax_rate / 100)
                
                # Calculate total
                self.total = (
                    self.subtotal 
                    - self.discount_amount 
                    + self.shipping_cost 
                    + self.tax_amount
                    + self.gift_wrap_cost
                )
            except Exception:
                pass
    
    @property
    def is_expired(self):
        """Check if session has expired."""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def is_active(self):
        """Check if session is still active."""
        return (
            not self.is_expired and 
            self.current_step not in [self.STEP_COMPLETE, self.STEP_ABANDONED, self.STEP_FAILED]
        )
    
    @property
    def has_email(self):
        """Check if email is set."""
        return bool(self.email or self.shipping_email)
    
    @property
    def customer_email(self):
        """Get customer email."""
        return self.email or self.shipping_email or (self.user.email if self.user else '')
    
    @property
    def can_proceed_to_information(self):
        """Check if we can proceed to information step."""
        return self.cart and self.cart.items.exists()
    
    @property
    def can_proceed_to_shipping(self):
        """Check if we can proceed to shipping step."""
        return (
            self.can_proceed_to_information and
            self.has_valid_contact_info and
            self.has_valid_shipping_address
        )
    
    @property
    def can_proceed_to_payment(self):
        """Check if we can proceed to payment step."""
        return (
            self.can_proceed_to_shipping and
            self.shipping_method and
            (self.shipping_method == self.SHIPPING_PICKUP or self.shipping_cost >= 0)
        )
    
    @property
    def can_proceed_to_review(self):
        """Check if we can proceed to review step."""
        return (
            self.can_proceed_to_payment and
            self.payment_method
        )
    
    @property
    def can_complete(self):
        """Check if checkout can be completed."""
        return self.can_proceed_to_review
    
    @property
    def has_valid_contact_info(self):
        """Check if contact information is valid."""
        return bool(
            self.customer_email and
            self.shipping_first_name and
            self.shipping_last_name
        )
    
    @property
    def has_valid_shipping_address(self):
        """Check if shipping address is complete."""
        if self.shipping_method == self.SHIPPING_PICKUP:
            return bool(self.pickup_location)
        
        return bool(
            self.shipping_address_line_1 and
            self.shipping_city and
            self.shipping_postal_code and
            self.shipping_country
        )
    
    @property
    def has_valid_billing_address(self):
        """Check if billing address is complete."""
        if self.billing_same_as_shipping:
            return self.has_valid_shipping_address
        
        return bool(
            self.billing_address_line_1 and
            self.billing_city and
            self.billing_postal_code and
            self.billing_country
        )
    
    @property
    def requires_payment(self):
        """Check if checkout requires online payment."""
        return self.payment_method not in [self.PAYMENT_COD, self.PAYMENT_BANK]
    
    @property
    def payment_ready(self):
        """Check if payment is set up."""
        if self.payment_method == self.PAYMENT_STRIPE:
            return bool(self.stripe_payment_intent_id)
        elif self.payment_method == self.PAYMENT_PAYPAL:
            return bool(self.paypal_order_id)
        elif self.payment_method == self.PAYMENT_BKASH:
            return bool(self.bkash_payment_id)
        elif self.payment_method == self.PAYMENT_NAGAD:
            return bool(self.nagad_payment_id)
        return True
    
    @property
    def step_progress(self):
        """Get checkout progress percentage."""
        completed = 0
        if self.information_completed:
            completed += 1
        if self.shipping_completed:
            completed += 1
        if self.payment_setup_completed:
            completed += 1
        if self.review_completed:
            completed += 1
        
        return int((completed / 4) * 100)
    
    def get_shipping_address_dict(self):
        """Get shipping address as dictionary."""
        return {
            'first_name': self.shipping_first_name,
            'last_name': self.shipping_last_name,
            'full_name': f"{self.shipping_first_name} {self.shipping_last_name}".strip(),
            'company': self.shipping_company,
            'email': self.shipping_email or self.email,
            'phone': self.shipping_phone,
            'address_line_1': self.shipping_address_line_1,
            'address_line_2': self.shipping_address_line_2,
            'city': self.shipping_city,
            'state': self.shipping_state,
            'postal_code': self.shipping_postal_code,
            'country': self.shipping_country,
        }
    
    def get_billing_address_dict(self):
        """Get billing address as dictionary."""
        if self.billing_same_as_shipping:
            addr = self.get_shipping_address_dict()
            addr.pop('email', None)
            addr.pop('phone', None)
            return addr
        
        return {
            'first_name': self.billing_first_name,
            'last_name': self.billing_last_name,
            'full_name': f"{self.billing_first_name} {self.billing_last_name}".strip(),
            'company': self.billing_company,
            'address_line_1': self.billing_address_line_1,
            'address_line_2': self.billing_address_line_2,
            'city': self.billing_city,
            'state': self.billing_state,
            'postal_code': self.billing_postal_code,
            'country': self.billing_country,
        }
    
    def get_formatted_shipping_address(self):
        """Get formatted shipping address for display."""
        addr = self.get_shipping_address_dict()
        lines = [addr['full_name']]
        
        if addr.get('company'):
            lines.append(addr['company'])
        
        lines.append(addr['address_line_1'])
        
        if addr.get('address_line_2'):
            lines.append(addr['address_line_2'])
        
        city_line = addr['city']
        if addr.get('state'):
            city_line += f", {addr['state']}"
        city_line += f" {addr['postal_code']}"
        lines.append(city_line)
        
        lines.append(addr['country'])
        
        if addr.get('phone'):
            lines.append(addr['phone'])
        
        return '\n'.join(lines)
    
    def extend_expiry(self, hours=24):
        """Extend session expiry time."""
        self.expires_at = timezone.now() + timezone.timedelta(hours=hours)
        self.save(update_fields=['expires_at', 'updated_at'])
    
    def mark_abandoned(self, reason=''):
        """Mark session as abandoned."""
        self.current_step = self.STEP_ABANDONED
        self.failure_reason = reason
        self.save(update_fields=['current_step', 'failure_reason', 'updated_at'])
    
    def mark_failed(self, reason=''):
        """Mark session as failed."""
        self.current_step = self.STEP_FAILED
        self.failure_reason = reason
        self.retry_count += 1
        self.save(update_fields=['current_step', 'failure_reason', 'retry_count', 'updated_at'])



class CheckoutEvent(models.Model):
    """
    Track checkout events for analytics and debugging.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    checkout_session = models.ForeignKey(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name='events'
    )
    
    # Event type
    EVENT_STARTED = 'checkout_started'
    EVENT_STEP_VIEWED = 'step_viewed'
    EVENT_STEP_COMPLETED = 'step_completed'
    EVENT_SHIPPING_SELECTED = 'shipping_selected'
    EVENT_PAYMENT_SELECTED = 'payment_selected'
    EVENT_COUPON_APPLIED = 'coupon_applied'
    EVENT_COUPON_REMOVED = 'coupon_removed'
    EVENT_PAYMENT_STARTED = 'payment_started'
    EVENT_PAYMENT_COMPLETED = 'payment_completed'
    EVENT_PAYMENT_FAILED = 'payment_failed'
    EVENT_ORDER_CREATED = 'order_created'
    EVENT_ABANDONED = 'abandoned'
    EVENT_ERROR = 'error'
    EVENT_CHOICES = [
        (EVENT_STARTED, 'Checkout Started'),
        (EVENT_STEP_VIEWED, 'Step Viewed'),
        (EVENT_STEP_COMPLETED, 'Step Completed'),
        (EVENT_SHIPPING_SELECTED, 'Shipping Selected'),
        (EVENT_PAYMENT_SELECTED, 'Payment Selected'),
        (EVENT_COUPON_APPLIED, 'Coupon Applied'),
        (EVENT_COUPON_REMOVED, 'Coupon Removed'),
        (EVENT_PAYMENT_STARTED, 'Payment Started'),
        (EVENT_PAYMENT_COMPLETED, 'Payment Completed'),
        (EVENT_PAYMENT_FAILED, 'Payment Failed'),
        (EVENT_ORDER_CREATED, 'Order Created'),
        (EVENT_ABANDONED, 'Abandoned'),
        (EVENT_ERROR, 'Error'),
    ]
    event_type = models.CharField(max_length=50, choices=EVENT_CHOICES)
    
    # Event data
    step = models.CharField(max_length=20, blank=True)
    data = models.JSONField(default=dict, blank=True)
    
    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Checkout Event'
        verbose_name_plural = 'Checkout Events'
        indexes = [
            models.Index(fields=['checkout_session', '-created_at']),
            models.Index(fields=['event_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_event_type_display()} - {self.checkout_session_id}"


class AbandonedCheckout(models.Model):
    """
    Track abandoned checkouts for recovery campaigns.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    checkout_session = models.OneToOneField(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name='abandoned_record'
    )
    
    # Customer info
    email = models.EmailField(db_index=True)
    first_name = models.CharField(max_length=100, blank=True)
    
    # Cart snapshot
    cart_items = models.JSONField(default=list)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='BDT')
    
    # Abandonment details
    abandoned_at_step = models.CharField(max_length=20)
    abandoned_at = models.DateTimeField(auto_now_add=True)
    
    # Recovery
    recovery_emails_sent = models.PositiveIntegerField(default=0)
    last_recovery_email_at = models.DateTimeField(null=True, blank=True)
    recovery_link = models.URLField(blank=True)
    recovery_token = models.CharField(max_length=64, unique=True, blank=True)
    
    # Conversion
    is_recovered = models.BooleanField(default=False)
    recovered_at = models.DateTimeField(null=True, blank=True)
    recovered_order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recovery_source'
    )
    
    # Status
    is_contacted = models.BooleanField(default=False)
    is_opted_out = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-abandoned_at']
        verbose_name = 'Abandoned Checkout'
        verbose_name_plural = 'Abandoned Checkouts'
        indexes = [
            models.Index(fields=['email', '-abandoned_at']),
            models.Index(fields=['is_recovered', '-abandoned_at']),
        ]
    
    def __str__(self):
        return f"Abandoned: {self.email} - {self.subtotal}"
    
    def save(self, *args, **kwargs):
        if not self.recovery_token:
            self.recovery_token = hashlib.sha256(
                f"{self.id}{timezone.now().isoformat()}{settings.SECRET_KEY}".encode()
            ).hexdigest()
        super().save(*args, **kwargs)
