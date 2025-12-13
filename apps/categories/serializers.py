# apps/categories/serializers.py
"""
Category Serializers
API serializers for category data.
"""
from rest_framework import serializers
from .models import Category


class CategoryMinimalSerializer(serializers.ModelSerializer):
    """Minimal category serializer for nested representations."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CategorySerializer(serializers.ModelSerializer):
    """Standard category serializer."""
    parent = CategoryMinimalSerializer(read_only=True)
    full_path = serializers.CharField(read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent', 'description',
            'image', 'icon', 'banner_image',
            'meta_title', 'meta_description',
            'is_featured', 'product_count_cache',
            'full_path', 'url'
        ]


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Recursive category serializer for tree structure."""
    children = serializers.SerializerMethodField()
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    product_count = serializers.IntegerField(source='product_count_cache', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'icon',
            'is_featured', 'product_count', 'url', 'children'
        ]
    
    def get_children(self, obj):
        children = obj.get_children().filter(is_active=True)
        return CategoryTreeSerializer(children, many=True).data


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Detailed category serializer with breadcrumbs."""
    breadcrumbs = serializers.ListField(read_only=True)
    parent = CategoryMinimalSerializer(read_only=True)
    children = CategoryMinimalSerializer(many=True, source='get_children', read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent', 'children',
            'description', 'image', 'icon', 'banner_image',
            'meta_title', 'meta_description',
            'is_featured', 'product_count_cache',
            'breadcrumbs', 'url'
        ]


class CategoryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating categories (admin)."""
    
    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'parent', 'description',
            'image', 'icon', 'banner_image',
            'meta_title', 'meta_description',
            'is_active', 'is_featured', 'show_in_menu',
            'display_order'
        ]
    
    def validate_parent(self, value):
        """Prevent circular references."""
        if self.instance and value:
            if value == self.instance:
                raise serializers.ValidationError("A category cannot be its own parent.")
            if value in self.instance.get_descendants():
                raise serializers.ValidationError("A category cannot have a descendant as its parent.")
        return value
