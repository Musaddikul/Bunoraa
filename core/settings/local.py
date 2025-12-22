"""
Local development settings
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'bunoraa.com']

# Use a local media URL in development (can be overridden via LOCAL_MEDIA_URL env var)
# Fallback order: LOCAL_MEDIA_URL -> MEDIA_URL -> '/media/'
MEDIA_URL = os.environ.get('LOCAL_MEDIA_URL') or os.environ.get('MEDIA_URL', '/media/')

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
    MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
    INTERNAL_IPS = ['127.0.0.1']
except ImportError:
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
