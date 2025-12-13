# apps/categories/serializers.py
"""
Serializers for categories.
"""
from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Full category serializer with all fields."""
    
    product_count = serializers.ReadOnlyField()
    breadcrumb = serializers.SerializerMethodField()
    has_children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent',
            'depth', 'sort_order', 'image', 'icon',
            'meta_title', 'meta_description',
            'is_active', 'is_featured',
            'product_count', 'breadcrumb', 'has_children',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'depth', 'created_at', 'updated_at']
    
    def get_breadcrumb(self, obj):
        return obj.get_breadcrumb()
    
    def get_has_children(self, obj):
        return obj.children.filter(is_deleted=False, is_active=True).exists()


class CategoryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating categories."""
    
    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'description', 'parent',
            'sort_order', 'image', 'icon',
            'meta_title', 'meta_description',
            'is_active', 'is_featured'
        ]
    
    def validate_parent(self, value):
        if value and value.is_deleted:
            raise serializers.ValidationError("Cannot set deleted category as parent.")
        return value
    
    def validate_slug(self, value):
        if value and Category.objects.filter(slug=value).exists():
            raise serializers.ValidationError("A category with this slug already exists.")
        return value


class CategoryUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating categories."""
    
    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'description', 'parent',
            'sort_order', 'image', 'icon',
            'meta_title', 'meta_description',
            'is_active', 'is_featured'
        ]
    
    def validate_parent(self, value):
        instance = self.instance
        
        if value:
            # Cannot set self as parent
            if value.pk == instance.pk:
                raise serializers.ValidationError("Category cannot be its own parent.")
            
            # Cannot set descendant as parent (would create loop)
            descendant_ids = list(instance.get_descendants().values_list('id', flat=True))
            if value.pk in descendant_ids:
                raise serializers.ValidationError("Cannot set a descendant as parent.")
            
            if value.is_deleted:
                raise serializers.ValidationError("Cannot set deleted category as parent.")
        
        return value


class CategoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for category lists."""
    
    has_children = serializers.SerializerMethodField()
    product_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'image', 'icon',
            'depth', 'is_featured', 'has_children', 'product_count'
        ]
    
    def get_has_children(self, obj):
        return obj.children.filter(is_deleted=False, is_active=True).exists()


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Serializer for category tree structure."""
    
    children = serializers.SerializerMethodField()
    product_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'image', 'icon',
            'is_featured', 'product_count', 'children'
        ]
    
    def get_children(self, obj):
        children = obj.get_children().filter(is_active=True)
        return CategoryTreeSerializer(children, many=True).data


class CategoryBreadcrumbSerializer(serializers.Serializer):
    """Serializer for category breadcrumb."""
    
    id = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.SlugField()
