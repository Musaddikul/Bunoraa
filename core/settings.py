# core/settings.py
import os
from pathlib import Path
import environ
from django.urls import reverse_lazy
from decouple import config, Csv, UndefinedValueError
from django.core.cache import cache
from logging.handlers import TimedRotatingFileHandler
from datetime import timedelta
import dj_database_url


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

LOG_DIR = Path(BASE_DIR) / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
os.environ['U2NET_HOME'] = os.path.join(BASE_DIR, '')

# Initialize environment variables
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

try:
    SECRET_KEY = config('SECRET_KEY')
except UndefinedValueError:
    from django.core.management.utils import get_random_secret_key
    SECRET_KEY = get_random_secret_key()
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.onrender.com',
    'bunoraa.onrender.com',
    '.railway.app',
    'bunoraa.up.railway.app',
    'bunoraa.com',
]
SITE_URL = env('SITE_URL', default="http://localhost:8000")
SITE_ID = 1

ROOT_HOSTCONF = 'core.hosts'
DEFAULT_HOST = 'www'

# Application definition
INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.humanize',
    'django.contrib.sitemaps',
    
    # Third-party apps - Infrastructure
    'django_hosts',
    'django_extensions',
    'django_browser_reload',
    'channels',
    'corsheaders',
    'storages',
    
    # Third-party apps - REST API
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    
    # Third-party apps - Admin enhancements
    'debug_toolbar',
    'django_admin_listfilter_dropdown',
    'rangefilter',
    
    # Third-party apps - Tailwind & Forms
    'tailwind',
    'theme',
    'crispy_forms',
    'crispy_tailwind',
    'widget_tweaks',
    
    # Third-party apps - Authentication
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.microsoft',
    
    # Third-party apps - Features
    'django_countries',
    'phonenumber_field',
    'django_ckeditor_5',
    'django_htmx',
    'taggit',
    'mptt',
    
    # Third-party apps - Tasks & Scheduling
    'django_celery_beat',
    
    # Third-party apps - Internationalization
    'rosetta',
    
    # Local apps - Core
    'core',
    'accounts',
    
    # Local apps - Products & Catalog
    'products',
    'reviews',
    
    # Local apps - Shopping
    'cart',
    'wishlist',
    'orders',
    'custom_order',
    
    # Local apps - Payments & Shipping
    'payments',
    'shipping',
    'returns',
    
    # Local apps - Marketing
    'promotions',
    'notifications',
    
    # Local apps - Content & Support
    'cms',
    'faq',
    'legal',
    'support',
    'contacts',
    
    # Local apps - Analytics & Settings
    'analytics',
    'currencies',
    'locations',
    
    # Storefront
    'storefront',
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['GET', 'POST', 'OPTIONS']
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
]
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000',
])
if DEBUG:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        },
    }
else:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                "hosts": [os.environ.get('REDIS_URL', 'redis://red-d24dtc2dbo4c73akdg9g:6379')],
            },
        },
    }

if DEBUG:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/0'),
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
                'CONNECTION_POOL_KWARGS': {
                    'max_connections': 100
                }
            }
        }
    }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'standard': '60/minute',
        'burst': '10/second',
    },
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardResultsPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] + (['rest_framework.renderers.BrowsableAPIRenderer'] if DEBUG else []),
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
    'EXCEPTION_HANDLER': 'core.exceptions.handlers.custom_exception_handler',
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1'],
    'VERSION_PARAM': 'version',
}

# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

customColorPalette = [
    {'color': 'hsl(4, 90%, 58%)', 'label': 'Red'},
    {'color': 'hsl(340, 82%, 52%)', 'label': 'Pink'},
    {'color': 'hsl(291, 64%, 42%)', 'label': 'Purple'},
    {'color': 'hsl(262, 52%, 47%)', 'label': 'Deep Purple'},
    {'color': 'hsl(231, 48%, 48%)', 'label': 'Indigo'},
    {'color': 'hsl(207, 90%, 54%)', 'label': 'Blue'},
]

CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                   'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', 'sourceEditing'],
    },
    'extends': {
        'blockToolbar': [
            'paragraph', 'heading1', 'heading2', 'heading3',
            '|',
            'bulletedList', 'numberedList',
            '|',
            'blockQuote',
        ],
        'toolbar': [
            'heading', '|',
            'outdent', 'indent', '|',
            'bold', 'italic', 'link', 'underline', 'strikethrough',
            'code', 'subscript', 'superscript', 'highlight', '|',
            'codeBlock', 'sourceEditing', 'insertImage', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'blockQuote', 'imageUpload', '|',
            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 
            'mediaEmbed', 'removeFormat', 'insertTable'
        ],
        'image': {
            'toolbar': [
                'imageTextAlternative', '|', 
                'imageStyle:alignLeft', 'imageStyle:alignRight', 
                'imageStyle:alignCenter', 'imageStyle:side', '|'
            ],
            'styles': [
                'full',
                'side',
                'alignLeft',
                'alignRight',
                'alignCenter',
            ]
        },
        'table': {
            'contentToolbar': [
                'tableColumn', 'tableRow', 'mergeTableCells',
                'tableProperties', 'tableCellProperties'
            ],
            'tableProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            },
            'tableCellProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            }
        },
        'heading': {
            'options': [
                {'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph'},
                {'model': 'heading1', 'view': 'h1', 'title': 'Heading 1', 'class': 'ck-heading_heading1'},
                {'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2'},
                {'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3'}
            ]
        },
        'htmlSupport': {
            'allow': [
                {'name': '/.*/', 'attributes': True, 'classes': True, 'styles': True}
            ]
        },
    }
}

CKEDITOR_5_CUSTOM_CSS = 'css/ckeditor5_dark_mode.css'

MIDDLEWARE = [
    'django_hosts.middleware.HostsRequestMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django_htmx.middleware.HtmxMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'cart.middleware.CartMiddleware',
    'cart.middleware.AbandonedCartNotificationMiddleware',
    'django_hosts.middleware.HostsResponseMiddleware',
]

# Add debug toolbar middleware in development
if DEBUG:
    MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
    MIDDLEWARE.append('django_browser_reload.middleware.BrowserReloadMiddleware')

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'backend', 'frontend', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'products.context_processors.categories',
                'products.context_processors.cart',
                'products.context_processors.site_settings',
                'currencies.context_processors.currency_context',
                'accounts.context_processors.user_settings_context',
                'core.context_processors.active_languages',
                'core.context_processors.bunoraa_config',
            ],
        },
    },
]

ASGI_APPLICATION = 'core.asgi.application'
WSGI_APPLICATION = 'core.wsgi.application'

# Database
if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DB_NAME', default='bunoraa'),
            'USER': env('DB_USER', default='bunoraa'),
            'PASSWORD': env('DB_PASSWORD', default=''),
            'HOST': env('DB_HOST', default='localhost'),
            'PORT': env('DB_PORT', default='5252'),
        }
    }

else:
    DATABASES = {
        'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
    }

# # Database
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('bn', 'বাংলা'), # Bangla
]

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

# Rosetta auto-translation
ROSETTA_GOOGLE_API_KEY = env('GOOGLE_TRANSLATE_API_KEY', default='')
ROSETTA_GOOGLE_TRANSLATE = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'backend', 'frontend', 'static'),
]

# WhiteNoise for static file serving
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

TAILWIND_APP_NAME = 'theme'
INTERNAL_IPS = ['127.0.0.1']

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'accounts.backends.MultiFieldAuthBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

APPEND_SLASH = True
AUTH_USER_MODEL = 'accounts.User'
ANONYMOUS_USER_ID = None

LOGIN_URL = '/accounts/login'
LOGIN_REDIRECT_URL = '/accounts/profile/'
LOGOUT_REDIRECT_URL = '/'

ACCOUNT_LOGIN_METHODS = {'email', 'username'}
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_UNIQUE_USERNAME = True
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_SIGNUP_DISABLED = False

SOCIALACCOUNT_LOGIN_ON_GET=True
SOCIALACCOUNT_SIGNUP_REDIRECT_URL = '/'
# SOCIALACCOUNT_ADAPTER = 'accounts.adapters.CustomSocialAccountAdapter'

ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
# ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = reverse_lazy('accounts:profile')

ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_SESSION_REMEMBER = True

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

ACCOUNT_FORMS = {
    'signup': 'allauth.account.forms.SignupForm',
    'login': 'allauth.account.forms.LoginForm',
    'reset_password': 'allauth.account.forms.ResetPasswordForm',
    'reset_password_from_key': 'allauth.account.forms.SetPasswordForm',
    'signup': 'accounts.forms.CustomSignupForm',
    'login': 'accounts.forms.CustomLoginForm',
    'reset_password': 'accounts.forms.CustomPasswordResetForm',
    'reset_password_from_key': 'accounts.forms.CustomSetPasswordForm',
}

