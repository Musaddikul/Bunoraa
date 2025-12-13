# core/settings/staging.py
"""
Bunoraa Staging Settings
Configuration for staging/testing environment.
"""
from .production import *

# =============================================================================
# DEBUG CONFIGURATION
# =============================================================================
DEBUG = config('DEBUG', default=True, cast=bool)

# =============================================================================
# SECURITY OVERRIDES FOR STAGING
# =============================================================================
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_HSTS_SECONDS = 0

# =============================================================================
# REST FRAMEWORK
# =============================================================================
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

# =============================================================================
# LOGGING
# =============================================================================
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['apps']['level'] = 'DEBUG'
