"""
Production settings
"""
import os
from .base import *

DEBUG = os.environ.get('DEBUG', False)

# Read ALLOWED_HOSTS from environment, fall back to a safe default.
_env_allowed = os.environ.get('ALLOWED_HOSTS')
if _env_allowed:
    ALLOWED_HOSTS = [h.strip() for h in _env_allowed.split(',') if h.strip()]
else:
    # Add your Render URL as the default host
    ALLOWED_HOSTS = ['bunoraa.onrender.com']

MEDIA_URL = os.environ.get('MEDIA_URL', '/media/')

# When running behind a proxy (e.g. Render, Cloudflare), honor X-Forwarded-Proto for HTTPS detection
# Cloudflare will forward the original scheme in X-Forwarded-Proto, so mark that header as trusted.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CSRF trusted origins must include scheme for Django >=4; allow override via env var or derive from ALLOWED_HOSTS
_env_csrf = os.environ.get('CSRF_TRUSTED_ORIGINS')
if _env_csrf:
    CSRF_TRUSTED_ORIGINS = [u.strip() for u in _env_csrf.split(',') if u.strip()]
else:
    CSRF_TRUSTED_ORIGINS = [f'https://{h}' for h in ALLOWED_HOSTS if h]

# Security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Database
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
            'CONNECTION_POOL_KWARGS': {'ssl_cert_reqs': None},
        }
    }
}

# Static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Logging
LOGGING['handlers']['console']['level'] = 'INFO'
LOGGING['loggers']['django']['level'] = 'INFO'
