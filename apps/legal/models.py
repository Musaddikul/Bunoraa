"""
Legal Models
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class LegalDocument(models.Model):
    """Legal document (terms, privacy policy, etc.)"""
    DOCUMENT_TYPES = [
        ('terms', 'Terms of Service'),
        ('privacy', 'Privacy Policy'),
        ('cookies', 'Cookie Policy'),
        ('returns', 'Return Policy'),
        ('shipping', 'Shipping Policy'),
        ('gdpr', 'GDPR Policy'),
        ('accessibility', 'Accessibility Statement'),
        ('disclaimer', 'Disclaimer'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, unique=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    
    # Content
    content = models.TextField()
    summary = models.TextField(blank=True, help_text="Brief summary for users")
    
    # Version control
    version = models.CharField(max_length=20, default='1.0')
    effective_date = models.DateField()
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True, max_length=500)
    
    # Status
    is_published = models.BooleanField(default=False)
    requires_acceptance = models.BooleanField(
        default=False,
        help_text="Users must accept this document (e.g., Terms of Service)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    last_updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='legal_documents_updated'
    )
    
    class Meta:
        ordering = ['document_type']
        verbose_name = 'Legal Document'
        verbose_name_plural = 'Legal Documents'
    
    def __str__(self):
        return f"{self.title} (v{self.version})"
    
    def save(self, *args, **kwargs):
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class LegalDocumentVersion(models.Model):
    """Version history for legal documents."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        LegalDocument,
        on_delete=models.CASCADE,
        related_name='versions'
    )
    
    version = models.CharField(max_length=20)
    content = models.TextField()
    change_summary = models.TextField(blank=True, help_text="Summary of changes in this version")
    
    effective_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['document', 'version']
        verbose_name = 'Document Version'
        verbose_name_plural = 'Document Versions'
    
    def __str__(self):
        return f"{self.document.title} v{self.version}"


class UserConsent(models.Model):
    """Track user consent to legal documents."""
    CONSENT_TYPES = [
        ('terms', 'Terms of Service'),
        ('privacy', 'Privacy Policy'),
        ('marketing', 'Marketing Communications'),
        ('cookies', 'Cookie Consent'),
        ('newsletter', 'Newsletter'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consents'
    )
    
    consent_type = models.CharField(max_length=20, choices=CONSENT_TYPES)
    document = models.ForeignKey(
        LegalDocument,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='consents'
    )
    document_version = models.CharField(max_length=20, blank=True)
    
    # Consent status
    is_granted = models.BooleanField(default=True)
    
    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamps
    granted_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-granted_at']
        verbose_name = 'User Consent'
        verbose_name_plural = 'User Consents'
    
    def __str__(self):
        status = "granted" if self.is_granted else "revoked"
        return f"{self.user.email} - {self.get_consent_type_display()} ({status})"
    
    def revoke(self):
        """Revoke this consent."""
        self.is_granted = False
        self.revoked_at = timezone.now()
        self.save()


class CookieConsent(models.Model):
    """Cookie consent for visitors (including non-logged in)."""
    COOKIE_CATEGORIES = [
        ('necessary', 'Necessary'),
        ('analytics', 'Analytics'),
        ('marketing', 'Marketing'),
        ('preferences', 'Preferences'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # User or visitor identification
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cookie_consents'
    )
    visitor_id = models.CharField(max_length=100, blank=True, help_text="Anonymous visitor ID")
    
    # Consent choices
    necessary = models.BooleanField(default=True)  # Always true
    analytics = models.BooleanField(default=False)
    marketing = models.BooleanField(default=False)
    preferences = models.BooleanField(default=False)
    
    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Cookie Consent'
        verbose_name_plural = 'Cookie Consents'
    
    def __str__(self):
        identifier = self.user.email if self.user else self.visitor_id or 'Anonymous'
        return f"Cookie consent for {identifier}"
    
    @property
    def consent_summary(self):
        """Get summary of consent choices."""
        return {
            'necessary': True,  # Always required
            'analytics': self.analytics,
            'marketing': self.marketing,
            'preferences': self.preferences,
        }


class GDPRRequest(models.Model):
    """GDPR data requests (access, deletion, etc.)"""
    REQUEST_TYPES = [
        ('access', 'Data Access Request'),
        ('deletion', 'Data Deletion Request'),
        ('rectification', 'Data Rectification'),
        ('portability', 'Data Portability'),
        ('restrict', 'Restrict Processing'),
        ('object', 'Object to Processing'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='gdpr_requests'
    )
    email = models.EmailField(help_text="Email for non-registered requests")
    
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    description = models.TextField(blank=True)
    
    # Processing info
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_gdpr_requests'
    )
    response = models.TextField(blank=True)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField(null=True, blank=True, help_text="GDPR 30-day deadline")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'GDPR Request'
        verbose_name_plural = 'GDPR Requests'
    
    def __str__(self):
        return f"{self.get_request_type_display()} - {self.email}"
    
    def save(self, *args, **kwargs):
        # Set deadline to 30 days from creation
        if not self.deadline and not self.pk:
            from datetime import timedelta
            self.deadline = timezone.now() + timedelta(days=30)
        
        # Set email from user if not provided
        if self.user and not self.email:
            self.email = self.user.email
        
        super().save(*args, **kwargs)
    
    @property
    def is_overdue(self):
        """Check if request is past deadline."""
        if self.deadline and self.status not in ['completed', 'rejected']:
            return timezone.now() > self.deadline
        return False
