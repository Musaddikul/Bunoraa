"""
Currency API Serializers
"""
from rest_framework import serializers
from ..models import Currency, ExchangeRate, CurrencySettings


class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for currency."""
    
    class Meta:
        model = Currency
        fields = [
            'id', 'code', 'name', 'symbol', 'decimal_places',
            'symbol_position', 'thousand_separator', 'decimal_separator',
            'is_default', 'sort_order'
        ]


class ExchangeRateSerializer(serializers.ModelSerializer):
    """Serializer for exchange rate."""
    from_currency_code = serializers.CharField(source='from_currency.code', read_only=True)
    to_currency_code = serializers.CharField(source='to_currency.code', read_only=True)
    inverse_rate = serializers.DecimalField(max_digits=18, decimal_places=8, read_only=True)
    
    class Meta:
        model = ExchangeRate
        fields = [
            'id', 'from_currency', 'from_currency_code',
            'to_currency', 'to_currency_code',
            'rate', 'inverse_rate', 'source', 'valid_from', 'valid_until'
        ]


class ConvertAmountSerializer(serializers.Serializer):
    """Serializer for currency conversion request."""
    amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    from_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    round_result = serializers.BooleanField(default=True)


class ConversionResultSerializer(serializers.Serializer):
    """Serializer for conversion result."""
    original_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    converted_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    from_currency = serializers.CharField()
    to_currency = serializers.CharField()
    rate = serializers.DecimalField(max_digits=18, decimal_places=8)
    formatted_original = serializers.CharField()
    formatted_converted = serializers.CharField()


class FormatAmountSerializer(serializers.Serializer):
    """Serializer for formatting amounts."""
    amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    currency = serializers.CharField(max_length=3)


class SetCurrencySerializer(serializers.Serializer):
    """Serializer for setting user currency preference."""
    currency_code = serializers.CharField(max_length=3)
    auto_detect = serializers.BooleanField(default=False)


class CurrencySettingsSerializer(serializers.ModelSerializer):
    """Serializer for currency settings (public)."""
    default_currency_code = serializers.CharField(source='default_currency.code', read_only=True)
    
    class Meta:
        model = CurrencySettings
        fields = [
            'default_currency_code', 'show_currency_selector',
            'show_original_price', 'rounding_method'
        ]
