"""
WSGI config for Bunoraa project.
"""
import os
import time
from pathlib import Path

# Load .env file before Django initializes
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

from django.core.wsgi import get_wsgi_application

_start_ts = time.time()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.s3')

application = get_wsgi_application()

# Log startup time for observability (useful to detect cold-starts)
try:
    _startup_time = time.time() - _start_ts
    print(f"WSGI application ready in {_startup_time:.2f}s")
except Exception:
    pass
