# shipping/api/serializers.py
from rest_framework import serializers
from ..models import Region, ShippingZone, ShippingCarrier, ShippingMethod, Shipment, ShipmentStatusUpdate, ShipmentEvent
from django.utils.translation import gettext_lazy as _

class RegionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Region model.
    """
    class Meta:
        model = Region
        fields = ['id', 'name', 'description']

class ShippingZoneSerializer(serializers.ModelSerializer):
    """
    Serializer for the ShippingZone model.
    Includes nested regions.
    """
    regions = RegionSerializer(many=True, read_only=True)
    
    class Meta:
        model = ShippingZone
        fields = [
            'id', 'name', 'regions', 'base_cost', 'free_shipping_threshold',
            'volumetric_divisor', 'postal_codes', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ShippingCarrierSerializer(serializers.ModelSerializer):
    """
    Serializer for the ShippingCarrier model.
    Excludes sensitive API keys/credentials for public API.
    """
    class Meta:
        model = ShippingCarrier
        fields = [
            'id', 'name', 'code', 'api_base_url', 'tracking_url', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ShippingMethodSerializer(serializers.ModelSerializer):
    """
    Serializer for the ShippingMethod model.
    Includes nested carrier and zones for comprehensive details.
    """
    carrier = ShippingCarrierSerializer(read_only=True)
    zones = ShippingZoneSerializer(many=True, read_only=True) # Nested zones
    
    class Meta:
        model = ShippingMethod
        fields = [
            'id', 'name', 'carrier', 'zones', 'base_charge', 'price_per_kg',
            'estimated_delivery_days', 'guaranteed_delivery_days', 'is_express', 'is_active',
            'min_weight_kg', 'max_weight_kg', 'min_dims_cm', 'max_dims_cm', 'service_code',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ShipmentEventSerializer(serializers.ModelSerializer):
    """
    Serializer for the ShipmentEvent model.
    """
    class Meta:
        model = ShipmentEvent
        fields = '__all__'
        read_only_fields = ['id', 'shipment', 'created_at']

class ShipmentStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for the ShipmentStatusUpdate model.
    """
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)

    class Meta:
        model = ShipmentStatusUpdate
        fields = ['id', 'old_status', 'new_status', 'notes', 'created_at', 'updated_by', 'updated_by_username']
        read_only_fields = ['id', 'created_at', 'updated_by', 'updated_by_username']

class ShipmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Shipment model.
    Includes nested shipping method, tracking link, and related events/status updates.
    """
    order_id = serializers.CharField(source='order.order_id', read_only=True)
    shipping_method = ShippingMethodSerializer(read_only=True)
    tracking_link = serializers.SerializerMethodField()
    status_updates = ShipmentStatusUpdateSerializer(many=True, read_only=True)
    events = ShipmentEventSerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'order', 'order_id', 'shipping_method', 'tracking_number', 'tracking_link',
            'status', 'cost', 'weight_kg', 'dims_cm', 'carrier_response_data',
            'delivery_proof_url', 'delivery_signature_url', 'notes',
            'created_at', 'updated_at', 'status_updates', 'events'
        ]
        read_only_fields = [
            'id', 'order', 'tracking_link', 'status', 'cost', 'created_at', 'updated_at',
            'carrier_response_data', 'delivery_proof_url', 'delivery_signature_url',
            'status_updates', 'events'
        ]

    def get_tracking_link(self, obj) -> str | None:
        """
        Returns the tracking URL for the shipment.
        """
        return obj.get_tracking_link()

class ShipmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a Shipment.
    Requires order_id and shipping_method_id, calculates cost internally.
    """
    order_id = serializers.UUIDField(write_only=True, help_text=_("UUID of the CustomOrder"))
    shipping_method_id = serializers.IntegerField(write_only=True, help_text=_("ID of the ShippingMethod"))
    
    class Meta:
        model = Shipment
        fields = [
            'order_id', 'shipping_method_id', 'weight_kg', 'dims_cm', 'notes',
        ]
        extra_kwargs = {
            'weight_kg': {'required': True},
            'dims_cm': {'required': False},
        }

    def validate(self, data):
        """
        Validates the input data and ensures related objects exist.
        """
        from custom_order.models import CustomOrder # Import CustomOrder here to avoid circular dependency
        from .services import calculate_shipping_cost

        try:
            order = CustomOrder.objects.get(order_id=data['order_id'])
            data['order'] = order
        except CustomOrder.DoesNotExist:
            raise serializers.ValidationError({'order_id': _("Order not found.")})

        try:
            shipping_method = ShippingMethod.objects.get(id=data['shipping_method_id'])
            data['shipping_method'] = shipping_method
        except ShippingMethod.DoesNotExist:
            raise serializers.ValidationError({'shipping_method_id': _("Shipping method not found.")})

        # Calculate cost based on provided data
        try:
            # You might need to retrieve order_total from the order object or pass it
            # For simplicity, using a placeholder if not directly available in data
            order_total = order.total_amount if hasattr(order, 'total_amount') else Decimal('0.00')

            calculated_cost = calculate_shipping_cost(
                shipping_method=data['shipping_method'],
                address=order.shipping_address, # Assuming order has shipping_address
                weight_kg=data['weight_kg'],
                dimensions_cm=data.get('dims_cm'),
                order_total=order_total,
                is_express=data['shipping_method'].is_express
            )
            data['cost'] = calculated_cost
        except Exception as e:
            raise serializers.ValidationError({'shipping_cost': _(f"Failed to calculate shipping cost: {e}")})

        return data

    def create(self, validated_data):
        """
        Creates a Shipment instance.
        """
        # Pop write_only fields
        validated_data.pop('order_id')
        validated_data.pop('shipping_method_id')
        
        # The 'order' and 'shipping_method' objects are already added to validated_data in validate()
        return Shipment.objects.create(**validated_data)

