# reviews/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Count, Avg

# Assuming Product model is in a 'products' app
# from products.models import Product # This import would be in a real project
# For now, we will assume Product is accessible or its foreign key reference is correct.
# A more robust approach would be to use a string reference 'products.Product'
# or ensure the Product model is imported correctly in your project structure.

class Review(models.Model):
    """
    Represents a customer review for a product.
    Includes moderation status, sentiment, and user interaction counters.
    """
    PRODUCT_SOURCE_CHOICES = [
        ('internal', 'Internal Submission'),
        ('google_reviews', 'Google Reviews'),
        ('third_party', 'Third-Party Integration'),
        ('filtered:keyword', 'Filtered by Keyword'),
        ('filtered:sentiment', 'Filtered by Sentiment'),
        # Add other sources as needed
    ]

    # Foreign Keys
    product = models.ForeignKey(
        'products.Product', # Use string reference for app cross-dependency
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text="The product this review is for."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # Or models.SET_NULL, models.SET_DEFAULT etc.
        related_name='reviews',
        help_text="The user who submitted this review.",
        # If you previously made this non-nullable and chose to manually handle NULLs,
        # ensure you have a migration or strategy to populate existing NULLs.
        # If you want a default for new objects and existing NULLs, add `default=some_user_id`
        # or `default=some_function_to_get_user_id`.
        # For example, if you want it to be nullable again, add `null=True, blank=True`.
        # For this "enterprise-grade" version, we assume it's non-nullable and a user is always associated.
        # If you need an anonymous user, you'd define a specific user and set its ID as default.
    )

    # Review Content
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating given to the product (1 to 5 stars)."
    )
    comment = models.TextField(
        blank=True,
        help_text="Detailed comment for the review (optional)."
    )

    # Moderation & Status
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether the review has been approved by a moderator."
    )
    verified = models.BooleanField(
        default=False,
        help_text="Indicates if the review is from a verified buyer/source."
    )
    source = models.CharField(
        max_length=50,
        choices=PRODUCT_SOURCE_CHOICES,
        default='internal',
        help_text="Origin or reason for review status (e.g., 'internal', 'filtered:keyword')."
    )
    sentiment_score = models.FloatField(
        null=True, blank=True,
        help_text="Sentiment score from external analysis (e.g., -1.0 to 1.0)."
    )
    pinned = models.BooleanField(
        default=False,
        help_text="Whether this review should be pinned to the top of review lists."
    )

    # Technical Details for Audit/Logging
    user_agent = models.CharField(
        max_length=255,
        blank=True, # Allow blank for cases where user_agent might not be captured
        help_text="User-Agent string from the client's request.",
    )
    ip_address = models.GenericIPAddressField(
        null=True, blank=True,
        help_text="IP address of the user who submitted the review."
    )

    # Counters for User Interactions (denormalized for performance)
    helpful_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of 'helpful' votes for this review."
    )
    not_helpful_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of 'not helpful' votes for this review."
    )
    flag_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of times this review has been flagged."
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the review was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the review was last updated."
    )

    class Meta:
        """
        Meta options for the Review model.
        """
        unique_together = ('product', 'user') # A user can only review a product once
        ordering = ['-created_at'] # Default ordering for reviews
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        """
        String representation of the Review instance, using the user's full name if available,
        otherwise their username.
        """
        user_display_name = self.user.get_full_name()
        if not user_display_name: # If get_full_name returns empty (e.g., no first/last name)
            user_display_name = self.user.username
        return f"Review by {user_display_name} for {self.product.name} ({self.rating} stars)"

    def update_vote_counters(self):
        """
        Updates the helpful and not_helpful counts based on related ReviewVote objects.
        This method should be called after a vote is cast or changed.
        """
        self.helpful_count = self.votes.filter(is_helpful=True).count()
        self.not_helpful_count = self.votes.filter(is_helpful=False).count()
        self.save(update_fields=['helpful_count', 'not_helpful_count'])

    def update_flag_counter(self):
        """
        Updates the flag count based on related ReviewFlag objects.
        This method should be called after a review is flagged.
        """
        self.flag_count = self.flags.count()
        self.save(update_fields=['flag_count'])


class ReviewImage(models.Model):
    """
    Represents an image attached to a review.
    """
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="The review this image belongs to."
    )
    image = models.ImageField(
        upload_to='review_images/%Y/%m/%d/',
        help_text="The image file for the review."
    )
    alt_text = models.CharField(
        max_length=100,
        blank=True,
        help_text="Alternative text for the image for accessibility."
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the image was uploaded."
    )

    class Meta:
        """
        Meta options for the ReviewImage model.
        """
        ordering = ['uploaded_at'] # Order images by upload time
        verbose_name = "Review Image"
        verbose_name_plural = "Review Images"

    def __str__(self):
        """
        String representation of the ReviewImage instance.
        """
        return f"Image for Review {self.review.id}"

    def save(self, *args, **kwargs):
        """
        Overrides save to auto-populate alt_text if not provided.
        """
        if not self.alt_text and self.review:
            self.alt_text = f"Image for review of {self.review.product.name}"
        super().save(*args, **kwargs)


class ReviewVote(models.Model):
    """
    Represents a user's vote (helpful/not helpful) on a review.
    """
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='votes',
        help_text="The review being voted on."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='review_votes',
        help_text="The user who cast the vote."
    )
    is_helpful = models.BooleanField(
        default=True,
        help_text="True if the vote is 'helpful', False if 'not helpful'."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the vote was cast."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the vote was last updated."
    )

    class Meta:
        """
        Meta options for the ReviewVote model.
        """
        unique_together = ('review', 'user') # A user can only vote on a specific review once
        verbose_name = "Review Vote"
        verbose_name_plural = "Review Votes"

    def __str__(self):
        """
        String representation of the ReviewVote instance.
        """
        return f"{self.user.username} voted {'helpful' if self.is_helpful else 'not helpful'} on Review {self.review.id}"


class ReviewFlag(models.Model):
    """
    Represents a user's flag (report) on a review.
    """
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='flags',
        help_text="The review being flagged."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='review_flags',
        help_text="The user who flagged the review."
    )
    reason = models.TextField(
        blank=True,
        help_text="Reason for flagging the review (optional)."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the review was flagged."
    )

    class Meta:
        """
        Meta options for the ReviewFlag model.
        """
        unique_together = ('review', 'user') # A user can only flag a specific review once
        verbose_name = "Review Flag"
        verbose_name_plural = "Review Flags"

    def __str__(self):
        """
        String representation of the ReviewFlag instance.
        """
        return f"{self.user.username} flagged Review {self.review.id}"
