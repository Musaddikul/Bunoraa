"""
Wishlist API Serializers
"""
from rest_framework import serializers
from ..models import Wishlist, WishlistItem, WishlistShare, WishlistNotification


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items."""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.SerializerMethodField()
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_sale_price = serializers.DecimalField(source='product.sale_price', max_digits=10, decimal_places=2, read_only=True, allow_null=True)
    discount_percentage = serializers.SerializerMethodField()
    variant_name = serializers.CharField(source='variant.name', read_only=True, allow_null=True)
    price_change = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    price_change_percentage = serializers.FloatField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    product_has_variants = serializers.SerializerMethodField()
    
    class Meta:
        model = WishlistItem
        fields = [
            'id', 'product', 'product_name', 'product_slug', 'product_image',
            'product_price', 'product_sale_price', 'discount_percentage',
            'variant', 'variant_name', 'added_at', 'notes',
            'price_at_add', 'price_change', 'price_change_percentage',
            'notify_on_sale', 'notify_on_restock', 'notify_on_price_drop',
            'is_in_stock', 'is_on_sale', 'product_has_variants'
        ]
        read_only_fields = [
            'id', 'added_at', 'price_at_add',
            'price_change', 'price_change_percentage'
        ]
    
    def get_product_image(self, obj):
        image = obj.product.primary_image
        if image and image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None
    
    def get_discount_percentage(self, obj):
        """Calculate discount percentage if product is on sale."""
        if obj.product.sale_price and obj.product.price and obj.product.sale_price < obj.product.price:
            discount = ((obj.product.price - obj.product.sale_price) / obj.product.price) * 100
            return round(discount)
        return None

    def get_product_has_variants(self, obj):
        """Whether the underlying product has variants."""
        try:
            return obj.product.variants.exists()
        except Exception:
            return False


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for wishlist."""
    items = WishlistItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    total_value = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'item_count', 'total_value', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AddToWishlistSerializer(serializers.Serializer):
    """Serializer for adding items to wishlist."""
    product_id = serializers.UUIDField()
    variant_id = serializers.UUIDField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    notify_on_sale = serializers.BooleanField(default=True)
    notify_on_restock = serializers.BooleanField(default=True)
    notify_on_price_drop = serializers.BooleanField(default=True)


class UpdateWishlistItemSerializer(serializers.Serializer):
    """Serializer for updating wishlist item."""
    notes = serializers.CharField(required=False, allow_blank=True)
    notify_on_sale = serializers.BooleanField(required=False)
    notify_on_restock = serializers.BooleanField(required=False)
    notify_on_price_drop = serializers.BooleanField(required=False)


class MoveToCartSerializer(serializers.Serializer):
    """Serializer for moving item to cart."""
    quantity = serializers.IntegerField(min_value=1, default=1)


class WishlistShareSerializer(serializers.ModelSerializer):
    """Serializer for wishlist shares."""
    share_url = serializers.SerializerMethodField()
    share_is_valid = serializers.BooleanField(source='is_valid', read_only=True)
    
    class Meta:
        model = WishlistShare
        fields = [
            'id', 'share_token', 'share_url', 'is_active', 'share_is_valid',
            'allow_view', 'allow_purchase', 'expires_at',
            'view_count', 'created_at', 'last_viewed_at'
        ]
        read_only_fields = [
            'id', 'share_token', 'share_url', 'share_is_valid',
            'view_count', 'created_at', 'last_viewed_at'
        ]
    
    def get_share_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/wishlist/shared/{obj.share_token}/')
        return f'/wishlist/shared/{obj.share_token}/'


class CreateShareSerializer(serializers.Serializer):
    """Serializer for creating wishlist share."""
    expires_in_days = serializers.IntegerField(required=False, min_value=1, max_value=365)
    allow_purchase = serializers.BooleanField(default=False)


class SharedWishlistSerializer(serializers.Serializer):
    """Serializer for shared wishlist view."""
    wishlist = WishlistSerializer()
    share_info = serializers.SerializerMethodField()
    
    def get_share_info(self, obj):
        share = obj.get('share')
        if share:
            return {
                'allow_purchase': share.allow_purchase,
                'expires_at': share.expires_at
            }
        return None


class WishlistNotificationSerializer(serializers.ModelSerializer):
    """Serializer for wishlist notifications."""
    product_name = serializers.CharField(
        source='wishlist_item.product.name', read_only=True
    )
    product_id = serializers.UUIDField(
        source='wishlist_item.product.id', read_only=True
    )
    product_slug = serializers.CharField(
        source='wishlist_item.product.slug', read_only=True
    )
    
    class Meta:
        model = WishlistNotification
        fields = [
            'id', 'notification_type', 'message',
            'product_name', 'product_id', 'product_slug',
            'old_price', 'new_price',
            'is_sent', 'is_read', 'created_at', 'read_at'
        ]
        read_only_fields = [
            'id', 'notification_type', 'message', 'old_price', 'new_price',
            'is_sent', 'created_at'
        ]


class CheckWishlistSerializer(serializers.Serializer):
    """Serializer for checking if products are in wishlist."""
    product_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1,
        max_length=100
    )
