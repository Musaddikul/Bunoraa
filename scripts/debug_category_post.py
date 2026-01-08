import os
import sys
from pathlib import Path
# Ensure project root on path when running script directly
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault('DJANGO_SETTINGS_MODULE','core.settings')
import django
django.setup()
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
User = get_user_model()
client = APIClient()
# Ensure host bypasses ALLOWED_HOSTS middleware during ad-hoc runs
client.defaults['HTTP_HOST'] = 'localhost'
admin, created = User.objects.get_or_create(email='admin2@example.com', defaults={'is_superuser': True, 'is_staff': True})
if created:
    admin.set_password('adminpass123')
    admin.save()
client.force_authenticate(user=admin)
resp = client.post('/api/v1/categories/', {'name':'New Category'})
# Print status and detailed content for debugging
print('status:', resp.status_code)
if hasattr(resp, 'data'):
    print('data:', resp.data)
else:
    print('content:', resp.content)

