"""
Currency API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CurrencyViewSet, ExchangeRateViewSet, ConvertCurrencyView,
    FormatCurrencyView, SetCurrencyPreferenceView, CurrencySettingsView
)

router = DefaultRouter()
router.register(r'', CurrencyViewSet, basename='currency')
router.register(r'exchange-rates', ExchangeRateViewSet, basename='exchange-rate')

# Note: place custom endpoints BEFORE router include to avoid router lookup collisions
urlpatterns = [
    path('convert/', ConvertCurrencyView.as_view(), name='currency-convert'),
    path('format/', FormatCurrencyView.as_view(), name='currency-format'),
    path('preference/', SetCurrencyPreferenceView.as_view(), name='currency-preference'),
    path('settings/', CurrencySettingsView.as_view(), name='currency-settings'),
    path('', include(router.urls)),
]
