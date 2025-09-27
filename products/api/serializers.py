# products/api/serializers.py
from rest_framework import serializers
from products.models import Product, ProductImage, Category, Brand, Color, Size, Fabric # Removed Seller from here

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class FabricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fabric
        fields = ['id', 'name']
from accounts.models import Seller # FIX: Import Seller from accounts.models

class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductImage, used for nested representation.
    """
    class Meta:
        model = ProductImage
        fields = ['image', 'alt_text', 'display_order'] # Expose image URL directly

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class BrandSerializer(serializers.ModelSerializer):
    """
    Serializer for Brand model.
    """
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']

class SellerSerializer(serializers.ModelSerializer):
    """
    Serializer for Seller model.
    Includes profile image URL if available.
    """
    profile_image_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = ['id', 'store_name', 'full_name', 'email', 'profile_image_url']

    def get_profile_image_url(self, obj):
        """
        Returns the URL of the seller's profile image.
        """
        if hasattr(obj, 'profile') and obj.profile.image:
            return obj.profile.image.url
        return '/static/images/default-store.png'

    def get_full_name(self, obj):
        """Returns the full name of the associated user."""
        return obj.user.get_full_name()

    def get_email(self, obj):
        """Returns the email of the associated user."""
        return obj.user.email

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the Product model, suitable for API responses.
    Includes current price, nested primary image, category, brand, and seller details.
    """
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    get_absolute_url = serializers.CharField(read_only=True)
    is_discounted = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    # FIX: Use a nested ProductImageSerializer for the 'image' property.
    # This will serialize the ProductImage object returned by product.image property
    # into a dictionary with an 'url' key (from the ImageField).
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.primary_image and hasattr(obj.primary_image, 'image') and hasattr(obj.primary_image.image, 'url'):
            return request.build_absolute_uri(obj.primary_image.image.url)
        return '/static/images/default_product.png' # Return a default image URL

    category = CategorySerializer(read_only=True) # Nested serializer for category details
    brand = BrandSerializer(read_only=True)       # Nested serializer for brand details
    seller = SellerSerializer(read_only=True)     # Nested serializer for seller details

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'discounted_price', 'current_price',
            'stock', 'available', 'weight', 'image', 'get_absolute_url', 'is_discounted', 'discount_percentage',
            'category', 'brand', 'seller'
        ]
        # Remove primary_image_url from read_only_fields as it's no longer a SerializerMethodField
        # and 'image' is read-only by default when using a nested serializer with read_only=True.

