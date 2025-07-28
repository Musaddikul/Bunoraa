# legal/models.py
from django.db import models
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field
from django.conf import settings
import uuid

class Policy(models.Model):
    POLICY_CHOICES = [
        ('shipping', '🚚 Shipping Policy'),
        ('returns', '🔄 Return Policy'),
        ('privacy', '🔒 Privacy Policy'),
        ('terms', '📜 Terms & Conditions'),
    ]
    policy_type   = models.CharField(max_length=20, choices=POLICY_CHOICES)
    version       = models.PositiveIntegerField(default=1)
    title         = models.CharField(max_length=100)
    content       = CKEditor5Field('Content', config_name='extends')
    language      = models.CharField(max_length=10, default='en', help_text="e.g. 'en' or 'bn'")
    is_active     = models.BooleanField(default=True, help_text="Show this version to users")
    published_at  = models.DateTimeField(default=timezone.now)
    previous      = models.ForeignKey('self', null=True, blank=True, related_name='next_versions', on_delete=models.SET_NULL)
    icon          = models.CharField(max_length=20, blank=True)
    created_at    = models.DateTimeField(default=timezone.now)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('policy_type','version','language')
        ordering = ['policy_type','-version']
        indexes = [models.Index(fields=['policy_type','is_active','language']),]
        verbose_name = 'Policy'
        verbose_name_plural = 'Policies'

    def __str__(self):
        return f"{self.get_policy_type_display()} v{self.version} ({self.language})"

    def publish_new_version(self, title, content, language=None):
        language = language or self.language
        new = Policy.objects.create(
            policy_type=self.policy_type,
            version=self.version + 1,
            title=title,
            content=content,
            language=language,
            is_active=True,
            published_at=timezone.now(),
            previous=self
        )
        # deactivate old
        self.is_active = False
        self.save(update_fields=['is_active'])
        return new

class PolicyAcceptance(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='policy_acceptances')
    policy       = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='acceptances')
    version      = models.PositiveIntegerField()
    accepted_at  = models.DateTimeField(default=timezone.now)
    ip_address   = models.GenericIPAddressField(null=True, blank=True)
    user_agent   = models.TextField(blank=True)

    class Meta:
        unique_together = ('user','policy','version')
        ordering = ['-accepted_at']

    def __str__(self):
        return f"{self.user} accepted {self.policy} at {self.accepted_at}"

class Subscriber(models.Model):
    email           = models.EmailField(unique=True)
    subscribed_at   = models.DateTimeField(default=timezone.now)
    confirmed       = models.BooleanField(default=False)
    confirm_token   = models.UUIDField(default=uuid.uuid4, editable=False)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        status = '✔' if self.confirmed else '✖'
        return f"{self.email} [{status}]"

    def confirm(self):
        self.confirmed = True
        self.save(update_fields=['confirmed'])

    def unsubscribe(self):
        self.unsubscribed_at = timezone.now()
        self.save(update_fields=['unsubscribed_at'])
