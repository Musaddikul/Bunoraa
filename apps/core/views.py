# apps/core/views.py
"""
Core App Views
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Language, Currency, SiteSettings
from .serializers import LanguageSerializer, CurrencySerializer, SiteSettingsSerializer


class LanguageListView(generics.ListAPIView):
    """List active languages."""
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Language.objects.filter(is_active=True)


class CurrencyListView(generics.ListAPIView):
    """List active currencies."""
    serializer_class = CurrencySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Currency.objects.filter(is_active=True)


class SiteSettingsView(generics.RetrieveAPIView):
    """Get public site settings."""
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        return SiteSettings.get_settings()


class HealthCheckView(APIView):
    """Health check endpoint."""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        from django.db import connection
        
        # Check database
        try:
            connection.ensure_connection()
            db_status = 'ok'
        except Exception as e:
            db_status = str(e)
        
        # Check cache
        try:
            from django.core.cache import cache
            cache.set('health_check', 'ok', 10)
            cache_status = 'ok' if cache.get('health_check') == 'ok' else 'error'
        except Exception as e:
            cache_status = str(e)
        
        status_code = status.HTTP_200_OK if db_status == 'ok' else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return Response({
            'status': 'healthy' if db_status == 'ok' else 'unhealthy',
            'database': db_status,
            'cache': cache_status,
        }, status=status_code)
