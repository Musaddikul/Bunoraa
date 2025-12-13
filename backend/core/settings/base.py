# core/settings/base.py
"""
Base Django settings for Bunoraa e-commerce platform.
"""
import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# =============================================================================
# APPLICATION DEFINITION
# =============================================================================

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.humanize',
    'django.contrib.postgres',  # PostgreSQL specific features
]

THIRD_PARTY_APPS = [
    # Django REST Framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    
    # CORS
    'corsheaders',
    
    # Filtering & Search
    'django_filters',
    
    # API Documentation
    'drf_spectacular',
    
    # Storage
    'storages',
    
    # Extensions
    'django_extensions',
]

# Backend apps (from backend/apps/)
BACKEND_APPS = [
    'apps.accounts.apps.AccountsConfig',
    'apps.products.apps.ProductsConfig',
    'apps.categories.apps.CategoriesConfig',
    'apps.cart.apps.CartConfig',
    'apps.orders.apps.OrdersConfig',
    'apps.payments.apps.PaymentsConfig',
    'apps.pages.apps.PagesConfig',
    'apps.promotions.apps.PromotionsConfig',
    'apps.reviews.apps.ReviewsConfig',
    'apps.wishlist.apps.WishlistConfig',
    'storefront.apps.StorefrontConfig',
]

# Frontend templates and static files are at BASE_DIR.parent / 'frontend'
# No Django app needed - just template/static directories

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + BACKEND_APPS

# =============================================================================
# MIDDLEWARE
# =============================================================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# =============================================================================
# URL CONFIGURATION
# =============================================================================

ROOT_URLCONF = 'core.urls'

# =============================================================================
# TEMPLATES
# =============================================================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
            BASE_DIR.parent / 'frontend' / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'core.context_processors.site_settings',
                'core.context_processors.cart_context',
            ],
        },
    },
]

# =============================================================================
# WSGI / ASGI
# =============================================================================

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

# =============================================================================
# AUTHENTICATION
# =============================================================================

# =============================================================================
# AUTHENTICATION
# =============================================================================

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Password Hashing (Argon2 as primary)
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# =============================================================================
# INTERNATIONALIZATION
# =============================================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Supported languages
LANGUAGES = [
    ('en', 'English'),
    ('bn', 'বাংলা'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# =============================================================================
# STATIC FILES
# =============================================================================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR.parent / 'frontend' / 'static',
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# =============================================================================
# MEDIA FILES
# =============================================================================

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# =============================================================================
# DEFAULT SETTINGS
# =============================================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Sites Framework
SITE_ID = 1

# =============================================================================
# REST FRAMEWORK CONFIGURATION
# =============================================================================

REST_FRAMEWORK = {
    # Authentication
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    
    # Permissions
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    
    # Pagination
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 20,
    
    # Filtering
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    
    # Renderers
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    
    # Throttling
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'login': '5/minute',
    },
    
    # Exception Handling
    'EXCEPTION_HANDLER': 'core.exceptions.handlers.custom_exception_handler',
    
    # Schema
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    # Versioning
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1'],
    
    # Date/Time format
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%SZ',
    'DATE_FORMAT': '%Y-%m-%d',
    'TIME_FORMAT': '%H:%M:%S',
}

# =============================================================================
# SIMPLE JWT CONFIGURATION
# =============================================================================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# =============================================================================
# CORS CONFIGURATION
# =============================================================================

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-currency',
]

# =============================================================================
# API DOCUMENTATION (DRF-Spectacular)
# =============================================================================

SPECTACULAR_SETTINGS = {
    'TITLE': 'Bunoraa E-Commerce API',
    'DESCRIPTION': 'Premium e-commerce platform API for Bunoraa',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
    'COMPONENT_SPLIT_REQUEST': True,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
    },
    'TAGS': [
        {'name': 'auth', 'description': 'Authentication endpoints'},
        {'name': 'users', 'description': 'User management'},
        {'name': 'products', 'description': 'Product operations'},
        {'name': 'categories', 'description': 'Category management'},
        {'name': 'cart', 'description': 'Shopping cart'},
        {'name': 'orders', 'description': 'Order management'},
        {'name': 'payments', 'description': 'Payment processing'},
        {'name': 'reviews', 'description': 'Product reviews'},
        {'name': 'wishlist', 'description': 'User wishlist'},
        {'name': 'promotions', 'description': 'Promotions & coupons'},
    ],
}

# =============================================================================
# CELERY CONFIGURATION
# =============================================================================

CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@bunoraa.com')
SERVER_EMAIL = os.environ.get('SERVER_EMAIL', 'server@bunoraa.com')
EMAIL_SUBJECT_PREFIX = '[Bunoraa] '

# =============================================================================
# CACHING CONFIGURATION
# =============================================================================

# Cache timeout settings (in seconds)
CACHE_TIMEOUT_SHORT = 60 * 5  # 5 minutes
CACHE_TIMEOUT_MEDIUM = 60 * 60  # 1 hour
CACHE_TIMEOUT_LONG = 60 * 60 * 24  # 1 day

# =============================================================================
# SESSION CONFIGURATION
# =============================================================================

SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14  # 2 weeks
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# =============================================================================
# SECURITY SETTINGS
# =============================================================================

# CSRF Settings
CSRF_COOKIE_HTTPONLY = False  # Allow JS to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'

# X-Frame-Options
X_FRAME_OPTIONS = 'SAMEORIGIN'

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 10 * 1024 * 1024,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['file', 'mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Create logs directory if it doesn't exist
LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

# =============================================================================
# BUNORAA CUSTOM SETTINGS
# =============================================================================

BUNORAA_SETTINGS = {
    # Site Information
    'SITE_NAME': 'Bunoraa',
    'SITE_TAGLINE': 'Premium Shopping Experience',
    'SUPPORT_EMAIL': 'support@bunoraa.com',
    'SUPPORT_PHONE': '+880 1234 567890',
    
    # Currency
    'DEFAULT_CURRENCY': 'BDT',
    'CURRENCY_SYMBOL': '৳',
    
    # Pagination
    'PRODUCTS_PER_PAGE': 24,
    'REVIEWS_PER_PAGE': 10,
    'ORDERS_PER_PAGE': 10,
    
    # Cart
    'MAX_CART_ITEMS': 50,
    'CART_SESSION_KEY': 'cart_id',
    
    # Orders
    'ORDER_ID_PREFIX': 'BUN',
    'ORDER_ID_LENGTH': 8,
    
    # Reviews
    'MIN_REVIEW_LENGTH': 10,
    'MAX_REVIEW_LENGTH': 2000,
    'REVIEW_APPROVAL_REQUIRED': False,
    
    # Products
    'MAX_PRODUCT_IMAGES': 10,
    'IMAGE_MAX_SIZE_MB': 5,
    'ALLOWED_IMAGE_TYPES': ['image/jpeg', 'image/png', 'image/webp'],
    
    # Promotions
    'MAX_COUPON_USES_PER_USER': 1,
    'COUPON_CODE_LENGTH': 8,
    
    # Search
    'SEARCH_MIN_CHARS': 2,
    'SEARCH_MAX_RESULTS': 100,
}
