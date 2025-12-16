"""
Checkout models
"""
import uuid
from django.db import models
from django.conf import settings


class CheckoutSession(models.Model):
    """
    Temporary checkout session that holds checkout state
    before order is created.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
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
    
    # Shipping address
    shipping_first_name = models.CharField(max_length=100, blank=True)
    shipping_last_name = models.CharField(max_length=100, blank=True)
    shipping_email = models.EmailField(blank=True)
    shipping_phone = models.CharField(max_length=20, blank=True)
    shipping_address_line_1 = models.CharField(max_length=255, blank=True)
    shipping_address_line_2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100, blank=True)
    shipping_state = models.CharField(max_length=100, blank=True)
    shipping_postal_code = models.CharField(max_length=20, blank=True)
    shipping_country = models.CharField(max_length=100, default='United States')
    
    # Billing address (if different)
    billing_same_as_shipping = models.BooleanField(default=True)
    billing_first_name = models.CharField(max_length=100, blank=True)
    billing_last_name = models.CharField(max_length=100, blank=True)
    billing_address_line_1 = models.CharField(max_length=255, blank=True)
    billing_address_line_2 = models.CharField(max_length=255, blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_postal_code = models.CharField(max_length=20, blank=True)
    billing_country = models.CharField(max_length=100, default='United States')
    
    # Shipping method
    SHIPPING_STANDARD = 'standard'
    SHIPPING_EXPRESS = 'express'
    SHIPPING_OVERNIGHT = 'overnight'
    SHIPPING_CHOICES = [
        (SHIPPING_STANDARD, 'Standard Shipping (5-7 days)'),
        (SHIPPING_EXPRESS, 'Express Shipping (2-3 days)'),
        (SHIPPING_OVERNIGHT, 'Overnight Shipping'),
    ]
    shipping_method = models.CharField(
        max_length=20,
        choices=SHIPPING_CHOICES,
        default=SHIPPING_STANDARD
    )
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Payment
    PAYMENT_STRIPE = 'stripe'
    PAYMENT_PAYPAL = 'paypal'
    PAYMENT_CHOICES = [
        (PAYMENT_STRIPE, 'Credit Card (Stripe)'),
        (PAYMENT_PAYPAL, 'PayPal'),
    ]
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default=PAYMENT_STRIPE
    )
    
    # Stripe payment intent
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_client_secret = models.CharField(max_length=255, blank=True)
    
    # Order notes
    order_notes = models.TextField(blank=True)
    
    # Status
    STEP_CART = 'cart'
    STEP_SHIPPING = 'shipping'
    STEP_PAYMENT = 'payment'
    STEP_REVIEW = 'review'
    STEP_COMPLETE = 'complete'
    STEP_CHOICES = [
        (STEP_CART, 'Cart Review'),
        (STEP_SHIPPING, 'Shipping Information'),
        (STEP_PAYMENT, 'Payment'),
        (STEP_REVIEW, 'Review Order'),
        (STEP_COMPLETE, 'Complete'),
    ]
    current_step = models.CharField(
        max_length=20,
        choices=STEP_CHOICES,
        default=STEP_CART
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Checkout Session'
        verbose_name_plural = 'Checkout Sessions'
    
    def __str__(self):
        if self.user:
            return f"Checkout for {self.user.email}"
        return f"Checkout session {self.id}"
    
    @property
    def is_expired(self):
        """Check if session has expired."""
        from django.utils import timezone
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def can_proceed_to_shipping(self):
        """Check if we can proceed to shipping step."""
        return self.cart and self.cart.items.exists()
    
    @property
    def can_proceed_to_payment(self):
        """Check if we can proceed to payment step."""
        return (
            self.can_proceed_to_shipping and
            self.shipping_first_name and
            self.shipping_last_name and
            self.shipping_address_line_1 and
            self.shipping_city and
            self.shipping_postal_code and
            self.shipping_country
        )
    
    @property
    def can_proceed_to_review(self):
        """Check if we can proceed to review step."""
        return (
            self.can_proceed_to_payment and
            self.payment_method
        )
    
    def get_shipping_address_dict(self):
        """Get shipping address as dictionary."""
        return {
            'first_name': self.shipping_first_name,
            'last_name': self.shipping_last_name,
            'email': self.shipping_email,
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
            return self.get_shipping_address_dict()
        
        return {
            'first_name': self.billing_first_name,
            'last_name': self.billing_last_name,
            'address_line_1': self.billing_address_line_1,
            'address_line_2': self.billing_address_line_2,
            'city': self.billing_city,
            'state': self.billing_state,
            'postal_code': self.billing_postal_code,
            'country': self.billing_country,
        }


class ShippingRate(models.Model):
    """
    Shipping rate configuration.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    
    # Pricing
    base_rate = models.DecimalField(max_digits=10, decimal_places=2)
    per_item_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    free_shipping_threshold = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True,
        help_text="Order subtotal for free shipping"
    )
    
    # Delivery time
    min_delivery_days = models.PositiveIntegerField(default=5)
    max_delivery_days = models.PositiveIntegerField(default=7)
    
    # Status
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Shipping Rate'
        verbose_name_plural = 'Shipping Rates'
    
    def __str__(self):
        return self.name
    
    def calculate_cost(self, subtotal, item_count):
        """Calculate shipping cost for given order."""
        # Check free shipping threshold
        if self.free_shipping_threshold and subtotal >= self.free_shipping_threshold:
            return 0
        
        return self.base_rate + (self.per_item_rate * item_count)
    
    @property
    def delivery_estimate(self):
        """Get delivery estimate string."""
        if self.min_delivery_days == self.max_delivery_days:
            return f"{self.min_delivery_days} days"
        return f"{self.min_delivery_days}-{self.max_delivery_days} days"
