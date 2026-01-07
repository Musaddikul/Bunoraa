"""
Management command to update exchange rates from multiple providers.

Supports:
  - Manual rates (default)
  - Open Exchange Rates (openexchange)
  - Fixer.io (fixer)
  - European Central Bank (ecb)
  - ExchangeRate-API (exchangerate_api)

Usage:
  python manage.py update_exchange_rates                     # Use configured provider
  python manage.py update_exchange_rates --provider=ecb      # Use ECB (no API key needed)
  python manage.py update_exchange_rates --provider=fixer    # Use Fixer.io
  python manage.py update_exchange_rates --all               # Try all providers in order
"""
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.i18n.services import ExchangeRateUpdateService
from apps.i18n.models import Currency, I18nSettings


PROVIDER_ORDER = ['exchangerate_api', 'openexchange', 'fixer', 'ecb', 'manual']


class Command(BaseCommand):
    help = 'Update exchange rates from configured or specified provider(s)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--provider',
            type=str,
            choices=['manual', 'openexchange', 'fixer', 'ecb', 'exchangerate_api'],
            help='Exchange rate provider to use'
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Try all providers in order until one succeeds'
        )
        parser.add_argument(
            '--api-key',
            type=str,
            help='API key for the provider (overrides settings)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )

    def handle(self, *args, **options):
        provider = options.get('provider')
        try_all = options.get('all', False)
        api_key = options.get('api_key')
        dry_run = options.get('dry_run', False)

        if dry_run:
            self.stdout.write(self.style.NOTICE('DRY RUN - no changes will be made'))

        # Check if we have any currencies
        currency_count = Currency.objects.filter(is_active=True).count()
        if currency_count == 0:
            self.stdout.write(self.style.WARNING(
                'No currencies found. Run "python manage.py add_currency --add-common" first.'
            ))
            return

        self.stdout.write(f'Found {currency_count} active currencies')

        # Get provider from settings if not specified
        if not provider and not try_all:
            try:
                i18n_settings = I18nSettings.get_settings()
                provider = i18n_settings.exchange_rate_provider or 'manual'
            except Exception:
                provider = 'manual'

        # Get API key from settings if not provided
        if not api_key:
            api_key = self._get_api_key(provider if provider else 'exchangerate_api')

        if try_all:
            self._try_all_providers(api_key, dry_run)
        else:
            self._update_from_provider(provider, api_key, dry_run)

    def _get_api_key(self, provider):
        """Get API key from settings for the given provider."""
        key_mapping = {
            'openexchange': 'OPEN_EXCHANGE_API_KEY',
            'fixer': 'FIXER_API_KEY',
            'exchangerate_api': 'EXCHANGERATE_API_KEY',
        }
        setting_name = key_mapping.get(provider)
        if setting_name:
            return getattr(settings, setting_name, None)
        return None

    def _try_all_providers(self, override_api_key, dry_run):
        """Try each provider in order until one succeeds."""
        self.stdout.write('Trying all providers in order...\n')

        for provider in PROVIDER_ORDER:
            if provider == 'manual':
                self.stdout.write(self.style.NOTICE('Skipping manual provider'))
                continue

            api_key = override_api_key or self._get_api_key(provider)
            
            # ECB doesn't need an API key
            if provider != 'ecb' and not api_key:
                self.stdout.write(f'  {provider}: No API key configured, skipping')
                continue

            self.stdout.write(f'\nTrying {provider}...')
            try:
                if not dry_run:
                    count = ExchangeRateUpdateService.update_rates(provider, api_key)
                    if count > 0:
                        self.stdout.write(self.style.SUCCESS(
                            f'Successfully updated {count} rates from {provider}'
                        ))
                        return
                    else:
                        self.stdout.write(f'  {provider}: No rates returned')
                else:
                    self.stdout.write(f'  Would update from {provider}')
                    return
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  {provider} failed: {e}'))

        self.stdout.write(self.style.ERROR('All providers failed'))

    def _update_from_provider(self, provider, api_key, dry_run):
        """Update from a specific provider."""
        self.stdout.write(f'Updating exchange rates from: {provider}')

        if provider != 'ecb' and provider != 'manual' and not api_key:
            self.stdout.write(self.style.ERROR(
                f'No API key found for {provider}. '
                f'Set {provider.upper()}_API_KEY in settings or use --api-key option.'
            ))
            return

        if provider == 'manual':
            self.stdout.write(self.style.NOTICE(
                'Manual provider selected. Use add_currency command to set rates manually.'
            ))
            return

        try:
            if not dry_run:
                count = ExchangeRateUpdateService.update_rates(provider, api_key)
                self.stdout.write(self.style.SUCCESS(f'Updated {count} exchange rates'))
            else:
                self.stdout.write(f'Would update from {provider}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
