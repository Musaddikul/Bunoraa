"""
Account API serializers
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from ..models import Address

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer for profile data."""
    
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'date_of_birth', 'is_verified',
            'newsletter_subscribed', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        from ..services import UserService
        return UserService.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'avatar', 'date_of_birth', 'newsletter_subscribed']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    current_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Passwords do not match.'
            })
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField(required=True)


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset."""
    
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Passwords do not match.'
            })
        return attrs


class AddressSerializer(serializers.ModelSerializer):
    """Address serializer."""
    
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'full_name', 'phone',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'is_default', 'full_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AddressCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating addresses."""
    
    class Meta:
        model = Address
        fields = [
            'address_type', 'full_name', 'phone',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'is_default'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Address.objects.create(**validated_data)
