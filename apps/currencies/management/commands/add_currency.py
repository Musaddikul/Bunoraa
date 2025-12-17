"""
Management command to add currencies with exchange rates.
Usage:
    python manage.py add_currency GBP "British Pound" "£"
    python manage.py add_currency --auto  # Fetch all rates from fixer.io
"""
import requests
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from apps.currencies.models import Currency, ExchangeRate, CurrencySettings


# Common currencies with their details
COMMON_CURRENCIES = {
    'USD': ('US Dollar', '$', 2),
    'EUR': ('Euro', '€', 2),
    'GBP': ('British Pound', '£', 2),
    'JPY': ('Japanese Yen', '¥', 0),
    'CAD': ('Canadian Dollar', 'C$', 2),
    'AUD': ('Australian Dollar', 'A$', 2),
    'CHF': ('Swiss Franc', 'CHF', 2),
    'CNY': ('Chinese Yuan', '¥', 2),
    'INR': ('Indian Rupee', '₹', 2),
    'BDT': ('Bangladeshi Taka', '৳', 2),
    'SGD': ('Singapore Dollar', 'S$', 2),
    'HKD': ('Hong Kong Dollar', 'HK$', 2),
    'MYR': ('Malaysian Ringgit', 'RM', 2),
    'THB': ('Thai Baht', '฿', 2),
    'KRW': ('South Korean Won', '₩', 0),
    'NZD': ('New Zealand Dollar', 'NZ$', 2),
    'SEK': ('Swedish Krona', 'kr', 2),
    'NOK': ('Norwegian Krone', 'kr', 2),
    'DKK': ('Danish Krone', 'kr', 2),
    'ZAR': ('South African Rand', 'R', 2),
    'RUB': ('Russian Ruble', '₽', 2),
    'BRL': ('Brazilian Real', 'R$', 2),
    'MXN': ('Mexican Peso', '$', 2),
    'AED': ('UAE Dirham', 'د.إ', 2),
    'SAR': ('Saudi Riyal', '﷼', 2),
    'PKR': ('Pakistani Rupee', '₨', 2),
    'PHP': ('Philippine Peso', '₱', 2),
    'IDR': ('Indonesian Rupiah', 'Rp', 0),
    'VND': ('Vietnamese Dong', '₫', 0),
    'TRY': ('Turkish Lira', '₺', 2),
    'PLN': ('Polish Zloty', 'zł', 2),
    'CZK': ('Czech Koruna', 'Kč', 2),
    'HUF': ('Hungarian Forint', 'Ft', 0),
    'ILS': ('Israeli Shekel', '₪', 2),
    'CLP': ('Chilean Peso', '$', 0),
    'COP': ('Colombian Peso', '$', 0),
    'ARS': ('Argentine Peso', '$', 2),
    'PEN': ('Peruvian Sol', 'S/', 2),
    'EGP': ('Egyptian Pound', '£', 2),
    'NGN': ('Nigerian Naira', '₦', 2),
    'KES': ('Kenyan Shilling', 'KSh', 2),
    'GHS': ('Ghanaian Cedi', '₵', 2),
    'MAD': ('Moroccan Dirham', 'د.م.', 2),
    'TWD': ('Taiwan Dollar', 'NT$', 2),
    'QAR': ('Qatari Riyal', '﷼', 2),
    'KWD': ('Kuwaiti Dinar', 'د.ك', 3),
    'BHD': ('Bahraini Dinar', '.د.ب', 3),
    'OMR': ('Omani Rial', '﷼', 3),
}


