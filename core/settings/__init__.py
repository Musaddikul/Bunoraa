# core/settings/__init__.py
"""
Bunoraa Settings Module
Enterprise-grade Django configuration with environment-based settings.
"""
import os

# Determine which settings module to use
environment = os.environ.get('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
elif environment == 'staging':
    from .staging import *
else:
    from .development import *
