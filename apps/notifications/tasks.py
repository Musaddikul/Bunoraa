# apps/notifications/tasks.py
"""
Notification Tasks
Celery tasks for sending notifications.
"""
from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings


@shared_task
def send_order_notification(order_id, event_type):
    """Send notification for order events."""
    from .models import Notification, EmailTemplate
    from apps.orders.models import Order
    
    try:
        order = Order.objects.get(pk=order_id)
        
        # Determine notification content based on event
        notifications_map = {
            'created': {
                'title': f'Order #{order.order_number} Confirmed',
                'message': f'Thank you for your order! Your order #{order.order_number} has been received.',
                'template': 'order_confirmation'
            },
            'confirmed': {
                'title': f'Order #{order.order_number} Confirmed',
                'message': f'Your order #{order.order_number} has been confirmed and is being processed.',
                'template': 'order_confirmed'
            },
            'shipped': {
                'title': f'Order #{order.order_number} Shipped',
                'message': f'Your order #{order.order_number} has been shipped! Tracking: {order.tracking_number}',
                'template': 'order_shipped'
            },
            'delivered': {
                'title': f'Order #{order.order_number} Delivered',
                'message': f'Your order #{order.order_number} has been delivered. Enjoy!',
                'template': 'order_delivered'
            },
            'cancelled': {
                'title': f'Order #{order.order_number} Cancelled',
                'message': f'Your order #{order.order_number} has been cancelled.',
                'template': 'order_cancelled'
            }
        }
        
        if event_type not in notifications_map:
            return
        
        config = notifications_map[event_type]
        
        # Create in-app notification
        notification = Notification.objects.create(
            user=order.user,
            type=Notification.Type.ORDER,
            title=config['title'],
            message=config['message'],
            order=order,
            action_url=f'/orders/{order.order_number}/',
            action_text='View Order'
        )
        
        # Send email
        send_notification_email.delay(notification.id, config['template'])
        
    except Order.DoesNotExist:
        pass


@shared_task
def send_notification_email(notification_id, template_code):
    """Send notification email."""
    from .models import Notification, EmailTemplate
    from django.utils import timezone
    
    try:
        notification = Notification.objects.get(pk=notification_id)
        
        # Check user preferences
        prefs = getattr(notification.user, 'notification_preferences', None)
        if prefs and notification.type == Notification.Type.ORDER and not prefs.email_orders:
            return
        
        # Get email template
        template = EmailTemplate.objects.filter(code=template_code, is_active=True).first()
        
        if template:
            context = {
                'user': notification.user,
                'notification': notification,
                'order': notification.order,
                'site_name': 'Bunoraa',
            }
            subject, html_body, text_body = template.render(context)
        else:
            subject = notification.title
            html_body = f'<p>{notification.message}</p>'
            text_body = notification.message
        
        # Send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[notification.user.email]
        )
        email.attach_alternative(html_body, 'text/html')
        email.send()
        
        # Update notification
        notification.email_sent = True
        notification.email_sent_at = timezone.now()
        notification.save(update_fields=['email_sent', 'email_sent_at'])
        
    except Notification.DoesNotExist:
        pass


@shared_task
def send_promotional_email(user_ids, subject, message, html_message=None):
    """Send promotional email to multiple users."""
    from apps.accounts.models import User
    
    users = User.objects.filter(
        pk__in=user_ids,
        is_active=True,
        notification_preferences__email_promotions=True
    )
    
    for user in users:
        try:
            if html_message:
                email = EmailMultiAlternatives(
                    subject=subject,
                    body=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email]
                )
                email.attach_alternative(html_message, 'text/html')
                email.send()
            else:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email]
                )
        except Exception:
            continue
