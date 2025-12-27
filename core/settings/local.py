"""
Local development settings
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Local media settings for development
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Use SQLite for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable HTTPS requirements
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# CORS allow all for development
CORS_ALLOW_ALL_ORIGINS = True

# Debug toolbar (optional)
try:
    import debug_toolbar
    INSTALLED_APPS += ['debug_toolbar']
    # Insert DebugToolbarMiddleware right after GZipMiddleware to avoid debug_toolbar.W003 warning
    try:
        gzip_index = MIDDLEWARE.index('django.middleware.gzip.GZipMiddleware')
        MIDDLEWARE.insert(gzip_index + 1, 'debug_toolbar.middleware.DebugToolbarMiddleware')
    except ValueError:
        # Fallback to front if gzip middleware isn't present for some reason
        MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
except ImportError:
    # Debug toolbar is optional in local development
    pass

# Cache - use local memory for development
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Throttling - disable for development
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '10000/hour',
    'user': '10000/hour',
}

# Logging - more verbose for development
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['bunoraa']['level'] = 'DEBUG'
