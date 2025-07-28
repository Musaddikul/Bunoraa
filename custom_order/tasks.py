# custom_order/tasks.py
from celery import shared_task
from django.core.mail import EmailMessage

@shared_task
def send_bulk_email(email_message: EmailMessage):
    email_message.send(fail_silently=False)
