"""
Currency Models
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone


class Currency(models.Model):
    """
    Currency model for multi-currency support.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=3, unique=True, help_text="ISO 4217 currency code (e.g., USD, EUR)")
    name = models.CharField(max_length=100, help_text="Currency name (e.g., US Dollar)")
    symbol = models.CharField(max_length=10, help_text="Currency symbol (e.g., $, €)")
    
    # Display settings
    decimal_places = models.PositiveSmallIntegerField(default=2)
    symbol_position = models.CharField(
        max_length=10,
        choices=[
            ('before', 'Before amount'),
            ('after', 'After amount'),
        ],
        default='before'
    )
    thousand_separator = models.CharField(max_length=5, default=',')
    decimal_separator = models.CharField(max_length=5, default='.')
    
    # Status
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    # Sorting
    sort_order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'code']
        verbose_name = 'Currency'
        verbose_name_plural = 'Currencies'
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default currency
        if self.is_default:
            Currency.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
    
    def format_amount(self, amount):
        """Format an amount in this currency."""
        from decimal import Decimal, ROUND_HALF_UP
        
        amount = Decimal(str(amount)).quantize(
            Decimal('0.01') if self.decimal_places == 2 else Decimal('1'),
            rounding=ROUND_HALF_UP
        )
        
        # Format number
        parts = str(amount).split('.')
        integer_part = parts[0]
        decimal_part = parts[1] if len(parts) > 1 else '00'
        
        # Add thousand separators
        if self.thousand_separator:
            integer_part = self._add_thousand_separators(integer_part)
        
        # Combine with decimal
        if self.decimal_places > 0:
            formatted = f"{integer_part}{self.decimal_separator}{decimal_part[:self.decimal_places]}"
        else:
            formatted = integer_part
        
        # Add symbol
        if self.symbol_position == 'before':
            return f"{self.symbol}{formatted}"
        return f"{formatted} {self.symbol}"
    
    def _add_thousand_separators(self, s):
        """Add thousand separators to a number string."""
        return self.thousand_separator.join(
            [s[max(i, 0):i + 3] for i in range(len(s) - 3, -3, -3)][::-1]
        )


class ExchangeRate(models.Model):
    """
    Exchange rate for currency conversion.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='rates_from'
    )
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='rates_to'
    )
    rate = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0.00000001'))],
        help_text="Exchange rate"
    )
    
    # Source tracking
    source = models.CharField(
        max_length=50,
        choices=[
            ('manual', 'Manual'),
            ('api', 'API'),
            ('ecb', 'European Central Bank'),
            ('openexchange', 'Open Exchange Rates'),
            ('fixer', 'Fixer.io'),
        ],
        default='manual'
    )
    
    # Validity
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-valid_from']
        unique_together = ['from_currency', 'to_currency', 'valid_from']
        verbose_name = 'Exchange Rate'
        verbose_name_plural = 'Exchange Rates'
    
    def __str__(self):
        return f"{self.from_currency.code} → {self.to_currency.code}: {self.rate}"
    
    @property
    def is_valid(self):
        """Check if rate is currently valid."""
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        return True
    
    @property
    def inverse_rate(self):
        """Get the inverse rate."""
        if self.rate:
            return Decimal('1') / self.rate
        return None


class ExchangeRateHistory(models.Model):
    """
    Historical exchange rates for analytics.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='history_from'
    )
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='history_to'
    )
    rate = models.DecimalField(max_digits=18, decimal_places=8)
    date = models.DateField()
    source = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['from_currency', 'to_currency', 'date']
        verbose_name = 'Exchange Rate History'
        verbose_name_plural = 'Exchange Rate History'
    
    def __str__(self):
        return f"{self.from_currency.code} → {self.to_currency.code}: {self.rate} ({self.date})"


class UserCurrencyPreference(models.Model):
    """
    User's preferred currency setting.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='currency_preference'
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.SET_NULL,
        null=True,
        related_name='user_preferences'
    )
    
    # Auto-detect settings
    auto_detect = models.BooleanField(
        default=True,
        help_text="Automatically detect currency from location"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Currency Preference'
        verbose_name_plural = 'User Currency Preferences'
    
    def __str__(self):
        return f"{self.user.email} - {self.currency.code if self.currency else 'Auto'}"


class CurrencySettings(models.Model):
    """
    Global currency settings (singleton).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Default currency
    default_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name='+'
    )
    
    # API settings
    auto_update_rates = models.BooleanField(default=True)
    update_frequency_hours = models.PositiveIntegerField(default=24)
    exchange_rate_provider = models.CharField(
        max_length=50,
        choices=[
            ('manual', 'Manual'),
            ('openexchange', 'Open Exchange Rates'),
            ('fixer', 'Fixer.io'),
            ('ecb', 'European Central Bank'),
        ],
        default='manual'
    )
    api_key = models.CharField(max_length=255, blank=True)
    
    # Display settings
    show_currency_selector = models.BooleanField(default=True)
    show_original_price = models.BooleanField(
        default=False,
        help_text="Show original price alongside converted price"
    )
    
    # Rounding
    rounding_method = models.CharField(
        max_length=20,
        choices=[
            ('none', 'No rounding'),
            ('nearest_cent', 'Nearest cent'),
            ('nearest_99', 'Nearest .99'),
            ('nearest_95', 'Nearest .95'),
            ('nearest_integer', 'Nearest whole number'),
        ],
        default='nearest_cent'
    )
    
    # Timestamps
    last_rate_update = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Currency Settings'
        verbose_name_plural = 'Currency Settings'
    
    def __str__(self):
        return "Currency Settings"
    
    def save(self, *args, **kwargs):
        # Ensure singleton
        if not self.pk and CurrencySettings.objects.exists():
            raise ValueError("Only one CurrencySettings instance allowed")
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the settings instance."""
        try:
            return cls.objects.first() or cls._create_default()
        except:
            return cls._create_default()
    
    @classmethod
    def _create_default(cls):
        """Create default settings."""
        # Ensure default currency exists
        default_currency, _ = Currency.objects.get_or_create(
            code='USD',
            defaults={
                'name': 'US Dollar',
                'symbol': '$',
                'is_default': True
            }
        )
        
        return cls.objects.create(default_currency=default_currency)
