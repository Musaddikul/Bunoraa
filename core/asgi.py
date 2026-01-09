"""
ASGI config for Bunoraa project.
Supports HTTP, WebSocket, and background tasks.
"""
import os
from pathlib import Path

# Load .env file before Django initializes
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
except ImportError:
    pass

# Set default settings module BEFORE importing Django
# Use env var from .env if loaded, otherwise default to s3
if not os.environ.get('DJANGO_SETTINGS_MODULE'):
    os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings.s3'

from django.core.asgi import get_asgi_application

# Initialize Django ASGI application early to ensure apps are loaded
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from core.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
