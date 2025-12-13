# apps/pages/tasks.py
"""
Pages Celery tasks.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_contact_notification(message_id):
    """Send notification to admin when contact form is submitted."""
    from .models import ContactMessage
    
    try:
        message = ContactMessage.objects.get(id=message_id)
    except ContactMessage.DoesNotExist:
        return
    
    subject = f'New Contact Form Submission: {message.subject}'
    
    body = f"""
New contact form submission received:

From: {message.name}
Email: {message.email}
Phone: {message.phone or 'Not provided'}
Subject: {message.subject}

Message:
{message.message}

---
Submitted at: {message.created_at}
"""
    
    # Send to admin email
    admin_email = getattr(settings, 'ADMIN_EMAIL', settings.DEFAULT_FROM_EMAIL)
    
    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[admin_email],
        fail_silently=True
    )


@shared_task
def send_contact_reply(message_id, reply_content):
    """Send reply to contact message."""
    from .models import ContactMessage
    
    try:
        message = ContactMessage.objects.get(id=message_id)
    except ContactMessage.DoesNotExist:
        return
    
    subject = f'Re: {message.subject}'
    
    body = f"""
Dear {message.name},

Thank you for contacting us.

{reply_content}

Best regards,
The Bunoraa Team
"""
    
    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[message.email],
        fail_silently=True
    )
