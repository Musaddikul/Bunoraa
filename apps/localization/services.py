"""
Localization Services
"""
from django.core.cache import cache

from .models import (
    Language, Timezone, Country, UserLocalePreference,
    Translation, LocalizationSettings
)


class LanguageService:
    """Service for language operations."""
    
    CACHE_TIMEOUT = 3600
    
    @staticmethod
    def get_active_languages():
        """Get all active languages."""
        cache_key = 'active_languages'
        languages = cache.get(cache_key)
        
        if languages is None:
            languages = list(Language.objects.filter(is_active=True))
            cache.set(cache_key, languages, LanguageService.CACHE_TIMEOUT)
        
        return languages
    
    @staticmethod
    def get_default_language():
        """Get default language."""
        cache_key = 'default_language'
        language = cache.get(cache_key)
        
        if language is None:
            language = Language.objects.filter(is_default=True).first()
            if not language:
                language = Language.objects.filter(is_active=True).first()
            if language:
                cache.set(cache_key, language, LanguageService.CACHE_TIMEOUT)
        
        return language
    
    @staticmethod
    def get_language_by_code(code):
        """Get language by code."""
        cache_key = f'language_{code}'
        language = cache.get(cache_key)
        
        if language is None:
            language = Language.objects.filter(code=code, is_active=True).first()
            if language:
                cache.set(cache_key, language, LanguageService.CACHE_TIMEOUT)
        
        return language
    
    @staticmethod
    def detect_language(request):
        """Detect language from request."""
        # Check session
        if hasattr(request, 'session'):
            lang_code = request.session.get('language')
            if lang_code:
                language = LanguageService.get_language_by_code(lang_code)
                if language:
                    return language
        
        # Check Accept-Language header
        accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        if accept_lang:
            # Parse first preferred language
            lang_code = accept_lang.split(',')[0].split('-')[0].strip()
            language = LanguageService.get_language_by_code(lang_code)
            if language:
                return language
        
        return LanguageService.get_default_language()
    
    @staticmethod
    def get_user_language(user=None, request=None):
        """Get language for user or request."""
        # Check user preference
        if user and user.is_authenticated:
            pref = UserLocalePreference.objects.filter(user=user).select_related('language').first()
            if pref and pref.language and not pref.auto_detect_language:
                return pref.language
        
        # Detect from request
        if request:
            return LanguageService.detect_language(request)
        
        return LanguageService.get_default_language()


class TimezoneService:
    """Service for timezone operations."""
    
    CACHE_TIMEOUT = 3600
    
    @staticmethod
    def get_all_timezones():
        """Get all active timezones."""
        cache_key = 'all_timezones'
        timezones = cache.get(cache_key)
        
        if timezones is None:
            timezones = list(Timezone.objects.filter(is_active=True))
            cache.set(cache_key, timezones, TimezoneService.CACHE_TIMEOUT)
        
        return timezones
    
    @staticmethod
    def get_common_timezones():
        """Get common timezones."""
        cache_key = 'common_timezones'
        timezones = cache.get(cache_key)
        
        if timezones is None:
            timezones = list(Timezone.objects.filter(is_active=True, is_common=True))
            cache.set(cache_key, timezones, TimezoneService.CACHE_TIMEOUT)
        
        return timezones
    
    @staticmethod
    def get_timezone_by_name(name):
        """Get timezone by IANA name."""
        return Timezone.objects.filter(name=name, is_active=True).first()
    
    @staticmethod
    def detect_timezone(request):
        """Detect timezone from request."""
        # Check session
        if hasattr(request, 'session'):
            tz_name = request.session.get('timezone')
            if tz_name:
                tz = TimezoneService.get_timezone_by_name(tz_name)
                if tz:
                    return tz
        
        # Try to get from JS cookie set by client
        if hasattr(request, 'COOKIES'):
            tz_name = request.COOKIES.get('timezone')
            if tz_name:
                tz = TimezoneService.get_timezone_by_name(tz_name)
                if tz:
                    return tz
        
        return None
    
    @staticmethod
    def get_user_timezone(user=None, request=None):
        """Get timezone for user or request."""
        # Check user preference
        if user and user.is_authenticated:
            pref = UserLocalePreference.objects.filter(user=user).select_related('timezone').first()
            if pref and pref.timezone and not pref.auto_detect_timezone:
                return pref.timezone
        
        # Detect from request
        if request:
            return TimezoneService.detect_timezone(request)
        
        # Return default
        settings = LocalizationSettings.get_settings()
        return settings.default_timezone


