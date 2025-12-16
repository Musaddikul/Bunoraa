"""
Currency Services
"""
from decimal import Decimal, ROUND_HALF_UP
from django.db import models
from django.utils import timezone
from django.core.cache import cache

from .models import Currency, ExchangeRate, ExchangeRateHistory, UserCurrencyPreference, CurrencySettings


class CurrencyService:
    """Service for currency operations."""
    
    CACHE_TIMEOUT = 3600  # 1 hour
    
    @staticmethod
    def get_default_currency():
        """Get the default currency."""
        cache_key = 'default_currency'
        currency = cache.get(cache_key)
        
        if currency is None:
            currency = Currency.objects.filter(is_default=True).first()
            if not currency:
                currency = Currency.objects.filter(is_active=True).first()
            if currency:
                cache.set(cache_key, currency, CurrencyService.CACHE_TIMEOUT)
        
        return currency
    
    @staticmethod
    def get_active_currencies():
        """Get all active currencies."""
        cache_key = 'active_currencies'
        currencies = cache.get(cache_key)
        
        if currencies is None:
            currencies = list(Currency.objects.filter(is_active=True))
            cache.set(cache_key, currencies, CurrencyService.CACHE_TIMEOUT)
        
        return currencies
    
    @staticmethod
    def get_currency_by_code(code):
        """Get currency by code."""
        cache_key = f'currency_{code}'
        currency = cache.get(cache_key)
        
        if currency is None:
            currency = Currency.objects.filter(code=code.upper(), is_active=True).first()
            if currency:
                cache.set(cache_key, currency, CurrencyService.CACHE_TIMEOUT)
        
        return currency
    
    @staticmethod
    def get_user_currency(user=None, request=None):
        """Get currency for a user or request."""
        # Check user preference
        if user and user.is_authenticated:
            pref = UserCurrencyPreference.objects.filter(user=user).select_related('currency').first()
            if pref and pref.currency and not pref.auto_detect:
                return pref.currency
        
        # Check session
        if request and hasattr(request, 'session'):
            currency_code = request.session.get('currency_code')
            if currency_code:
                currency = CurrencyService.get_currency_by_code(currency_code)
                if currency:
                    return currency
        
        # Check cookie
        if request and hasattr(request, 'COOKIES'):
            currency_code = request.COOKIES.get('currency')
            if currency_code:
                currency = CurrencyService.get_currency_by_code(currency_code)
                if currency:
                    return currency
        
        # Auto-detect from location
        if request:
            currency = CurrencyService._detect_from_location(request)
            if currency:
                return currency
        
        # Fall back to default
        return CurrencyService.get_default_currency()
    
    @staticmethod
    def _detect_from_location(request):
        """Detect currency from request location."""
        # Country to currency mapping
        COUNTRY_CURRENCIES = {
            'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'AU': 'AUD',
            'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
            'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'IE': 'EUR',
            'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'BR': 'BRL',
            'MX': 'MXN', 'KR': 'KRW', 'SG': 'SGD', 'HK': 'HKD',
            'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
            'NZ': 'NZD', 'ZA': 'ZAR', 'AE': 'AED', 'SA': 'SAR',
        }
        
        # Try to get country from various headers
        country_code = None
        
        # CloudFlare
        if not country_code:
            country_code = request.META.get('HTTP_CF_IPCOUNTRY')
        
        # AWS CloudFront
        if not country_code:
            country_code = request.META.get('HTTP_CLOUDFRONT_VIEWER_COUNTRY')
        
        # GeoIP header
        if not country_code:
            country_code = request.META.get('HTTP_X_COUNTRY_CODE')
        
        if country_code and country_code in COUNTRY_CURRENCIES:
            return CurrencyService.get_currency_by_code(COUNTRY_CURRENCIES[country_code])
        
        return None
    
    @staticmethod
    def set_user_currency(user, currency_code, auto_detect=False):
        """Set user's preferred currency."""
        currency = CurrencyService.get_currency_by_code(currency_code)
        if not currency:
            return None
        
        pref, _ = UserCurrencyPreference.objects.get_or_create(user=user)
        pref.currency = currency
        pref.auto_detect = auto_detect
        pref.save()
        
        return pref


