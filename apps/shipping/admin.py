# apps/shipping/admin.py
"""
Shipping Admin
"""
from django.contrib import admin
from .models import ShippingZone, ShippingMethod, ShippingRate


class ShippingMethodInline(admin.TabularInline):
    model = ShippingMethod
    extra = 0


class ShippingRateInline(admin.TabularInline):
    model = ShippingRate
    extra = 0


@admin.register(ShippingZone)
class ShippingZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_default', 'is_active', 'method_count']
    list_filter = ['is_active', 'is_default']
    search_fields = ['name']
    inlines = [ShippingMethodInline]
    
    def method_count(self, obj):
        return obj.methods.count()
    method_count.short_description = 'Methods'


@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'zone', 'carrier', 'pricing_type', 'base_rate', 'delivery_estimate', 'is_active']
    list_filter = ['pricing_type', 'is_active', 'zone']
    search_fields = ['name', 'carrier']
    inlines = [ShippingRateInline]
