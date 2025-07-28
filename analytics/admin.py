# analytics/admin.py
from django.contrib import admin
from django.utils import timezone
from .models import PageView, ProductView, OrderEvent, DailyMetrics

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display   = ('timestamp','path','user','status_code','ip_address')
    list_filter    = ('status_code',)
    search_fields  = ('path','user__username','ip_address')
    date_hierarchy = 'timestamp'

@admin.register(ProductView)
class ProductViewAdmin(admin.ModelAdmin):
    list_display   = ('timestamp','product','user','ip_address')
    list_filter    = ('product',)
    search_fields  = ('product__name','user__username')
    date_hierarchy = 'timestamp'

@admin.register(OrderEvent)
class OrderEventAdmin(admin.ModelAdmin):
    list_display   = ('timestamp','order','status','amount')
    list_filter    = ('status',)
    search_fields  = ('order__id',)
    date_hierarchy = 'timestamp'

@admin.register(DailyMetrics)
class DailyMetricsAdmin(admin.ModelAdmin):
    list_display   = ('date','total_orders','total_revenue','avg_order_value','new_users','returning_users')
    list_filter    = ('date',)
    date_hierarchy = 'date'
    readonly_fields= ('created_at',)
