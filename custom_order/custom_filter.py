# custom_order/custom_filter.py
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

class OrderTypeFilter(admin.SimpleListFilter):
    title = _('Order Type')
    parameter_name = 'order_type'

    def lookups(self, request, model_admin):
        return CustomOrder.OrderType.choices

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(order_type=self.value())
        return queryset
