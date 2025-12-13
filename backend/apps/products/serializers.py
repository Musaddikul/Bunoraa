# apps/products/serializers.py
"""
Serializers for products.
"""
from rest_framework import serializers
from django.db.models import Avg
from .models import (
    Product, ProductImage, ProductVariant, ProductAttribute,
    Tag, Brand, AttributeType, AttributeValue, RelatedProduct
)
from apps.categories.serializers import CategoryListSerializer, CategoryBreadcrumbSerializer


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tags."""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for brands."""
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'website']


class AttributeTypeSerializer(serializers.ModelSerializer):
    """Serializer for attribute types."""
    
    class Meta:
        model = AttributeType
        fields = ['id', 'name', 'slug']


class AttributeValueSerializer(serializers.ModelSerializer):
    """Serializer for attribute values."""
    
    type_name = serializers.CharField(source='attribute_type.name', read_only=True)
    
    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute_type', 'type_name', 'value', 'display_value', 'color_code']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variants."""
    
    attributes = AttributeValueSerializer(many=True, read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'sku', 'name', 'attributes', 'price',
            'price_adjustment', 'stock', 'image', 'is_active'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description',
            'price', 'sale_price', 'current_price',
            'discount_percentage', 'is_on_sale', 'is_in_stock',
            'primary_image', 'average_rating', 'review_count',
            'category_name', 'brand_name', 'is_featured'
        ]
    
    def get_primary_image(self, obj):
        image = obj.primary_image
        if image:
            return ProductImageSerializer(image).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product detail serializer."""
    
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategoryListSerializer(read_only=True)
    breadcrumb = serializers.SerializerMethodField()
    brand = BrandSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    attributes = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'price', 'sale_price', 'current_price', 'discount_percentage',
            'is_on_sale', 'is_in_stock', 'is_low_stock', 'stock',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description',
            'is_featured', 'average_rating', 'review_count', 'views',
            'images', 'variants', 'category', 'breadcrumb',
            'brand', 'tags', 'attributes', 'related_products',
            'created_at', 'updated_at'
        ]
    
    def get_breadcrumb(self, obj):
        return obj.category.get_breadcrumb() if obj.category else []
    
    def get_attributes(self, obj):
        attributes = {}
        for attr in obj.attributes.select_related('attribute_value__attribute_type'):
            attr_type = attr.attribute_value.attribute_type.name
            if attr_type not in attributes:
                attributes[attr_type] = []
            attributes[attr_type].append({
                'value': attr.attribute_value.value,
                'display_value': attr.attribute_value.display_value,
                'color_code': attr.attribute_value.color_code
            })
        return attributes
    
    def get_related_products(self, obj):
        related = Product.objects.filter(
            id__in=obj.related_products.values_list('related_id', flat=True),
            is_active=True,
            is_deleted=False
        )[:8]
        return ProductListSerializer(related, many=True).data


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating products."""
    
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    tag_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    attribute_value_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'category', 'brand', 'price', 'sale_price', 'cost_price',
            'is_taxable', 'tax_rate', 'stock', 'low_stock_threshold',
            'track_inventory', 'allow_backorder',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description',
            'is_featured', 'featured_weight', 'is_active',
            'images', 'tag_ids', 'attribute_value_ids'
        ]
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        tag_ids = validated_data.pop('tag_ids', [])
        attribute_value_ids = validated_data.pop('attribute_value_ids', [])
        
        product = Product.objects.create(**validated_data)
        
        # Add images
        for i, image in enumerate(images_data):
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=(i == 0),
                sort_order=i
            )
        
        # Add tags
        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            product.tags.set(tags)
        
        # Add attributes
        for attr_id in attribute_value_ids:
            try:
                attr_value = AttributeValue.objects.get(id=attr_id)
                ProductAttribute.objects.create(
                    product=product,
                    attribute_value=attr_value
                )
            except AttributeValue.DoesNotExist:
                pass
        
        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating products."""
    
    tag_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'category', 'brand', 'price', 'sale_price', 'cost_price',
            'is_taxable', 'tax_rate', 'stock', 'low_stock_threshold',
            'track_inventory', 'allow_backorder',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description',
            'is_featured', 'featured_weight', 'is_active',
            'tag_ids'
        ]
    
    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tag_ids is not None:
            tags = Tag.objects.filter(id__in=tag_ids)
            instance.tags.set(tags)
        
        return instance


class BulkProductSerializer(serializers.Serializer):
    """Serializer for bulk product operations."""
    
    products = ProductCreateSerializer(many=True)
    
    def create(self, validated_data):
        products_data = validated_data.get('products', [])
        created_products = []
        
        for product_data in products_data:
            serializer = ProductCreateSerializer(data=product_data)
            if serializer.is_valid():
                product = serializer.save()
                created_products.append(product)
        
        return created_products
