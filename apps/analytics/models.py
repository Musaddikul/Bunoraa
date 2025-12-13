# apps/analytics/models.py
"""
Analytics Models
Site analytics and tracking.
"""
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# TimeStampedModel available when needed


class PageView(models.Model):
    """
    Track page views.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('user')
    )
    session_key = models.CharField(_('session'), max_length=40, blank=True)
    
    path = models.CharField(_('path'), max_length=500, db_index=True)
    full_url = models.URLField(_('full URL'), max_length=1000)
    
    # Request info
    ip_address = models.GenericIPAddressField(_('IP'), null=True, blank=True)
    user_agent = models.TextField(_('user agent'), blank=True)
    referrer = models.URLField(_('referrer'), max_length=1000, blank=True)
    
    # Device info
    device_type = models.CharField(_('device'), max_length=20, blank=True)
    browser = models.CharField(_('browser'), max_length=50, blank=True)
    os = models.CharField(_('OS'), max_length=50, blank=True)
    
    # Timestamp
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True, db_index=True)
    
    class Meta:
        verbose_name = _('page view')
        verbose_name_plural = _('page views')
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['path', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]


class ProductView(models.Model):
    """
    Track product views.
    """
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='views',
        verbose_name=_('product')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('user')
    )
    session_key = models.CharField(_('session'), max_length=40, blank=True)
    ip_address = models.GenericIPAddressField(_('IP'), null=True, blank=True)
    
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True, db_index=True)
    
    class Meta:
        verbose_name = _('product view')
        verbose_name_plural = _('product views')
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['product', 'timestamp']),
        ]


class SearchQuery(models.Model):
    """
    Track search queries.
    """
    query = models.CharField(_('query'), max_length=500, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('user')
    )
    session_key = models.CharField(_('session'), max_length=40, blank=True)
    
    results_count = models.PositiveIntegerField(_('results'), default=0)
    clicked_product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('clicked product')
    )
    
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True, db_index=True)
    
    class Meta:
        verbose_name = _('search query')
        verbose_name_plural = _('search queries')
        ordering = ['-timestamp']


class DailyStat(models.Model):
    """
    Daily aggregated statistics.
    """
    date = models.DateField(_('date'), unique=True, db_index=True)
    
    # Visitors
    total_visitors = models.PositiveIntegerField(_('visitors'), default=0)
    unique_visitors = models.PositiveIntegerField(_('unique visitors'), default=0)
    new_visitors = models.PositiveIntegerField(_('new visitors'), default=0)
    
    # Page views
    total_page_views = models.PositiveIntegerField(_('page views'), default=0)
    
    # Products
    product_views = models.PositiveIntegerField(_('product views'), default=0)
    products_added_to_cart = models.PositiveIntegerField(_('add to cart'), default=0)
    
    # Orders
    orders_placed = models.PositiveIntegerField(_('orders'), default=0)
    orders_revenue = models.DecimalField(_('revenue'), max_digits=12, decimal_places=2, default=Decimal('0'))
    orders_average = models.DecimalField(_('avg order'), max_digits=12, decimal_places=2, default=Decimal('0'))
    
    # Conversion
    cart_conversion_rate = models.DecimalField(_('cart rate'), max_digits=5, decimal_places=2, default=Decimal('0'))
    checkout_conversion_rate = models.DecimalField(_('checkout rate'), max_digits=5, decimal_places=2, default=Decimal('0'))
    
    # Searches
    total_searches = models.PositiveIntegerField(_('searches'), default=0)
    
    class Meta:
        verbose_name = _('daily stat')
        verbose_name_plural = _('daily stats')
        ordering = ['-date']
    
    def __str__(self):
        return str(self.date)


class SalesReport(models.Model):
    """
    Sales report snapshots.
    """
    class Period(models.TextChoices):
        DAILY = 'daily', _('Daily')
        WEEKLY = 'weekly', _('Weekly')
        MONTHLY = 'monthly', _('Monthly')
        YEARLY = 'yearly', _('Yearly')
    
    period = models.CharField(_('period'), max_length=10, choices=Period.choices)
    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'))
    
    # Revenue
    gross_revenue = models.DecimalField(_('gross revenue'), max_digits=14, decimal_places=2, default=Decimal('0'))
    net_revenue = models.DecimalField(_('net revenue'), max_digits=14, decimal_places=2, default=Decimal('0'))
    
    # Orders
    total_orders = models.PositiveIntegerField(_('orders'), default=0)
    average_order_value = models.DecimalField(_('AOV'), max_digits=12, decimal_places=2, default=Decimal('0'))
    
    # Products
    units_sold = models.PositiveIntegerField(_('units sold'), default=0)
    
    # Discounts
    total_discounts = models.DecimalField(_('discounts'), max_digits=12, decimal_places=2, default=Decimal('0'))
    
    # Refunds
    total_refunds = models.DecimalField(_('refunds'), max_digits=12, decimal_places=2, default=Decimal('0'))
    refund_count = models.PositiveIntegerField(_('refund count'), default=0)
    
    # Shipping
    shipping_revenue = models.DecimalField(_('shipping'), max_digits=12, decimal_places=2, default=Decimal('0'))
    
    # Taxes
    tax_collected = models.DecimalField(_('taxes'), max_digits=12, decimal_places=2, default=Decimal('0'))
    
    created_at = models.DateTimeField(_('created'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('sales report')
        verbose_name_plural = _('sales reports')
        ordering = ['-end_date']
        unique_together = [['period', 'start_date', 'end_date']]
    
    def __str__(self):
        return f'{self.get_period_display()}: {self.start_date} - {self.end_date}'
