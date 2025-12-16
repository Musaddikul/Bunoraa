"""
Currency API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from ..models import Currency, ExchangeRate, CurrencySettings
from ..services import (
    CurrencyService, ExchangeRateService, CurrencyConversionService
)
from .serializers import (
    CurrencySerializer, ExchangeRateSerializer, ConvertAmountSerializer,
    FormatAmountSerializer, SetCurrencySerializer,
    CurrencySettingsSerializer
)


class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for currencies."""
    queryset = Currency.objects.filter(is_active=True)
    serializer_class = CurrencySerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """Get default currency."""
        currency = CurrencyService.get_default_currency()
        
        if not currency:
            return Response({
                'success': False,
                'message': 'No default currency configured',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'Default currency retrieved',
            'data': CurrencySerializer(currency).data
        })
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current currency for user/session."""
        currency = CurrencyService.get_user_currency(
            user=request.user if request.user.is_authenticated else None,
            request=request
        )
        
        return Response({
            'success': True,
            'message': 'Current currency retrieved',
            'data': CurrencySerializer(currency).data if currency else None
        })


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for exchange rates."""
    queryset = ExchangeRate.objects.filter(is_active=True)
    serializer_class = ExchangeRateSerializer
    permission_classes = [AllowAny]
    
    def list(self, request):
        """List all active exchange rates."""
        from_code = request.query_params.get('from')
        to_code = request.query_params.get('to')
        
        queryset = self.get_queryset()
        
        if from_code:
            queryset = queryset.filter(from_currency__code=from_code.upper())
        if to_code:
            queryset = queryset.filter(to_currency__code=to_code.upper())
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Exchange rates retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def rate(self, request):
        """Get specific exchange rate."""
        from_code = request.query_params.get('from')
        to_code = request.query_params.get('to')
        
        if not from_code or not to_code:
            return Response({
                'success': False,
                'message': 'Both from and to currency codes required',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        from_currency = CurrencyService.get_currency_by_code(from_code)
        to_currency = CurrencyService.get_currency_by_code(to_code)
        
        if not from_currency or not to_currency:
            return Response({
                'success': False,
                'message': 'Currency not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        rate = ExchangeRateService.get_exchange_rate(from_currency, to_currency)
        
        if rate is None:
            return Response({
                'success': False,
                'message': f'No exchange rate available for {from_code} to {to_code}',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'Exchange rate retrieved',
            'data': {
                'from_currency': from_code.upper(),
                'to_currency': to_code.upper(),
                'rate': str(rate),
                'inverse_rate': str(1 / rate) if rate else None
            }
        })


class ConvertCurrencyView(APIView):
    """API endpoint for currency conversion."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Convert amount between currencies."""
        serializer = ConvertAmountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid request data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        from_currency = CurrencyService.get_currency_by_code(data['from_currency'])
        to_currency = CurrencyService.get_currency_by_code(data['to_currency'])
        
        if not from_currency:
            return Response({
                'success': False,
                'message': f"Currency not found: {data['from_currency']}",
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not to_currency:
            return Response({
                'success': False,
                'message': f"Currency not found: {data['to_currency']}",
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            converted = CurrencyConversionService.convert(
                data['amount'],
                from_currency,
                to_currency,
                data['round_result']
            )
            
            rate = ExchangeRateService.get_exchange_rate(from_currency, to_currency)
            
            return Response({
                'success': True,
                'message': 'Conversion successful',
                'data': {
                    'original_amount': str(data['amount']),
                    'converted_amount': str(converted),
                    'from_currency': from_currency.code,
                    'to_currency': to_currency.code,
                    'rate': str(rate),
                    'formatted_original': from_currency.format_amount(data['amount']),
                    'formatted_converted': to_currency.format_amount(converted)
                }
            })
            
        except ValueError as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)


class FormatCurrencyView(APIView):
    """API endpoint for formatting amounts."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Format an amount in a specific currency."""
        serializer = FormatAmountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid request data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        currency = CurrencyService.get_currency_by_code(data['currency'])
        if not currency:
            return Response({
                'success': False,
                'message': f"Currency not found: {data['currency']}",
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        formatted = currency.format_amount(data['amount'])
        
        return Response({
            'success': True,
            'message': 'Amount formatted',
            'data': {
                'amount': str(data['amount']),
                'currency': currency.code,
                'formatted': formatted
            }
        })


class SetCurrencyPreferenceView(APIView):
    """API endpoint for setting user currency preference."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Set user's preferred currency."""
        serializer = SetCurrencySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid request data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        pref = CurrencyService.set_user_currency(
            request.user,
            data['currency_code'],
            data['auto_detect']
        )
        
        if not pref:
            return Response({
                'success': False,
                'message': f"Currency not found: {data['currency_code']}",
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'Currency preference saved',
            'data': {
                'currency': CurrencySerializer(pref.currency).data,
                'auto_detect': pref.auto_detect
            }
        })


class CurrencySettingsView(APIView):
    """API endpoint for currency settings."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get public currency settings."""
        settings = CurrencySettings.get_settings()
        serializer = CurrencySettingsSerializer(settings)
        
        return Response({
            'success': True,
            'message': 'Currency settings retrieved',
            'data': serializer.data
        })
