# custom_order/admin_dashboard.py
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import CustomOrder

@admin.register(CustomOrder)
class CustomOrderDashboard(admin.ModelAdmin):
    change_list_template = "admin/custom_order/dashboard.html"
    def changelist_view(self, request, extra_context=None):
        qs = CustomOrder.objects.all()
        stats = {
            'total'     : qs.count(),
            'pending'   : qs.filter(status=CustomOrder.Status.PENDING_CONFIRM).count(),
            'confirmed' : qs.filter(status=CustomOrder.Status.CONFIRMED).count(),
            'completed' : qs.filter(status=CustomOrder.Status.COMPLETED).count(),
        }
        extra_context = extra_context or {}
        extra_context['stats'] = stats
        return super().changelist_view(request, extra_context=extra_context)
