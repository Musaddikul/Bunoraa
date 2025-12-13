# apps/reviews/serializers.py
"""
Review serializers.
"""
from rest_framework import serializers
from .models import Review, ReviewImage, ReviewResponse


class ReviewImageSerializer(serializers.ModelSerializer):
    """Serializer for review images."""
    
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'caption', 'order']


class ReviewResponseSerializer(serializers.ModelSerializer):
    """Serializer for review responses."""
    
    responder_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReviewResponse
        fields = ['id', 'responder_name', 'content', 'created_at']
    
    def get_responder_name(self, obj):
        if obj.responder:
            return obj.responder.get_full_name() or 'Store Team'
        return 'Store Team'


class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer for review list view."""
    
    user_name = serializers.SerializerMethodField()
    images = ReviewImageSerializer(many=True, read_only=True)
    response = ReviewResponseSerializer(read_only=True)
    helpfulness_score = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user_name', 'rating', 'title', 'content',
            'pros', 'cons', 'is_verified_purchase',
            'helpful_votes', 'not_helpful_votes', 'helpfulness_score',
            'images', 'response', 'created_at'
        ]
    
    def get_user_name(self, obj):
        # Show first name + last initial for privacy
        first_name = obj.user.first_name or 'Anonymous'
        last_initial = obj.user.last_name[0] + '.' if obj.user.last_name else ''
        return f'{first_name} {last_initial}'.strip()


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for review."""
    
    user_name = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    response = ReviewResponseSerializer(read_only=True)
    helpfulness_score = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_name', 'user_name',
            'rating', 'title', 'content', 'pros', 'cons',
            'status', 'is_verified_purchase',
            'helpful_votes', 'not_helpful_votes', 'helpfulness_score',
            'images', 'response', 'created_at', 'updated_at'
        ]
    
    def get_user_name(self, obj):
        first_name = obj.user.first_name or 'Anonymous'
        last_initial = obj.user.last_name[0] + '.' if obj.user.last_name else ''
        return f'{first_name} {last_initial}'.strip()


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a review."""
    
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        max_length=5
    )
    
    class Meta:
        model = Review
        fields = [
            'product', 'order', 'rating', 'title', 'content',
            'pros', 'cons', 'images'
        ]
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value
    
    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs['product']
        
        # Check if user already reviewed this product
        if Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError(
                'You have already reviewed this product'
            )
        
        # Check if user purchased this product (for verified badge)
        from apps.orders.models import Order, OrderItem
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            order__payment_status=Order.PaymentStatus.PAID,
            product=product
        ).exists()
        
        attrs['is_verified_purchase'] = has_purchased
        
        return attrs
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        validated_data['user'] = self.context['request'].user
        
        review = Review.objects.create(**validated_data)
        
        # Create review images
        for idx, image in enumerate(images_data):
            ReviewImage.objects.create(
                review=review,
                image=image,
                order=idx
            )
        
        return review


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a review."""
    
    class Meta:
        model = Review
        fields = ['rating', 'title', 'content', 'pros', 'cons']


class ReviewVoteSerializer(serializers.Serializer):
    """Serializer for voting on review helpfulness."""
    
    is_helpful = serializers.BooleanField()


class ReviewResponseCreateSerializer(serializers.ModelSerializer):
    """Serializer for admin response to review."""
    
    class Meta:
        model = ReviewResponse
        fields = ['content']
