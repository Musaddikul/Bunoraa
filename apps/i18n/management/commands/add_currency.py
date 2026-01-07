"""
Management command to add currencies with exchange rates.
Adapted for Bunoraa i18n app.

Usage:
    python manage.py add_currency GBP "British Pound" "£"
    python manage.py add_currency --auto  # Fetch all rates from fixer.io
    python manage.py add_currency --add-common  # Add all common currencies
    python manage.py add_currency --list  # List available currencies
"""
import requests
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from apps.i18n.models import Currency, ExchangeRate


# Common currencies with their details
# Format: code -> (name, symbol, native_symbol, decimal_places, symbol_position, number_system)
COMMON_CURRENCIES = {
    # South Asian currencies (primary markets)
    'BDT': ('Bangladeshi Taka', '৳', '৳', 2, 'before', 'bengali'),
    'INR': ('Indian Rupee', '₹', '₹', 2, 'before', 'indian'),
    'PKR': ('Pakistani Rupee', 'Rs', '₨', 2, 'before', 'indian'),
    'NPR': ('Nepalese Rupee', 'Rs', 'रू', 2, 'before', 'indian'),
    'LKR': ('Sri Lankan Rupee', 'Rs', 'රු', 2, 'before', 'western'),
    
    # Major world currencies
    'USD': ('US Dollar', '$', '$', 2, 'before', 'western'),
    'EUR': ('Euro', '€', '€', 2, 'before', 'western'),
    'GBP': ('British Pound', '£', '£', 2, 'before', 'western'),
    'JPY': ('Japanese Yen', '¥', '¥', 0, 'before', 'western'),
    'CAD': ('Canadian Dollar', 'C$', 'C$', 2, 'before', 'western'),
    'AUD': ('Australian Dollar', 'A$', 'A$', 2, 'before', 'western'),
    'CHF': ('Swiss Franc', 'CHF', 'CHF', 2, 'before', 'western'),
    'CNY': ('Chinese Yuan', '¥', '¥', 2, 'before', 'western'),
    
    # Southeast Asian currencies
    'SGD': ('Singapore Dollar', 'S$', 'S$', 2, 'before', 'western'),
    'MYR': ('Malaysian Ringgit', 'RM', 'RM', 2, 'before', 'western'),
    'THB': ('Thai Baht', '฿', '฿', 2, 'before', 'western'),
    'PHP': ('Philippine Peso', '₱', '₱', 2, 'before', 'western'),
    'IDR': ('Indonesian Rupiah', 'Rp', 'Rp', 0, 'before', 'western'),
    'VND': ('Vietnamese Dong', '₫', '₫', 0, 'after', 'western'),
    
    # Middle Eastern currencies
    'AED': ('UAE Dirham', 'AED', 'د.إ', 2, 'after', 'western'),
    'SAR': ('Saudi Riyal', 'SAR', '﷼', 2, 'after', 'western'),
    'QAR': ('Qatari Riyal', 'QAR', '﷼', 2, 'after', 'western'),
    'KWD': ('Kuwaiti Dinar', 'KD', 'د.ك', 3, 'before', 'western'),
    'BHD': ('Bahraini Dinar', 'BD', '.د.ب', 3, 'before', 'western'),
    'OMR': ('Omani Rial', 'OMR', '﷼', 3, 'before', 'western'),
    
    # Other currencies
    'HKD': ('Hong Kong Dollar', 'HK$', 'HK$', 2, 'before', 'western'),
    'KRW': ('South Korean Won', '₩', '₩', 0, 'before', 'western'),
    'NZD': ('New Zealand Dollar', 'NZ$', 'NZ$', 2, 'before', 'western'),
    'SEK': ('Swedish Krona', 'kr', 'kr', 2, 'after', 'western'),
    'NOK': ('Norwegian Krone', 'kr', 'kr', 2, 'after', 'western'),
    'DKK': ('Danish Krone', 'kr', 'kr', 2, 'after', 'western'),
    'ZAR': ('South African Rand', 'R', 'R', 2, 'before', 'western'),
    'RUB': ('Russian Ruble', '₽', '₽', 2, 'after', 'western'),
    'BRL': ('Brazilian Real', 'R$', 'R$', 2, 'before', 'western'),
    'MXN': ('Mexican Peso', '$', '$', 2, 'before', 'western'),
    'TRY': ('Turkish Lira', '₺', '₺', 2, 'before', 'western'),
    'PLN': ('Polish Zloty', 'zł', 'zł', 2, 'after', 'western'),
    'TWD': ('Taiwan Dollar', 'NT$', 'NT$', 2, 'before', 'western'),
    'EGP': ('Egyptian Pound', 'E£', 'ج.م', 2, 'before', 'western'),
    'NGN': ('Nigerian Naira', '₦', '₦', 2, 'before', 'western'),
}


