# orders/admin_extras.py
from django.http import HttpResponse
import csv

def export_orders_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="orders_export.csv"'
    writer = csv.writer(response)
    # Add your CSV export logic here, e.g.:
    writer.writerow(['Order Number', 'User', 'Status', 'Total'])
    for order in queryset:
        writer.writerow([order.order_number, order.user.email if order.user else '', order.status, float(order.grand_total)])
    return response

def sync_with_erp(modeladmin, request, queryset):
    """Placeholder for ERP integration"""
    modeladmin.message_user(request, f"{queryset.count()} orders queued for ERP sync")
