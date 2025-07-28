# promotions/serializers.py
from rest_framework import serializers
from .models import Coupon
from django.utils.translation import gettext_lazy as _

class CouponSerializer(serializers.ModelSerializer):
    """
    Serializer for the Coupon model.
    Includes all relevant fields for API representation, with read-only fields for system-managed data.
    """
    # Add a field to show the count of unique users who have used this coupon
    unique_users_used_count = serializers.SerializerMethodField(
        help_text=_("The number of unique users who have used this coupon.")
    )

    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount_type', 'discount_value',
            'max_discount_amount', 'minimum_order_amount', 'valid_from', 'valid_until',
            'usage_limit', 'usage_limit_per_user', 'used_count', 'unique_users_used_count',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'used_count', 'unique_users_used_count', 'created_at', 'updated_at'
        ]

    def get_unique_users_used_count(self, obj):
        """
        Returns the count of unique users associated with the coupon.
        """
        return obj.users_used.count()