# Social Authentication
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {
            'access_type': 'online',
            'prompt': 'select_account',
        },
        'APP': {
            'client_id': env('GOOGLE_CLIENT_ID', default=''),
            'secret': env('GOOGLE_CLIENT_SECRET', default=''),
            'key': '',
        },
    },
    'facebook': {
        'METHOD': 'oauth2',
        'SDK_URL': '//connect.facebook.net/{locale}/sdk.js',
        'SCOPE': ['email', 'public_profile'],
        'AUTH_PARAMS': {
            'auth_type': 'reauthenticate',
        },
        'INIT_PARAMS': {
            'cookie': True,
        },
        'FIELDS': [
            'id',
            'first_name',
            'last_name',
            'name',
            'name_format',
            'picture',
            'short_name',
        ],
        'EXCHANGE_TOKEN': True,
        'LOCALE_FUNC': lambda request: 'en_US',
        'VERIFIED_EMAIL': False,
        'VERSION': 'v13.0',
        'APP': {
            'client_id': env('FACEBOOK_CLIENT_ID', default=''),
            'secret': env('FACEBOOK_CLIENT_SECRET', default=''),
            'key': '',
        },
    },
    'microsoft': {
        'tenant': 'organizations',
        'APP': {
            'client_id': env('MICROSOFT_CLIENT_ID', default=''),
            'secret': env('MICROSOFT_CLIENT_SECRET', default=''),
            'key': '',
        },
    },
}

SOCIAL_REDIRECT_URIS = {
    'google': env('GOOGLE_REDIRECT_URI', default='http://localhost:8000/accounts/google/login/callback/'),
    'facebook': env('FACEBOOK_REDIRECT_URI', default='http://localhost:8000/accounts/facebook/login/callback/'),
    'microsoft': env('MICROSOFT_REDIRECT_URI', default='http://localhost:8000/accounts/microsoft/login/callback/'),
}

# Email configuration
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env.int('EMAIL_PORT')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

GOOGLE_API_KEY = env('GOOGLE_API_KEY')

AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME')
AWS_S3_CUSTOM_DOMAIN = f"{env('AWS_STORAGE_BUCKET_NAME')}.s3.amazonaws.com"
AWS_DEFAULT_ACL = None
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}


SSLCOMMERZ_STORE_ID = env('SSLCOMMERZ_STORE_ID')
SSLCOMMERZ_STORE_PASS = env('SSLCOMMERZ_STORE_PASS')
SSLCOMMERZ_SANDBOX = env('SSLCOMMERZ_SANDBOX', default=True)
SSLCOMMERZ_API_URL  =env('SSLCOMMERZ_API_URL')
SSLCOMMERZ_VALIDATION_URL = env('SSLCOMMERZ_VALIDATION_URL')


# Crispy Forms
CRISPY_ALLOWED_TEMPLATE_PACKS = "tailwind"
CRISPY_TEMPLATE_PACK = "tailwind"

# Session settings
CART_ABANDONMENT_MINUTES = 300
CART_SESSION_ID = 'cart'
WISHLIST_SESSION_ID = 'wishlist'

REVIEW_BLACKLISTED_KEYWORDS = [
    'spam',
    'scam',
    'fake',
    'viagra',
    'porn',
    # Add more as needed
]

# URL for an external sentiment analysis API
# Example: 'https://api.sentiment-provider.com/analyze'
SENTIMENT_API_URL = os.environ.get('SENTIMENT_API_URL') # Best practice to use environment variable
# SENTIMENT_API_URL = 'http://localhost:8001/sentiment-analyzer/analyze/' # Example if running a local service

# Optional: Minimum sentiment score for automatic approval (e.g., if score is below -0.5, disapprove)
REVIEW_MIN_SENTIMENT_SCORE = -0.5

AUTO_PROCESS_PRODUCTS = env('AUTO_PROCESS_PRODUCTS', default=True)

OUR_WAREHOUSE_ADDRESS = {
    'address_line1': 'Bozra, Ulipur',
    'city': 'Kurigram',
    'state': 'Rangpur Division',
    'postal_code': '5621',
    'country': 'Bangladesh',
    'phone_number': '+880701922629',
    'contact_name': 'Musaddikul'
} 

# Celery Configuration
if DEBUG:
    CELERY_TASK_ALWAYS_EAGER = True
    CELERY_BROKER_URL = 'memory://'
    CELERY_RESULT_BACKEND = 'db+sqlite:///results.sqlite3'
else:
    CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://localhost:6379/1')

# Additional Celery settings
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Dhaka' # Ensure this matches your Django TIME_ZONE
CELERY_TASK_TRACK_STARTED = True # Useful for monitoring tasks
CELERY_TASK_ALWAYS_EAGER = False # Set to True for synchronous execution in tests/dev if needed
CELERY_WORKER_SEND_TASK_EVENTS = True
CELERY_WORKER_STATE_DB = 'celery_worker_state.db'
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'find-and-notify-abandoned-carts': {
        'task': 'cart.tasks.find_and_notify_abandoned_carts',
        'schedule': timedelta(hours=1),
    },
    'update-exchange-rates': {
        'task': 'currencies.tasks.update_exchange_rates',
        'schedule': timedelta(days=30),
    },
}

