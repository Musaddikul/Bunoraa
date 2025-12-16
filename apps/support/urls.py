"""
Support URL Configuration
"""
from django.urls import path, include

app_name = 'support'

urlpatterns = [
    path('api/v1/support/', include('apps.support.api.urls')),
]
