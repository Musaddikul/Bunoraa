# reviews/services.py
import requests
from django.core.exceptions import ValidationError
from django.conf import settings
from django.db import transaction
from django.core.cache import cache # Import cache for invalidation
from .models import Review, ReviewImage, ReviewVote, ReviewFlag
from .selectors import get_product_review_stats # Keep this import
from products.models import Product # Explicitly import Product model for fetching

# For real-time updates (placeholder - needs a WebSocket setup like Django Channels)
# from django.dispatch import Signal
# review_submitted_signal = Signal()
# review_updated_signal = Signal()

def submit_review(user, product_id, rating, comment, images=None, user_agent='', ip_address=''):
    """
    Submits or updates a product review, handling associated images and moderation.

    Args:
        user (User): The user submitting the review.
        product_id (int): The ID of the product being reviewed.
        rating (int): The rating given to the product (1-5).
        comment (str): The review comment.
        images (list, optional): A list of uploaded image files. Defaults to None.
        user_agent (str, optional): The user agent string from the request. Defaults to ''.
        ip_address (str, optional): The IP address of the user. Defaults to ''.

    Returns:
        Review: The created or updated review object.

    Raises:
        ValidationError: If the input data is invalid (e.g., user already reviewed).
        Product.DoesNotExist: If the product does not exist.
        Exception: For other unexpected errors during submission or moderation.
    """
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        raise Product.DoesNotExist(f"Product with ID {product_id} does not exist.")

    with transaction.atomic():
        # Using get_or_create/update_or_create to handle unique constraint on (product, user)
        review, created = Review.objects.update_or_create(
            product=product,
            user=user,
            defaults={
                'rating': rating,
                'comment': comment,
                'user_agent': user_agent,
                'ip_address': ip_address,
                'verified': False, # Set to False initially, moderation process will verify if needed
                'source': 'internal'
            }
        )

        if images:
            # Clear existing images if updating, then add new ones
            ReviewImage.objects.filter(review=review).delete()
            for img_file in images:
                ReviewImage.objects.create(review=review, image=img_file)

        # Trigger moderation
        moderate_review(review)

        # Invalidate product review stats cache
        cache_key = f"review_stats_{product.pk}"
        cache.delete(cache_key)

        # Placeholder for real-time notification (e.g., via Django Channels)
        # if created:
        #     review_submitted_signal.send(sender=Review, review=review, product_id=product.pk)
        # else:
        #     review_updated_signal.send(sender=Review, review=review, product_id=product.pk)

    return review

def moderate_review(review):
    """
    Extended moderation logic: keyword filtering + sentiment API scoring.
    Sets is_approved and source based on checks.

    Args:
        review (Review): The review object to moderate.
    """
    text = review.comment.lower()
    initial_approval_status = True
    initial_source = 'internal'

    # 1. Keyword-based spam filter
    blacklisted_keywords = getattr(settings, 'REVIEW_BLACKLISTED_KEYWORDS', [])
    if any(kw.lower() in text for kw in blacklisted_keywords):
        initial_approval_status = False
        initial_source = 'filtered:keyword'

    review.is_approved = initial_approval_status
    review.source = initial_source

    # 2. Sentiment analysis via external API (only if API URL is configured)
    sentiment_api_url = getattr(settings, 'SENTIMENT_API_URL', None)
    if sentiment_api_url:
        try:
            resp = requests.post(sentiment_api_url, json={'text': review.comment}, timeout=5) # Add timeout
            resp.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            score = resp.json().get('score')
            review.sentiment_score = score

            # Optional: Further moderation based on sentiment score
            # if score < settings.REVIEW_MIN_SENTIMENT_SCORE:
            #     review.is_approved = False
            #     review.source = 'filtered:sentiment'

        except requests.exceptions.RequestException as e:
            # Log the error but don't fail the review submission
            print(f"Sentiment API call failed: {e}")
            review.sentiment_score = None
            # Consider setting source to 'error:sentiment_api' if the failure is critical
        except Exception as e:
            print(f"Error processing sentiment API response: {e}")
            review.sentiment_score = None

    review.save(update_fields=['is_approved', 'source', 'sentiment_score'])
    # Placeholder for real-time notification
    # review_updated_signal.send(sender=Review, review=review, product_id=review.product.pk)


def vote_review(user, review_id, is_helpful=True):
    """
    Allows a user to vote on a review (helpful or not helpful).

    Args:
        user (User): The user casting the vote.
        review_id (int): The ID of the review to vote on.
        is_helpful (bool): True for a helpful vote, False for a not helpful vote.

    Returns:
        tuple: (helpful_count, not_helpful_count) after the vote.

    Raises:
        ValidationError: If the user tries to vote the same way again.
        Review.DoesNotExist: If the review does not exist or is not approved.
    """
    review = Review.objects.get(pk=review_id, is_approved=True) # Ensure only approved reviews can be voted on

    with transaction.atomic():
        vote, created = ReviewVote.objects.get_or_create(
            review=review,
            user=user,
            defaults={'is_helpful': is_helpful}
        )

        if not created and vote.is_helpful == is_helpful:
            raise ValidationError("You have already cast this vote on this review.")
        elif not created and vote.is_helpful != is_helpful:
            # User changed their vote (e.g., from helpful to not helpful)
            vote.is_helpful = is_helpful
            vote.save(update_fields=['is_helpful', 'updated_at'])

        review.update_vote_counters() # Update denormalized counts

        # Placeholder for real-time notification
        # review_updated_signal.send(sender=Review, review=review, product_id=review.product.pk)

    return review.helpful_count, review.not_helpful_count

def flag_review(user, review_id, reason=''):
    """
    Allows a user to flag a review for moderation.

    Args:
        user (User): The user flagging the review.
        review_id (int): The ID of the review to flag.
        reason (str, optional): The reason for flagging. Defaults to ''.

    Returns:
        int: The total flag count for the review after flagging.

    Raises:
        ValidationError: If the user has already flagged this review.
        Review.DoesNotExist: If the review does not exist.
    """
    review = Review.objects.get(pk=review_id) # Can flag unapproved reviews for moderator review

    with transaction.atomic():
        flag, created = ReviewFlag.objects.get_or_create(
            review=review,
            user=user,
            defaults={'reason': reason}
        )

        if not created:
            raise ValidationError("You have already flagged this review.")

        review.update_flag_counter() # Update denormalized counts

        # Placeholder for real-time notification
        # review_updated_signal.send(sender=Review, review=review, product_id=review.product.pk)

    return review.flag_count

def get_review_summary(product_id): # <--- Accepts product_id
    """
    Retrieves the aggregated review summary for a product.

    Args:
        product_id (int): The ID of the product.

    Returns:
        dict: A dictionary with 'total', 'average', and 'breakdown' of ratings.
    Raises:
        Product.DoesNotExist: If the product with the given ID does not exist.
    """
    try:
        product = Product.objects.get(pk=product_id) # <--- Fetch Product object here
    except Product.DoesNotExist:
        raise Product.DoesNotExist(f"Product with ID {product_id} does not exist.")

    return get_product_review_stats(product) # <--- Pass the Product object to the selector
