"""
Email Digest Service for Bunoraa

Provides:
- Daily notification digests
- Weekly summaries
- Batched email sending
- Digest preferences
"""
import logging
from typing import List, Dict, Any, Optional
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.db.models import Count, Q

logger = logging.getLogger('bunoraa.notifications.digest')


class DigestFrequency:
    """Digest frequency options."""
    IMMEDIATE = 'immediate'
    HOURLY = 'hourly'
    DAILY = 'daily'
    WEEKLY = 'weekly'
    NEVER = 'never'
    
    CHOICES = [
        (IMMEDIATE, 'Immediate'),
        (HOURLY, 'Hourly'),
        (DAILY, 'Daily'),
        (WEEKLY, 'Weekly'),
        (NEVER, 'Never'),
    ]


class DigestService:
    """
    Service for creating and sending notification digests.
    """
    
    @staticmethod
    def get_pending_digest_users(frequency: str) -> List[int]:
        """
        Get users who should receive a digest based on frequency.
        
        Returns list of user IDs.
        """
        from apps.notifications.models import Notification, NotificationPreference
        from apps.accounts.models import User
        
        now = timezone.now()
        
        # Calculate time window based on frequency
        if frequency == DigestFrequency.HOURLY:
            since = now - timedelta(hours=1)
        elif frequency == DigestFrequency.DAILY:
            since = now - timedelta(days=1)
        elif frequency == DigestFrequency.WEEKLY:
            since = now - timedelta(weeks=1)
        else:
            return []
        
        # Get users with unread notifications in the time window
        users_with_notifications = Notification.objects.filter(
            is_read=False,
            created_at__gte=since
        ).values_list('user_id', flat=True).distinct()
        
        # Filter by digest preference
        # For now, return all users with notifications
        # In production, check NotificationPreference.digest_frequency
        return list(users_with_notifications)
    
    @staticmethod
    def generate_digest(user_id: int, since: timezone.datetime = None) -> Optional[Dict[str, Any]]:
        """
        Generate digest content for a user.
        
        Returns dict with:
        - summary stats
        - notification groups by type
        - recommendations
        """
        from apps.notifications.models import Notification, NotificationType
        from apps.accounts.models import User
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
        
        if since is None:
            since = timezone.now() - timedelta(days=1)
        
        notifications = Notification.objects.filter(
            user_id=user_id,
            created_at__gte=since
        ).order_by('-created_at')
        
        if not notifications.exists():
            return None
        
        # Group by type
        by_type = {}
        for notif in notifications:
            if notif.type not in by_type:
                by_type[notif.type] = []
            by_type[notif.type].append({
                'id': str(notif.id),
                'title': notif.title,
                'message': notif.message,
                'url': notif.url,
                'is_read': notif.is_read,
                'created_at': notif.created_at
            })
        
        # Calculate stats
        stats = {
            'total': notifications.count(),
            'unread': notifications.filter(is_read=False).count(),
            'by_type': {k: len(v) for k, v in by_type.items()}
        }
        
        # Priority notifications (orders, payments)
        priority_types = [
            NotificationType.ORDER_PLACED,
            NotificationType.ORDER_SHIPPED,
            NotificationType.ORDER_DELIVERED,
            NotificationType.PAYMENT_RECEIVED,
            NotificationType.PAYMENT_FAILED
        ]
        
        priority_notifications = [
            n for n in notifications
            if n.type in priority_types
        ][:5]
        
        # Build digest
        digest = {
            'user': user,
            'user_name': user.get_full_name() or user.email,
            'user_email': user.email,
            'period_start': since,
            'period_end': timezone.now(),
            'stats': stats,
            'notifications_by_type': by_type,
            'priority_notifications': priority_notifications,
            'all_notifications': notifications[:20],
            'has_more': notifications.count() > 20
        }
        
        return digest
    
    @staticmethod
    def send_digest_email(user_id: int, digest: Dict[str, Any]) -> bool:
        """
        Send digest email to user.
        """
        from apps.notifications.models import EmailLog
        
        user = digest['user']
        
        # Render templates
        try:
            html_content = render_to_string('emails/digest/daily_digest.html', {
                'digest': digest,
                'user': user,
                'site_name': 'Bunoraa',
                'site_url': getattr(settings, 'SITE_URL', 'https://bunoraa.com'),
                'unsubscribe_url': f"{getattr(settings, 'SITE_URL', '')}/account/notifications/unsubscribe/"
            })
        except Exception as e:
            logger.error(f"Failed to render digest template: {e}")
            # Fallback to simple format
            html_content = DigestService._generate_simple_digest_html(digest)
        
        text_content = DigestService._generate_digest_text(digest)
        
        # Build subject
        unread = digest['stats']['unread']
        if unread == 1:
            subject = "You have 1 unread notification"
        else:
            subject = f"You have {unread} unread notifications"
        
        # Create log
        log = EmailLog.objects.create(
            recipient_email=user.email,
            recipient_user=user,
            notification_type='digest',
            subject=subject
        )
        
        try:
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email.attach_alternative(html_content, 'text/html')
            email.send()
            
            log.status = 'sent'
            log.sent_at = timezone.now()
            log.save(update_fields=['status', 'sent_at'])
            
            logger.info(f"Digest email sent to {user.email}")
            return True
            
        except Exception as e:
            log.status = 'failed'
            log.error_message = str(e)
            log.save(update_fields=['status', 'error_message'])
            
            logger.error(f"Failed to send digest to {user.email}: {e}")
            return False
    
    @staticmethod
    def _generate_simple_digest_html(digest: Dict[str, Any]) -> str:
        """Generate simple HTML digest when template not available."""
        notifications_html = ""
        
        for notif in digest['all_notifications'][:10]:
            notifications_html += f"""
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0 0 5px; color: #333;">{notif.title}</h3>
                    <p style="margin: 0; color: #666;">{notif.message}</p>
                    <small style="color: #999;">{notif.created_at.strftime('%b %d, %Y %H:%M')}</small>
                </td>
            </tr>
            """
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 30px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Bunoraa</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your Daily Digest</p>
                </div>
                
                <div style="padding: 30px;">
                    <p style="color: #333; font-size: 16px;">Hi {digest['user_name']},</p>
                    <p style="color: #666;">You have <strong>{digest['stats']['unread']}</strong> unread notifications.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        {notifications_html}
                    </table>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="{getattr(settings, 'SITE_URL', '')}/account/notifications/" 
                           style="display: inline-block; background: #6366F1; color: #fff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                            View All Notifications
                        </a>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                    <p>© 2025 Bunoraa. All rights reserved.</p>
                    <p>
                        <a href="{getattr(settings, 'SITE_URL', '')}/account/notifications/preferences/" style="color: #6366F1;">
                            Manage notification preferences
                        </a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
    
    @staticmethod
    def _generate_digest_text(digest: Dict[str, Any]) -> str:
        """Generate plain text digest."""
        lines = [
            f"Hi {digest['user_name']},",
            "",
            f"You have {digest['stats']['unread']} unread notifications.",
            "",
            "Recent notifications:",
            "-" * 40
        ]
        
        for notif in digest['all_notifications'][:10]:
            lines.extend([
                "",
                f"• {notif.title}",
                f"  {notif.message}",
                f"  {notif.created_at.strftime('%b %d, %Y %H:%M')}"
            ])
        
        lines.extend([
            "",
            "-" * 40,
            "",
            f"View all notifications: {getattr(settings, 'SITE_URL', '')}/account/notifications/",
            "",
            "Best regards,",
            "The Bunoraa Team"
        ])
        
        return "\n".join(lines)
    
    @staticmethod
    def process_daily_digests():
        """
        Process and send daily digests.
        Called by Celery beat task.
        """
        users = DigestService.get_pending_digest_users(DigestFrequency.DAILY)
        
        sent = 0
        failed = 0
        
        for user_id in users:
            digest = DigestService.generate_digest(
                user_id,
                since=timezone.now() - timedelta(days=1)
            )
            
            if digest and digest['stats']['unread'] > 0:
                success = DigestService.send_digest_email(user_id, digest)
                if success:
                    sent += 1
                else:
                    failed += 1
        
        logger.info(f"Daily digest processed: {sent} sent, {failed} failed")
        return {'sent': sent, 'failed': failed}
    
    @staticmethod
    def process_weekly_digests():
        """
        Process and send weekly digests.
        Called by Celery beat task.
        """
        users = DigestService.get_pending_digest_users(DigestFrequency.WEEKLY)
        
        sent = 0
        failed = 0
        
        for user_id in users:
            digest = DigestService.generate_digest(
                user_id,
                since=timezone.now() - timedelta(weeks=1)
            )
            
            if digest and digest['stats']['unread'] > 0:
                success = DigestService.send_digest_email(user_id, digest)
                if success:
                    sent += 1
                else:
                    failed += 1
        
        logger.info(f"Weekly digest processed: {sent} sent, {failed} failed")
        return {'sent': sent, 'failed': failed}


