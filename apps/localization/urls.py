"""
Localization URL Configuration
"""
from django.urls import path, include

app_name = 'localization'

urlpatterns = [
    path('api/', include('apps.localization.api.urls')),
]
