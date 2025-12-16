"""
Support Models
"""
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class TicketCategory(models.Model):
    """Category for support tickets."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name")
    
    # Settings
    is_active = models.BooleanField(default=True)
    requires_order = models.BooleanField(
        default=False,
        help_text="Require order reference for this category"
    )
    auto_response = models.TextField(
        blank=True,
        help_text="Automatic response when ticket is created"
    )
    priority_default = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('urgent', 'Urgent'),
        ],
        default='medium'
    )
    
    # SLA settings
    response_time_hours = models.PositiveIntegerField(
        default=24,
        help_text="Expected first response time in hours"
    )
    resolution_time_hours = models.PositiveIntegerField(
        default=72,
        help_text="Expected resolution time in hours"
    )
    
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Ticket Category'
        verbose_name_plural = 'Ticket Categories'
    
    def __str__(self):
        return self.name


class Ticket(models.Model):
    """Support ticket."""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending Customer Response'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # User info
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_tickets',
        null=True,
        blank=True
    )
    # Guest ticket support
    email = models.EmailField(help_text="Contact email")
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=30, blank=True)
    
    # Ticket details
    category = models.ForeignKey(
        TicketCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='tickets'
    )
    subject = models.CharField(max_length=500)
    description = models.TextField()
    
    # Status and priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )
    
    # Related entities
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='support_tickets'
    )
    
    # Tracking
    is_escalated = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True, help_text="Visible in ticket history")
    
    # Ratings
    satisfaction_rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text="Customer satisfaction rating (1-5)"
    )
    rating_feedback = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    first_response_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    # SLA tracking
    response_due_at = models.DateTimeField(null=True, blank=True)
    resolution_due_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Support Ticket'
        verbose_name_plural = 'Support Tickets'
    
    def __str__(self):
        return f"#{self.ticket_number} - {self.subject}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = self._generate_ticket_number()
        
        # Set SLA times on creation
        if not self.pk and self.category:
            now = timezone.now()
            self.response_due_at = now + timezone.timedelta(hours=self.category.response_time_hours)
            self.resolution_due_at = now + timezone.timedelta(hours=self.category.resolution_time_hours)
        
        # Set user email/name if user is set
        if self.user and not self.email:
            self.email = self.user.email
        if self.user and not self.name:
            self.name = self.user.get_full_name() or self.user.email
        
        super().save(*args, **kwargs)
    
    def _generate_ticket_number(self):
        """Generate unique ticket number."""
        import random
        import string
        prefix = timezone.now().strftime('%Y%m')
        suffix = ''.join(random.choices(string.digits, k=6))
        return f"TKT-{prefix}-{suffix}"
    
    @property
    def is_open(self):
        return self.status in ['open', 'pending', 'in_progress', 'on_hold']
    
    @property
    def is_overdue(self):
        """Check if ticket is overdue for response or resolution."""
        now = timezone.now()
        if self.response_due_at and not self.first_response_at and now > self.response_due_at:
            return True
        if self.resolution_due_at and self.status not in ['resolved', 'closed'] and now > self.resolution_due_at:
            return True
        return False


class TicketMessage(models.Model):
    """Message in a support ticket."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    
    # Sender
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ticket_messages'
    )
    is_staff_reply = models.BooleanField(default=False)
    sender_name = models.CharField(max_length=200, blank=True)
    
    # Content
    message = models.TextField()
    
    # Visibility
    is_internal = models.BooleanField(
        default=False,
        help_text="Internal note not visible to customer"
    )
    
    # Tracking
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Ticket Message'
        verbose_name_plural = 'Ticket Messages'
    
    def __str__(self):
        return f"Message on {self.ticket.ticket_number}"
    
    def save(self, *args, **kwargs):
        if self.user and not self.sender_name:
            self.sender_name = self.user.get_full_name() or self.user.email
        super().save(*args, **kwargs)


class TicketAttachment(models.Model):
    """Attachment on a ticket or message."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    message = models.ForeignKey(
        TicketMessage,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='attachments'
    )
    
    file = models.FileField(upload_to='support/attachments/%Y/%m/')
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    content_type = models.CharField(max_length=100, blank=True)
    
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='ticket_attachments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Ticket Attachment'
        verbose_name_plural = 'Ticket Attachments'
    
    def __str__(self):
        return self.filename
    
    def save(self, *args, **kwargs):
        if self.file and not self.filename:
            self.filename = self.file.name
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class CannedResponse(models.Model):
    """Pre-written responses for common queries."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    category = models.ForeignKey(
        TicketCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='canned_responses'
    )
    
    content = models.TextField()
    shortcut = models.CharField(
        max_length=50,
        blank=True,
        help_text="Keyboard shortcut to insert this response"
    )
    
    is_active = models.BooleanField(default=True)
    usage_count = models.PositiveIntegerField(default=0)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='canned_responses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['title']
        verbose_name = 'Canned Response'
        verbose_name_plural = 'Canned Responses'
    
    def __str__(self):
        return self.title


class HelpArticle(models.Model):
    """Help center articles."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, max_length=200)
    
    category = models.ForeignKey(
        TicketCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='help_articles'
    )
    
    # Content
    summary = models.TextField(blank=True, help_text="Short summary for listings")
    content = models.TextField()
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True, max_length=500)
    
    # Status
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Stats
    view_count = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)
    not_helpful_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='help_articles'
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    sort_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['sort_order', '-published_at']
        verbose_name = 'Help Article'
        verbose_name_plural = 'Help Articles'
    
    def __str__(self):
        return self.title
    
    @property
    def helpful_percentage(self):
        """Calculate helpful percentage."""
        total = self.helpful_count + self.not_helpful_count
        if total == 0:
            return 0
        return (self.helpful_count / total) * 100


class ContactMessage(models.Model):
    """General contact form messages."""
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('sales', 'Sales Question'),
        ('support', 'Support Request'),
        ('feedback', 'Feedback'),
        ('partnership', 'Partnership'),
        ('press', 'Press Inquiry'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    company = models.CharField(max_length=200, blank=True)
    
    subject_type = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    subject = models.CharField(max_length=500)
    message = models.TextField()
    
    # Status
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    is_spam = models.BooleanField(default=False)
    
    # Conversion to ticket
    converted_to_ticket = models.ForeignKey(
        Ticket,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='source_messages'
    )
    
    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamps
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_replies'
    )
    replied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
