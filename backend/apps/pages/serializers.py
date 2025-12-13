# apps/pages/serializers.py
"""
Pages serializers.
"""
from rest_framework import serializers
from .models import Page, FAQ, ContactMessage, SiteSettings


class PageSerializer(serializers.ModelSerializer):
    """Serializer for pages."""
    
    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt',
            'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQs."""
    
    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )
    
    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'category_display'
        ]


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating contact messages."""
    
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
    
    def validate_email(self, value):
        return value.lower()


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact message display (admin)."""
    
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'status', 'status_display', 'admin_notes',
            'created_at', 'updated_at'
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for site settings."""
    
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'logo', 'favicon',
            'contact_email', 'contact_phone', 'address',
            'facebook_url', 'instagram_url', 'twitter_url',
            'pinterest_url', 'youtube_url', 'tiktok_url',
            'default_meta_title', 'default_meta_description',
            'footer_text', 'currency_code', 'currency_symbol',
            'free_shipping_threshold'
        ]
