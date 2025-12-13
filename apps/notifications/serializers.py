# apps/notifications/serializers.py
"""
Notification Serializers
"""
from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    """Notification serializer."""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'type_display', 'title', 'message',
            'action_url', 'action_text', 'order',
            'is_read', 'read_at', 'created_at'
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Notification preference serializer."""
    
    class Meta:
        model = NotificationPreference
        fields = [
            'email_orders', 'email_shipping', 'email_promotions',
            'email_reviews', 'email_newsletter',
            'push_orders', 'push_shipping', 'push_promotions',
            'sms_orders', 'sms_shipping'
        ]
