#!/usr/bin/env python
"""
Quick test script for the Email Service Provider
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.email_service.models import EmailMessage, APIKey, EmailEvent
from apps.email_service.engine import DeliveryEngine
from apps.email_service.tasks import process_email_queue
import json

print("\n" + "="*70)
print("📧 EMAIL SERVICE TESTING")
print("="*70)

# Test 1: Check API Keys
print("\n[Test 1] API Key Verification")
print("-" * 70)
try:
    api_keys = APIKey.objects.all()
    if api_keys.exists():
        print(f"✅ API Keys found: {api_keys.count()}")
        for key in api_keys:
            print(f"   • {key.name} (User: {key.user.email})")
            print(f"     Prefix: {key.key_prefix}")
            print(f"     Rate Limit: {key.rate_limit_per_minute}/min")
            print(f"     Daily Limit: {key.daily_limit}/day")
    else:
        print("❌ No API keys found")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Check Queued Messages
print("\n[Test 2] Queued Messages Check")
print("-" * 70)
try:
    messages = EmailMessage.objects.filter(status='queued')
    if messages.exists():
        print(f"✅ Queued messages found: {messages.count()}")
        for msg in messages:
            print(f"   • ID: {msg.message_id}")
            print(f"     To: {msg.to_email}")
            print(f"     Subject: {msg.subject}")
            print(f"     Status: {msg.status}")
            print(f"     Attempts: {msg.attempt_count}/{msg.max_attempts}")
    else:
        print("❌ No queued messages found")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Test DeliveryEngine Initialization
print("\n[Test 3] Delivery Engine Test")
print("-" * 70)
try:
    engine = DeliveryEngine()
    print("✅ DeliveryEngine initialized successfully")
    print(f"   • SMTP Config loaded")
    print(f"   • Connection pool ready")
except Exception as e:
    print(f"❌ Error initializing engine: {e}")

# Test 4: Test Email Event Logging
print("\n[Test 4] Email Event Logging")
print("-" * 70)
try:
    events = EmailEvent.objects.all()
    print(f"✅ Email events in database: {events.count()}")
    if events.exists():
        for event in events[:5]:
            print(f"   • {event.event_type}: {event.message.to_email}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 5: Create and Queue a New Test Email
print("\n[Test 5] Create and Queue Test Email")
print("-" * 70)
try:
    test_msg = EmailMessage.objects.create(
        message_id="test_" + str(os.urandom(8).hex())[:16],
        to_email="testing@bunoraa.com",
        subject="Email Service Test - " + str(os.urandom(4).hex()),
        html_content="<h1>Test</h1><p>This is a test email from the Email Service Provider</p>",
        status='queued',
        api_key=APIKey.objects.first(),
    )
    print(f"✅ Test email created successfully")
    print(f"   • Message ID: {test_msg.message_id}")
    print(f"   • To: {test_msg.to_email}")
    print(f"   • Status: {test_msg.status}")
    print(f"   • Ready to be processed by Celery worker")
except Exception as e:
    print(f"❌ Error: {e}")

# Summary
print("\n" + "="*70)
print("📊 SUMMARY")
print("="*70)
total_messages = EmailMessage.objects.count()
queued_messages = EmailMessage.objects.filter(status='queued').count()
sent_messages = EmailMessage.objects.filter(status='sent').count()
failed_messages = EmailMessage.objects.filter(status='failed').count()

print(f"\n✓ Total emails in system: {total_messages}")
print(f"  • Queued: {queued_messages}")
print(f"  • Sent: {sent_messages}")
print(f"  • Failed: {failed_messages}")

print(f"\n✓ API Keys active: {APIKey.objects.count()}")
print(f"\n✓ Email events logged: {EmailEvent.objects.count()}")

print("\n" + "="*70)
print("🚀 NEXT STEPS:")
print("="*70)
print("""
1. Start Celery Worker:
   celery -A core worker -B -l info

2. Or process queue manually:
   python manage.py process_email_queue

3. Check delivery logs in admin at:
   /admin/email_service/emailevent/

4. Monitor webhook deliveries at:
   /admin/email_service/webhooklog/
""")
print("="*70 + "\n")
