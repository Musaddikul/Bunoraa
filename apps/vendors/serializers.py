# apps/vendors/serializers.py
"""
Vendor Serializers
API serializers for vendor data.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Vendor, VendorPage, VendorSettings, VendorReview, VendorPayout

User = get_user_model()


class VendorMinimalSerializer(serializers.ModelSerializer):
    """Minimal vendor serializer for nested representations."""
    
    class Meta:
        model = Vendor
        fields = ['id', 'store_name', 'slug', 'logo', 'is_verified']


class VendorListSerializer(serializers.ModelSerializer):
    """Vendor list serializer."""
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    
    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'tagline', 'logo', 'banner',
            'is_verified', 'is_featured',
            'product_count', 'average_rating', 'review_count',
            'url'
        ]


class VendorDetailSerializer(serializers.ModelSerializer):
    """Detailed vendor serializer for storefront."""
    owner_name = serializers.CharField(read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    
    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'tagline', 'description',
            'logo', 'banner',
            'email', 'phone', 'whatsapp', 'website',
            'city', 'state', 'country',
            'is_verified', 'is_featured', 'verified_at',
            'return_policy', 'shipping_policy',
            'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url',
            'meta_title', 'meta_description',
            'product_count', 'order_count', 'average_rating', 'review_count',
            'owner_name', 'url', 'created_at'
        ]


class VendorDashboardSerializer(serializers.ModelSerializer):
    """Vendor serializer for dashboard (owner view)."""
    owner_name = serializers.CharField(read_only=True)
    pending_orders = serializers.SerializerMethodField()
    recent_sales = serializers.SerializerMethodField()
    
    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'tagline', 'description',
            'logo', 'banner', 'status', 'is_verified',
            'email', 'phone', 'whatsapp', 'website',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country',
            'business_type', 'tax_id', 'registration_number',
            'commission_rate', 'return_policy', 'shipping_policy',
            'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url',
            'meta_title', 'meta_description',
            'product_count', 'order_count', 'total_sales', 'average_rating', 'review_count',
            'owner_name', 'pending_orders', 'recent_sales', 'created_at'
        ]
        read_only_fields = [
            'status', 'is_verified', 'commission_rate',
            'product_count', 'order_count', 'total_sales',
            'average_rating', 'review_count', 'created_at'
        ]
    
    def get_pending_orders(self, obj):
        return obj.order_items.filter(
            order__status__name__in=['pending', 'processing']
        ).values('order').distinct().count()
    
    def get_recent_sales(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Sum
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        result = obj.order_items.filter(
            order__created_at__gte=thirty_days_ago,
            order__status__name__in=['completed', 'delivered']
        ).aggregate(total=Sum('subtotal'))
        
        return float(result['total'] or 0)


class VendorRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for vendor registration."""
    
    class Meta:
        model = Vendor
        fields = [
            'store_name', 'tagline', 'description',
            'email', 'phone', 'whatsapp',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country',
            'business_type'
        ]
    
    def validate_store_name(self, value):
        if Vendor.objects.filter(store_name__iexact=value).exists():
            raise serializers.ValidationError('A store with this name already exists.')
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VendorPageSerializer(serializers.ModelSerializer):
    """Vendor page serializer."""
    
    class Meta:
        model = VendorPage
        fields = ['id', 'title', 'slug', 'content', 'is_published', 'display_order']
        read_only_fields = ['id', 'slug']


class VendorSettingsSerializer(serializers.ModelSerializer):
    """Vendor settings serializer."""
    
    class Meta:
        model = VendorSettings
        fields = [
            'email_on_order', 'email_on_review', 'email_on_low_stock',
            'auto_approve_reviews', 'show_sold_count', 'show_stock_status',
            'vacation_mode', 'vacation_message', 'vacation_end_date'
        ]


class VendorReviewSerializer(serializers.ModelSerializer):
    """Vendor review serializer."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = VendorReview
        fields = [
            'id', 'rating', 'title', 'comment',
            'user_name', 'is_approved', 'created_at'
        ]
        read_only_fields = ['id', 'is_approved', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['vendor'] = self.context['vendor']
        return super().create(validated_data)


class VendorPayoutSerializer(serializers.ModelSerializer):
    """Vendor payout serializer."""
    
    class Meta:
        model = VendorPayout
        fields = [
            'id', 'amount', 'currency', 'status',
            'payment_method', 'transaction_id', 'notes',
            'created_at', 'processed_at'
        ]
        read_only_fields = ['id', 'status', 'transaction_id', 'created_at', 'processed_at']
