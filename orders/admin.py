# orders/admin.py
from django.contrib import admin
from django.http import HttpResponse
import csv
from .models import Order, OrderItem
from .admin_extras import export_orders_csv, sync_with_erp  # Assuming these exist in your provided files.

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'price', 'quantity', 'discount', 'final_price', 'subtotal']
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment', 'created_at', 'grand_total']
    list_filter = ['status', 'payment__method',]
    search_fields = ['order_number', 'user__email']
    inlines = [OrderItemInline]
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'tracking_number']
    
    actions = ['export_orders_csv', 'sync_with_erp', 'mark_as_shipped', 'mark_as_cancelled']

    def mark_as_shipped(self, request, queryset):
        """Custom action to mark orders as shipped."""
        queryset.update(status__name="Shipped")
        self.message_user(request, f"{queryset.count()} orders marked as shipped.")

    def mark_as_cancelled(self, request, queryset):
        """Custom action to cancel orders."""
        queryset.update(status__name="Cancelled")
        self.message_user(request, f"{queryset.count()} orders cancelled.")

    def export_orders_csv(self, request, queryset):
        return export_orders_csv(self, request, queryset)

    def sync_with_erp(self, request, queryset):
        return sync_with_erp(self, request, queryset)
