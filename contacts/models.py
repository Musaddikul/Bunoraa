# contacts/models.py
from django.db import models
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils import timezone

class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('order', 'Order Inquiry'),
        ('product', 'Product Question'),
        ('shipping', 'Shipping Information'),
        ('return', 'Return/Exchange'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.name} about {self.get_subject_display()}"

class FAQ(models.Model):
    question = models.CharField(max_length=200)
    answer = CKEditor5Field()
    category = models.CharField(max_length=50)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['category', '-is_featured', 'question']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(default=timezone.now)

class Policy(models.Model):
    POLICY_CHOICES = [
        ('shipping', '🚚 Shipping Policy'),
        ('returns', '🔄 Return Policy'),
        ('privacy', '🔒 Privacy Policy'),
        ('terms', '📜 Terms & Conditions'),
    ]
    
    policy_type = models.CharField(max_length=20, choices=POLICY_CHOICES, unique=True)
    title = models.CharField(max_length=100)
    content = CKEditor5Field('Content', config_name='extends')
    last_updated = models.DateTimeField(default=timezone.now)
    icon = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.title

