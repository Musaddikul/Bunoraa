"""
Category API serializers
"""
from rest_framework import serializers
from ..models import Category, Facet, ExternalCategoryMapping


class CategorySerializer(serializers.ModelSerializer):
    """Basic category serializer."""
    
    image_url = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(read_only=True)
    
    aspect = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'code', 'name', 'slug', 'description', 'image_url', 'icon',
            'depth', 'path', 'is_featured', 'product_count', 'meta_title',
            'meta_description', 'created_at', 'aspect'
        ]

    def get_aspect(self, obj):
        eff = obj.get_effective_aspect()
        return {
            'width': str(eff.get('width')),
            'height': str(eff.get('height')),
            'unit': eff.get('unit'),
            'ratio': str(eff.get('ratio')),
            'css': f"{eff.get('width')}/{eff.get('height')}"
        }    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CategoryDetailSerializer(CategorySerializer):
    """Detailed category serializer with breadcrumbs."""
    
    breadcrumbs = serializers.SerializerMethodField()
    parent = CategorySerializer(read_only=True)
    children = serializers.SerializerMethodField()
    
    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ['breadcrumbs', 'parent', 'children']
    
    def get_breadcrumbs(self, obj):
        return obj.get_breadcrumbs()
    
    def get_children(self, obj):
        children = obj.children.filter(is_active=True, is_deleted=False).order_by('order', 'name')
        return CategorySerializer(children, many=True, context=self.context).data


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Serializer for category tree structure."""
    
    children = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image_url', 'icon', 'depth', 'product_count', 'children']
    
    def get_children(self, obj):
        children = obj.children.filter(is_active=True, is_deleted=False).order_by('order', 'name')
        return CategoryTreeSerializer(children, many=True, context=self.context).data
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CategoryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating categories."""

    # Make slug optional and allow blank values to let model save() generate one when omitted
    slug = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'description', 'parent', 'image', 'icon',
            'order', 'meta_title', 'meta_description', 'meta_keywords',
            # Image aspect for category
            'aspect_width', 'aspect_height', 'aspect_unit',
            'is_active', 'is_featured'
        ]
        extra_kwargs = {
            'slug': {'required': False}
        }


class CategoryUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating categories."""
    
    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'description', 'parent', 'image', 'icon',
            'order', 'meta_title', 'meta_description', 'meta_keywords',
            'is_active', 'is_featured'
        ]


class CategoryReorderSerializer(serializers.Serializer):
    """Serializer for reordering categories."""
    
    id = serializers.UUIDField()
    order = serializers.IntegerField(min_value=0)


class FacetSerializer(serializers.ModelSerializer):
    """Serializer for facet definitions."""

    class Meta:
        model = Facet
        fields = ['facet_code', 'label', 'data_type', 'allowed_values']


class ExternalCategoryMappingSerializer(serializers.ModelSerializer):
    """Serializer for external marketplace mappings."""

    class Meta:
        model = ExternalCategoryMapping
        fields = ['provider', 'external_code', 'extra']