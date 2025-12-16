"""
Notifications API URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import NotificationViewSet, NotificationPreferenceViewSet, PushTokenViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('notifications/preferences/', NotificationPreferenceViewSet.as_view({
        'get': 'list',
        'put': 'update',
        'patch': 'update'
    }), name='notification-preferences'),
    path('notifications/push-tokens/', PushTokenViewSet.as_view({
        'post': 'create'
    }), name='push-token-create'),
    path('notifications/push-tokens/<str:pk>/', PushTokenViewSet.as_view({
        'delete': 'destroy'
    }), name='push-token-delete'),
]
