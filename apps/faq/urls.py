"""
FAQ URL Configuration
"""
from django.urls import path, include

app_name = 'faq'

urlpatterns = [
    path('api/v1/', include('apps.faq.api.urls')),
]
