# custom_order/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import (
    Category, SubCategory, FabricType, SizeOption, ColorOption,
    CustomOrder, DesignImage, CustomerItemImage, OrderStatusUpdate
)
from .services import finalize_pricing # Ensure this service is still relevant for admin actions
from django.db.models import Sum, Count, Q
from django.urls import reverse
from django.utils import timezone # Import timezone for confirmed_at

class OrderStatusUpdateInline(admin.TabularInline):
    """
    Inline admin for OrderStatusUpdate related to CustomOrder.
    Allows viewing and adding status updates directly from the CustomOrder admin page.
    """
    model = OrderStatusUpdate
    extra = 0
    # 'updated_by' is set automatically in the save_model/save_formset of CustomOrderAdmin
    readonly_fields = ('created_at', 'updated_by')
    fields = ('old_status', 'new_status', 'notes') # Removed 'updated_by' from fields as it's readonly and set automatically

    def get_queryset(self, request):
        """
        Orders status updates by creation date in descending order.
        """
        return super().get_queryset(request).order_by('-created_at')

class DesignImageInline(admin.TabularInline):
    """
    Inline admin for DesignImage related to CustomOrder.
    Allows uploading and managing design images directly from the CustomOrder admin page.
    """
    model = DesignImage
    extra = 0
    readonly_fields = ('preview', 'created_at')
    fields = ('preview', 'image', 'description', 'is_primary', 'created_at')

    def preview(self, obj):
        """
        Displays a thumbnail preview of the image in the admin.
        """
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:100px; max-width:100px; object-fit:contain;"/>',
                obj.image.url
            )
        return "-"
    preview.short_description = _("Preview")

class CustomerItemImageInline(admin.TabularInline):
    """
    Inline admin for CustomerItemImage related to CustomOrder.
    Allows uploading and managing customer item images directly from the CustomOrder admin page.
    """
    model = CustomerItemImage
    extra = 0
    readonly_fields = ('preview', 'created_at')
    fields = ('preview', 'image', 'description', 'created_at')

    def preview(self, obj):
        """
        Displays a thumbnail preview of the image in the admin.
        """
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:100px; max-width:100px; object-fit:contain;"/>',
                obj.image.url
            )
        return "-"
    preview.short_description = _("Preview")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Category model.
    """
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_editable = ('is_active',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    list_filter = ('is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the SubCategory model.
    """
    list_display = ('name', 'category', 'base_price_multiplier', 'is_active')
    list_editable = ('base_price_multiplier', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'category__name')
    raw_id_fields = ('category',)

@admin.register(FabricType)
class FabricTypeAdmin(admin.ModelAdmin):
    """
    Admin configuration for the FabricType model.
    """
    list_display = ('name', 'base_price', 'is_active')
    list_editable = ('base_price', 'is_active')
    search_fields = ('name',)
    list_filter = ('is_active', 'created_at')

