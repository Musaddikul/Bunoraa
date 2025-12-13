# apps/reviews/signals.py
"""
Review Signals
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review, ReviewVote


@receiver([post_save, post_delete], sender=Review)
def update_product_rating(sender, instance, **kwargs):
    """Update product rating when reviews change."""
    product = instance.product
    reviews = product.reviews.filter(status=Review.Status.APPROVED)
    
    stats = reviews.aggregate(
        avg_rating=Avg('rating'),
        count=Count('id')
    )
    
    product.rating = stats['avg_rating'] or 0
    product.review_count = stats['count']
    product.save(update_fields=['rating', 'review_count'])


@receiver(post_save, sender=ReviewVote)
def update_review_votes(sender, instance, created, **kwargs):
    """Update review vote counts."""
    review = instance.review
    
    review.helpful_count = review.votes.filter(is_helpful=True).count()
    review.not_helpful_count = review.votes.filter(is_helpful=False).count()
    review.save(update_fields=['helpful_count', 'not_helpful_count'])


@receiver(post_delete, sender=ReviewVote)
def update_review_votes_on_delete(sender, instance, **kwargs):
    """Update review vote counts when vote deleted."""
    try:
        review = instance.review
        review.helpful_count = review.votes.filter(is_helpful=True).count()
        review.not_helpful_count = review.votes.filter(is_helpful=False).count()
        review.save(update_fields=['helpful_count', 'not_helpful_count'])
    except:
        pass
