# apps/accounts/tasks.py
"""
Celery tasks for accounts app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import timedelta
import secrets


@shared_task
def send_password_reset_email(user_id, token):
    """Send password reset email to user."""
    from .models import User
    
    try:
        user = User.objects.get(id=user_id)
        
        reset_url = f"{settings.SITE_URL}/reset-password?token={token}"
        
        subject = 'Reset Your Password - Bunoraa'
        message = f"""
        Hi {user.first_name},

        You requested to reset your password. Click the link below to set a new password:

        {reset_url}

        This link will expire in 24 hours.

        If you didn't request this, please ignore this email.

        Best regards,
        The Bunoraa Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except User.DoesNotExist:
        pass


@shared_task
def send_email_verification(user_id):
    """Send email verification to user."""
    from .models import User, EmailVerificationToken
    
    try:
        user = User.objects.get(id=user_id)
        
        # Generate verification token
        token = secrets.token_urlsafe(32)
        EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        verify_url = f"{settings.SITE_URL}/verify-email?token={token}"
        
        subject = 'Verify Your Email - Bunoraa'
        message = f"""
        Hi {user.first_name},

        Welcome to Bunoraa! Please verify your email by clicking the link below:

        {verify_url}

        This link will expire in 7 days.

        Best regards,
        The Bunoraa Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except User.DoesNotExist:
        pass


@shared_task
def send_welcome_email(user_id):
    """Send welcome email to new user."""
    from .models import User
    
    try:
        user = User.objects.get(id=user_id)
        
        subject = 'Welcome to Bunoraa!'
        message = f"""
        Hi {user.first_name},

        Welcome to Bunoraa! We're thrilled to have you as part of our community.

        Start exploring our premium collection of products and discover amazing deals.

        Happy shopping!

        Best regards,
        The Bunoraa Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except User.DoesNotExist:
        pass


@shared_task
def cleanup_expired_tokens():
    """Remove expired password reset and email verification tokens."""
    from .models import PasswordResetToken, EmailVerificationToken
    
    now = timezone.now()
    
    # Delete expired password reset tokens
    PasswordResetToken.objects.filter(expires_at__lt=now).delete()
    
    # Delete expired email verification tokens
    EmailVerificationToken.objects.filter(expires_at__lt=now).delete()
