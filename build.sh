#!/usr/bin/env bash
set -euo pipefail

# Install dependencies already handled by Render
echo "Starting build script..."
pip install -r requirements.txt
pip install -r requirements-ml.txt

# Run migrations and collectstatic
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Prerender initial set of pages (best-effort)
python manage.py prerender_top --categories=10 --products=20 --include-static || true

# Setup periodic tasks if django-celery-beat is present
python manage.py setup_seo_schedules || true

echo "Build script completed."