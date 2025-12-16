"""
Localization API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from ..models import (
    Language, Timezone, Country, UserLocalePreference,
    LocalizationSettings
)
from ..services import (
    LanguageService, TimezoneService, CountryService,
    LocalePreferenceService, TranslationService
)
from .serializers import (
    LanguageSerializer, LanguageMinimalSerializer,
    TimezoneSerializer, TimezoneMinimalSerializer,
    CountrySerializer, CountryMinimalSerializer,
    UserLocalePreferenceSerializer, TranslationSerializer,
    TranslationCreateSerializer, TranslationRequestSerializer,
    LocalizationSettingsSerializer,
    SetLanguageSerializer, SetTimezoneSerializer, SetCountrySerializer
)


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for languages."""
    
    queryset = Language.objects.filter(is_active=True)
    serializer_class = LanguageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'code'
    
    def list(self, request):
        """List all active languages."""
        languages = LanguageService.get_active_languages()
        serializer = self.get_serializer(languages, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """Get default language."""
        language = LanguageService.get_default_language()
        if not language:
            return Response({
                'success': False,
                'message': 'No default language configured'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(language)
        return Response({
            'success': True,
            'data': serializer.data
        })


class TimezoneViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for timezones."""
    
    queryset = Timezone.objects.filter(is_active=True)
    serializer_class = TimezoneSerializer
    permission_classes = [AllowAny]
    lookup_field = 'name'
    
    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get('common') == 'true':
            qs = qs.filter(is_common=True)
        return qs
    
    def list(self, request):
        """List timezones."""
        common_only = request.query_params.get('common') == 'true'
        if common_only:
            timezones = TimezoneService.get_common_timezones()
        else:
            timezones = TimezoneService.get_all_timezones()
        
        serializer = self.get_serializer(timezones, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for countries."""
    
    queryset = Country.objects.filter(is_active=True)
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]
    lookup_field = 'code'
    
    def list(self, request):
        """List all active countries."""
        shipping_only = request.query_params.get('shipping') == 'true'
        if shipping_only:
            countries = CountryService.get_shipping_countries()
        else:
            countries = CountryService.get_all_countries()
        
        serializer = self.get_serializer(countries, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def shipping(self, request):
        """Get countries with shipping available."""
        countries = CountryService.get_shipping_countries()
        serializer = CountryMinimalSerializer(countries, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


class LocalePreferenceView(APIView):
    """View for user locale preferences."""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's locale preferences."""
        pref = LocalePreferenceService.get_or_create_preference(request.user)
        serializer = UserLocalePreferenceSerializer(pref)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def put(self, request):
        """Update current user's locale preferences."""
        pref = LocalePreferenceService.get_or_create_preference(request.user)
        serializer = UserLocalePreferenceSerializer(pref, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Locale preferences updated',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SetLanguageView(APIView):
    """View to set session language."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Set language in session."""
        serializer = SetLanguageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid language code',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['language_code']
        language = LanguageService.get_language_by_code(code)
        
        if not language:
            return Response({
                'success': False,
                'message': f'Language "{code}" not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        request.session['language'] = code
        
        # Also update user preference if authenticated
        if request.user.is_authenticated:
            LocalePreferenceService.update_preference(request.user, language_code=code)
        
        return Response({
            'success': True,
            'message': f'Language set to {language.name}',
            'data': LanguageMinimalSerializer(language).data
        })


class SetTimezoneView(APIView):
    """View to set session timezone."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Set timezone in session."""
        serializer = SetTimezoneSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid timezone',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        name = serializer.validated_data['timezone_name']
        timezone = TimezoneService.get_timezone_by_name(name)
        
        if not timezone:
            return Response({
                'success': False,
                'message': f'Timezone "{name}" not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        request.session['timezone'] = name
        
        # Also update user preference if authenticated
        if request.user.is_authenticated:
            LocalePreferenceService.update_preference(request.user, timezone_name=name)
        
        return Response({
            'success': True,
            'message': f'Timezone set to {timezone.display_name}',
            'data': TimezoneMinimalSerializer(timezone).data
        })


class SetCountryView(APIView):
    """View to set session country."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Set country in session."""
        serializer = SetCountrySerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid country code',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['country_code']
        country = CountryService.get_country_by_code(code)
        
        if not country:
            return Response({
                'success': False,
                'message': f'Country "{code}" not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        request.session['country'] = code
        
        # Also update user preference if authenticated
        if request.user.is_authenticated:
            LocalePreferenceService.update_preference(request.user, country_code=code)
        
        return Response({
            'success': True,
            'message': f'Country set to {country.name}',
            'data': CountryMinimalSerializer(country).data
        })


class DetectLocaleView(APIView):
    """View to detect user's locale from request."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Detect locale from request headers and return."""
        user = request.user if request.user.is_authenticated else None
        
        language = LanguageService.get_user_language(user, request)
        timezone = TimezoneService.get_user_timezone(user, request)
        
        data = {
            'language': LanguageMinimalSerializer(language).data if language else None,
            'timezone': TimezoneMinimalSerializer(timezone).data if timezone else None,
            'country': None
        }
        
        # Try to get country from user preference
        if user:
            pref = UserLocalePreference.objects.filter(user=user).select_related('country').first()
            if pref and pref.country:
                data['country'] = CountryMinimalSerializer(pref.country).data
        
        return Response({
            'success': True,
            'data': data
        })


class TranslationView(APIView):
    """View for translations."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get translation for content."""
        content_type = request.query_params.get('content_type')
        content_id = request.query_params.get('content_id')
        field_name = request.query_params.get('field_name')
        language_code = request.query_params.get('language_code')
        
        if not all([content_type, content_id, field_name, language_code]):
            return Response({
                'success': False,
                'message': 'Missing required parameters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        translation = TranslationService.get_translation(
            content_type, content_id, field_name, language_code
        )
        
        return Response({
            'success': True,
            'data': {
                'translation': translation
            }
        })
    
    def post(self, request):
        """Create or update a translation."""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = TranslationCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        translation = TranslationService.set_translation(
            content_type=data['content_type'],
            content_id=data['content_id'],
            field_name=data['field_name'],
            language_code=data['language_code'],
            text=data['translated_text'],
            user=request.user,
            is_machine=False
        )
        
        if not translation:
            return Response({
                'success': False,
                'message': 'Failed to create translation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': 'Translation saved',
            'data': TranslationSerializer(translation).data
        }, status=status.HTTP_201_CREATED)


class TranslateTextView(APIView):
    """View for machine translation."""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Translate text using machine translation API."""
        serializer = TranslationRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        result = TranslationService.translate_text(
            text=data['text'],
            from_lang=data['from_language'],
            to_lang=data['to_language']
        )
        
        if result is None:
            return Response({
                'success': False,
                'message': 'Translation service not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response({
            'success': True,
            'data': {
                'original_text': data['text'],
                'translated_text': result,
                'from_language': data['from_language'],
                'to_language': data['to_language']
            }
        })


class LocalizationSettingsView(APIView):
    """View for localization settings."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get public localization settings."""
        settings = LocalizationSettings.get_settings()
        serializer = LocalizationSettingsSerializer(settings)
        return Response({
            'success': True,
            'data': serializer.data
        })
