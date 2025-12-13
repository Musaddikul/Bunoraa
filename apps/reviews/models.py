# apps/reviews/models.py
"""
Review Models
Product and vendor review system with ratings.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.core.models import TimeStampedModel, SoftDeleteModel


class Review(TimeStampedModel, SoftDeleteModel):
    """
    Product review model.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('product')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='product_reviews',
        verbose_name=_('user')
    )
    order_item = models.ForeignKey(
        'orders.OrderItem',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews',
        verbose_name=_('order item')
    )
    
    # Rating
    rating = models.PositiveSmallIntegerField(
        _('rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    # Content
    title = models.CharField(_('title'), max_length=200, blank=True)
    content = models.TextField(_('review'))
    pros = models.TextField(_('pros'), blank=True)
    cons = models.TextField(_('cons'), blank=True)
    
    # Status
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    
    # Verification
    is_verified_purchase = models.BooleanField(_('verified purchase'), default=False)
    
    # Helpful votes
    helpful_count = models.PositiveIntegerField(_('helpful votes'), default=0)
    not_helpful_count = models.PositiveIntegerField(_('not helpful votes'), default=0)
    
    # Admin
    admin_response = models.TextField(_('admin response'), blank=True)
    admin_response_at = models.DateTimeField(_('response date'), null=True, blank=True)
    moderation_note = models.TextField(_('moderation note'), blank=True)
    
    class Meta:
        verbose_name = _('review')
        verbose_name_plural = _('reviews')
        ordering = ['-created_at']
        unique_together = [['product', 'user']]
        indexes = [
            models.Index(fields=['product', 'status', 'rating']),
            models.Index(fields=['user', 'status']),
        ]
    
    def __str__(self):
        return f'{self.user.get_full_name()} - {self.product.name} ({self.rating}★)'
    
    @property
    def is_approved(self):
        return self.status == self.Status.APPROVED
    
    def approve(self):
        """Approve the review."""
        self.status = self.Status.APPROVED
        self.save()
    
    def reject(self, note=''):
        """Reject the review."""
        self.status = self.Status.REJECTED
        self.moderation_note = note
        self.save()


class ReviewImage(TimeStampedModel):
    """
    Images attached to reviews.
    """
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('review')
    )
    image = models.ImageField(
        _('image'),
        upload_to='reviews/%Y/%m/'
    )
    alt_text = models.CharField(_('alt text'), max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(_('order'), default=0)
    
    class Meta:
        verbose_name = _('review image')
        verbose_name_plural = _('review images')
        ordering = ['order']
    
    def __str__(self):
        return f'Image for review #{self.review_id}'


class ReviewVote(TimeStampedModel):
    """
    Track helpful/not helpful votes on reviews.
    """
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='votes',
        verbose_name=_('review')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='review_votes',
        verbose_name=_('user')
    )
    is_helpful = models.BooleanField(_('is helpful'))
    
    class Meta:
        verbose_name = _('review vote')
        verbose_name_plural = _('review votes')
        unique_together = [['review', 'user']]
    
    def __str__(self):
        vote_type = 'helpful' if self.is_helpful else 'not helpful'
        return f'{self.user} voted {vote_type} on review #{self.review_id}'


class ReviewReport(TimeStampedModel):
    """
    Report inappropriate reviews.
    """
    class Reason(models.TextChoices):
        SPAM = 'spam', _('Spam')
        INAPPROPRIATE = 'inappropriate', _('Inappropriate Content')
        FAKE = 'fake', _('Fake Review')
        OFF_TOPIC = 'off_topic', _('Off Topic')
        OTHER = 'other', _('Other')
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        REVIEWED = 'reviewed', _('Reviewed')
        RESOLVED = 'resolved', _('Resolved')
        DISMISSED = 'dismissed', _('Dismissed')
    
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='reports',
        verbose_name=_('review')
    )
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='review_reports',
        verbose_name=_('reported by')
    )
    reason = models.CharField(
        _('reason'),
        max_length=20,
        choices=Reason.choices
    )
    details = models.TextField(_('details'), blank=True)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    resolution_note = models.TextField(_('resolution note'), blank=True)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_review_reports',
        verbose_name=_('resolved by')
    )
    resolved_at = models.DateTimeField(_('resolved at'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('review report')
        verbose_name_plural = _('review reports')
        unique_together = [['review', 'reported_by']]
    
    def __str__(self):
        return f'Report on review #{self.review_id} by {self.reported_by}'
