# faq/models.py
from django.db import models
from django.utils import timezone
from django.conf import settings
from django_ckeditor_5.fields import CKEditor5Field
from taggit.managers import TaggableManager

class Category(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    description = models.TextField(blank=True)
    parent      = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    created_at  = models.DateTimeField(default=timezone.now)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['parent__id', 'name']

    def __str__(self):
        return self.name

class FAQ(models.Model):
    category          = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='faqs')
    question          = models.CharField(max_length=255)
    slug              = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    answer            = CKEditor5Field()
    is_active         = models.BooleanField(default=True)
    is_featured       = models.BooleanField(default=False)
    tags              = TaggableManager(blank=True)
    view_count        = models.PositiveIntegerField(default=0, editable=False)
    helpful_count     = models.PositiveIntegerField(default=0, editable=False)
    not_helpful_count = models.PositiveIntegerField(default=0, editable=False)
    meta_title        = models.CharField(max_length=70, blank=True)
    meta_description  = models.CharField(max_length=160, blank=True)
    created_by        = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    updated_by        = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    created_at        = models.DateTimeField(default=timezone.now)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured','category__name','question']
        indexes = [
            models.Index(fields=['slug','is_active']),
            models.Index(fields=['category','is_featured']),
        ]

    def __str__(self):
        return self.question

    def mark_viewed(self):
        self.view_count = models.F('view_count') + 1
        self.save(update_fields=['view_count'])

    def update_vote_counts(self):
        from .models import FAQFeedback
        self.helpful_count = FAQFeedback.objects.filter(faq=self, is_helpful=True).count()
        self.not_helpful_count = FAQFeedback.objects.filter(faq=self, is_helpful=False).count()
        self.save(update_fields=['helpful_count','not_helpful_count'])

class FAQFeedback(models.Model):
    faq         = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='feedbacks')
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_helpful  = models.BooleanField()
    created_at  = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('faq','user')

class FAQRequest(models.Model):
    STATUS_NEW       = 'new'
    STATUS_ANSWERED  = 'answered'
    STATUS_CHOICES   = [
        (STATUS_NEW,      'New'),
        (STATUS_ANSWERED, 'Answered'),
    ]
    user             = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    email            = models.EmailField()
    question_text    = models.TextField()
    response_text    = models.TextField(blank=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at       = models.DateTimeField(default=timezone.now)
    responded_at     = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
