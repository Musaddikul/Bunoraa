"""
Notifications services
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template import Template, Context
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone

from .models import (
    Notification, NotificationType, NotificationChannel,
    NotificationPreference, EmailTemplate, EmailLog
)


class NotificationService:
    """Service for managing notifications."""
    
    @staticmethod
    def create_notification(
        user,
        notification_type,
        title,
        message,
        url=None,
        reference_type=None,
        reference_id=None,
        metadata=None,
        send_email=True,
        send_push=True
    ):
        """
        Create a notification for a user.
        
        Args:
            user: User instance
            notification_type: NotificationType value
            title: Notification title
            message: Notification message
            url: Optional URL to link to
            reference_type: Optional type of related object (e.g., 'order')
            reference_id: Optional ID of related object
            metadata: Optional additional data
            send_email: Whether to send email notification
            send_push: Whether to send push notification
        
        Returns:
            Notification instance
        """
        notification = Notification.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            url=url,
            reference_type=reference_type,
            reference_id=str(reference_id) if reference_id else None,
            metadata=metadata or {}
        )
        
        channels_sent = [NotificationChannel.IN_APP]
        
        # Get user preferences
        prefs = NotificationService._get_preferences(user)
        
        # Send email if enabled
        if send_email and NotificationService._should_send_email(prefs, notification_type):
            email_context = {
                'title': title,
                'message': message,
                'url': url,
            }
            if metadata:
                email_context.update(metadata)
            email_sent = EmailService.send_notification_email(
                user=user,
                notification_type=notification_type,
                context=email_context,
            )
            if email_sent:
                channels_sent.append(NotificationChannel.EMAIL)
        
        # Update channels sent
        notification.channels_sent = [c.value if hasattr(c, 'value') else c for c in channels_sent]
        notification.save(update_fields=['channels_sent'])
        
        return notification
    
    @staticmethod
    def _get_preferences(user):
        """Get or create notification preferences for user."""
        prefs, _ = NotificationPreference.objects.get_or_create(user=user)
        return prefs
    
    @staticmethod
    def _should_send_email(prefs, notification_type):
        """Check if email should be sent based on preferences."""
        email_type_map = {
            NotificationType.ORDER_PLACED: prefs.email_order_updates,
            NotificationType.ORDER_CONFIRMED: prefs.email_order_updates,
            NotificationType.ORDER_SHIPPED: prefs.email_shipping_updates,
            NotificationType.ORDER_DELIVERED: prefs.email_shipping_updates,
            NotificationType.ORDER_CANCELLED: prefs.email_order_updates,
            NotificationType.ORDER_REFUNDED: prefs.email_order_updates,
            NotificationType.PAYMENT_RECEIVED: prefs.email_order_updates,
            NotificationType.PAYMENT_FAILED: prefs.email_order_updates,
            NotificationType.REVIEW_APPROVED: prefs.email_reviews,
            NotificationType.REVIEW_REJECTED: prefs.email_reviews,
            NotificationType.PRICE_DROP: prefs.email_price_drops,
            NotificationType.BACK_IN_STOCK: prefs.email_back_in_stock,
            NotificationType.WISHLIST_SALE: prefs.email_promotions,
            NotificationType.PROMO_CODE: prefs.email_promotions,
        }
        return email_type_map.get(notification_type, True)
    
    @staticmethod
    def get_user_notifications(user, unread_only=False, limit=None):
        """Get notifications for a user."""
        queryset = Notification.objects.filter(user=user)
        if unread_only:
            queryset = queryset.filter(is_read=False)
        if limit:
            queryset = queryset[:limit]
        return queryset
    
    @staticmethod
    def get_unread_count(user):
        """Get count of unread notifications."""
        return Notification.objects.filter(user=user, is_read=False).count()
    
    @staticmethod
    def mark_as_read(notification_id, user):
        """Mark a notification as read."""
        notification = Notification.objects.filter(id=notification_id, user=user).first()
        if notification:
            notification.mark_as_read()
            return True
        return False
    
    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications as read."""
        Notification.objects.filter(user=user, is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
    
    @staticmethod
    def delete_notification(notification_id, user):
        """Delete a notification."""
        return Notification.objects.filter(id=notification_id, user=user).delete()[0] > 0


class EmailService:
    """Service for sending emails."""
    
    @staticmethod
    def send_notification_email(user, notification_type, context):
        """Send notification email to user."""
        template = EmailTemplate.objects.filter(
            notification_type=notification_type,
            is_active=True
        ).first()
        
        if not template:
            # Use default template
            subject = context.get('title', 'Notification from Bunoraa')
            message = context.get('message', '')
        else:
            # Render template
            subject = Template(template.subject).render(Context(context))
            message = Template(template.text_template).render(Context(context))
        
        # Create email log
        log = EmailLog.objects.create(
            recipient_email=user.email,
            recipient_user=user,
            notification_type=notification_type,
            subject=subject,
            reference_type=context.get('reference_type'),
            reference_id=context.get('reference_id')
        )
        
        try:
            if template and template.html_template:
                html_content = Template(template.html_template).render(Context(context))
                email = EmailMultiAlternatives(
                    subject=subject,
                    body=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email]
                )
                email.attach_alternative(html_content, 'text/html')
                email.send()
            else:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email]
                )
            
            log.status = EmailLog.STATUS_SENT
            log.sent_at = timezone.now()
            log.save(update_fields=['status', 'sent_at'])
            return True
            
        except Exception as e:
            log.status = EmailLog.STATUS_FAILED
            log.error_message = str(e)
            log.save(update_fields=['status', 'error_message'])
            return False
    
    @staticmethod
    def send_order_confirmation(order):
        """Send order confirmation email."""
        context = {
            'title': f'Order Confirmation - {order.order_number}',
            'message': f'Thank you for your order! Your order #{order.order_number} has been received.',
            'order': order,
            'order_number': order.order_number,
            'total': str(order.total_amount),
            'reference_type': 'order',
            'reference_id': str(order.id)
        }
        
        return NotificationService.create_notification(
            user=order.user,
            notification_type=NotificationType.ORDER_PLACED,
            title=context['title'],
            message=context['message'],
            url=f'/account/orders/{order.id}/',
            reference_type='order',
            reference_id=order.id,
            metadata={'order_number': order.order_number}
        )
    
    @staticmethod
    def send_order_shipped(order, tracking_number=None):
        """Send order shipped email."""
        message = f'Your order #{order.order_number} has been shipped!'
        if tracking_number:
            message += f' Tracking number: {tracking_number}'
        
        context = {
            'title': f'Order Shipped - {order.order_number}',
            'message': message,
            'order_number': order.order_number,
            'tracking_number': tracking_number,
            'reference_type': 'order',
            'reference_id': str(order.id)
        }
        
        return NotificationService.create_notification(
            user=order.user,
            notification_type=NotificationType.ORDER_SHIPPED,
            title=context['title'],
            message=context['message'],
            url=f'/account/orders/{order.id}/',
            reference_type='order',
            reference_id=order.id,
            metadata={
                'order_number': order.order_number,
                'tracking_number': tracking_number
            }
        )
    
    @staticmethod
    def send_password_reset(user, reset_url):
        """Send password reset email."""
        context = {
            'title': 'Password Reset Request',
            'message': f'Click the link below to reset your password:\n{reset_url}',
            'reset_url': reset_url,
            'user_name': user.get_full_name() or user.email
        }
        
        return NotificationService.create_notification(
            user=user,
            notification_type=NotificationType.PASSWORD_RESET,
            title=context['title'],
            message=context['message'],
            url=reset_url,
            send_push=False
        )
    
    @staticmethod
    def send_welcome_email(user):
        """Send welcome email to new user."""
        context = {
            'title': 'Welcome to Bunoraa!',
            'message': 'Thank you for creating an account. Start shopping now!',
            'user_name': user.get_full_name() or user.email
        }
        
        return NotificationService.create_notification(
            user=user,
            notification_type=NotificationType.ACCOUNT_CREATED,
            title=context['title'],
            message=context['message'],
            url='/',
            send_push=False
        )


