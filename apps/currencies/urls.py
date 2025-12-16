"""
Currency URL Configuration
"""
from django.urls import path, include

app_name = 'currencies'

urlpatterns = [
    path('api/v1/', include('apps.currencies.api.urls')),
]
