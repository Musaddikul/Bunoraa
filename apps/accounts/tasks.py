"""
Celery tasks for Accounts app.
Handles background tasks related to user management.
"""
import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger('bunoraa.accounts')


@shared_task
def cleanup_old_interactions(days: int = 730):
    """
    Clean up old user interaction data.
    Keeps the last 2 years by default.
    """
    logger.info(f"Cleaning up user interactions older than {days} days...")
    
    try:
        from apps.accounts.behavior_models import UserInteraction
        
        cutoff = timezone.now() - timedelta(days=days)
        deleted, _ = UserInteraction.objects.filter(created_at__lt=cutoff).delete()
        
        logger.info(f"Deleted {deleted} old user interactions")
        return {'deleted': deleted}
        
    except Exception as e:
        logger.error(f"Failed to cleanup interactions: {e}")
        return {'error': str(e)}


@shared_task
def cleanup_expired_tokens():
    """
    Clean up expired authentication tokens.
    """
    logger.info("Cleaning up expired tokens...")
    
    try:
        from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
        
        # Delete expired outstanding tokens
        expired = OutstandingToken.objects.filter(expires_at__lt=timezone.now())
        count = expired.count()
        
        # First delete associated blacklisted tokens
        BlacklistedToken.objects.filter(token__in=expired).delete()
        expired.delete()
        
        logger.info(f"Cleaned up {count} expired tokens")
        return {'deleted': count}
        
    except ImportError:
        logger.debug("JWT token blacklist not configured")
        return {'skipped': True}
    except Exception as e:
        logger.error(f"Failed to cleanup tokens: {e}")
        return {'error': str(e)}


@shared_task
def update_user_last_seen(user_id: int):
    """
    Update user's last seen timestamp.
    """
    try:
        from apps.accounts.models import User
        
        User.objects.filter(pk=user_id).update(last_seen=timezone.now())
        
    except Exception as e:
        logger.warning(f"Failed to update last seen for user {user_id}: {e}")


@shared_task
def send_welcome_email(user_id: int):
    """
    Send welcome email to new user.
    """
    logger.info(f"Sending welcome email to user {user_id}")
    
    try:
        from apps.accounts.models import User
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        from django.conf import settings
        
        user = User.objects.get(pk=user_id)
        
        context = {
            'user': user,
            'site_name': 'Bunoraa',
            'site_url': settings.SITE_URL,
        }
        
        html_message = render_to_string('emails/welcome.html', context)
        plain_message = render_to_string('emails/welcome.txt', context)
        
        send_mail(
            subject='Welcome to Bunoraa!',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Welcome email sent to {user.email}")
        return {'sent': True}
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        return {'error': str(e)}


@shared_task
def calculate_user_lifetime_value(user_id: int):
    """
    Calculate and update user's lifetime value.
    """
    try:
        from apps.accounts.models import User
        from apps.accounts.behavior_models import UserBehaviorProfile
        from apps.orders.models import Order
        from django.db.models import Sum
        
        user = User.objects.get(pk=user_id)
        profile, _ = UserBehaviorProfile.objects.get_or_create(user=user)
        
        # Calculate total spent
        total = Order.objects.filter(
            user=user,
            status__in=['completed', 'delivered'],
            is_deleted=False,
        ).aggregate(total=Sum('total'))['total'] or 0
        
        profile.total_spent = total
        profile.save(update_fields=['total_spent'])
        
        return {'user_id': user_id, 'ltv': float(total)}
        
    except Exception as e:
        logger.error(f"Failed to calculate LTV for user {user_id}: {e}")
        return {'error': str(e)}
