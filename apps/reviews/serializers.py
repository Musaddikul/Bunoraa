# apps/reviews/serializers.py
"""
Review Serializers
"""
from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from .models import Review, ReviewImage, ReviewReport


class ReviewImageSerializer(serializers.ModelSerializer):
    """Review image serializer."""
    
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'alt_text', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    """Review serializer."""
    user = UserSerializer(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'user', 'order_item',
            'rating', 'title', 'content', 'pros', 'cons',
            'status', 'is_verified_purchase',
            'helpful_count', 'not_helpful_count',
            'admin_response', 'admin_response_at',
            'images', 'user_vote',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'user', 'status', 'is_verified_purchase',
            'helpful_count', 'not_helpful_count',
            'admin_response', 'admin_response_at'
        ]
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = obj.votes.filter(user=request.user).first()
            if vote:
                return 'helpful' if vote.is_helpful else 'not_helpful'
        return None


class ReviewListSerializer(serializers.ModelSerializer):
    """Simplified review serializer for lists."""
    user_name = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'title', 'content',
            'user_name', 'is_verified_purchase',
            'helpful_count', 'image_count',
            'created_at'
        ]
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email.split('@')[0]
    
    def get_image_count(self, obj):
        return obj.images.count()


class CreateReviewSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews."""
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        max_length=5
    )
    
    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'content', 'pros', 'cons', 'images']
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        review = Review.objects.create(**validated_data)
        
        for i, image in enumerate(images):
            ReviewImage.objects.create(review=review, image=image, order=i)
        
        return review


class ReviewVoteSerializer(serializers.Serializer):
    """Serializer for voting on reviews."""
    is_helpful = serializers.BooleanField()


class ReviewReportSerializer(serializers.ModelSerializer):
    """Serializer for reporting reviews."""
    
    class Meta:
        model = ReviewReport
        fields = ['review', 'reason', 'details']


class AdminReviewSerializer(ReviewSerializer):
    """Admin review serializer with moderation fields."""
    
    class Meta(ReviewSerializer.Meta):
        fields = ReviewSerializer.Meta.fields + ['moderation_note', 'is_deleted']
        read_only_fields = ['user', 'is_verified_purchase', 'helpful_count', 'not_helpful_count']


class ReviewStatsSerializer(serializers.Serializer):
    """Product review statistics."""
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()
    verified_purchase_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
