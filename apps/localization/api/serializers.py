"""
Localization API Serializers
"""
from rest_framework import serializers

from ..models import (
    Language, Timezone, Country, UserLocalePreference,
    Translation, LocalizationSettings
)


class LanguageSerializer(serializers.ModelSerializer):
    """Serializer for Language model."""
    
    class Meta:
        model = Language
        fields = [
            'id', 'code', 'name', 'native_name', 'flag_emoji',
            'is_rtl', 'is_default', 'translation_progress'
        ]
        read_only_fields = ['id', 'is_default', 'translation_progress']


class LanguageMinimalSerializer(serializers.ModelSerializer):
    """Minimal serializer for Language."""
    
    class Meta:
        model = Language
        fields = ['code', 'name', 'flag_emoji', 'is_rtl']


class TimezoneSerializer(serializers.ModelSerializer):
    """Serializer for Timezone model."""
    
    class Meta:
        model = Timezone
        fields = ['id', 'name', 'display_name', 'utc_offset', 'is_common']
        read_only_fields = ['id']


class TimezoneMinimalSerializer(serializers.ModelSerializer):
    """Minimal serializer for Timezone."""
    
    class Meta:
        model = Timezone
        fields = ['name', 'display_name', 'utc_offset']


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for Country model."""
    
    default_language = LanguageMinimalSerializer(read_only=True)
    timezones = TimezoneMinimalSerializer(many=True, read_only=True)
    
    class Meta:
        model = Country
        fields = [
            'id', 'code', 'name', 'flag_emoji', 'calling_code',
            'continent', 'is_shipping_available', 'is_default',
            'default_language', 'timezones'
        ]
        read_only_fields = ['id', 'is_default']


class CountryMinimalSerializer(serializers.ModelSerializer):
    """Minimal serializer for Country."""
    
    class Meta:
        model = Country
        fields = ['code', 'name', 'flag_emoji']


class UserLocalePreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserLocalePreference model."""
    
    language = LanguageMinimalSerializer(read_only=True)
    timezone = TimezoneMinimalSerializer(read_only=True)
    country = CountryMinimalSerializer(read_only=True)
    
    language_code = serializers.CharField(write_only=True, required=False)
    timezone_name = serializers.CharField(write_only=True, required=False)
    country_code = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = UserLocalePreference
        fields = [
            'id', 'language', 'timezone', 'country',
            'language_code', 'timezone_name', 'country_code',
            'date_format', 'time_format', 'first_day_of_week',
            'measurement_system', 'auto_detect_language', 'auto_detect_timezone',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'language', 'timezone', 'country', 'created_at', 'updated_at']
    
    def update(self, instance, validated_data):
        from ..services import LanguageService, TimezoneService, CountryService
        
        if 'language_code' in validated_data:
            instance.language = LanguageService.get_language_by_code(validated_data.pop('language_code'))
        
        if 'timezone_name' in validated_data:
            instance.timezone = TimezoneService.get_timezone_by_name(validated_data.pop('timezone_name'))
        
        if 'country_code' in validated_data:
            instance.country = CountryService.get_country_by_code(validated_data.pop('country_code'))
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class TranslationSerializer(serializers.ModelSerializer):
    """Serializer for Translation model."""
    
    language = LanguageMinimalSerializer(read_only=True)
    language_code = serializers.CharField(write_only=True)
    
    class Meta:
        model = Translation
        fields = [
            'id', 'content_type', 'content_id', 'field_name',
            'language', 'language_code', 'original_text', 'translated_text',
            'is_machine_translated', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'language', 'is_approved', 'created_at', 'updated_at']


class TranslationCreateSerializer(serializers.Serializer):
    """Serializer for creating translations."""
    
    content_type = serializers.CharField()
    content_id = serializers.CharField()
    field_name = serializers.CharField()
    language_code = serializers.CharField()
    translated_text = serializers.CharField()
    original_text = serializers.CharField(required=False, allow_blank=True)


class TranslationRequestSerializer(serializers.Serializer):
    """Serializer for translation request."""
    
    text = serializers.CharField()
    from_language = serializers.CharField()
    to_language = serializers.CharField()


class LocalizationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for LocalizationSettings model."""
    
    default_language = LanguageMinimalSerializer(read_only=True)
    default_timezone = TimezoneMinimalSerializer(read_only=True)
    default_country = CountryMinimalSerializer(read_only=True)
    fallback_language = LanguageMinimalSerializer(read_only=True)
    
    class Meta:
        model = LocalizationSettings
        fields = [
            'default_language', 'default_timezone', 'default_country',
            'default_date_format', 'default_time_format', 'default_measurement_system',
            'enable_machine_translation', 'auto_detect_language', 'auto_detect_timezone',
            'fallback_language'
        ]


class DetectedLocaleSerializer(serializers.Serializer):
    """Serializer for detected locale information."""
    
    language = LanguageMinimalSerializer()
    timezone = TimezoneMinimalSerializer(allow_null=True)
    country = CountryMinimalSerializer(allow_null=True)


class SetLanguageSerializer(serializers.Serializer):
    """Serializer for setting language."""
    
    language_code = serializers.CharField()


class SetTimezoneSerializer(serializers.Serializer):
    """Serializer for setting timezone."""
    
    timezone_name = serializers.CharField()


class SetCountrySerializer(serializers.Serializer):
    """Serializer for setting country."""
    
    country_code = serializers.CharField(max_length=2)
