# apps/shipping/serializers.py
"""
Shipping Serializers
"""
from rest_framework import serializers
from .models import ShippingZone, ShippingMethod, ShippingRate


class ShippingRateSerializer(serializers.ModelSerializer):
    """Shipping rate serializer."""
    
    class Meta:
        model = ShippingRate
        fields = ['id', 'min_weight', 'max_weight', 'min_price', 'max_price', 'rate']


class ShippingMethodSerializer(serializers.ModelSerializer):
    """Shipping method serializer."""
    rates = ShippingRateSerializer(many=True, read_only=True)
    delivery_estimate = serializers.CharField(read_only=True)
    
    class Meta:
        model = ShippingMethod
        fields = [
            'id', 'name', 'code', 'description', 'carrier',
            'pricing_type', 'base_rate', 'free_shipping_threshold',
            'min_delivery_days', 'max_delivery_days', 'delivery_estimate',
            'rates'
        ]


class ShippingZoneSerializer(serializers.ModelSerializer):
    """Shipping zone serializer."""
    methods = ShippingMethodSerializer(many=True, read_only=True)
    countries_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ShippingZone
        fields = ['id', 'name', 'countries', 'countries_display', 'methods', 'is_default']
    
    def get_countries_display(self, obj):
        return [str(c.name) for c in obj.countries]


class ShippingCalculateSerializer(serializers.Serializer):
    """Serializer for calculating shipping."""
    country = serializers.CharField()
    state = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=False)
    order_total = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    weight = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    item_count = serializers.IntegerField(required=False)


class AvailableShippingMethodSerializer(serializers.Serializer):
    """Serializer for available shipping methods response."""
    id = serializers.IntegerField()
    name = serializers.CharField()
    carrier = serializers.CharField()
    rate = serializers.DecimalField(max_digits=10, decimal_places=2)
    delivery_estimate = serializers.CharField()
