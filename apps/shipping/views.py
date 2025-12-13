# apps/shipping/views.py
"""
Shipping Views
"""
from rest_framework import viewsets, generics, status, permissions
# action decorator available when needed
from rest_framework.response import Response

from .models import ShippingZone, ShippingMethod
from .serializers import (
    ShippingZoneSerializer, ShippingMethodSerializer,
    ShippingCalculateSerializer
)


class ShippingZoneViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Shipping zones.
    """
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.AllowAny]
    queryset = ShippingZone.objects.filter(is_active=True).prefetch_related('methods')


class ShippingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Shipping methods.
    """
    serializer_class = ShippingMethodSerializer
    permission_classes = [permissions.AllowAny]
    queryset = ShippingMethod.objects.filter(is_active=True)


class CalculateShippingView(generics.GenericAPIView):
    """
    Calculate available shipping methods for an address.
    """
    serializer_class = ShippingCalculateSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Find zone for address
        zone = ShippingZone.get_zone_for_address(
            country=data['country'],
            state=data.get('state'),
            postal_code=data.get('postal_code')
        )
        
        if not zone:
            return Response({
                'error': 'No shipping available to this location'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get available methods
        methods = ShippingMethod.objects.filter(
            zone=zone,
            is_active=True
        ) | ShippingMethod.objects.filter(
            zone__isnull=True,
            is_active=True
        )
        
        available_methods = []
        for method in methods.order_by('priority'):
            if method.is_available_for_order(
                order_total=data.get('order_total'),
                weight=data.get('weight')
            ):
                rate = method.calculate_rate(
                    order_total=data.get('order_total'),
                    weight=data.get('weight'),
                    item_count=data.get('item_count')
                )
                
                available_methods.append({
                    'id': method.id,
                    'name': method.name,
                    'carrier': method.carrier,
                    'rate': rate,
                    'delivery_estimate': method.delivery_estimate
                })
        
        return Response({
            'zone': zone.name,
            'methods': available_methods
        })


class AdminShippingZoneViewSet(viewsets.ModelViewSet):
    """
    Admin shipping zone management.
    """
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ShippingZone.objects.all().prefetch_related('methods')


class AdminShippingMethodViewSet(viewsets.ModelViewSet):
    """
    Admin shipping method management.
    """
    serializer_class = ShippingMethodSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ShippingMethod.objects.all()