class NotificationBatcher:
    """
    Batches notifications to prevent email flood.
    """
    
    @staticmethod
    def should_batch(user_id: int, notification_type: str) -> bool:
        """
        Check if notification should be batched instead of sent immediately.
        
        Returns True if the user has received too many notifications recently.
        """
        from apps.notifications.models import EmailLog
        
        # Don't batch critical notifications
        critical_types = ['order_placed', 'payment_failed', 'password_reset']
        if notification_type in critical_types:
            return False
        
        # Check recent email count
        recent = EmailLog.objects.filter(
            recipient_user_id=user_id,
            created_at__gte=timezone.now() - timedelta(hours=1)
        ).count()
        
        # Batch if more than 5 emails in the last hour
        return recent >= 5
    
    @staticmethod
    def queue_for_digest(user_id: int, notification_type: str, context: dict):
        """
        Queue notification for next digest instead of sending immediately.
        
        The notification will be included in the next scheduled digest.
        """
        from apps.notifications.models import Notification
        
        # Just create the in-app notification
        # It will be picked up by the digest processor
        Notification.objects.create(
            user_id=user_id,
            type=notification_type,
            title=context.get('title', 'Notification'),
            message=context.get('message', ''),
            url=context.get('url'),
            metadata={**context, 'batched': True}
        )
        
        logger.info(f"Notification queued for digest: user={user_id}, type={notification_type}")
