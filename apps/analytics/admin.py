# apps/analytics/admin.py
"""
Analytics Admin
"""
from django.contrib import admin
from .models import DailyStat, SalesReport, SearchQuery


@admin.register(DailyStat)
class DailyStatAdmin(admin.ModelAdmin):
    list_display = ['date', 'unique_visitors', 'total_page_views', 'orders_placed', 'orders_revenue']
    list_filter = ['date']
    date_hierarchy = 'date'


@admin.register(SalesReport)
class SalesReportAdmin(admin.ModelAdmin):
    list_display = ['period', 'start_date', 'end_date', 'total_orders', 'gross_revenue', 'net_revenue']
    list_filter = ['period']
    date_hierarchy = 'end_date'


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ['query', 'user', 'results_count', 'clicked_product', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['query']
    date_hierarchy = 'timestamp'
