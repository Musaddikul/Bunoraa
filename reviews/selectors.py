# reviews/selectors.py
from django.db.models import Avg, Count
from django.core.cache import cache
from .models import Review, ReviewImage, ReviewVote, ReviewFlag
from django.shortcuts import get_object_or_404 # For fetching single objects with 404

CACHE_TTL = 300  # 5 minutes

def get_approved_reviews(product, limit=20, offset=0, order_by='-pinned,-created_at'): # <--- Changed to accept 'product' object
    """
    Retrieves a paginated list of approved reviews for a given product.

    Args:
        product (Product): The Product object.
        limit (int): Maximum number of reviews to return.
        offset (int): Number of reviews to skip.
        order_by (str): Comma-separated string of fields to order the reviews by (e.g., '-pinned,-created_at').

    Returns:
        django.db.models.QuerySet: A queryset of approved Review objects.
    """
    # Split the order_by string into a list of field names
    order_fields = [f.strip() for f in order_by.split(',')]

    qs = Review.objects.filter(
        product=product, # <--- Use product object directly
        is_approved=True
    ).select_related(
        'user' # Select related User object to avoid N+1 queries
    ).prefetch_related(
        'images' # Preload review images
    ).order_by(*order_fields) # <--- Unpack the list of order fields

    return qs[offset:offset + limit]

def get_review_by_id(review_id):
    """
    Retrieves a single approved review by its ID, ensuring it's approved.

    Args:
        review_id (int): The ID of the review.

    Returns:
        Review: The Review object.

    Raises:
        Http404: If the review does not exist or is not approved.
    """
    return get_object_or_404(Review.objects.prefetch_related('images'), pk=review_id, is_approved=True)

def get_top_helpful_reviews(product, limit=5): # <--- Changed to accept 'product' object
    """
    Retrieves the most helpful approved reviews for a given product.

    Args:
        product (Product): The Product object.
        limit (int): Maximum number of reviews to return.

    Returns:
        django.db.models.QuerySet: A queryset of helpful Review objects.
    """
    qs = Review.objects.filter(
        product=product, # <--- Use product object directly
        is_approved=True
    ).select_related(
        'user'
    ).prefetch_related(
        'images'
    ).order_by('-helpful_count', '-created_at') # These are already separate arguments
    return qs[:limit]

def get_product_review_stats(product): # <--- Changed to accept 'product' object
    """
    Calculates and caches review statistics for a product (total, average, breakdown).

    Args:
        product (Product): The Product object.

    Returns:
        dict: A dictionary containing review statistics.
    """
    # Use product.pk for a clean and reliable cache key
    cache_key = f"review_stats_{product.pk}" # <--- Use product.pk for cache key
    stats = cache.get(cache_key)
    if stats:
        return stats
    qs = Review.objects.filter(product=product, is_approved=True) # <--- Use product object directly
    total = qs.count()
    avg = qs.aggregate(avg=Avg('rating'))['avg'] or 0
    breakdown = qs.values('rating').annotate(count=Count('rating'))
    dist = {i:0 for i in range(1,6)}
    for entry in breakdown:
        dist[entry['rating']] = entry['count']
    stats = {'total': total, 'average': round(avg, 1), 'breakdown': dist}
    cache.set(cache_key, stats, CACHE_TTL)
    return stats