class Command(BaseCommand):
    help = 'Add currencies with exchange rates'

    def add_arguments(self, parser):
        parser.add_argument('code', nargs='?', type=str, help='Currency code (e.g., GBP)')
        parser.add_argument('name', nargs='?', type=str, help='Currency name (e.g., "British Pound")')
        parser.add_argument('symbol', nargs='?', type=str, help='Currency symbol (e.g., £)')
        parser.add_argument('--rate', type=float, help='Exchange rate from base currency')
        parser.add_argument('--auto', action='store_true', help='Auto-fetch rates from exchange rate API')
        parser.add_argument('--list', action='store_true', help='List all available currencies')
        parser.add_argument('--add-common', action='store_true', help='Add all common currencies')
        parser.add_argument('--base', type=str, default='BDT', help='Base currency code (default: BDT)')

    def handle(self, *args, **options):
        if options['list']:
            self.list_currencies()
            return

        if options['auto']:
            self.auto_fetch_rates(options['base'])
            return

        if options['add_common']:
            self.add_common_currencies(options['base'])
            return

        code = options['code']
        if not code:
            self.stdout.write(self.style.ERROR('Please provide a currency code or use --auto/--add-common'))
            return

        code = code.upper()
        
        # Get name and symbol from common currencies or arguments
        if code in COMMON_CURRENCIES:
            default_name, default_symbol, native_symbol, decimal_places, position, num_sys = COMMON_CURRENCIES[code]
            name = options['name'] or default_name
            symbol = options['symbol'] or default_symbol
        else:
            name = options['name']
            symbol = options['symbol']
            native_symbol = symbol
            decimal_places = 2
            position = 'before'
            num_sys = 'western'

        if not name or not symbol:
            self.stdout.write(self.style.ERROR(f'Unknown currency {code}. Please provide name and symbol.'))
            return

        # Create or update currency
        currency, created = Currency.objects.update_or_create(
            code=code,
            defaults={
                'name': name,
                'symbol': symbol,
                'native_symbol': native_symbol if code in COMMON_CURRENCIES else symbol,
                'decimal_places': decimal_places if code in COMMON_CURRENCIES else 2,
                'symbol_position': position if code in COMMON_CURRENCIES else 'before',
                'number_system': num_sys if code in COMMON_CURRENCIES else 'western',
                'is_active': True,
                'is_default': code == 'BDT',  # BDT is default for Bangladesh
            }
        )

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} currency: {currency.code} - {currency.name} ({currency.symbol})'))

        # Add exchange rate if provided
        rate = options.get('rate')
        if rate:
            self.create_exchange_rate(options['base'], code, rate)

    def list_currencies(self):
        """List all available currencies."""
        self.stdout.write(self.style.MIGRATE_HEADING('\nAvailable currencies:'))
        self.stdout.write('-' * 70)
        
        for code, (name, symbol, native, decimals, position, num_sys) in sorted(COMMON_CURRENCIES.items()):
            exists = Currency.objects.filter(code=code).exists()
            status = '✓' if exists else ' '
            self.stdout.write(f'  [{status}] {code}: {name} ({symbol}) - {num_sys}')
        
        self.stdout.write('-' * 70)
        self.stdout.write(f'Total: {len(COMMON_CURRENCIES)} currencies')
        self.stdout.write('\nUsage:')
        self.stdout.write('  python manage.py add_currency GBP')
        self.stdout.write('  python manage.py add_currency --add-common')

    def add_common_currencies(self, base_code='BDT'):
        """Add all common currencies."""
        self.stdout.write('Adding common currencies...')
        
        created_count = 0
        updated_count = 0
        
        for i, (code, (name, symbol, native_symbol, decimal_places, position, num_sys)) in enumerate(COMMON_CURRENCIES.items()):
            currency, created = Currency.objects.update_or_create(
                code=code,
                defaults={
                    'name': name,
                    'symbol': symbol,
                    'native_symbol': native_symbol,
                    'decimal_places': decimal_places,
                    'symbol_position': position,
                    'number_system': num_sys,
                    'is_active': True,
                    'is_default': code == 'BDT',
                    'is_base_currency': code == base_code,
                    'sort_order': i,
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  Created: {currency.code} - {currency.name}')
            else:
                updated_count += 1
                self.stdout.write(f'  Updated: {currency.code} - {currency.name}')
        
        self.stdout.write(self.style.SUCCESS(
            f'\nAdded {created_count} new currencies, updated {updated_count} existing.'
        ))

    def create_exchange_rate(self, from_code, to_code, rate):
        """Create exchange rate between two currencies."""
        try:
            from_currency = Currency.objects.get(code=from_code)
            to_currency = Currency.objects.get(code=to_code)

            if from_code == to_code:
                self.stdout.write(self.style.WARNING('Cannot create exchange rate for same currency'))
                return

            exchange_rate, created = ExchangeRate.objects.update_or_create(
                from_currency=from_currency,
                to_currency=to_currency,
                defaults={
                    'rate': Decimal(str(rate)),
                    'source': 'manual',
                    'is_active': True,
                    'valid_from': timezone.now()
                }
            )

            action = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(
                f'  {action} rate: {from_code} -> {to_code} = {rate}'
            ))
        except Currency.DoesNotExist as e:
            self.stdout.write(self.style.ERROR(f'Currency not found: {e}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating rate: {e}'))

    def auto_fetch_rates(self, base_code='BDT'):
        """Auto-fetch and update rates from an exchange rate API."""
        self.stdout.write('Fetching exchange rates...')
        
        # Try to get API key from settings
        api_key = getattr(settings, 'EXCHANGERATE_API_KEY', None)
        
        if not api_key:
            self.stdout.write(self.style.WARNING(
                'No EXCHANGERATE_API_KEY in settings. Using fallback rates.'
            ))
            self._use_fallback_rates(base_code)
            return
        
        try:
            # Using exchangerate-api.com (free tier available)
            response = requests.get(
                f'https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_code}',
                timeout=10
            )
            data = response.json()

            if data.get('result') == 'success':
                rates = data.get('conversion_rates', {})
                self._process_rates(base_code, rates)
            else:
                self.stdout.write(self.style.ERROR(f'API error: {data.get("error-type", "Unknown error")}'))
                self._use_fallback_rates(base_code)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error fetching rates: {e}'))
            self._use_fallback_rates(base_code)
    
    def _process_rates(self, base_code, rates):
        """Process fetched exchange rates."""
        # Ensure base currency exists
        if base_code in COMMON_CURRENCIES:
            name, symbol, native, decimals, position, num_sys = COMMON_CURRENCIES[base_code]
            base_currency, _ = Currency.objects.get_or_create(
                code=base_code,
                defaults={
                    'name': name,
                    'symbol': symbol,
                    'native_symbol': native,
                    'decimal_places': decimals,
                    'symbol_position': position,
                    'number_system': num_sys,
                    'is_active': True,
                    'is_base_currency': True,
                }
            )
        else:
            self.stdout.write(self.style.ERROR(f'Base currency {base_code} not in common currencies'))
            return

        updated = 0
        for code, rate in rates.items():
            if code == base_code:
                continue
            
            # Only process known currencies
            if code not in COMMON_CURRENCIES:
                continue
            
            # Ensure currency exists
            name, symbol, native, decimals, position, num_sys = COMMON_CURRENCIES[code]
            currency, _ = Currency.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'symbol': symbol,
                    'native_symbol': native,
                    'decimal_places': decimals,
                    'symbol_position': position,
                    'number_system': num_sys,
                    'is_active': True,
                }
            )
            
            # Create exchange rate
            self.create_exchange_rate(base_code, code, rate)
            updated += 1

        self.stdout.write(self.style.SUCCESS(f'\nUpdated {updated} exchange rates'))
    
    def _use_fallback_rates(self, base_code='BDT'):
        """Use fallback hardcoded rates (approximate)."""
        self.stdout.write('Using fallback exchange rates (approximate values)...')
        
        # Approximate rates from BDT (as of 2024)
        BDT_RATES = {
            'USD': 0.0091,  # 1 BDT = 0.0091 USD
            'EUR': 0.0084,
            'GBP': 0.0072,
            'INR': 0.76,
            'PKR': 2.53,
            'SGD': 0.012,
            'MYR': 0.043,
            'AED': 0.033,
            'SAR': 0.034,
            'JPY': 1.36,
            'CNY': 0.066,
            'CAD': 0.012,
            'AUD': 0.014,
        }
        
        # First add all common currencies
        self.add_common_currencies(base_code)
        
        # Then add rates
        for code, rate in BDT_RATES.items():
            if code != base_code:
                self.create_exchange_rate(base_code, code, rate)
        
        self.stdout.write(self.style.SUCCESS('Fallback rates applied'))
