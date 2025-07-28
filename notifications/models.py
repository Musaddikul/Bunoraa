# notifications/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import JSONField

class NotificationType(models.TextChoices):
    ORDER_UPDATE    = 'order_update', 'Order Update'
    PROMOTION       = 'promotion',    'Promotion'
    SHIPPING_UPDATE = 'shipping',     'Shipping Update'
    SYSTEM_ALERT    = 'system',       'System Alert'

class NotificationChannel(models.TextChoices):
    IN_APP = 'in_app', 'In-App'
    EMAIL  = 'email',  'Email'
    SMS    = 'sms',    'SMS'
    PUSH   = 'push',   'Push'

class NotificationTemplate(models.Model):
    """
    Defines reusable templates for different notification types & channels.
    """
    name         = models.CharField(max_length=100, unique=True)
    notif_type   = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.ORDER_UPDATE)
    channel      = models.CharField(max_length=10, choices=NotificationChannel.choices, default=NotificationChannel.IN_APP)
    subject      = models.CharField(max_length=200, blank=True)
    body_html    = models.TextField(help_text="Use {{context_key}} placeholders")
    body_plain   = models.TextField(help_text="Plain-text fallback", blank=True)
    created_at   = models.DateTimeField(default=timezone.now)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_notif_type_display()} / {self.get_channel_display()})"

class NotificationPreference(models.Model):
    """
    User opt-in/out per notification type & channel.
    """
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notif_prefs')
    notif_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.ORDER_UPDATE)
    channel    = models.CharField(max_length=10, choices=NotificationChannel.choices, default=NotificationChannel.IN_APP)
    enabled    = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user','notif_type','channel')

    def __str__(self):
        status = "On" if self.enabled else "Off"
        return f"{self.user} {status} {self.notif_type} via {self.channel}"

class Notification(models.Model):
    """
    Tracks each sent or queued notification instance.
    """
    user           = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    template       = models.ForeignKey(NotificationTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    notif_type     = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.ORDER_UPDATE)
    channel        = models.CharField(max_length=10, choices=NotificationChannel.choices, default=NotificationChannel.IN_APP)
    title          = models.CharField(max_length=200, blank=True, null=True, help_text="Optional title for the notification", default="")
    message        = models.TextField()
    link           = models.URLField(blank=True, null=True)
    payload        = JSONField(blank=True, null=True, help_text="Extra context for client")
    priority       = models.PositiveSmallIntegerField(default=0, help_text="Higher = more urgent")
    is_read        = models.BooleanField(default=False)
    created_at     = models.DateTimeField(default=timezone.now)
    delivered_at   = models.DateTimeField(null=True, blank=True)
    read_at        = models.DateTimeField(null=True, blank=True)
    metadata       = JSONField(blank=True, null=True, help_text="Delivery statuses & logs")

    class Meta:
        ordering = ['-priority','-created_at']
        indexes = [
            models.Index(fields=['user','is_read']),
            models.Index(fields=['notif_type','channel']),
        ]

    def mark_delivered(self):
        self.delivered_at = timezone.now()
        self.save(update_fields=['delivered_at'])
    
    def mark_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read','read_at'])
