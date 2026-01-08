"""
Settings module for Bunoraa.

DO NOT import all settings here. Use DJANGO_SETTINGS_MODULE to select the appropriate settings:
- core.settings.local      - Local development with SQLite
- core.settings.s3         - Development with S3/PostgreSQL  
- core.settings.production - Production deployment

Example:
    export DJANGO_SETTINGS_MODULE=core.settings.local
    python manage.py runserver
"""

# Import nothing by default - let DJANGO_SETTINGS_MODULE pick the right file
