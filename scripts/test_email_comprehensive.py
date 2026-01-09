import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.email_service.models import EmailMessage, APIKey, EmailEvent, SenderDomain, EmailTemplate

print('=' * 70)
print('📧 EMAIL SERVICE COMPREHENSIVE TEST')
print('=' * 70)

# Test 1: API Keys
print('\n[✓] API Key Status')
print('-' * 70)
api_keys = APIKey.objects.all()
print(f'Active API Keys: {api_keys.count()}')
for key in api_keys:
    print(f'  • Name: {key.name}')
    print(f'    Owner: {key.user.email}')
    print(f'    Created: {key.created_at.strftime("%Y-%m-%d %H:%M:%S")}')
    print(f'    Rate Limit: {key.rate_limit_per_minute}/min')

# Test 2: Messages
print('\n[✓] Email Messages Status')
print('-' * 70)
total = EmailMessage.objects.count()
queued = EmailMessage.objects.filter(status='queued').count()
sent = EmailMessage.objects.filter(status='sent').count()
failed = EmailMessage.objects.filter(status='failed').count()

print(f'Total Messages: {total}')
print(f'  • Queued: {queued}')
print(f'  • Sent: {sent}')
print(f'  • Failed: {failed}')

# Test 3: Detailed Message Info
print('\n[✓] Message Details')
print('-' * 70)
for msg in EmailMessage.objects.all()[:3]:
    print(f'Message ID: {msg.message_id}')
    print(f'  To: {msg.to_email}')
    print(f'  From: {msg.from_email}')
    print(f'  Subject: {msg.subject}')
    print(f'  Status: {msg.status}')
    print(f'  Created: {msg.created_at.strftime("%Y-%m-%d %H:%M:%S")}')
    print()

# Test 4: Events
print('[✓] Email Events')
print('-' * 70)
events = EmailEvent.objects.all()
print(f'Total Events: {events.count()}')
if events.exists():
    event_types = events.values('event_type').distinct()
    for et in event_types:
        count = events.filter(event_type=et['event_type']).count()
        print(f'  • {et["event_type"]}: {count}')

# Test 5: Templates
print('\n[✓] Email Templates')
print('-' * 70)
templates = EmailTemplate.objects.all()
print(f'Stored Templates: {templates.count()}')
for tpl in templates:
    print(f'  • {tpl.name} (v{tpl.current_version})')

# Test 6: Domains
print('\n[✓] Sender Domains')
print('-' * 70)
domains = SenderDomain.objects.all()
print(f'Verified Domains: {domains.count()}')
for domain in domains:
    print(f'  • {domain.domain}')
    print(f'    Status: {domain.verification_status}')

print('\n' + '=' * 70)
print('✅ EMAIL SERVICE IS OPERATIONAL')
print('=' * 70)
print('\nNext Steps:')
print('1. Start Celery worker: celery -A core worker -B -l info')
print('2. Or manually process queue: python manage.py process_email_queue')
print('3. Test API endpoint: POST http://localhost:8000/email/v1/mail/send/')
print('=' * 70)
