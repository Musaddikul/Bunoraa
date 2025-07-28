# support/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import JSONField
from taggit.managers import TaggableManager

class TicketCategory(models.TextChoices):
    ORDER     = 'order',    'Order Inquiry'
    PRODUCT   = 'product',  'Product Question'
    SHIPPING  = 'shipping', 'Shipping Information'
    RETURNS   = 'returns',  'Return/Exchange'
    OTHER     = 'other',    'Other'

class TicketPriority(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH     = 'high',     'High'
    MEDIUM   = 'medium',   'Medium'
    LOW      = 'low',      'Low'

class TicketStatus(models.TextChoices):
    OPEN      = 'open',      'Open'
    PENDING   = 'pending',   'Pending'
    RESOLVED  = 'resolved',  'Resolved'
    CLOSED    = 'closed',    'Closed'
    ESCALATED = 'escalated', 'Escalated'

class SupportTicket(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    subject      = models.CharField(max_length=200)
    description  = models.TextField()
    category     = models.CharField(max_length=20, choices=TicketCategory.choices, default=TicketCategory.OTHER)
    priority     = models.CharField(max_length=10, choices=TicketPriority.choices, default=TicketPriority.MEDIUM)
    status       = models.CharField(max_length=10, choices=TicketStatus.choices, default=TicketStatus.OPEN)
    assigned_to  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    tags         = TaggableManager(blank=True)
    metadata     = JSONField(blank=True, null=True, help_text="Additional context")
    sla_due      = models.DateTimeField(help_text="SLA violation due date/time")
    created_at   = models.DateTimeField(default=timezone.now)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority','-created_at']
        indexes = [
            models.Index(fields=['status','priority']),
            models.Index(fields=['assigned_to']),
        ]

    def __str__(self):
        return f"[{self.get_status_display()}] {self.subject}"

    def mark_resolved(self):
        self.status = TicketStatus.RESOLVED
        self.save(update_fields=['status','updated_at'])

    def escalate(self):
        self.status   = TicketStatus.ESCALATED
        self.priority = TicketPriority.CRITICAL
        self.save(update_fields=['status','priority','updated_at'])

class TicketAttachment(models.Model):
    ticket      = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='attachments')
    file        = models.FileField(upload_to='support/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(default=timezone.now)

class TicketResponse(models.Model):
    ticket      = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='responses')
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    message     = models.TextField()
    attachments = models.ManyToManyField(TicketAttachment, blank=True)
    created_at  = models.DateTimeField(default=timezone.now)