OPENAI_API_KEY = env('OPENAI_API_KEY')
MANNEQUIN_IMAGE_PATH = os.path.join(BASE_DIR, 'media/mannequin/male_base.png')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': "[{asctime}] {levelname} [{name}] {message}",
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'level': 'DEBUG',
        },
        'file_products': {
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': os.path.join(LOG_DIR, 'products.log'),
            'when': 'midnight',
            'interval': 1,
            'backupCount': 7,
            'formatter': 'verbose',
            'delay': True,
            'encoding': 'utf-8',
            'utc': True
        },
        'file_celery': {
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': os.path.join(LOG_DIR, 'celery_tasks.log'),
            'when': 'midnight',
            'interval': 1,
            'backupCount': 7,
            'formatter': 'verbose',
            'encoding': 'utf-8',
            'utc': True
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'custom_order': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'promotions': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'shipping': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'payments': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'products': {
            'handlers': ['console', 'file_products'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'celery': {
            'handlers': ['console', 'file_celery'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'kombu': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'celery.app.trace': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'cms': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'notifications': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'legal': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'faq': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'orders': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'cart': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'analytics': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'core': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'returns': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'reviews': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'support': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'wishlist': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        '': {
            'handlers': ['console'],
            'level': 'WARNING',
        }
    }
}

# ExchangeRate-API configuration
EXCHANGERATE_API_KEY = env('EXCHANGERATE_API_KEY', default='your_api_key_here')

# # Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    CSRF_COOKIE_SECURE = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

else:
    # Development security settings
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False


# =============================================================================
# Additional Feature Configurations
# =============================================================================

# Session Configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 60 * 60 * 24 * 30  # 30 days
SESSION_COOKIE_NAME = 'bunoraa_session'
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = True

# Phone Number Configuration
PHONENUMBER_DEFAULT_REGION = 'BD'
PHONENUMBER_DB_FORMAT = 'NATIONAL'

# Taggit Configuration
TAGGIT_CASE_INSENSITIVE = True

# Django Countries Configuration
COUNTRIES_FIRST = ['BD', 'US', 'GB', 'CA', 'AU']
COUNTRIES_FIRST_SORT = False

# Messages Configuration
MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'

# File Upload Configuration
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000

# Django Debug Toolbar Configuration
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
    'INTERCEPT_REDIRECTS': False,
}

# MPTT Configuration
MPTT_ADMIN_LEVEL_INDENT = 20

# Currency Settings
DEFAULT_CURRENCY = 'BDT'
SUPPORTED_CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']

# Shipping Settings
FREE_SHIPPING_THRESHOLD = 5000  # In default currency (BDT)
DEFAULT_SHIPPING_COST = 60  # In default currency (BDT)

# Order Settings
ORDER_ID_PREFIX = 'BNR'
MIN_ORDER_AMOUNT = 100  # Minimum order amount in default currency

# Review Settings
REVIEW_REQUIRE_PURCHASE = True
REVIEW_REQUIRE_MODERATION = False
REVIEW_ALLOW_ANONYMOUS = False

# Notification Settings
NOTIFICATION_CHANNELS = ['email', 'sms', 'push', 'in_app']
NOTIFICATION_DEFAULT_SENDER = 'Bunoraa <noreply@bunoraa.com>'

# Analytics Settings
ANALYTICS_ENABLED = True
ANALYTICS_TRACKING_ID = env('ANALYTICS_TRACKING_ID', default='')

# Feature Flags
FEATURES = {
    'ENABLE_REVIEWS': True,
    'ENABLE_WISHLIST': True,
    'ENABLE_COMPARE': True,
    'ENABLE_MULTI_CURRENCY': True,
    'ENABLE_MULTI_LANGUAGE': True,
    'ENABLE_SOCIAL_LOGIN': True,
    'ENABLE_GUEST_CHECKOUT': True,
    'ENABLE_COUPONS': True,
    'ENABLE_FLASH_SALES': True,
    'ENABLE_PRODUCT_RECOMMENDATIONS': True,
    'ENABLE_RECENTLY_VIEWED': True,
    'ENABLE_SMS_NOTIFICATIONS': False,
    'ENABLE_PUSH_NOTIFICATIONS': False,
}

# API Rate Limiting (per user)
API_RATE_LIMITS = {
    'default': '1000/hour',
    'search': '100/minute',
    'checkout': '10/minute',
    'auth': '20/minute',
}

# Cache Timeouts (in seconds)
CACHE_TIMEOUTS = {
    'categories': 60 * 60,  # 1 hour
    'products': 60 * 15,     # 15 minutes
    'settings': 60 * 60,     # 1 hour
    'exchange_rates': 60 * 60 * 24,  # 24 hours
    'user_cart': 60 * 5,     # 5 minutes
}
