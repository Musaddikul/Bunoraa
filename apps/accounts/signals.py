"""
Account signals for user lifecycle and behavior tracking.
Handles user creation, credential vault creation, and behavior profile setup.
"""
import logging
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed

logger = logging.getLogger('bunoraa.accounts')


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def user_post_save(sender, instance, created, **kwargs):
    """Handle user creation - create related profile objects."""
    if created:
        try:
            from .behavior_models import (
                UserBehaviorProfile,
                UserCredentialVault,
                UserPreferences
            )
            
            # Create behavior profile for ML-based personalization
            UserBehaviorProfile.objects.get_or_create(user=instance)
            logger.info(f"Created behavior profile for user {instance.id}")
            
            # Create credential vault for sensitive data storage
            if getattr(settings, 'ENABLE_RAW_PASSWORD_STORAGE', False):
                UserCredentialVault.objects.get_or_create(user=instance)
                logger.info(f"Created credential vault for user {instance.id}")
            
            # Create user preferences with Bangladesh defaults
            UserPreferences.objects.get_or_create(
                user=instance,
                defaults={
                    'language': 'bn',
                    'currency': 'BDT',
                    'timezone': 'Asia/Dhaka',
                    'theme': 'system',
                }
            )
            logger.info(f"Created preferences for user {instance.id}")
            
        except Exception as e:
            logger.error(f"Error creating user profiles for {instance.id}: {e}")


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    """Track user login for security and analytics."""
    try:
        from .behavior_models import UserCredentialVault, UserSession
        from django.utils import timezone
        
        # Update last login IP
        ip_address = get_client_ip(request)
        if ip_address:
            user.last_login_ip = ip_address
            user.save(update_fields=['last_login_ip'])
        
        # Record successful login in credential vault
        if hasattr(user, 'credential_vault'):
            user.credential_vault.record_login_attempt(success=True)
        
        # Create session tracking record
        if getattr(settings, 'ENABLE_USER_TRACKING', True):
            UserSession.objects.create(
                user=user,
                session_key=request.session.session_key or '',
                ip_address=ip_address,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                device_type=get_device_type(request),
                browser=get_browser(request),
                referrer=request.META.get('HTTP_REFERER', '')[:2000] if request.META.get('HTTP_REFERER') else '',
            )
        
        logger.info(f"User {user.id} logged in from {ip_address}")
        
    except Exception as e:
        logger.error(f"Error handling user login: {e}")


@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    """Track user logout."""
    if user:
        try:
            from .behavior_models import UserSession
            
            # End the current session
            session_key = request.session.session_key
            if session_key:
                sessions = UserSession.objects.filter(
                    user=user,
                    session_key=session_key,
                    ended_at__isnull=True
                )
                for session in sessions:
                    session.end_session()
            
            logger.info(f"User {user.id} logged out")
            
        except Exception as e:
            logger.error(f"Error handling user logout: {e}")


@receiver(user_login_failed)
def user_login_failed_handler(sender, credentials, request, **kwargs):
    """Track failed login attempts for security."""
    try:
        from .models import User
        from .behavior_models import UserCredentialVault
        
        email = credentials.get('email') or credentials.get('username')
        if email:
            try:
                user = User.objects.get(email=email)
                if hasattr(user, 'credential_vault'):
                    user.credential_vault.record_login_attempt(success=False)
                    
                    if user.credential_vault.is_locked:
                        logger.warning(f"Account locked for user {user.id} after failed attempts")
                    
            except User.DoesNotExist:
                pass
        
        ip_address = get_client_ip(request)
        logger.warning(f"Failed login attempt for {email} from {ip_address}")
        
    except Exception as e:
        logger.error(f"Error handling failed login: {e}")


def get_client_ip(request):
    """Extract client IP from request headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    
    x_real_ip = request.META.get('HTTP_X_REAL_IP')
    if x_real_ip:
        return x_real_ip
    
    return request.META.get('REMOTE_ADDR')


def get_device_type(request):
    """Detect device type from user agent."""
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    
    if any(mobile in user_agent for mobile in ['mobile', 'android', 'iphone', 'ipod']):
        return 'mobile'
    elif any(tablet in user_agent for tablet in ['tablet', 'ipad']):
        return 'tablet'
    return 'desktop'


def get_browser(request):
    """Extract browser name from user agent."""
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    
    browsers = [
        ('edge', 'Edge'),
        ('chrome', 'Chrome'),
        ('safari', 'Safari'),
        ('firefox', 'Firefox'),
        ('opera', 'Opera'),
        ('msie', 'IE'),
        ('trident', 'IE'),
    ]
    
    for pattern, name in browsers:
        if pattern in user_agent:
            return name
    return 'Unknown'
