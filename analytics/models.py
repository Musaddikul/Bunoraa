# analytics/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

class PageView(models.Model):
    """
    Tracks every page request for real-time behavioral analytics.
    """
    user          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    session_key   = models.CharField(max_length=40, null=True, blank=True)
    path          = models.CharField(max_length=255)
    method        = models.CharField(max_length=10)
    status_code   = models.PositiveSmallIntegerField(null=True, blank=True)
    user_agent    = models.CharField(max_length=255, blank=True)
    ip_address    = models.GenericIPAddressField(null=True, blank=True)
    timestamp     = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=['path']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['user']),
        ]

class ProductView(models.Model):
    """
    Tracks product detail views for popularity and conversion.
    """
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    product      = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='analysis_views')
    session_key  = models.CharField(max_length=40, null=True, blank=True)
    ip_address   = models.GenericIPAddressField(null=True, blank=True)
    user_agent   = models.CharField(max_length=255, blank=True)
    timestamp    = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['timestamp']),
        ]

class OrderEvent(models.Model):
    """
    Captures every order creation/update for revenue analytics.
    """
    order       = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='events')
    status      = models.CharField(max_length=50)
    amount      = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    timestamp   = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['timestamp']),
        ]

class DailyMetrics(models.Model):
    """
    Aggregated daily KPIs for fast reporting.
    """
    date             = models.DateField(unique=True)
    total_orders     = models.PositiveIntegerField()
    total_revenue    = models.DecimalField(max_digits=14, decimal_places=2)
    avg_order_value  = models.DecimalField(max_digits=12, decimal_places=2)
    new_users        = models.PositiveIntegerField()
    returning_users  = models.PositiveIntegerField()
    created_at       = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date']
        indexes = [models.Index(fields=['date'])]
