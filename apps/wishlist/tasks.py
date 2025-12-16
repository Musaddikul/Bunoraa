"""
Wishlist Tasks
"""
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


@shared_task
def check_wishlist_price_drops():
    """Check for price drops on wishlist items and send notifications."""
    from .services import WishlistNotificationService
    count = WishlistNotificationService.check_price_drops()
    return f"Created {count} price drop notifications"


@shared_task
def check_wishlist_back_in_stock():
    """Check for items back in stock and send notifications."""
    from .services import WishlistNotificationService
    count = WishlistNotificationService.check_back_in_stock()
    return f"Created {count} back in stock notifications"


@shared_task
def check_wishlist_sales():
    """Check for items on sale and send notifications."""
    from .services import WishlistNotificationService
    count = WishlistNotificationService.check_sales()
    return f"Created {count} sale notifications"


@shared_task
def send_wishlist_notifications():
    """Send pending wishlist notifications via email."""
    from .models import WishlistNotification
    from django.utils import timezone
    
    notifications = WishlistNotification.objects.filter(
        is_sent=False
    ).select_related(
        'wishlist_item__product',
        'wishlist_item__wishlist__user'
    )[:100]  # Process in batches
    
    sent_count = 0
    
    for notification in notifications:
        try:
            user = notification.wishlist_item.wishlist.user
            product = notification.wishlist_item.product
            
            # Prepare email
            subject = f"Wishlist Update: {notification.get_notification_type_display()}"
            
            context = {
                'user': user,
                'notification': notification,
                'product': product,
                'site_name': getattr(settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/wishlist_notification.html', context
            )
            
            send_mail(
                subject=subject,
                message=notification.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=True
            )
            
            notification.mark_as_sent()
            sent_count += 1
            
        except Exception as e:
            # Log error but continue processing
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error sending wishlist notification: {e}")
    
    return f"Sent {sent_count} notifications"


@shared_task
def cleanup_expired_shares():
    """Clean up expired wishlist shares."""
    from .models import WishlistShare
    from django.utils import timezone
    
    expired = WishlistShare.objects.filter(
        expires_at__lt=timezone.now(),
        is_active=True
    )
    
    count = expired.update(is_active=False)
    return f"Deactivated {count} expired shares"
