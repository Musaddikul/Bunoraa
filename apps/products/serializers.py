# apps/products/serializers.py
"""
Product Serializers
API serializers for product data.
"""
from rest_framework import serializers
# Avg imported when needed for aggregations
from taggit.serializers import TagListSerializerField, TaggitSerializer

from apps.categories.serializers import CategoryMinimalSerializer
from apps.vendors.serializers import VendorMinimalSerializer
from .models import (
    Brand, ProductAttribute, AttributeValue,
    Product, ProductImage, ProductVariant
)


class BrandSerializer(serializers.ModelSerializer):
    """Brand serializer."""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 'is_featured', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class AttributeValueSerializer(serializers.ModelSerializer):
    """Attribute value serializer."""
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    
    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute', 'attribute_name', 'value', 'slug', 'color_code']


class ProductAttributeSerializer(serializers.ModelSerializer):
    """Product attribute with values."""
    values = AttributeValueSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name', 'slug', 'values']


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'display_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer."""
    attributes = AttributeValueSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    attribute_string = serializers.CharField(read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'sku', 'name', 'price', 'compare_at_price',
            'current_price', 'stock_quantity', 'weight', 'image',
            'attributes', 'attribute_string', 'is_in_stock', 'is_active'
        ]


class ProductListSerializer(TaggitSerializer, serializers.ModelSerializer):
    """Product list serializer (optimized for listings)."""
    primary_image_url = serializers.CharField(read_only=True)
    category = CategoryMinimalSerializer(read_only=True)
    vendor = VendorMinimalSerializer(read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    is_discounted = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    tags = TagListSerializerField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'category', 'vendor', 'brand_name',
            'price', 'compare_at_price', 'current_price',
            'is_discounted', 'discount_percentage',
            'primary_image_url', 'is_in_stock', 'is_low_stock',
            'is_new', 'is_bestseller', 'is_on_sale', 'is_featured',
            'average_rating', 'review_count',
            'tags', 'url', 'created_at'
        ]


class ProductDetailSerializer(TaggitSerializer, serializers.ModelSerializer):
    """Detailed product serializer."""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategoryMinimalSerializer(read_only=True)
    vendor = VendorMinimalSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    attributes = AttributeValueSerializer(many=True, read_only=True)
    
    is_discounted = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    tags = TagListSerializerField()
    
    # Category breadcrumbs
    breadcrumbs = serializers.SerializerMethodField()
    
    # Related products
    related_products = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku',
            'short_description', 'description',
            'category', 'vendor', 'brand',
            'price', 'compare_at_price', 'current_price',
            'is_discounted', 'discount_percentage',
            'is_taxable', 'tax_rate',
            'track_inventory', 'stock_quantity', 'allow_backorder',
            'is_in_stock', 'is_low_stock',
            'weight', 'length', 'width', 'height',
            'status', 'is_active',
            'is_new', 'is_bestseller', 'is_on_sale', 'is_featured',
            'meta_title', 'meta_description',
            'view_count', 'sale_count',
            'average_rating', 'review_count',
            'images', 'variants', 'attributes', 'tags',
            'breadcrumbs', 'related_products',
            'url', 'created_at', 'updated_at'
        ]
    
    def get_breadcrumbs(self, obj):
        if obj.category:
            return obj.category.breadcrumbs
        return []
    
    def get_related_products(self, obj):
        # Get products from same category
        related = Product.objects.filter(
            category=obj.category,
            is_active=True,
            status=Product.Status.ACTIVE
        ).exclude(pk=obj.pk)[:8]
        
        return ProductListSerializer(related, many=True, context=self.context).data


class ProductCreateSerializer(TaggitSerializer, serializers.ModelSerializer):
    """Serializer for creating/updating products (vendor/admin)."""
    tags = TagListSerializerField()
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'short_description', 'description',
            'category', 'brand',
            'price', 'compare_at_price', 'cost_price',
            'is_taxable', 'tax_rate',
            'track_inventory', 'stock_quantity', 'low_stock_threshold', 'allow_backorder',
            'weight', 'length', 'width', 'height',
            'status', 'is_active',
            'featured_weight', 'featured_until',
            'is_new', 'is_bestseller', 'is_on_sale',
            'meta_title', 'meta_description',
            'tags'
        ]
    
    def create(self, validated_data):
        # Set vendor from request
        validated_data['vendor'] = self.context['request'].user.vendor_profile
        return super().create(validated_data)


class ProductMiniSerializer(serializers.ModelSerializer):
    """Minimal product serializer for nested representations."""
    primary_image_url = serializers.CharField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'primary_image_url']
