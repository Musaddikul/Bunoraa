"""
Internationalization API Serializers

DRF serializers for i18n models.
"""
from rest_framework import serializers
from ..models import (
    Language, Currency, ExchangeRate, ExchangeRateHistory,
    Timezone, Country, Division, District, Upazila,
    TranslationNamespace, TranslationKey, Translation, ContentTranslation,
    UserLocalePreference
)


# =============================================================================
# Language Serializers
# =============================================================================

class LanguageSerializer(serializers.ModelSerializer):
    """Serializer for Language model."""
    
    translation_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Language
        fields = [
            'id', 'code', 'locale_code', 'name', 'native_name',
            'flag_emoji', 'font_family', 'is_rtl', 'is_active',
            'is_default', 'sort_order', 'translation_progress'
        ]
        read_only_fields = ['id']
    
    def get_translation_progress(self, obj):
        if obj.total_strings and obj.total_strings > 0:
            return round((obj.translated_strings / obj.total_strings) * 100, 1)
        return 0


class LanguageListSerializer(serializers.ModelSerializer):
    """Compact serializer for language lists."""
    
    class Meta:
        model = Language
        fields = ['id', 'code', 'name', 'native_name', 'flag_emoji', 'is_rtl']


# =============================================================================
# Currency Serializers
# =============================================================================

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for Currency model."""
    
    formatted_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = Currency
        fields = [
            'id', 'code', 'name', 'native_name', 'symbol', 'native_symbol',
            'decimal_places', 'symbol_position', 'thousands_separator',
            'decimal_separator', 'number_system', 'exchange_rate',
            'formatted_rate', 'is_active', 'is_default', 'sort_order'
        ]
        read_only_fields = ['id', 'exchange_rate', 'last_rate_update']
    
    def get_formatted_rate(self, obj):
        if obj.is_default:
            return '1.00 (Base)'
        return f'{obj.exchange_rate:.4f}'


class CurrencyListSerializer(serializers.ModelSerializer):
    """Compact serializer for currency lists."""
    
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'native_symbol']


# =============================================================================
# Exchange Rate Serializers
# =============================================================================

class ExchangeRateSerializer(serializers.ModelSerializer):
    """Serializer for ExchangeRate model."""
    
    from_currency_code = serializers.CharField(source='from_currency.code', read_only=True)
    to_currency_code = serializers.CharField(source='to_currency.code', read_only=True)
    spread = serializers.SerializerMethodField()
    
    class Meta:
        model = ExchangeRate
        fields = [
            'id', 'from_currency', 'from_currency_code',
            'to_currency', 'to_currency_code',
            'rate', 'bid_rate', 'ask_rate', 'spread',
            'source', 'valid_from', 'valid_until', 'is_active'
        ]
        read_only_fields = ['id']
    
    def get_spread(self, obj):
        spread = obj.spread
        return round(spread * 100, 4) if spread else None


class ExchangeRateHistorySerializer(serializers.ModelSerializer):
    """Serializer for ExchangeRateHistory model."""
    
    from_currency_code = serializers.CharField(source='from_currency.code', read_only=True)
    to_currency_code = serializers.CharField(source='to_currency.code', read_only=True)
    
    class Meta:
        model = ExchangeRateHistory
        fields = [
            'id', 'from_currency', 'from_currency_code',
            'to_currency', 'to_currency_code', 'date',
            'rate', 'open_rate', 'high_rate', 'low_rate', 'close_rate',
            'source'
        ]
        read_only_fields = ['id']


# =============================================================================
# Timezone Serializers
# =============================================================================

class TimezoneSerializer(serializers.ModelSerializer):
    """Serializer for Timezone model."""
    
    formatted_offset = serializers.CharField(read_only=True)
    
    class Meta:
        model = Timezone
        fields = [
            'id', 'name', 'display_name', 'utc_offset', 'formatted_offset',
            'has_dst', 'dst_offset', 'is_common', 'is_active'
        ]
        read_only_fields = ['id']


class TimezoneListSerializer(serializers.ModelSerializer):
    """Compact serializer for timezone lists."""
    
    formatted_offset = serializers.CharField(read_only=True)
    
    class Meta:
        model = Timezone
        fields = ['id', 'name', 'display_name', 'formatted_offset']


# =============================================================================
# Country Serializers
# =============================================================================

class CountrySerializer(serializers.ModelSerializer):
    """Serializer for Country model."""
    
    default_currency_code = serializers.CharField(
        source='default_currency.code', read_only=True, allow_null=True
    )
    default_language_code = serializers.CharField(
        source='default_language.code', read_only=True, allow_null=True
    )
    
    class Meta:
        model = Country
        fields = [
            'id', 'code', 'code3', 'numeric_code', 'name', 'native_name',
            'flag_emoji', 'phone_code', 'continent', 'region',
            'default_currency', 'default_currency_code',
            'default_language', 'default_language_code',
            'default_timezone', 'address_format',
            'postal_code_format', 'vat_name', 'vat_rate',
            'is_shipping_available', 'is_active'
        ]
        read_only_fields = ['id']


class CountryListSerializer(serializers.ModelSerializer):
    """Compact serializer for country lists."""
    
    class Meta:
        model = Country
        fields = ['id', 'code', 'name', 'flag_emoji', 'phone_code']


# =============================================================================
# Division/District/Upazila Serializers
# =============================================================================

class UpazilaSerializer(serializers.ModelSerializer):
    """Serializer for Upazila model."""
    
    class Meta:
        model = Upazila
        fields = [
            'id', 'code', 'name', 'native_name', 'post_codes',
            'shipping_zone', 'is_active', 'sort_order'
        ]
        read_only_fields = ['id']


class DistrictSerializer(serializers.ModelSerializer):
    """Serializer for District model."""
    
    upazilas = UpazilaSerializer(many=True, read_only=True)
    upazila_count = serializers.SerializerMethodField()
    
    class Meta:
        model = District
        fields = [
            'id', 'code', 'name', 'native_name', 'shipping_zone',
            'is_active', 'sort_order', 'upazila_count', 'upazilas'
        ]
        read_only_fields = ['id']
    
    def get_upazila_count(self, obj):
        return obj.upazilas.count()


class DistrictListSerializer(serializers.ModelSerializer):
    """Compact serializer for district lists."""
    
    class Meta:
        model = District
        fields = ['id', 'code', 'name', 'native_name']


class DivisionSerializer(serializers.ModelSerializer):
    """Serializer for Division model."""
    
    districts = DistrictListSerializer(many=True, read_only=True)
    district_count = serializers.SerializerMethodField()
    country_code = serializers.CharField(source='country.code', read_only=True)
    
    class Meta:
        model = Division
        fields = [
            'id', 'code', 'name', 'native_name', 'country', 'country_code',
            'shipping_zone', 'is_active', 'sort_order',
            'district_count', 'districts'
        ]
        read_only_fields = ['id']
    
    def get_district_count(self, obj):
        return obj.districts.count()


class DivisionListSerializer(serializers.ModelSerializer):
    """Compact serializer for division lists."""
    
    class Meta:
        model = Division
        fields = ['id', 'code', 'name', 'native_name']


# =============================================================================
# Translation Serializers
# =============================================================================

class TranslationNamespaceSerializer(serializers.ModelSerializer):
    """Serializer for TranslationNamespace model."""
    
    key_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TranslationNamespace
        fields = ['id', 'name', 'description', 'key_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_key_count(self, obj):
        return obj.keys.count()


class TranslationKeySerializer(serializers.ModelSerializer):
    """Serializer for TranslationKey model."""
    
    namespace_name = serializers.CharField(source='namespace.name', read_only=True, allow_null=True)
    
    class Meta:
        model = TranslationKey
        fields = [
            'id', 'key', 'namespace', 'namespace_name',
            'source_text', 'context', 'max_length',
            'has_plural', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TranslationSerializer(serializers.ModelSerializer):
    """Serializer for Translation model."""
    
    key_name = serializers.CharField(source='key.key', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)
    translated_by_username = serializers.CharField(
        source='translated_by.username', read_only=True, allow_null=True
    )
    
    class Meta:
        model = Translation
        fields = [
            'id', 'key', 'key_name', 'language', 'language_code',
            'translated_text', 'plural_forms', 'status',
            'is_machine_translated', 'translated_by', 'translated_by_username',
            'reviewed_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContentTranslationSerializer(serializers.ModelSerializer):
    """Serializer for ContentTranslation model."""
    
    language_code = serializers.CharField(source='language.code', read_only=True)
    
    class Meta:
        model = ContentTranslation
        fields = [
            'id', 'content_type', 'content_id', 'field_name',
            'language', 'language_code', 'source_text', 'translated_text',
            'is_machine_translated', 'is_approved', 'translated_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# =============================================================================
# User Preference Serializers
# =============================================================================

class UserLocalePreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserLocalePreference model."""
    
    language_code = serializers.CharField(source='language.code', read_only=True, allow_null=True)
    currency_code = serializers.CharField(source='currency.code', read_only=True, allow_null=True)
    timezone_name = serializers.CharField(source='timezone.name', read_only=True, allow_null=True)
    country_code = serializers.CharField(source='country.code', read_only=True, allow_null=True)
    
    class Meta:
        model = UserLocalePreference
        fields = [
            'id', 'user',
            'language', 'language_code',
            'currency', 'currency_code',
            'timezone', 'timezone_name',
            'country', 'country_code',
            'auto_detect_language', 'auto_detect_currency', 'auto_detect_timezone',
            'date_format', 'time_format', 'first_day_of_week',
            'measurement_system', 'temperature_unit',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserLocalePreferenceUpdateSerializer(serializers.Serializer):
    """Serializer for updating user locale preferences."""
    
    language_code = serializers.CharField(required=False, allow_null=True)
    currency_code = serializers.CharField(required=False, allow_null=True)
    timezone_name = serializers.CharField(required=False, allow_null=True)
    country_code = serializers.CharField(required=False, allow_null=True)
    
    auto_detect_language = serializers.BooleanField(required=False)
    auto_detect_currency = serializers.BooleanField(required=False)
    auto_detect_timezone = serializers.BooleanField(required=False)
    
    date_format = serializers.CharField(required=False)
    time_format = serializers.CharField(required=False)
    first_day_of_week = serializers.IntegerField(required=False, min_value=0, max_value=6)
    measurement_system = serializers.ChoiceField(
        choices=['metric', 'imperial'],
        required=False
    )
    temperature_unit = serializers.ChoiceField(
        choices=['celsius', 'fahrenheit'],
        required=False
    )


# =============================================================================
# Currency Conversion Serializers
# =============================================================================

class CurrencyConversionRequestSerializer(serializers.Serializer):
    """Serializer for currency conversion request."""
    
    amount = serializers.DecimalField(max_digits=20, decimal_places=6)
    from_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    round_result = serializers.BooleanField(default=True)


class CurrencyConversionResponseSerializer(serializers.Serializer):
    """Serializer for currency conversion response."""
    
    original_amount = serializers.DecimalField(max_digits=20, decimal_places=6)
    original_currency = serializers.CharField()
    original_formatted = serializers.CharField()
    
    converted_amount = serializers.DecimalField(max_digits=20, decimal_places=6)
    converted_currency = serializers.CharField()
    converted_formatted = serializers.CharField()
    
    exchange_rate = serializers.DecimalField(max_digits=20, decimal_places=10)