class Command(BaseCommand):
    help = 'Add a currency with exchange rate'

    def add_arguments(self, parser):
        parser.add_argument('code', nargs='?', type=str, help='Currency code (e.g., GBP)')
        parser.add_argument('name', nargs='?', type=str, help='Currency name (e.g., "British Pound")')
        parser.add_argument('symbol', nargs='?', type=str, help='Currency symbol (e.g., £)')
        parser.add_argument('--rate', type=float, help='Exchange rate from EUR')
        parser.add_argument('--auto', action='store_true', help='Auto-fetch rates from fixer.io')
        parser.add_argument('--list', action='store_true', help='List all available currencies')
        parser.add_argument('--add-common', action='store_true', help='Add all common currencies')

    def handle(self, *args, **options):
        if options['list']:
            self.list_currencies()
            return

        if options['auto']:
            self.auto_fetch_rates()
            return

        if options['add_common']:
            self.add_common_currencies()
            return

        code = options['code']
        if not code:
            self.stdout.write(self.style.ERROR('Please provide a currency code or use --auto'))
            return

        code = code.upper()
        
        # Get name and symbol from common currencies or arguments
        if code in COMMON_CURRENCIES:
            default_name, default_symbol, decimal_places = COMMON_CURRENCIES[code]
            name = options['name'] or default_name
            symbol = options['symbol'] or default_symbol
        else:
            name = options['name']
            symbol = options['symbol']
            decimal_places = 2

        if not name or not symbol:
            self.stdout.write(self.style.ERROR(f'Unknown currency {code}. Please provide name and symbol.'))
            return

        # Create or update currency
        currency, created = Currency.objects.update_or_create(
            code=code,
            defaults={
                'name': name,
                'symbol': symbol,
                'decimal_places': decimal_places,
                'is_active': True
            }
        )

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} currency: {currency}'))

        # Add exchange rate if provided or fetch from fixer.io
        rate = options.get('rate')
        if not rate:
            rate = self.fetch_rate_for_currency(code)

        if rate:
            self.create_exchange_rate(code, rate)

    def list_currencies(self):
        """List all available currencies."""
        self.stdout.write(self.style.MIGRATE_HEADING('\nAvailable currencies:'))
        self.stdout.write('-' * 50)
        
        for code, (name, symbol, decimals) in sorted(COMMON_CURRENCIES.items()):
            exists = Currency.objects.filter(code=code).exists()
            status = '✓' if exists else ' '
            self.stdout.write(f'  [{status}] {code}: {name} ({symbol})')
        
        self.stdout.write('-' * 50)
        self.stdout.write(f'Total: {len(COMMON_CURRENCIES)} currencies')
        self.stdout.write('\nUsage: python manage.py add_currency GBP')

    def add_common_currencies(self):
        """Add all common currencies."""
        self.stdout.write('Adding common currencies...')
        
        rates = self.fetch_all_rates()
        
        for code, (name, symbol, decimal_places) in COMMON_CURRENCIES.items():
            currency, created = Currency.objects.update_or_create(
                code=code,
                defaults={
                    'name': name,
                    'symbol': symbol,
                    'decimal_places': decimal_places,
                    'is_active': True
                }
            )
            
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  {action}: {currency}')
            
            # Add exchange rate
            if code in rates and code != 'EUR':
                self.create_exchange_rate(code, rates[code])

    def fetch_all_rates(self):
        """Fetch all exchange rates from fixer.io."""
        try:
            settings_obj = CurrencySettings.objects.first()
            if not settings_obj or not settings_obj.api_key:
                self.stdout.write(self.style.WARNING('No fixer.io API key configured'))
                return {}

            response = requests.get(
                f'http://data.fixer.io/api/latest?access_key={settings_obj.api_key}',
                timeout=10
            )
            data = response.json()

            if data.get('success'):
                return data.get('rates', {})
            else:
                self.stdout.write(self.style.ERROR(f'Fixer.io error: {data.get("error", {})}'))
                return {}
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error fetching rates: {e}'))
            return {}

    def fetch_rate_for_currency(self, code):
        """Fetch exchange rate for a specific currency."""
        rates = self.fetch_all_rates()
        return rates.get(code)

    def create_exchange_rate(self, to_code, rate):
        """Create exchange rate from EUR to the given currency."""
        try:
            eur = Currency.objects.get(code='EUR')
            to_currency = Currency.objects.get(code=to_code)

            exchange_rate, created = ExchangeRate.objects.update_or_create(
                from_currency=eur,
                to_currency=to_currency,
                defaults={
                    'rate': Decimal(str(rate)),
                    'source': 'fixer',
                    'is_active': True,
                    'valid_from': timezone.now()
                }
            )

            action = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(
                f'  {action} rate: EUR -> {to_code} = {rate}'
            ))
        except Currency.DoesNotExist as e:
            self.stdout.write(self.style.ERROR(f'Currency not found: {e}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating rate: {e}'))

    def auto_fetch_rates(self):
        """Auto-fetch and update all rates from fixer.io."""
        self.stdout.write('Fetching rates from fixer.io...')
        
        rates = self.fetch_all_rates()
        if not rates:
            return

        # Ensure EUR exists
        eur, _ = Currency.objects.get_or_create(
            code='EUR',
            defaults={'name': 'Euro', 'symbol': '€', 'decimal_places': 2, 'is_active': True}
        )

        updated = 0
        for code, rate in rates.items():
            # Check if currency exists
            currency = Currency.objects.filter(code=code).first()
            if not currency:
                # Check if it's a known currency
                if code in COMMON_CURRENCIES:
                    name, symbol, decimals = COMMON_CURRENCIES[code]
                    currency = Currency.objects.create(
                        code=code,
                        name=name,
                        symbol=symbol,
                        decimal_places=decimals,
                        is_active=True
                    )
                    self.stdout.write(f'  Created currency: {currency}')
                else:
                    continue

            if code != 'EUR':
                self.create_exchange_rate(code, rate)
                updated += 1

        self.stdout.write(self.style.SUCCESS(f'\nUpdated {updated} exchange rates'))
