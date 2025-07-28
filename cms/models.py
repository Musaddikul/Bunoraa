# cms/models.py
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class Banner(models.Model):
    title           = models.CharField(max_length=100)
    image           = models.ImageField(upload_to='cms/banners/')
    alt_text        = models.CharField(max_length=150, blank=True)
    link            = models.URLField(blank=True, null=True)
    start_date      = models.DateTimeField(default=timezone.now)
    end_date        = models.DateTimeField(null=True, blank=True)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)
    target_groups   = models.JSONField(blank=True, null=True,
                                       help_text="e.g. {'segment':'vip','min_orders':5}")
    ab_variant      = models.CharField(max_length=10, choices=[('A','A'),('B','B')], default='A')
    ab_weight       = models.PositiveSmallIntegerField(default=50,
                                       help_text="Percentage weight for A/B test")
    created_at      = models.DateTimeField(default=timezone.now)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['is_active','start_date','end_date']),
        ]

    def __str__(self):
        return self.title

    def is_current(self):
        now = timezone.now()
        if not self.is_active: return False
        if self.start_date > now: return False
        if self.end_date and self.end_date < now: return False
        return True

class Page(models.Model):
    STATUS_CHOICES = [
        ('draft','Draft'), ('published','Published'), ('archived','Archived')
    ]
    slug            = models.SlugField(max_length=150, unique=True)
    title           = models.CharField(max_length=200)
    subtitle        = models.CharField(max_length=200, blank=True)
    content         = models.TextField(help_text="Rich HTML or markdown")
    template_name   = models.CharField(max_length=100, default='cms/page_detail.html')
    status          = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    publish_date    = models.DateTimeField(default=timezone.now)
    expire_date     = models.DateTimeField(null=True, blank=True)
    meta_title      = models.CharField(max_length=70, blank=True)
    meta_description= models.CharField(max_length=160, blank=True)
    language        = models.CharField(max_length=10, default='en')
    author          = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    enable_comments = models.BooleanField(default=False)
    created_at      = models.DateTimeField(default=timezone.now)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date']
        indexes = [
            models.Index(fields=['slug','status']),
            models.Index(fields=['status','publish_date']),
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('cms:page_detail', args=[self.slug])

    def is_published(self):
        now = timezone.now()
        return self.status == 'published' and self.publish_date <= now and (not self.expire_date or self.expire_date > now)

class ContentBlock(models.Model):
    BLOCK_TYPES = [
        ('text','Text'), ('html','Raw HTML'), ('image','Image'),
        ('component','Component'), ('code','Code Snippet')
    ]
    page        = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='blocks')
    identifier  = models.CharField(max_length=50,
                      help_text="Used in template to place this block")
    block_type  = models.CharField(max_length=10, choices=BLOCK_TYPES, default='text')
    content     = models.TextField()
    settings    = models.JSONField(blank=True, null=True,
                      help_text="Block-specific options, e.g. {'align':'center'}")
    order       = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(default=timezone.now)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = [('page','identifier')]

    def __str__(self):
        return f"{self.page.slug} :: {self.identifier}"

class SiteSetting(models.Model):
    key         = models.CharField(max_length=100, unique=True)
    value       = models.JSONField()
    description = models.CharField(max_length=200, blank=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']

    def __str__(self):
        return self.key
