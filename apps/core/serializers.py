# apps/core/serializers.py
"""
Core App Serializers
"""
from rest_framework import serializers
from .models import Language, Currency, SiteSettings


class LanguageSerializer(serializers.ModelSerializer):
    """Language serializer."""
    
    class Meta:
        model = Language
        fields = ['code', 'name', 'native_name', 'is_default', 'is_rtl']


class CurrencySerializer(serializers.ModelSerializer):
    """Currency serializer."""
    
    class Meta:
        model = Currency
        fields = ['code', 'name', 'symbol', 'exchange_rate', 'is_default']


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Site settings serializer (public fields only)."""
    
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'logo', 'favicon',
            'primary_color', 'secondary_color',
            'contact_email', 'contact_phone',
            'facebook_url', 'instagram_url', 'twitter_url',
            'default_currency', 'default_language',
            'enable_reviews', 'enable_wishlist',
        ]
