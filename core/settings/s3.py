"""
S3/Cloudflare settings for local development or testing
"""
import os
from .base import *

# Parse DEBUG as boolean
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('1', 'true', 'yes')

# Use S3/Cloudflare for media files
USE_S3 = True

# MEDIA_URL will be set by base.py S3 logic
# Do not set LOCAL_MEDIA_URL or MEDIA_ROOT here

# Optionally override ALLOWED_HOSTS for local testing
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Optionally set email backend for local
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')

# Database fallback for local development: if DEBUG is True, use SQLite so you
# don't need a remote DATABASE_URL during local testing.
if DEBUG:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True,
        )
    }
    # Cache
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.environ.get('REDIS_URL'),
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            }
        }
    }

    # DATABASES = {
    #     'default': {
    #         'ENGINE': 'django.db.backends.sqlite3',
    #         'NAME': BASE_DIR / 'db.sqlite3',
    #     }
    # }
    # # Use local in-memory cache during development
    # CACHES = {
    #     'default': {
    #         'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    #         'LOCATION': 'unique-snowflake',
    #     }
    # }
else:
    # In non-debug, expect DATABASE_URL to be provided (production)
    pass

# Security settings: in DEBUG (development), do not set secure-only cookies so CSRF cookie
# will be sent over plain HTTP. In production (DEBUG=False), enable stricter security.
if DEBUG:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_SSL_REDIRECT = False
    # Disable HSTS in development
    SECURE_HSTS_SECONDS = 0
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
else:
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').lower() in ('1', 'true', 'yes')
    CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True').lower() in ('1', 'true', 'yes')
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True').lower() in ('1', 'true', 'yes')
    SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', 31536000))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = os.environ.get('SECURE_HSTS_INCLUDE_SUBDOMAINS', 'True').lower() in ('1', 'true', 'yes')
    SECURE_HSTS_PRELOAD = os.environ.get('SECURE_HSTS_PRELOAD', 'True').lower() in ('1', 'true', 'yes')

# CORS allow all for development
CORS_ALLOW_ALL_ORIGINS = True

# Development logging tweaks: ensure errors and debug info are printed to the console
# This file is used for S3-enabled local/testing environments so emit relevant logs here
try:
    # Ensure the console handler prints at DEBUG level so full tracebacks are visible
    LOGGING['handlers']['console']['level'] = 'DEBUG'

    # Ensure our app logger is verbose in this environment
    LOGGING['loggers'].setdefault('bunoraa', {})
    LOGGING['loggers']['bunoraa']['level'] = 'DEBUG'

    # Ensure django.request errors go to console (prints 500 tracebacks)
    LOGGING['loggers'].setdefault('django.request', {})
    LOGGING['loggers']['django.request'].setdefault('handlers', [])
    if 'console' not in LOGGING['loggers']['django.request']['handlers']:
        LOGGING['loggers']['django.request']['handlers'].append('console')
    LOGGING['loggers']['django.request']['level'] = 'ERROR'

    # Raise root verbosity so all relevant logs appear while developing/debugging
    LOGGING['root']['level'] = 'DEBUG'

    # Enable verbose boto3/botocore logs for S3 troubleshooting when in DEBUG
    import logging as _logging
    if DEBUG:
        for _name in ('boto3', 'botocore', 's3transfer', 'urllib3'):
            _logging.getLogger(_name).setLevel(_logging.DEBUG)
            # ensure those modules also propagate to console via root handlers
except Exception:
    # Non-fatal: don't break settings if LOGGING is not defined or structure differs
    pass

