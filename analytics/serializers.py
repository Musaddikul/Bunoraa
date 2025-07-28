# analytics/serializers.py
from rest_framework import serializers
from .models import DailyMetrics

class DailyMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMetrics
        fields = ['date','total_orders','total_revenue','avg_order_value','new_users','returning_users']
