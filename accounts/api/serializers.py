# accounts/api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import UserAddress # Import UserAddress from accounts.models

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.
    Includes common fields for user profile information.
    """
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'gender',
            'date_of_birth',
            # 'profile_picture' # Uncomment if you want to expose/allow updates via API
        ]
        read_only_fields = ['username', 'email'] # Typically username/email are not changed via profile API

class UserAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserAddress model.
    Ensures 'full_name' is included and adds 'user_email' via a method field.
    """
    # Assuming 'full_name' is a direct field on UserAddress, as per your models.py
    full_name = serializers.CharField(required=True, max_length=100)
    
    # Add a field to explicitly expose the associated user's email
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = UserAddress
        fields = [
            'id',
            'user', # This will show the user's ID
            'full_name',
            'phone_number',
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'upazila',
            'postal_code',
            'country',
            'is_default',
            'created_at',
            'user_email', # The new field for the user's email
        ]
        read_only_fields = ['user', 'created_at'] # User and creation date are set by the system

    def get_user_email(self, obj):
        """
        Returns the email of the associated User object.
        """
        if obj.user:
            return obj.user.email
        return None

    def create(self, validated_data):
        # When creating an address via API, ensure the user is set from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    # Optional: If you want to combine city, state, upazila into a single 'region' field for display
    # This is similar to how you were receiving it earlier.
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['region'] = f"{instance.city}, {instance.state}"
        if instance.upazila:
            representation['region'] = f"{instance.upazila}, {representation['region']}"
        return representation