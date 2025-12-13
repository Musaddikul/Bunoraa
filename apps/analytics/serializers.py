# apps/analytics/serializers.py
"""
Analytics Serializers
"""
from rest_framework import serializers
from .models import DailyStat, SalesReport


class DailyStatSerializer(serializers.ModelSerializer):
    """Daily statistics serializer."""
    
    class Meta:
        model = DailyStat
        fields = '__all__'


class SalesReportSerializer(serializers.ModelSerializer):
    """Sales report serializer."""
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    
    class Meta:
        model = SalesReport
        fields = '__all__'


class DashboardStatsSerializer(serializers.Serializer):
    """Dashboard overview statistics."""
    today_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    today_orders = serializers.IntegerField()
    today_visitors = serializers.IntegerField()
    
    week_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    week_orders = serializers.IntegerField()
    
    month_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    month_orders = serializers.IntegerField()
    
    pending_orders = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    pending_reviews = serializers.IntegerField()


class TopProductSerializer(serializers.Serializer):
    """Top products serializer."""
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    units_sold = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)


class RevenueChartSerializer(serializers.Serializer):
    """Revenue chart data."""
    labels = serializers.ListField(child=serializers.CharField())
    values = serializers.ListField(child=serializers.DecimalField(max_digits=12, decimal_places=2))
