# shipping/admin.py
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import truncatechars
from .models import Region, ShippingZone, ShippingCarrier, ShippingMethod, Shipment, ShipmentStatusUpdate, ShipmentEvent
from .services import request_carrier_pickup, generate_shipping_label # Import new service functions

class ShipmentStatusUpdateInline(admin.TabularInline):
    """
    Inline for displaying and adding ShipmentStatusUpdate objects within the Shipment admin.
    """
    model = ShipmentStatusUpdate
    extra = 0
    readonly_fields = ('created_at', 'updated_by')
    fields = ('old_status', 'new_status', 'notes', 'created_at', 'updated_by')

class ShipmentEventInline(admin.TabularInline):
    """
    Inline for displaying ShipmentEvent objects within the Shipment admin.
    """
    model = ShipmentEvent
    extra = 0
    readonly_fields = ('event_type', 'description_short', 'location', 'event_timestamp', 'carrier_raw_data')
    fields = ('event_type', 'description_short', 'location', 'event_timestamp')

    def description_short(self, obj):
        """Truncates description for display."""
        return truncatechars(obj.description, 50)
    description_short.short_description = _("Description")

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Region model.
    """
    list_display = ('name', 'description')
    search_fields = ('name',)
    list_filter = ('name',)

@admin.register(ShippingZone)
class ShippingZoneAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ShippingZone model.
    """
    list_display = ('name', 'base_cost', 'free_shipping_threshold', 'volumetric_divisor', 'is_active', 'display_regions')
    filter_horizontal = ('regions',)
    search_fields = ('name', 'regions__name', 'postal_codes')
    list_filter = ('is_active',)
    fieldsets = (
        (None, {
            'fields': ('name', 'regions', 'is_active', 'postal_codes')
        }),
        (_('Pricing & Calculations'), {
            'fields': ('base_cost', 'free_shipping_threshold', 'volumetric_divisor')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    def display_regions(self, obj):
        """Displays associated regions."""
        return ", ".join([region.name for region in obj.regions.all()])
    display_regions.short_description = _("Regions")

@admin.register(ShippingCarrier)
class ShippingCarrierAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ShippingCarrier model.
    """
    list_display = ('name', 'code', 'api_base_url', 'tracking_url', 'is_active')
    search_fields = ('name', 'code')
    list_filter = ('is_active', 'auth_type')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'is_active')
        }),
        (_('API Integration Details'), {
            'fields': ('api_base_url', 'auth_type', 'api_key', 'credentials_json', 'tracking_url', 'webhook_secret', 'return_api_url')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ShippingMethod model.
    """
    list_display = ('name', 'carrier', 'display_zones', 'base_charge', 'price_per_kg', 'estimated_delivery_days', 'is_express', 'is_active')
    list_filter = ('carrier', 'zones', 'is_express', 'is_active')
    search_fields = ('name', 'carrier__name', 'zones__name', 'service_code')
    filter_horizontal = ('zones',)
    fieldsets = (
        (None, {
            'fields': ('name', 'carrier', 'zones', 'is_active', 'service_code')
        }),
        (_('Pricing'), {
            'fields': ('base_charge', 'price_per_kg', 'is_express')
        }),
        (_('Delivery Information'), {
            'fields': ('estimated_delivery_days', 'guaranteed_delivery_days')
        }),
        (_('Weight & Dimensions Limits'), {
            'fields': ('min_weight_kg', 'max_weight_kg', 'min_dims_cm', 'max_dims_cm'),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    def display_zones(self, obj):
        """Displays associated zones."""
        return ", ".join([zone.name for zone in obj.zones.all()])
    display_zones.short_description = _("Zones")

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Shipment model.
    Includes inlines for status updates and events, and custom actions.
    """
    list_display = ('id', 'order_link', 'shipping_method', 'tracking_number', 'status', 'cost', 'created_at', 'updated_at')
    list_filter = ('status', 'shipping_method__carrier', 'shipping_method__zones', 'created_at')
    search_fields = ('order__order_id', 'tracking_number', 'shipping_method__name', 'notes')
    raw_id_fields = ('order', 'shipping_method')
    readonly_fields = ('created_at', 'updated_at', 'tracking_url_generated', 'carrier_response_data', 'delivery_proof_url', 'delivery_signature_url')
    inlines = [ShipmentStatusUpdateInline, ShipmentEventInline]
    actions = ['request_pickup_action', 'generate_label_action']

    fieldsets = (
        (None, {
            'fields': ('order', 'shipping_method', 'tracking_number', 'tracking_url_generated', 'status', 'notes')
        }),
        (_('Cost & Dimensions'), {
            'fields': ('cost', 'weight_kg', 'dims_cm')
        }),
        (_('Proof of Delivery'), {
            'fields': ('delivery_proof_url', 'delivery_signature_url'),
            'classes': ('collapse',)
        }),
        (_('Carrier Integration Data'), {
            'fields': ('carrier_response_data',),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def order_link(self, obj):
        """Creates a link to the associated order in the admin."""
        from django.urls import reverse
        from django.utils.html import format_html
        link = reverse("admin:custom_order_customorder_change", args=[obj.order.pk])
        return format_html('<a href="{}">{}</a>', link, obj.order.order_id)
    order_link.short_description = _("Order")

    @admin.action(description=_("Request pickup for selected shipments"))
    def request_pickup_action(self, request, queryset):
        """Admin action to request pickup for selected shipments."""
        successful_count = 0
        failed_count = 0
        for shipment in queryset:
            try:
                # Call the service function to request pickup
                request_carrier_pickup(shipment)
                self.message_user(request, _(f"Pickup requested for shipment {shipment.id}."))
                successful_count += 1
            except Exception as e:
                self.message_user(request, _(f"Failed to request pickup for shipment {shipment.id}: {e}"), level='error')
                failed_count += 1
        if successful_count > 0:
            self.message_user(request, _(f"Successfully requested pickup for {successful_count} shipments."))
        if failed_count > 0:
            self.message_user(request, _(f"Failed to request pickup for {failed_count} shipments."), level='error')

    @admin.action(description=_("Generate shipping label for selected shipments"))
    def generate_label_action(self, request, queryset):
        """Admin action to generate shipping labels for selected shipments."""
        successful_count = 0
        failed_count = 0
        for shipment in queryset:
            try:
                # Call the service function to generate label
                label_url = generate_shipping_label(shipment)
                if label_url:
                    self.message_user(request, _(f"Label generated for shipment {shipment.id}: {label_url}"))
                    successful_count += 1
                else:
                    raise Exception("Label generation failed, no URL returned.")
            except Exception as e:
                self.message_user(request, _(f"Failed to generate label for shipment {shipment.id}: {e}"), level='error')
                failed_count += 1
        if successful_count > 0:
            self.message_user(request, _(f"Successfully generated labels for {successful_count} shipments."))
        if failed_count > 0:
            self.message_user(request, _(f"Failed to generate labels for {failed_count} shipments."), level='error')
