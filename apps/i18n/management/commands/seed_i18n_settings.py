"""
Management command to seed I18nSettings.
"""
from django.core.management.base import BaseCommand
from apps.i18n.models import I18nSettings


class Command(BaseCommand):
    help = 'Seeds the I18nSettings singleton with defaults'

    def add_arguments(self, parser):
        parser.add_argument(
            '--provider',
            type=str,
            choices=['manual', 'openexchange', 'fixer', 'ecb', 'exchangerate_api'],
            default='exchangerate_api',
            help='Exchange rate provider (default: exchangerate_api)'
        )
        parser.add_argument(
            '--api-key',
            type=str,
            default='',
            help='API key for the exchange rate provider'
        )
        parser.add_argument(
            '--update-frequency',
            type=int,
            default=24,
            help='Exchange rate update frequency in hours (default: 24)'
        )
        parser.add_argument(
            '--rounding',
            type=str,
            choices=['none', 'nearest_cent', 'nearest_99', 'nearest_95', 'nearest_integer', 'round_up'],
            default='nearest_cent',
            help='Price rounding method (default: nearest_cent)'
        )

    def handle(self, *args, **options):
        provider = options['provider']
        api_key = options['api_key']
        update_frequency = options['update_frequency']
        rounding = options['rounding']

        settings, created = I18nSettings.objects.update_or_create(
            pk=1,
            defaults={
                # Languages
                'enable_auto_detect_language': True,
                'enable_language_selector': True,
                
                # Currency
                'enable_auto_detect_currency': True,
                'enable_currency_selector': True,
                'show_original_price': False,
                'show_exchange_rate': False,
                
                # Exchange rates
                'auto_update_exchange_rates': provider != 'manual',
                'exchange_rate_update_frequency': update_frequency,
                'exchange_rate_provider': provider,
                'exchange_rate_api_key': api_key,
                
                # Price rounding
                'rounding_method': rounding,
                
                # Translation
                'enable_machine_translation': False,
            }
        )

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(
            f'{action} I18nSettings: provider={provider}, rounding={rounding}'
        ))
