# orders/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from weasyprint import HTML
from django.utils import timezone
from datetime import timedelta
from .models import Order, OrderStatus
from payments.models import Payment
import tempfile
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_email_task(order_id, email_type, reason=None):
    """
    Asynchronous task to send an order-related email.
    """
    try:
        order = Order.objects.get(pk=order_id)
        subject_map = {
            'confirmation': f"Order Confirmation: {order.order_number}",
            'shipped': f"Your Order Has Shipped: {order.order_number}",
            'cancellation': f"Order Cancelled: {order.order_number}",
        }
        template_map = {
            'confirmation': 'orders/emails/order_confirmation.html',
            'shipped': 'orders/emails/order_shipped.html',
            'cancellation': 'orders/emails/order_cancellation.html',
        }

        subject = subject_map.get(email_type, "Update on your order")
        template_name = template_map.get(email_type)
        
        context = {'order': order, 'reason': reason}
        html_message = render_to_string(template_name, context)
        
        if not order.user.email:
            logger.error(f"Cannot send email for order {order.id}: User {order.user.id} has no email address.")
            return

        logger.debug(f"Attempting to send email for order {order.id} to {order.user.email}")
        send_mail(
            subject,
            '', # Plain text version can be added here
            settings.DEFAULT_FROM_EMAIL,
            [order.user.email],
            html_message=html_message
        )
    except Order.DoesNotExist:
        # Log this error
        return

@shared_task
def generate_invoice_task(order_id):
    """
    Asynchronous task to generate a PDF invoice and save its URL.
    """
    try:
        order = Order.objects.get(pk=order_id)
        context = {'order': order}
        html_string = render_to_string("orders/invoice.html", context)
        
        # In a real enterprise app, this would upload to cloud storage (e.g., S3)
        # and save the public URL. For now, we simulate it.
        # pdf_url = upload_to_s3(pdf_file)
        # order.invoice_url = pdf_url
        # order.save(update_fields=['invoice_url'])
        
    except Order.DoesNotExist:
        # Log this error
        return

@shared_task
def process_pending_orders():
    """
    Periodically checks orders that are in 'pending' status, and processes them.
    It can move them to 'processing', cancel orders if they have been pending too long, etc.
    """
    now = timezone.now()
    pending_orders = Order.objects.filter(status__name='pending')

    for order in pending_orders:
        # Check if the order has been in the 'pending' status for too long (e.g., 24 hours)
        time_in_pending = now - order.created_at

        if time_in_pending > timedelta(hours=24):
            # If an order has been pending for more than 24 hours, it can be automatically cancelled
            order_status_cancelled = OrderStatus.objects.get(name='Cancelled')
            order.status = order_status_cancelled
            order.save()
            # Optionally, restock items or perform other actions
            for item in order.items.all():
                item.product.stock += item.quantity
                item.product.save()

            # Send cancellation email (you may already be doing this via signals, but you can add here)
            EmailService.send_order_cancellation(order.id, reason="Order cancelled due to inactivity")
            print(f"Order {order.order_number} has been automatically cancelled due to inactivity.")
        
        else:
            # Check if the order's payment has been completed, and if so, move to 'processing' status
            if order.payment and order.payment.status == 'completed':
                order_status_processing = OrderStatus.objects.get(name='Processing')
                order.status = order_status_processing
                order.save()

                # Additional actions, like notifying the user or generating invoices, can go here
                # EmailService.send_order_processing(order.id)  # Example of sending an email

                print(f"Order {order.order_number} has been moved to 'Processing'.")
            
            else:
                # Log if the payment isn't complete yet
                print(f"Order {order.order_number} is still pending payment.")
