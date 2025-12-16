"""
FAQ API Serializers
"""
from rest_framework import serializers

from ..models import FAQCategory, FAQQuestion, FAQSuggestion


class FAQQuestionListSerializer(serializers.ModelSerializer):
    """Serializer for FAQ question list."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = FAQQuestion
        fields = [
            'id', 'question', 'slug', 'category_name', 'category_slug',
            'is_featured', 'view_count', 'helpfulness_ratio'
        ]


class FAQQuestionDetailSerializer(serializers.ModelSerializer):
    """Serializer for FAQ question detail."""
    
    category = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQQuestion
        fields = [
            'id', 'question', 'slug', 'answer', 'category',
            'is_featured', 'view_count', 'helpful_count', 'not_helpful_count',
            'helpfulness_ratio', 'created_at', 'updated_at'
        ]
    
    def get_category(self, obj):
        return {
            'id': str(obj.category.id),
            'name': obj.category.name,
            'slug': obj.category.slug
        }


class FAQCategoryListSerializer(serializers.ModelSerializer):
    """Serializer for FAQ category list."""
    
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'questions_count', 'order'
        ]
    
    def get_questions_count(self, obj):
        return obj.questions.filter(is_active=True).count()


class FAQCategoryDetailSerializer(serializers.ModelSerializer):
    """Serializer for FAQ category detail with questions."""
    
    questions = FAQQuestionListSerializer(many=True, source='active_questions')
    
    class Meta:
        model = FAQCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'meta_title', 'meta_description', 'questions'
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Filter to only active questions
        active_questions = instance.questions.filter(is_active=True).order_by('order')
        data['questions'] = FAQQuestionListSerializer(active_questions, many=True).data
        return data


class FAQFeedbackSerializer(serializers.Serializer):
    """Serializer for submitting FAQ feedback."""
    
    question_id = serializers.UUIDField()
    feedback_type = serializers.ChoiceField(choices=['helpful', 'not_helpful'])
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)


class FAQSearchSerializer(serializers.Serializer):
    """Serializer for FAQ search."""
    
    query = serializers.CharField(min_length=2, max_length=255)
    category = serializers.SlugField(required=False, allow_blank=True)


class FAQSuggestionCreateSerializer(serializers.Serializer):
    """Serializer for creating FAQ suggestions."""
    
    question = serializers.CharField(max_length=500)
    answer = serializers.CharField(required=False, allow_blank=True, max_length=5000)
    email = serializers.EmailField(required=False, allow_blank=True)
    category_id = serializers.UUIDField(required=False, allow_null=True)


class FAQSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for FAQ suggestion."""
    
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    
    class Meta:
        model = FAQSuggestion
        fields = [
            'id', 'suggested_question', 'suggested_answer', 
            'category_name', 'status', 'created_at'
        ]
