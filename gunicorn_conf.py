import multiprocessing
import os

workers = int(os.environ.get('GUNICORN_WORKERS', max(2, multiprocessing.cpu_count() * 2 + 1)))
bind = '0.0.0.0:' + os.environ.get('PORT', '8000')
preload_app = True
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '120'))
graceful_timeout = int(os.environ.get('GUNICORN_GRACEFUL_TIMEOUT', '30'))
keepalive = int(os.environ.get('GUNICORN_KEEPALIVE', '120'))
worker_tmp_dir = '/dev/shm'
# Consider gthread for improved concurrency on blocking operations
worker_class = os.environ.get('GUNICORN_WORKER_CLASS', 'gthread')
threads = int(os.environ.get('GUNICORN_THREADS', '4'))

# Log configuration
accesslog = '-'
errorlog = '-'
loglevel = 'info'
