"""Management command to seed exchange rates for currency conversion.

Usage:
  python manage.py seed_exchange_rates               # use built-in defaults (BDT as base)
  python manage.py seed_exchange_rates --base=USD    # use USD as base currency
  python manage.py seed_exchange_rates --update      # update existing rates
  python manage.py seed_exchange_rates --fetch       # fetch from API (requires API key)
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.i18n.models import Currency, ExchangeRate


# Default exchange rates with BDT as base (approximate as of 2024)
# These are rough rates for reference - update with real rates in production
DEFAULT_RATES_BDT_BASE = {
    'USD': Decimal('0.0083'),    # 1 BDT = 0.0083 USD (1 USD ≈ 120 BDT)
    'EUR': Decimal('0.0076'),    # 1 BDT = 0.0076 EUR
    'GBP': Decimal('0.0065'),    # 1 BDT = 0.0065 GBP
    'INR': Decimal('0.69'),      # 1 BDT = 0.69 INR
    'AED': Decimal('0.030'),     # 1 BDT = 0.030 AED
    'SAR': Decimal('0.031'),     # 1 BDT = 0.031 SAR
    'MYR': Decimal('0.038'),     # 1 BDT = 0.038 MYR
    'SGD': Decimal('0.011'),     # 1 BDT = 0.011 SGD
    'CAD': Decimal('0.011'),     # 1 BDT = 0.011 CAD
    'AUD': Decimal('0.012'),     # 1 BDT = 0.012 AUD
    'JPY': Decimal('1.25'),      # 1 BDT = 1.25 JPY
    'CNY': Decimal('0.059'),     # 1 BDT = 0.059 CNY
    'PKR': Decimal('2.32'),      # 1 BDT = 2.32 PKR
    'NPR': Decimal('1.11'),      # 1 BDT = 1.11 NPR
    'LKR': Decimal('2.50'),      # 1 BDT = 2.50 LKR
}

# Major currencies to always ensure exist
MAJOR_CURRENCIES = [
    {
        'code': 'BDT',
        'name': 'Bangladeshi Taka',
        'symbol': '৳',
        'native_symbol': '৳',
        'decimal_places': 2,
        'is_default': True,
    },
    {
        'code': 'USD',
        'name': 'US Dollar',
        'symbol': '$',
        'native_symbol': '$',
        'decimal_places': 2,
    },
    {
        'code': 'EUR',
        'name': 'Euro',
        'symbol': '€',
        'native_symbol': '€',
        'decimal_places': 2,
    },
    {
        'code': 'GBP',
        'name': 'British Pound',
        'symbol': '£',
        'native_symbol': '£',
        'decimal_places': 2,
    },
    {
        'code': 'INR',
        'name': 'Indian Rupee',
        'symbol': '₹',
        'native_symbol': '₹',
        'decimal_places': 2,
    },
]


class Command(BaseCommand):
    help = 'Seed exchange rates for currency conversion. BDT as default base currency.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--base',
            type=str,
            default='BDT',
            help='Base currency code (default: BDT)'
        )
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing rates instead of skipping'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help="Don't write to DB, only show actions"
        )

    def handle(self, *args, **options):
        base_code = options.get('base', 'BDT').upper()
        update = options.get('update', False)
        dry_run = options.get('dry_run', False)

        if dry_run:
            self.stdout.write(self.style.NOTICE('DRY RUN - no changes will be made'))

        with transaction.atomic():
            # Ensure major currencies exist
            currencies_created = 0
            for curr_data in MAJOR_CURRENCIES:
                code = curr_data.pop('code')
                is_default = curr_data.pop('is_default', False)
                
                if dry_run:
                    self.stdout.write(f'Would ensure currency: {code}')
                    continue
                    
                currency, created = Currency.objects.get_or_create(
                    code=code,
                    defaults={
                        'name': curr_data.get('name', code),
                        'symbol': curr_data.get('symbol', code),
                        'native_symbol': curr_data.get('native_symbol', curr_data.get('symbol', code)),
                        'decimal_places': curr_data.get('decimal_places', 2),
                        'is_active': True,
                    }
                )
                if created:
                    currencies_created += 1
                    self.stdout.write(self.style.SUCCESS(f'Created currency: {code}'))
                
                # Set as default if specified
                if is_default and not currency.is_default:
                    Currency.objects.filter(is_default=True).update(is_default=False)
                    currency.is_default = True
                    currency.save(update_fields=['is_default'])
                    self.stdout.write(self.style.SUCCESS(f'Set {code} as default currency'))

            # Get base currency
            try:
                base_currency = Currency.objects.get(code=base_code)
            except Currency.DoesNotExist:
                self.stderr.write(self.style.ERROR(f'Base currency {base_code} not found'))
                return

            # Seed exchange rates
            rates_created = 0
            rates_updated = 0
            
            for target_code, rate in DEFAULT_RATES_BDT_BASE.items():
                if target_code == base_code:
                    continue
                    
                try:
                    target_currency = Currency.objects.get(code=target_code)
                except Currency.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f'Currency {target_code} not found, skipping'
                    ))
                    continue

                if dry_run:
                    self.stdout.write(f'Would create rate: {base_code} → {target_code}: {rate}')
                    continue

                # Create or update forward rate (BDT -> target)
                existing = ExchangeRate.objects.filter(
                    from_currency=base_currency,
                    to_currency=target_currency,
                    is_active=True
                ).first()

                if existing:
                    if update:
                        existing.rate = rate
                        existing.valid_from = timezone.now()
                        existing.source = 'manual'
                        existing.save()
                        rates_updated += 1
                        self.stdout.write(f'Updated rate: {base_code} → {target_code}: {rate}')
                    else:
                        self.stdout.write(self.style.NOTICE(
                            f'Rate {base_code} → {target_code} exists, skipping'
                        ))
                else:
                    ExchangeRate.objects.create(
                        from_currency=base_currency,
                        to_currency=target_currency,
                        rate=rate,
                        source='manual',
                        valid_from=timezone.now(),
                        is_active=True
                    )
                    rates_created += 1
                    self.stdout.write(self.style.SUCCESS(
                        f'Created rate: {base_code} → {target_code}: {rate}'
                    ))

                # Create inverse rate (target -> BDT)
                inverse_rate = Decimal('1') / rate if rate else Decimal('0')
                
                existing_inverse = ExchangeRate.objects.filter(
                    from_currency=target_currency,
                    to_currency=base_currency,
                    is_active=True
                ).first()

                if existing_inverse:
                    if update:
                        existing_inverse.rate = inverse_rate.quantize(Decimal('0.00000001'))
                        existing_inverse.valid_from = timezone.now()
                        existing_inverse.source = 'manual'
                        existing_inverse.save()
                        rates_updated += 1
                else:
                    ExchangeRate.objects.create(
                        from_currency=target_currency,
                        to_currency=base_currency,
                        rate=inverse_rate.quantize(Decimal('0.00000001')),
                        source='manual',
                        valid_from=timezone.now(),
                        is_active=True
                    )
                    rates_created += 1

            if not dry_run:
                self.stdout.write(self.style.SUCCESS(
                    f'Exchange rate seeding complete: {currencies_created} currencies, '
                    f'{rates_created} rates created, {rates_updated} rates updated'
                ))
