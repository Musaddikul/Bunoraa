# apps/notifications/urls.py
"""
Notification URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, NotificationPreferenceView

app_name = 'notifications'

router = DefaultRouter()
router.register('', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('preferences/', NotificationPreferenceView.as_view(), name='preferences'),
]
