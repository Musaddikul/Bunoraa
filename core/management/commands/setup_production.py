"""
Management command for production setup and optimization.
"""
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.conf import settings
from django.db import connection
import os
import subprocess


class Command(BaseCommand):
    help = 'Setup and optimize Bunoraa for production deployment'

    def add_arguments(self, parser):
        parser.add_argument(
            '--migrate',
            action='store_true',
            help='Run database migrations',
        )
        parser.add_argument(
            '--collectstatic',
            action='store_true',
            help='Collect static files',
        )
        parser.add_argument(
            '--compress',
            action='store_true',
            help='Compress static files',
        )
        parser.add_argument(
            '--optimize-db',
            action='store_true',
            help='Optimize database (PostgreSQL only)',
        )
        parser.add_argument(
            '--create-indexes',
            action='store_true',
            help='Create recommended database indexes',
        )
        parser.add_argument(
            '--compile-messages',
            action='store_true',
            help='Compile translation messages',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Run all production setup tasks',
        )

    def handle(self, *args, **options):
        run_all = options['all']
        
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Bunoraa Production Setup'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        
        # Run migrations
        if run_all or options['migrate']:
            self.run_migrations()
        
        # Collect static files
        if run_all or options['collectstatic']:
            self.collect_static()
        
        # Compress static files
        if run_all or options['compress']:
            self.compress_static()
        
        # Optimize database
        if run_all or options['optimize_db']:
            self.optimize_database()
        
        # Create indexes
        if run_all or options['create_indexes']:
            self.create_indexes()
        
        # Compile translation messages
        if run_all or options['compile_messages']:
            self.compile_messages()
        
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Production setup complete!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

    def run_migrations(self):
        """Run database migrations."""
        self.stdout.write('\n📦 Running database migrations...')
        try:
            call_command('migrate', verbosity=1)
            self.stdout.write(self.style.SUCCESS('✓ Migrations complete'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Migration error: {e}'))

    def collect_static(self):
        """Collect static files."""
        self.stdout.write('\n📁 Collecting static files...')
        try:
            call_command('collectstatic', '--noinput', verbosity=1)
            self.stdout.write(self.style.SUCCESS('✓ Static files collected'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Static collection error: {e}'))

    def compress_static(self):
        """Compress static files."""
        self.stdout.write('\n🗜️  Compressing static files...')
        try:
            # Check if django-compressor is installed
            call_command('compress', '--force', verbosity=1)
            self.stdout.write(self.style.SUCCESS('✓ Static files compressed'))
        except CommandError:
            self.stdout.write(self.style.WARNING('⚠ django-compressor not installed, skipping'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠ Compression skipped: {e}'))

    def optimize_database(self):
        """Optimize database tables."""
        self.stdout.write('\n🔧 Optimizing database...')
        
        if 'postgresql' not in settings.DATABASES['default']['ENGINE']:
            self.stdout.write(self.style.WARNING('⚠ Skipping: Not PostgreSQL'))
            return
        
        try:
            from core.utils.database import DatabaseOptimizer
            
            optimizer = DatabaseOptimizer()
            
            # Analyze tables
            self.stdout.write('  Running ANALYZE...')
            result = optimizer.analyze_tables()
            self.stdout.write(f'  Analyzed {len(result.get("analyzed", []))} tables')
            
            # Get stats
            stats = optimizer.get_table_stats()
            total_rows = sum(s.get('row_count', 0) for s in stats)
            self.stdout.write(f'  Total rows: {total_rows:,}')
            
            # Check for missing indexes
            missing = optimizer.get_missing_indexes()
            if missing:
                self.stdout.write(self.style.WARNING(
                    f'  ⚠ {len(missing)} tables may need indexes'
                ))
            
            self.stdout.write(self.style.SUCCESS('✓ Database optimized'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Optimization error: {e}'))

    def create_indexes(self):
        """Create recommended database indexes."""
        self.stdout.write('\n📊 Creating database indexes...')
        
        if 'postgresql' not in settings.DATABASES['default']['ENGINE']:
            self.stdout.write(self.style.WARNING('⚠ Skipping: Not PostgreSQL'))
            return
        
        try:
            from core.utils.database import DatabaseOptimizer
            
            optimizer = DatabaseOptimizer()
            created = optimizer.create_recommended_indexes()
            
            if created:
                self.stdout.write(f'  Created indexes: {", ".join(created)}')
            else:
                self.stdout.write('  All recommended indexes already exist')
            
            self.stdout.write(self.style.SUCCESS('✓ Indexes created'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Index creation error: {e}'))

    def compile_messages(self):
        """Compile translation messages."""
        self.stdout.write('\n🌐 Compiling translation messages...')
        try:
            call_command('compilemessages', verbosity=1)
            self.stdout.write(self.style.SUCCESS('✓ Messages compiled'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠ Message compilation skipped: {e}'))
