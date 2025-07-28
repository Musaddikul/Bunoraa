# reviews/serializers.py
from rest_framework import serializers
from .models import Review, ReviewImage, ReviewVote
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class ReviewImageSerializer(serializers.ModelSerializer):
    """
    Serializer for ReviewImage model, providing image URL.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'alt_text', 'uploaded_at', 'image_url']
        read_only_fields = ['id', 'uploaded_at']

    def get_image_url(self, obj):
        """
        Returns the absolute URL of the review image.
        """
        if obj.image:
            # Use request context to build absolute URL if available, otherwise just relative
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class UserReviewSerializer(serializers.ModelSerializer):
    """
    Simplified User Serializer for nested representation in Review.
    Includes full name.
    """
    full_name = serializers.SerializerMethodField() # <--- ADDED

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name'] # <--- ADDED 'full_name'
        read_only_fields = ['id', 'username', 'first_name', 'last_name', 'full_name'] # <--- ADDED 'full_name'

    def get_full_name(self, obj): # <--- ADDED METHOD
        """
        Returns the full name of the user, falling back to username if full name is empty.
        """
        full_name = obj.get_full_name()
        return full_name if full_name else obj.username

class ReviewSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for the Review model,
    including nested related data and dynamic fields for user interaction.
    """
    user = UserReviewSerializer(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    created_at_display = serializers.SerializerMethodField()
    user_has_voted = serializers.SerializerMethodField()
    user_vote_type = serializers.SerializerMethodField() # 'helpful', 'not_helpful', or None
    user_can_flag = serializers.SerializerMethodField() # Can be flagged by multiple users

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'user', 'rating', 'comment',
            'is_approved', 'verified', 'source', 'sentiment_score', 'pinned',
            'helpful_count', 'not_helpful_count', 'flag_count',
            'created_at', 'updated_at', 'created_at_display',
            'images', # Nested images
            'user_has_voted', 'user_vote_type', 'user_can_flag'
        ]
        read_only_fields = [
            'id', 'product', 'user', 'is_approved', 'verified', 'source',
            'sentiment_score', 'helpful_count', 'not_helpful_count', 'flag_count',
            'created_at', 'updated_at', 'images', 'user_has_voted', 'user_vote_type',
            'user_can_flag'
        ]

    def get_created_at_display(self, obj):
        """
        Returns a human-readable display of the creation timestamp.
        For enterprise-grade, consider using a library like `django-humanize`
        or `arrow` for more sophisticated time formatting.
        """
        return obj.created_at.strftime("%b %d, %Y") # e.g., "Jul 21, 2025"

    def get_user_has_voted(self, obj):
        """
        Determines if the current authenticated user has voted on this review.
        Requires request context.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False

    def get_user_vote_type(self, obj):
        """
        Returns the type of vote ('helpful', 'not_helpful') if the user has voted, else None.
        Requires request context.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                vote = obj.votes.get(user=request.user)
                return 'helpful' if vote.is_helpful else 'not_helpful'
            except ReviewVote.DoesNotExist:
                pass
        return None

    def get_user_can_flag(self, obj):
        """
        Determines if the current authenticated user can flag this review.
        A user can flag a review if they haven't already.
        Requires request context.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return not obj.flags.filter(user=request.user).exists()
        return False
