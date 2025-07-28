# payments/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import truncatechars
from .models import Payment, PaymentMethod, Refund, PaymentEvent, PaymentStatus
from .services import capture_payment, initiate_refund, verify_payment_status_with_gateway # Import new services

class RefundInline(admin.TabularInline):
    """
    Inline for displaying and adding Refund objects within the Payment admin.
    """
    model = Refund
    extra = 0
    readonly_fields = ('created_at', 'updated_at', 'refund_id', 'gateway_response_data')
    fields = ('amount', 'status', 'reason', 'refund_id', 'created_at')

class PaymentEventInline(admin.TabularInline):
    """
    Inline for displaying PaymentEvent objects within the Payment admin.
    """
    model = PaymentEvent
    extra = 0
    readonly_fields = ('event_type', 'gateway_event_id', 'payload_short', 'created_at', 'processed')
    fields = ('event_type', 'gateway_event_id', 'payload_short', 'created_at', 'processed')

    def payload_short(self, obj):
        """Truncates payload for display."""
        return truncatechars(str(obj.payload), 100)
    payload_short.short_description = _("Payload")

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """
    Admin configuration for the PaymentMethod model.
    """
    list_display = ('name', 'code', 'gateway_code', 'is_online', 'is_active')
    list_filter = ('is_online', 'is_active', 'gateway_code')
    search_fields = ('name', 'code', 'gateway_code')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'is_active', 'is_online', 'icon')
        }),
        (_('Gateway Integration'), {
            'fields': ('gateway_code', 'config_json')
        }),
    )
    readonly_fields = ('created_at', 'updated_at') # Assuming these fields are added to PaymentMethod

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Payment model.
    Includes inlines for refunds and events, and custom actions.
    """
    list_display = (
        'id', 'order_id_link', 'user_link', 'method', 'amount', 'currency',
        'status_badge', 'is_verified', 'capture_status', 'is_test', 'created_at',
    )
    list_filter = (
        'method', 'status', 'is_verified', 'is_test', 'capture_status', 'created_at',
    )
    search_fields = (
        'order_id', 'user__email', 'user__username', 'transaction_id',
        'gateway_reference', 'payment_intent_id',
    )
    readonly_fields = (
        'created_at', 'updated_at', 'completed_at', 'metadata',
        'error_details', 'payment_intent_id', 'transaction_id', 'gateway_reference'
    )
    ordering = ('-created_at',)
    inlines = [RefundInline, PaymentEventInline]
    actions = ['capture_payment_action', 'initiate_refund_action', 'verify_status_action']

    fieldsets = (
        (None, {
            'fields': ('user', 'order_id', 'method', 'amount', 'currency', 'status')
        }),
        (_('Gateway Info'), {
            'fields': ('payment_intent_id', 'transaction_id', 'gateway_reference', 'metadata', 'error_details')
        }),
        (_('Flags & Status'), {
            'fields': ('is_verified', 'is_test', 'capture_status')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )

    def status_badge(self, obj):
        """Displays payment status with a colored badge."""
        color_map = {
            PaymentStatus.COMPLETED: 'green',
            PaymentStatus.CAPTURED: 'green',
            PaymentStatus.PENDING: 'orange',
            PaymentStatus.PROCESSING: 'blue',
            PaymentStatus.AUTHORIZED: 'purple',
            PaymentStatus.FAILED: 'red',
            PaymentStatus.REFUNDED: 'gray',
            PaymentStatus.PARTIALLY_REFUNDED: 'darkgray',
            PaymentStatus.CANCELLED: 'black',
            PaymentStatus.REQUIRES_ACTION: 'darkorange',
            PaymentStatus.DISPUTED: 'darkred',
        }
        color = color_map.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = _('Status')

    def order_id_link(self, obj):
        """Creates a link to the associated order in the admin."""
        from django.urls import reverse
        # Assuming your custom_order app has a 'detail' or 'change' view for orders
        try:
            link = reverse("admin:custom_order_customorder_change", args=[obj.order_id])
            return format_html('<a href="{}">{}</a>', link, obj.order_id)
        except Exception:
            return obj.order_id
    order_id_link.short_description = _("Order ID")

    def user_link(self, obj):
        """Creates a link to the associated user in the admin."""
        from django.urls import reverse
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user_obj = User.objects.get(pk=obj.user.pk)
            link = reverse("admin:accounts_user_change", args=[user_obj.pk]) # Assuming 'accounts' app
            return format_html('<a href="{}">{}</a>', link, user_obj.username or user_obj.email)
        except User.DoesNotExist:
            return obj.user.username or obj.user.email
        except Exception:
            return str(obj.user)
    user_link.short_description = _("User")

    @admin.action(description=_("Capture selected authorized payments"))
    def capture_payment_action(self, request, queryset):
        """Admin action to capture authorized payments."""
        successful_count = 0
        failed_count = 0
        for payment in queryset.filter(status=PaymentStatus.AUTHORIZED, capture_status=False):
            try:
                capture_payment(payment, request.user)
                self.message_user(request, _(f"Payment {payment.id} captured successfully."))
                successful_count += 1
            except Exception as e:
                self.message_user(request, _(f"Failed to capture payment {payment.id}: {e}"), level='error')
                failed_count += 1
        if successful_count > 0:
            self.message_user(request, _(f"Successfully captured {successful_count} payments."))
        if failed_count > 0:
            self.message_user(request, _(f"Failed to capture {failed_count} payments."), level='error')

    @admin.action(description=_("Initiate full refund for selected payments"))
    def initiate_refund_action(self, request, queryset):
        """Admin action to initiate full refund for selected payments."""
        successful_count = 0
        failed_count = 0
        for payment in queryset.filter(status__in=[PaymentStatus.COMPLETED, PaymentStatus.CAPTURED]):
            try:
                # For full refund, pass payment.amount
                initiate_refund(payment, payment.amount, _("Full refund initiated by admin."), request.user)
                self.message_user(request, _(f"Refund initiated for payment {payment.id}."))
                successful_count += 1
            except Exception as e:
                self.message_user(request, _(f"Failed to initiate refund for payment {payment.id}: {e}"), level='error')
                failed_count += 1
        if successful_count > 0:
            self.message_user(request, _(f"Successfully initiated refunds for {successful_count} payments."))
        if failed_count > 0:
            self.message_user(request, _(f"Failed to initiate refunds for {failed_count} payments."), level='error')

    @admin.action(description=_("Verify status of selected payments with gateway"))
    def verify_status_action(self, request, queryset):
        """Admin action to verify payment status with gateway."""
        successful_count = 0
        failed_count = 0
        for payment in queryset:
            try:
                verify_payment_status_with_gateway(payment)
                self.message_user(request, _(f"Status for payment {payment.id} verified with gateway."))
                successful_count += 1
            except Exception as e:
                self.message_user(request, _(f"Failed to verify status for payment {payment.id}: {e}"), level='error')
                failed_count += 1
        if successful_count > 0:
            self.message_user(request, _(f"Successfully verified status for {successful_count} payments."))
        if failed_count > 0:
            self.message_user(request, _(f"Failed to verify status for {failed_count} payments."), level='error')

@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Refund model.
    """
    list_display = ('id', 'payment_link', 'amount', 'status', 'refund_id', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('payment__order_id', 'refund_id', 'reason')
    readonly_fields = ('created_at', 'updated_at', 'gateway_response_data')
    fieldsets = (
        (None, {
            'fields': ('payment', 'amount', 'status', 'reason')
        }),
        (_('Gateway Details'), {
            'fields': ('refund_id', 'gateway_response_data')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def payment_link(self, obj):
        """Creates a link to the associated payment in the admin."""
        from django.urls import reverse
        from django.utils.html import format_html
        link = reverse("admin:payments_payment_change", args=[obj.payment.pk])
        return format_html('<a href="{}">{}</a>', link, obj.payment.id)
    payment_link.short_description = _("Payment")

@admin.register(PaymentEvent)
class PaymentEventAdmin(admin.ModelAdmin):
    """
    Admin configuration for the PaymentEvent model.
    """
    list_display = ('id', 'payment_link', 'event_type', 'gateway_event_id', 'processed', 'created_at')
    list_filter = ('event_type', 'processed', 'created_at')
    search_fields = ('payment__order_id', 'gateway_event_id', 'event_type')
    readonly_fields = ('created_at', 'payload')
    fieldsets = (
        (None, {
            'fields': ('payment', 'event_type', 'gateway_event_id', 'processed')
        }),
        (_('Payload'), {
            'fields': ('payload',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at',)
        }),
    )

    def payment_link(self, obj):
        """Creates a link to the associated payment in the admin."""
        from django.urls import reverse
        from django.utils.html import format_html
        if obj.payment:
            link = reverse("admin:payments_payment_change", args=[obj.payment.pk])
            return format_html('<a href="{}">{}</a>', link, obj.payment.id)
        return _("N/A")
    payment_link.short_description = _("Payment")