class ExchangeRateService:
    """Service for exchange rate operations."""
    
    CACHE_TIMEOUT = 300  # 5 minutes
    
    @staticmethod
    def get_exchange_rate(from_currency, to_currency):
        """Get current exchange rate between two currencies."""
        if from_currency.id == to_currency.id:
            return Decimal('1')
        
        cache_key = f'exchange_rate_{from_currency.code}_{to_currency.code}'
        rate = cache.get(cache_key)
        
        if rate is None:
            # Try direct rate
            rate_obj = ExchangeRate.objects.filter(
                from_currency=from_currency,
                to_currency=to_currency,
                is_active=True,
                valid_from__lte=timezone.now()
            ).filter(
                models.Q(valid_until__isnull=True) | 
                models.Q(valid_until__gte=timezone.now())
            ).order_by('-valid_from').first()
            
            if rate_obj:
                rate = rate_obj.rate
            else:
                # Try inverse rate
                inverse = ExchangeRate.objects.filter(
                    from_currency=to_currency,
                    to_currency=from_currency,
                    is_active=True,
                    valid_from__lte=timezone.now()
                ).filter(
                    models.Q(valid_until__isnull=True) | 
                    models.Q(valid_until__gte=timezone.now())
                ).order_by('-valid_from').first()
                
                if inverse:
                    rate = Decimal('1') / inverse.rate
                else:
                    # Try via base currency (USD)
                    rate = ExchangeRateService._get_rate_via_base(from_currency, to_currency)
            
            if rate:
                cache.set(cache_key, rate, ExchangeRateService.CACHE_TIMEOUT)
        
        return rate
    
    @staticmethod
    def _get_rate_via_base(from_currency, to_currency):
        """Calculate rate via base currency."""
        from django.db import models
        
        base_code = 'USD'
        base = Currency.objects.filter(code=base_code).first()
        
        if not base:
            return None
        
        # Get from_currency -> USD rate
        now = timezone.now()
        from_to_base = ExchangeRate.objects.filter(
            from_currency=from_currency,
            to_currency=base,
            is_active=True,
            valid_from__lte=now
        ).filter(
            models.Q(valid_until__isnull=True) | 
            models.Q(valid_until__gte=now)
        ).order_by('-valid_from').first()
        
        if not from_to_base:
            # Try inverse
            base_to_from = ExchangeRate.objects.filter(
                from_currency=base,
                to_currency=from_currency,
                is_active=True,
                valid_from__lte=now
            ).filter(
                models.Q(valid_until__isnull=True) | 
                models.Q(valid_until__gte=now)
            ).order_by('-valid_from').first()
            
            if base_to_from:
                from_to_base_rate = Decimal('1') / base_to_from.rate
            else:
                return None
        else:
            from_to_base_rate = from_to_base.rate
        
        # Get USD -> to_currency rate
        base_to_target = ExchangeRate.objects.filter(
            from_currency=base,
            to_currency=to_currency,
            is_active=True,
            valid_from__lte=now
        ).filter(
            models.Q(valid_until__isnull=True) | 
            models.Q(valid_until__gte=now)
        ).order_by('-valid_from').first()
        
        if not base_to_target:
            # Try inverse
            target_to_base = ExchangeRate.objects.filter(
                from_currency=to_currency,
                to_currency=base,
                is_active=True,
                valid_from__lte=now
            ).filter(
                models.Q(valid_until__isnull=True) | 
                models.Q(valid_until__gte=now)
            ).order_by('-valid_from').first()
            
            if target_to_base:
                base_to_target_rate = Decimal('1') / target_to_base.rate
            else:
                return None
        else:
            base_to_target_rate = base_to_target.rate
        
        return from_to_base_rate * base_to_target_rate
    
    @staticmethod
    def set_exchange_rate(from_currency, to_currency, rate, source='manual'):
        """Set exchange rate."""
        now = timezone.now()
        
        # Deactivate old rates
        ExchangeRate.objects.filter(
            from_currency=from_currency,
            to_currency=to_currency,
            is_active=True
        ).update(is_active=False, valid_until=now)
        
        # Create new rate
        exchange_rate = ExchangeRate.objects.create(
            from_currency=from_currency,
            to_currency=to_currency,
            rate=Decimal(str(rate)),
            source=source,
            valid_from=now
        )
        
        # Record history
        ExchangeRateHistory.objects.create(
            from_currency=from_currency,
            to_currency=to_currency,
            rate=Decimal(str(rate)),
            date=now.date(),
            source=source
        )
        
        # Clear cache
        cache.delete(f'exchange_rate_{from_currency.code}_{to_currency.code}')
        
        return exchange_rate


