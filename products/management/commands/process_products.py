# products/management/commands/process_products.py
import os
from django.core.management.base import BaseCommand
from products.models import Product
from products.tasks import process_product_image_async
from django.utils import timezone
from tqdm import tqdm  # progress bar
import sys

class Command(BaseCommand):
    help = 'Queue unprocessed products for image enhancement and content generation'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Queue all products, including already processed ones'
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=0,
            help='Limit the number of products to queue'
        )
        parser.add_argument(
            '--retry-failed',
            action='store_true',
            help='Only retry failed products'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be processed, but do not queue tasks'
        )

    def handle(self, *args, **options):
        queryset = Product.objects.all()

        # Filtering based on flags
        if options['retry_failed']:
            queryset = queryset.filter(processing_status='failed')
        elif not options['all']:
            queryset = queryset.filter(processing_status='pending')

        if options['limit'] > 0:
            queryset = queryset[:options['limit']]

        total = queryset.count()
        if total == 0:
            self.stdout.write(self.style.WARNING("No matching products found."))
            return

        # Confirm if destructive action
        if not options['dry_run'] and (options['all'] or options['retry_failed']) and options['limit'] == 0:
            confirm = input(
                f"You are about to queue {total} products. Continue? [y/N]: "
            ).strip().lower()
            if confirm != 'y':
                self.stdout.write(self.style.NOTICE("Operation cancelled."))
                return

        if options['dry_run']:
            self.stdout.write(self.style.NOTICE(f"[DRY-RUN] {total} products would be queued:"))
            for product in queryset:
                self.stdout.write(f"- {product.name} (ID: {product.id}, Status: {product.processing_status})")
            return

        self.stdout.write(self.style.NOTICE(f"Queuing {total} products for processing..."))

        for product in tqdm(queryset, desc="Queuing", file=sys.stdout):
            try:
                product.processing_status = 'pending'
                product.save(update_fields=['processing_status'])

                process_product_image_async.delay(product.id)

            except Exception as e:
                self.stderr.write(f"❌ Failed to queue {product.name} (ID: {product.id}): {str(e)}")

        self.stdout.write(self.style.SUCCESS(f"✔ Successfully queued {total} product(s)."))
