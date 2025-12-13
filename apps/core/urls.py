# apps/core/urls.py
"""
Core App URLs
"""
from django.urls import path
from .views import (
    LanguageListView, CurrencyListView, SiteSettingsView,
    HealthCheckView
)

app_name = 'core'

urlpatterns = [
    path('languages/', LanguageListView.as_view(), name='languages'),
    path('currencies/', CurrencyListView.as_view(), name='currencies'),
    path('settings/', SiteSettingsView.as_view(), name='settings'),
    path('health/', HealthCheckView.as_view(), name='health'),
]
