# custom_order/emails.py
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from .tasks import send_bulk_email

def send_order_confirmation(order):
    subject = f"Your Custom Order {order.order_id} is Received"
    txt  = render_to_string("custom_order/emails/confirmation.txt", {'order': order})
    html = render_to_string("custom_order/emails/confirmation.html", {'order': order})
    msg = EmailMultiAlternatives(subject, txt, settings.DEFAULT_FROM_EMAIL, [order.email or order.user.email])
    msg.attach_alternative(html, "text/html")
    send_bulk_email.delay(msg)  # Celery task

def send_status_update(order):
    subject = f"Order {order.order_id} Status Updated to {order.get_status_display()}"
    html = render_to_string("custom_order/emails/status_update.html", {'order': order})
    send_bulk_email.delay(EmailMultiAlternatives(subject, "", settings.DEFAULT_FROM_EMAIL, [order.email or order.user.email], alternatives=[(html,"text/html")]))