@admin.register(SizeOption)
class SizeOptionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the SizeOption model.
    """
    list_display = ('name', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('name',)
    list_filter = ('is_active',)
    filter_horizontal = ('subcategories',) # Use filter_horizontal for ManyToMany

@admin.register(ColorOption)
class ColorOptionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ColorOption model.
    """
    list_display = ('name', 'hex_code', 'color_preview', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('name', 'hex_code')

    def color_preview(self, obj):
        """
        Displays a color swatch based on the hex code.
        """
        return format_html(
            '<div style="width:20px; height:20px; background-color:{}; border:1px solid #ddd;"></div>',
            obj.hex_code
        )
    color_preview.short_description = _("Color")

@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    """
    Admin configuration for the CustomOrder model.
    Provides comprehensive management for custom orders including inline images and status updates.
    """
    list_display = (
        'order_id', 'customer_name', 'order_type', 'status',
        'total_amount', 'is_draft', 'created_at', 'view_order_link'
    )
    list_filter = (
        'order_type', 'status', 'is_draft', 'created_at',
        'category', 'subcategory'
    )
    search_fields = (
        'order_id', 'customer_name', 'user__email', 'phone'
    )
    readonly_fields = (
        'order_id', 'created_at', 'updated_at', 'confirmed_at',
        'completed_at', 'base_price', 'shipping_cost', 'vat_amount',
        'discount_amount', 'total_amount', 'view_order_link'
    )
    date_hierarchy = 'created_at'
    inlines = [OrderStatusUpdateInline, DesignImageInline, CustomerItemImageInline]
    actions = ['calculate_pricing', 'mark_as_confirmed']
    list_per_page = 50

    fieldsets = (
        (_("Order Info"), {
            'fields': (
                'order_id', 'user', 'order_type', 'status', 'is_draft'
            )
        }),
        (_("Customer Details"), {
            'fields': (
                'customer_name', 'phone', 'email', 'contact_method'
            )
        }),
        (_("Design / Product"), {
            'fields': (
                ('category', 'subcategory'),
                'fabric_type', 'size_option', 'color_option', 'quantity',
                'design_description', 'customer_item_description',
                'customer_item_condition'
            )
        }),
        (_("Pricing"), {
            'fields': (
                'base_price', 'shipping_cost', 'vat_amount',
                'discount_amount', 'total_amount', 'coupon'
            )
        }),
        (_("Shipping & Payment"), {
            'fields': (
                'shipping_address', 'shipping_method',
                'payment_method'
            )
        }),
        (_("Additional Info"), {
            'classes': ('collapse',),
            'fields': (
                'size_info', 'expected_date', 'additional_info'
            )
        }),
        (_("Timestamps"), {
            'classes': ('collapse',),
            'fields': (
                'created_at', 'updated_at', 'confirmed_at', 'completed_at'
            )
        }),
        (_("Links"), {
            'classes': ('collapse',),
            'fields': ('view_order_link',)
        }),
    )

    def view_order_link(self, obj):
        """
        Generates a link to the detailed view of the custom order.
        """
        if obj.order_id:
            url = reverse('custom_order:detail', kwargs={'order_id': obj.order_id})
            return format_html('<a href="{}">{}</a>', url, _("View Order"))
        return "-"
    view_order_link.short_description = _("Order Link")

    def calculate_pricing(self, request, queryset):
        """
        Admin action to recalculate pricing for selected orders.
        """
        for order in queryset:
            try:
                finalize_pricing(order)
            except Exception as e:
                self.message_user(
                    request,
                    _("Error calculating pricing for order %(order_id)s: %(error)s") % {
                        'order_id': order.order_id,
                        'error': str(e)
                    },
                    level='error'
                )
        self.message_user(
            request,
            _("Successfully calculated pricing for %(count)d orders.") % {'count': queryset.count()}
        )
    calculate_pricing.short_description = _("Recalculate pricing")

    def mark_as_confirmed(self, request, queryset):
        """
        Admin action to mark selected pending orders as confirmed.
        """
        updated = queryset.filter(status=CustomOrder.Status.PENDING).update(
            status=CustomOrder.Status.CONFIRMED,
            confirmed_at=timezone.now()
        )
        self.message_user(
            request,
            _("Successfully confirmed %(count)d orders.") % {'count': updated}
        )
    mark_as_confirmed.short_description = _("Mark selected as confirmed")

    def get_queryset(self, request):
        """
        Optimizes queryset by prefetching related objects.
        """
        qs = super().get_queryset(request)
        return qs.select_related(
            'user', 'category', 'subcategory', 'fabric_type',
            'size_option', 'color_option', 'shipping_address',
            'shipping_method',
            'payment_method', 'coupon'
        )

    def changelist_view(self, request, extra_context=None):
        """
        Adds custom dashboard statistics to the changelist view.
        """
        extra_context = extra_context or {}
        stats = CustomOrder.objects.aggregate(
            total_orders=Count('id'),
            total_revenue=Sum('total_amount'),
            pending_orders=Count('id', filter=Q(status=CustomOrder.Status.PENDING)),
            completed_orders=Count('id', filter=Q(status__in=[
                CustomOrder.Status.READY_FOR_SHIPMENT,
                CustomOrder.Status.SHIPPED,
                CustomOrder.Status.DELIVERED
            ]))
        )
        extra_context['stats'] = stats
        return super().changelist_view(request, extra_context=extra_context)

    def save_formset(self, request, form, formset, change):
        """
        Overrides save_formset to set 'updated_by' for OrderStatusUpdateInline.
        """
        if isinstance(formset.model, OrderStatusUpdate):
            for form_instance in formset.forms:
                if form_instance.instance.pk is None: # New instance
                    form_instance.instance.updated_by = request.user
        super().save_formset(request, form, formset, change)
