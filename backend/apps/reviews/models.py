# apps/reviews/models.py
"""
Review models for product reviews.
"""
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    """
    Product review model.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews',
        help_text='Order where this product was purchased'
    )
    
    # Review content
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    
    # Pros and cons (optional)
    pros = models.TextField(blank=True, help_text='What the reviewer liked')
    cons = models.TextField(blank=True, help_text='What the reviewer disliked')
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Verification
    is_verified_purchase = models.BooleanField(
        default=False,
        help_text='Whether the reviewer purchased this product'
    )
    
    # Engagement
    helpful_votes = models.PositiveIntegerField(default=0)
    not_helpful_votes = models.PositiveIntegerField(default=0)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['product', 'user']
        indexes = [
            models.Index(fields=['product', 'status']),
            models.Index(fields=['user']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f'{self.user.email} - {self.product.name} - {self.rating}★'
    
    @property
    def helpfulness_score(self):
        total = self.helpful_votes + self.not_helpful_votes
        if total == 0:
            return 0
        return round((self.helpful_votes / total) * 100)
    
    def mark_helpful(self, user):
        """Mark review as helpful."""
        vote, created = ReviewVote.objects.get_or_create(
            review=self,
            user=user,
            defaults={'is_helpful': True}
        )
        
        if not created and not vote.is_helpful:
            vote.is_helpful = True
            vote.save()
            self.helpful_votes += 1
            self.not_helpful_votes -= 1
            self.save()
        elif created:
            self.helpful_votes += 1
            self.save()
    
    def mark_not_helpful(self, user):
        """Mark review as not helpful."""
        vote, created = ReviewVote.objects.get_or_create(
            review=self,
            user=user,
            defaults={'is_helpful': False}
        )
        
        if not created and vote.is_helpful:
            vote.is_helpful = False
            vote.save()
            self.helpful_votes -= 1
            self.not_helpful_votes += 1
            self.save()
        elif created:
            self.not_helpful_votes += 1
            self.save()


class ReviewImage(models.Model):
    """
    Image attached to a review.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='reviews/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f'Image for {self.review}'


class ReviewVote(models.Model):
    """
    Track user votes on review helpfulness.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='review_votes'
    )
    is_helpful = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['review', 'user']
    
    def __str__(self):
        vote_type = 'helpful' if self.is_helpful else 'not helpful'
        return f'{self.user.email} marked {self.review} as {vote_type}'


class ReviewResponse(models.Model):
    """
    Store/Admin response to a review.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.OneToOneField(
        Review,
        on_delete=models.CASCADE,
        related_name='response'
    )
    responder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='review_responses'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Response to {self.review}'
