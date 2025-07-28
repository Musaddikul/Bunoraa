# core/celery.py
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# Initialize Celery with the project name
app = Celery("core", broker='redis://localhost:6379/2')  # Explicitly set broker to db=2

# Configure Celery to read settings from Django settings file
app.config_from_object("django.conf:settings", namespace="CELERY")

# Automatically discover tasks in all registered Django app configs
app.autodiscover_tasks()

# Celery Worker Pool configuration using gevent (ideal for I/O-bound tasks)
app.conf.worker_pool = 'gevent'

# Add task routing configuration if needed, for example:
# app.conf.task_routes = {'yourapp.tasks.your_task_name': {'queue': 'your_queue_name'}}

# If you are using Celery Beat for periodic tasks:
app.conf.beat_schedule = {
    'process-pending-orders': {
        'task': 'orders.tasks.process_pending_orders',  # Update with your actual task path
        'schedule': crontab(minute=0, hour='*/1'),  # Every hour
    },
}

# Enable logging configuration
app.conf.update(
    task_track_started=True,
    worker_max_tasks_per_child=100,  # Optional: limit the number of tasks per worker
    result_backend='redis://localhost:6379/3',  # Store task results in Redis DB 3
    result_expires=3600,  # Expiry for task results (optional)
)

# Optionally, you can also configure Celery's retry behavior or time limits for tasks here.