class OrderNotificationService:
    """Service for order-related notifications."""
    
    @staticmethod
    def notify_order_placed(order):
        """Notify user when order is placed."""
        return EmailService.send_order_confirmation(order)
    
    @staticmethod
    def notify_order_confirmed(order):
        """Notify user when order is confirmed."""
        return NotificationService.create_notification(
            user=order.user,
            notification_type=NotificationType.ORDER_CONFIRMED,
            title=f'Order Confirmed - {order.order_number}',
            message=f'Your order #{order.order_number} has been confirmed and is being processed.',
            url=f'/account/orders/{order.id}/',
            reference_type='order',
            reference_id=order.id,
            metadata={'order_number': order.order_number}
        )
    
    @staticmethod
    def notify_order_shipped(order):
        """Notify user when order is shipped."""
        return EmailService.send_order_shipped(order, order.tracking_number)
    
    @staticmethod
    def notify_order_delivered(order):
        """Notify user when order is delivered."""
        return NotificationService.create_notification(
            user=order.user,
            notification_type=NotificationType.ORDER_DELIVERED,
            title=f'Order Delivered - {order.order_number}',
            message=f'Your order #{order.order_number} has been delivered!',
            url=f'/account/orders/{order.id}/',
            reference_type='order',
            reference_id=order.id,
            metadata={'order_number': order.order_number}
        )
    
    @staticmethod
    def notify_order_cancelled(order):
        """Notify user when order is cancelled."""
        return NotificationService.create_notification(
            user=order.user,
            notification_type=NotificationType.ORDER_CANCELLED,
            title=f'Order Cancelled - {order.order_number}',
            message=f'Your order #{order.order_number} has been cancelled.',
            url=f'/account/orders/{order.id}/',
            reference_type='order',
            reference_id=order.id,
            metadata={'order_number': order.order_number}
        )
