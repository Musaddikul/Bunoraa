# apps/accounts/serializers.py
"""
Account Serializers
API serializers for user authentication and profiles.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserAddress, UserSettings

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone_number']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile display and updates."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    is_vendor = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'gender', 'date_of_birth', 'profile_picture',
            'email_verified', 'phone_verified', 'is_vendor',
            'created_at', 'last_activity'
        ]
        read_only_fields = ['id', 'email', 'email_verified', 'phone_verified', 'created_at', 'last_activity']


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer for user addresses."""
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = UserAddress
        fields = [
            'id', 'address_type', 'full_name', 'phone_number',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'upazila', 'union',
            'is_default', 'label', 'full_address', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserSettingsSerializer(serializers.ModelSerializer):
    """Serializer for user settings."""
    
    class Meta:
        model = UserSettings
        fields = [
            'preferred_currency', 'preferred_language', 'timezone',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'marketing_emails', 'show_profile', 'show_reviews'
        ]


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate_current_password(self, value: str) -> str:
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
    
    def validate(self, attrs: dict) -> dict:
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': 'Passwords do not match.'})
        return attrs
    
    def save(self, **kwargs):  # type: ignore[override]
        user = self.context['request'].user
        data = dict(self.validated_data) if self.validated_data else {}
        user.set_password(data['new_password'])
        user.save()
        return user


class UserMiniSerializer(serializers.ModelSerializer):
    """Minimal user serializer for nested representations."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_picture']


# Alias for backwards compatibility
UserSerializer = UserMiniSerializer
