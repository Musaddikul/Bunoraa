"""
WSGI config for Bunoraa project.
"""
import os
import time
from django.core.wsgi import get_wsgi_application

_start_ts = time.time()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# Log startup time for observability (useful to detect cold-starts)
try:
    _startup_time = time.time() - _start_ts
    print(f"WSGI application ready in {_startup_time:.2f}s")
except Exception:
    pass
