# legal/serializers.py
from rest_framework import serializers
from .models import Policy, Subscriber, PolicyAcceptance

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = [
            'id','policy_type','version','title','content',
            'language','is_active','published_at'
        ]

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['email','confirmed','subscribed_at']

class PolicyAcceptanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyAcceptance
        fields = ['user','policy','version','accepted_at']