class CountryService:
    """Service for country operations."""
    
    CACHE_TIMEOUT = 3600
    
    @staticmethod
    def get_all_countries():
        """Get all active countries."""
        cache_key = 'all_countries'
        countries = cache.get(cache_key)
        
        if countries is None:
            countries = list(Country.objects.filter(is_active=True))
            cache.set(cache_key, countries, CountryService.CACHE_TIMEOUT)
        
        return countries
    
    @staticmethod
    def get_shipping_countries():
        """Get countries where shipping is available."""
        cache_key = 'shipping_countries'
        countries = cache.get(cache_key)
        
        if countries is None:
            countries = list(Country.objects.filter(is_active=True, is_shipping_available=True))
            cache.set(cache_key, countries, CountryService.CACHE_TIMEOUT)
        
        return countries
    
    @staticmethod
    def get_country_by_code(code):
        """Get country by code."""
        return Country.objects.filter(code=code.upper(), is_active=True).first()


class LocalePreferenceService:
    """Service for user locale preferences."""
    
    @staticmethod
    def get_or_create_preference(user):
        """Get or create locale preference for user."""
        pref, _ = UserLocalePreference.objects.get_or_create(user=user)
        return pref
    
    @staticmethod
    def update_preference(user, **kwargs):
        """Update user's locale preference."""
        pref = LocalePreferenceService.get_or_create_preference(user)
        
        if 'language_code' in kwargs:
            pref.language = LanguageService.get_language_by_code(kwargs['language_code'])
        
        if 'timezone_name' in kwargs:
            pref.timezone = TimezoneService.get_timezone_by_name(kwargs['timezone_name'])
        
        if 'country_code' in kwargs:
            pref.country = CountryService.get_country_by_code(kwargs['country_code'])
        
        if 'date_format' in kwargs:
            pref.date_format = kwargs['date_format']
        
        if 'time_format' in kwargs:
            pref.time_format = kwargs['time_format']
        
        if 'measurement_system' in kwargs:
            pref.measurement_system = kwargs['measurement_system']
        
        if 'auto_detect_language' in kwargs:
            pref.auto_detect_language = kwargs['auto_detect_language']
        
        if 'auto_detect_timezone' in kwargs:
            pref.auto_detect_timezone = kwargs['auto_detect_timezone']
        
        pref.save()
        return pref


class TranslationService:
    """Service for translation operations."""
    
    @staticmethod
    def get_translation(content_type, content_id, field_name, language_code):
        """Get a translation."""
        cache_key = f'translation_{content_type}_{content_id}_{field_name}_{language_code}'
        translation = cache.get(cache_key)
        
        if translation is None:
            translation = Translation.objects.filter(
                content_type=content_type,
                content_id=content_id,
                field_name=field_name,
                language__code=language_code,
                is_approved=True
            ).first()
            
            if translation:
                cache.set(cache_key, translation.translated_text, 3600)
                return translation.translated_text
            return None
        
        return translation
    
    @staticmethod
    def set_translation(content_type, content_id, field_name, language_code, text, user=None, is_machine=False):
        """Set a translation."""
        language = LanguageService.get_language_by_code(language_code)
        if not language:
            return None
        
        translation, created = Translation.objects.update_or_create(
            content_type=content_type,
            content_id=content_id,
            field_name=field_name,
            language=language,
            defaults={
                'translated_text': text,
                'translated_by': user,
                'is_machine_translated': is_machine,
                'is_approved': not is_machine,  # Auto-approve human translations
            }
        )
        
        # Clear cache
        cache_key = f'translation_{content_type}_{content_id}_{field_name}_{language_code}'
        cache.delete(cache_key)
        
        return translation
    
    @staticmethod
    def translate_text(text, from_lang, to_lang):
        """Translate text using configured API (placeholder)."""
        settings = LocalizationSettings.get_settings()
        
        if not settings.enable_machine_translation:
            return None
        
        provider = settings.translation_api_provider
        api_key = settings.translation_api_key
        
        if not provider or not api_key:
            return None
        
        # Placeholder for actual API integration
        # In production, implement actual API calls to Google, DeepL, etc.
        
        return None
