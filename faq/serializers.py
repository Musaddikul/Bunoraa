# faq/serializers.py
from rest_framework import serializers
from .models import Category, FAQ, FAQFeedback, FAQRequest

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','slug','description','parent']

class FAQSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags     = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    class Meta:
        model = FAQ
        fields = [
            'id','slug','question','answer','category','tags',
            'view_count','helpful_count','not_helpful_count',
            'is_featured','meta_title','meta_description'
        ]

class FAQFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQFeedback
        fields = ['faq','is_helpful']

class FAQRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQRequest
        fields = ['email','question_text']
