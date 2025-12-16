"""
Localization API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    LanguageViewSet, TimezoneViewSet, CountryViewSet,
    LocalePreferenceView, SetLanguageView, SetTimezoneView,
    SetCountryView, DetectLocaleView, TranslationView,
    TranslateTextView, LocalizationSettingsView
)


router = DefaultRouter()
router.register(r'languages', LanguageViewSet, basename='language')
router.register(r'timezones', TimezoneViewSet, basename='timezone')
router.register(r'countries', CountryViewSet, basename='country')

urlpatterns = [
    path('', include(router.urls)),
    path('preferences/', LocalePreferenceView.as_view(), name='locale-preferences'),
    path('set-language/', SetLanguageView.as_view(), name='set-language'),
    path('set-timezone/', SetTimezoneView.as_view(), name='set-timezone'),
    path('set-country/', SetCountryView.as_view(), name='set-country'),
    path('detect/', DetectLocaleView.as_view(), name='detect-locale'),
    path('translations/', TranslationView.as_view(), name='translations'),
    path('translate/', TranslateTextView.as_view(), name='translate-text'),
    path('settings/', LocalizationSettingsView.as_view(), name='localization-settings'),
]