class CurrencyConversionService:
    """Service for converting amounts between currencies."""
    
    @staticmethod
    def convert(amount, from_currency, to_currency, round_result=True):
        """Convert an amount from one currency to another."""
        if from_currency.id == to_currency.id:
            return Decimal(str(amount))
        
        rate = ExchangeRateService.get_exchange_rate(from_currency, to_currency)
        
        if rate is None:
            raise ValueError(f"No exchange rate available for {from_currency.code} to {to_currency.code}")
        
        converted = Decimal(str(amount)) * rate
        
        if round_result:
            converted = CurrencyConversionService._apply_rounding(converted, to_currency)
        
        return converted
    
    @staticmethod
    def _apply_rounding(amount, currency):
        """Apply rounding based on currency settings."""
        settings = CurrencySettings.get_settings()
        method = settings.rounding_method
        
        if method == 'none':
            return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        elif method == 'nearest_cent':
            return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        elif method == 'nearest_99':
            integer = int(amount)
            return Decimal(f'{integer}.99')
        elif method == 'nearest_95':
            integer = int(amount)
            return Decimal(f'{integer}.95')
        elif method == 'nearest_integer':
            return amount.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        
        return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @staticmethod
    def convert_by_code(amount, from_code, to_code, round_result=True):
        """Convert amount using currency codes."""
        from_currency = CurrencyService.get_currency_by_code(from_code)
        to_currency = CurrencyService.get_currency_by_code(to_code)
        
        if not from_currency:
            raise ValueError(f"Currency not found: {from_code}")
        if not to_currency:
            raise ValueError(f"Currency not found: {to_code}")
        
        return CurrencyConversionService.convert(amount, from_currency, to_currency, round_result)
    
    @staticmethod
    def format_price(amount, currency, include_symbol=True):
        """Format a price in a specific currency."""
        if include_symbol:
            return currency.format_amount(amount)
        
        # Format without symbol
        from decimal import ROUND_HALF_UP
        amount = Decimal(str(amount)).quantize(
            Decimal('0.01') if currency.decimal_places == 2 else Decimal('1'),
            rounding=ROUND_HALF_UP
        )
        
        parts = str(amount).split('.')
        integer_part = parts[0]
        decimal_part = parts[1] if len(parts) > 1 else '00'
        
        if currency.thousand_separator:
            integer_part = currency.thousand_separator.join(
                [integer_part[max(i, 0):i + 3] for i in range(len(integer_part) - 3, -3, -3)][::-1]
            )
        
        if currency.decimal_places > 0:
            return f"{integer_part}{currency.decimal_separator}{decimal_part[:currency.decimal_places]}"
        return integer_part


class ExchangeRateUpdateService:
    """Service for updating exchange rates from external APIs."""
    
    @staticmethod
    def update_rates():
        """Update exchange rates from configured provider."""
        settings = CurrencySettings.get_settings()
        
        if not settings.auto_update_rates:
            return 0
        
        provider = settings.exchange_rate_provider
        
        if provider == 'openexchange':
            return ExchangeRateUpdateService._update_from_openexchange(settings.api_key)
        elif provider == 'fixer':
            return ExchangeRateUpdateService._update_from_fixer(settings.api_key)
        elif provider == 'ecb':
            return ExchangeRateUpdateService._update_from_ecb()
        
        return 0
    
    @staticmethod
    def _update_from_openexchange(api_key):
        """Update rates from Open Exchange Rates."""
        import requests
        
        if not api_key:
            return 0
        
        try:
            response = requests.get(
                f'https://openexchangerates.org/api/latest.json?app_id={api_key}',
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            rates = data.get('rates', {})
            base_currency = Currency.objects.filter(code='USD').first()
            
            if not base_currency:
                return 0
            
            count = 0
            for code, rate in rates.items():
                target = Currency.objects.filter(code=code, is_active=True).first()
                if target and target.id != base_currency.id:
                    ExchangeRateService.set_exchange_rate(
                        base_currency, target, rate, source='openexchange'
                    )
                    count += 1
            
            # Update last rate update timestamp
            settings = CurrencySettings.get_settings()
            settings.last_rate_update = timezone.now()
            settings.save(update_fields=['last_rate_update'])
            
            return count
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error updating rates from Open Exchange: {e}")
            return 0
    
    @staticmethod
    def _update_from_fixer(api_key):
        """Update rates from Fixer.io."""
        import requests
        
        if not api_key:
            return 0
        
        try:
            response = requests.get(
                f'http://data.fixer.io/api/latest?access_key={api_key}',
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                return 0
            
            rates = data.get('rates', {})
            base_code = data.get('base', 'EUR')
            base_currency = Currency.objects.filter(code=base_code).first()
            
            if not base_currency:
                return 0
            
            count = 0
            for code, rate in rates.items():
                target = Currency.objects.filter(code=code, is_active=True).first()
                if target and target.id != base_currency.id:
                    ExchangeRateService.set_exchange_rate(
                        base_currency, target, rate, source='fixer'
                    )
                    count += 1
            
            settings = CurrencySettings.get_settings()
            settings.last_rate_update = timezone.now()
            settings.save(update_fields=['last_rate_update'])
            
            return count
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error updating rates from Fixer: {e}")
            return 0
    
    @staticmethod
    def _update_from_ecb():
        """Update rates from European Central Bank."""
        import requests
        import xml.etree.ElementTree as ET
        
        try:
            response = requests.get(
                'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
                timeout=30
            )
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            ns = {'gesmes': 'http://www.gesmes.org/xml/2002-08-01',
                  'eurofxref': 'http://www.ecb.int/vocabulary/2002-08-01/eurofxref'}
            
            base_currency = Currency.objects.filter(code='EUR').first()
            if not base_currency:
                return 0
            
            count = 0
            for cube in root.findall('.//eurofxref:Cube[@currency]', ns):
                code = cube.get('currency')
                rate = Decimal(cube.get('rate'))
                
                target = Currency.objects.filter(code=code, is_active=True).first()
                if target:
                    ExchangeRateService.set_exchange_rate(
                        base_currency, target, rate, source='ecb'
                    )
                    count += 1
            
            settings = CurrencySettings.get_settings()
            settings.last_rate_update = timezone.now()
            settings.save(update_fields=['last_rate_update'])
            
            return count
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error updating rates from ECB: {e}")
            return 0
