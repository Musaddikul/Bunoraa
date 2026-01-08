"""
Management command to fix migration inconsistencies.
Run this on production after deploying the updated migration files.

Usage: python manage.py fix_migrations
"""
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Fix migration inconsistencies by marking missing migrations as applied'

    def handle(self, *args, **options):
        from pathlib import Path
        from django.conf import settings
        
        # Find apps directory
        base_dir = Path(settings.BASE_DIR)
        apps_dir = base_dir / 'apps'
        
        if not apps_dir.exists():
            self.stderr.write(self.style.ERROR(f"Apps directory not found: {apps_dir}"))
            return
        
        # Get all migration files from filesystem
        file_migrations = {}
        for app_dir in apps_dir.iterdir():
            if app_dir.is_dir():
                migrations_dir = app_dir / 'migrations'
                if migrations_dir.exists():
                    app_name = app_dir.name
                    file_migrations[app_name] = []
                    for mig_file in migrations_dir.glob('*.py'):
                        if mig_file.name != '__init__.py':
                            mig_name = mig_file.stem
                            file_migrations[app_name].append(mig_name)
        
        # Get all applied migrations from database
        with connection.cursor() as cursor:
            cursor.execute("SELECT app, name FROM django_migrations")
            db_migrations = set((row[0], row[1]) for row in cursor.fetchall())
        
        # Add missing migrations as "fake applied"
        added = []
        with connection.cursor() as cursor:
            for app, migrations in file_migrations.items():
                for mig in migrations:
                    if (app, mig) not in db_migrations:
                        cursor.execute(
                            "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, NOW())",
                            [app, mig]
                        )
                        added.append(f"{app}.{mig}")
        
        if added:
            self.stdout.write(self.style.SUCCESS(f"Added {len(added)} migrations to database:"))
            for m in added:
                self.stdout.write(f"  - {m}")
        else:
            self.stdout.write(self.style.SUCCESS("No migrations needed to be added"))
