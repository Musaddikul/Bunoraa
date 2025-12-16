"""
FAQ Models
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify


class FAQCategory(models.Model):
    """Category for FAQ items."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class name (e.g., fa-question)')
    
    # Display settings
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'FAQ Category'
        verbose_name_plural = 'FAQ Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def active_questions_count(self):
        return self.questions.filter(is_active=True).count()


class FAQQuestion(models.Model):
    """FAQ question and answer."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    
    question = models.CharField(max_length=500)
    slug = models.SlugField(max_length=520, blank=True)
    answer = models.TextField()
    
    # Display settings
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False, help_text='Show on homepage')
    is_active = models.BooleanField(default=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)
    not_helpful_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'FAQ Question'
        verbose_name_plural = 'FAQ Questions'
        ordering = ['category', 'order', 'question']
        unique_together = ['category', 'slug']
    
    def __str__(self):
        return self.question
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.question)[:500]
        super().save(*args, **kwargs)
    
    @property
    def helpfulness_ratio(self):
        total = self.helpful_count + self.not_helpful_count
        if total == 0:
            return 0
        return round((self.helpful_count / total) * 100, 1)


class FAQFeedback(models.Model):
    """Feedback on FAQ questions."""
    
    FEEDBACK_TYPES = [
        ('helpful', 'Helpful'),
        ('not_helpful', 'Not Helpful'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(
        FAQQuestion,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=40, blank=True)
    
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    comment = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'FAQ Feedback'
        verbose_name_plural = 'FAQ Feedbacks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.feedback_type} - {self.question}'


class FAQSearch(models.Model):
    """Log of FAQ searches for analytics."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    query = models.CharField(max_length=255)
    results_count = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=40, blank=True)
    
    # Track if user found what they needed
    clicked_result = models.ForeignKey(
        FAQQuestion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_clicks'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'FAQ Search'
        verbose_name_plural = 'FAQ Searches'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'"{self.query}" ({self.results_count} results)'


class FAQSuggestion(models.Model):
    """User-submitted FAQ suggestions."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('published', 'Published'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    email = models.EmailField(blank=True)
    
    suggested_question = models.CharField(max_length=500)
    suggested_answer = models.TextField(blank=True, help_text='Optional suggested answer')
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    
    # If published, link to the created question
    published_question = models.ForeignKey(
        FAQQuestion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='suggestions'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_faq_suggestions'
    )
    
    class Meta:
        verbose_name = 'FAQ Suggestion'
        verbose_name_plural = 'FAQ Suggestions'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.suggested_question[:100]
