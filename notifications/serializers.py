# notifications/serializers.py
from rest_framework import serializers
from .models import (
    Notification, NotificationTemplate, NotificationPreference
)

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id','notif_type','channel','title','message','link',
            'payload','priority','is_read','created_at','delivered_at','read_at'
        ]

class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = ['id','name','notif_type','channel','subject','body_html','body_plain']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id','notif_type','channel','enabled']
