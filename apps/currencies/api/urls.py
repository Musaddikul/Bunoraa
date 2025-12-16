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
router.register(r'currencies', CurrencyViewSet, basename='currency')
router.register(r'exchange-rates', ExchangeRateViewSet, basename='exchange-rate')

urlpatterns = [
    path('', include(router.urls)),
    path('currencies/convert/', ConvertCurrencyView.as_view(), name='currency-convert'),
    path('currencies/format/', FormatCurrencyView.as_view(), name='currency-format'),
    path('currencies/preference/', SetCurrencyPreferenceView.as_view(), name='currency-preference'),
    path('currencies/settings/', CurrencySettingsView.as_view(), name='currency-settings'),
]
