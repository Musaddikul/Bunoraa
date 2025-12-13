# apps/notifications/models.py
"""
Notification Models
User notifications and email template management.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.template import Template, Context

from apps.core.models import TimeStampedModel


class Notification(TimeStampedModel):
    """
    User notification model.
    """
    class Type(models.TextChoices):
        ORDER = 'order', _('Order')
        PAYMENT = 'payment', _('Payment')
        SHIPPING = 'shipping', _('Shipping')
        REVIEW = 'review', _('Review')
        PROMOTION = 'promotion', _('Promotion')
        ACCOUNT = 'account', _('Account')
        SYSTEM = 'system', _('System')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('user')
    )
    
    type = models.CharField(
        _('type'),
        max_length=20,
        choices=Type.choices
    )
    title = models.CharField(_('title'), max_length=200)
    message = models.TextField(_('message'))
    
    # Link
    action_url = models.URLField(_('action URL'), blank=True)
    action_text = models.CharField(_('action text'), max_length=50, blank=True)
    
    # Related objects
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        verbose_name=_('order')
    )
    
    # Status
    is_read = models.BooleanField(_('read'), default=False)
    read_at = models.DateTimeField(_('read at'), null=True, blank=True)
    
    # Email
    email_sent = models.BooleanField(_('email sent'), default=False)
    email_sent_at = models.DateTimeField(_('email sent at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'type']),
        ]
    
    def __str__(self):
        return f'{self.title} - {self.user}'
    
    def mark_as_read(self):
        """Mark notification as read."""
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class EmailTemplate(TimeStampedModel):
    """
    Email template for notifications.
    """
    name = models.CharField(_('name'), max_length=100, unique=True)
    code = models.CharField(_('code'), max_length=50, unique=True)
    description = models.TextField(_('description'), blank=True)
    
    # Content
    subject = models.CharField(_('subject'), max_length=200)
    html_body = models.TextField(_('HTML body'))
    text_body = models.TextField(_('plain text body'), blank=True)
    
    # Settings
    is_active = models.BooleanField(_('active'), default=True)
    
    class Meta:
        verbose_name = _('email template')
        verbose_name_plural = _('email templates')
    
    def __str__(self):
        return self.name
    
    def render(self, context_data):
        """Render template with context."""
        context = Context(context_data)
        
        subject = Template(self.subject).render(context)
        html_body = Template(self.html_body).render(context)
        text_body = Template(self.text_body).render(context) if self.text_body else ''
        
        return subject, html_body, text_body


class NotificationPreference(TimeStampedModel):
    """
    User notification preferences.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preferences',
        verbose_name=_('user')
    )
    
    # Email preferences
    email_orders = models.BooleanField(_('order emails'), default=True)
    email_shipping = models.BooleanField(_('shipping emails'), default=True)
    email_promotions = models.BooleanField(_('promotional emails'), default=True)
    email_reviews = models.BooleanField(_('review reminders'), default=True)
    email_newsletter = models.BooleanField(_('newsletter'), default=True)
    
    # Push preferences
    push_orders = models.BooleanField(_('order notifications'), default=True)
    push_shipping = models.BooleanField(_('shipping notifications'), default=True)
    push_promotions = models.BooleanField(_('promotional notifications'), default=False)
    
    # SMS preferences
    sms_orders = models.BooleanField(_('order SMS'), default=False)
    sms_shipping = models.BooleanField(_('shipping SMS'), default=False)
    
    class Meta:
        verbose_name = _('notification preference')
        verbose_name_plural = _('notification preferences')
    
    def __str__(self):
        return f'Preferences for {self.user}'
