# cart/admin.py
from django.contrib import admin
from django.db.models import Sum, Count, DecimalField, F
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Cart, CartItem
from .services import mark_cart_checked_out, clear_cart_items
from decimal import Decimal

class CartItemInline(admin.TabularInline):
    """
    Inline for displaying and managing CartItem objects within the Cart admin.
    """
    model           = CartItem
    extra           = 0
    readonly_fields = ['added_at','updated_at','price','total_price']
    fields          = ['product','color','size','fabric','quantity','saved_for_later','price','total_price','added_at']

    def price(self,obj):
        return obj.price
    price.short_description = _('Price')

    def total_price(self,obj):
        return obj.total_price
    total_price.short_description = _('Total Price')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Cart model.
    Includes custom list display, filters, inlines, and actions.
    """
    list_display    = [
        'id', 'user_display', 'session_key_display', 'total_items_display',
        'subtotal_display', 'discount_amount_display', 'shipping_cost_display',
        'tax_amount_display', 'final_total_display', 'checked_out', 'abandoned',
        'created_at', 'updated_at',
    ]
    list_filter     = ['checked_out', 'abandoned', 'converted', 'created_at', 'updated_at']
    search_fields   = ['user__email', 'session_key']
    inlines         = [CartItemInline]
    actions         = ['mark_checked_out', 'clear_selected_carts_items']
    readonly_fields = ['created_at', 'updated_at', 'abandoned_at', 'converted_at']

    def user_display(self, obj):
        """Displays the user's email or 'Anonymous'."""
        return obj.user.email if obj.user else _("Anonymous")
    user_display.short_description = _("User")

    def session_key_display(self, obj):
        """Displays the session key, truncated for readability."""
        return obj.session_key[:10] + '...' if obj.session_key and len(obj.session_key) > 10 else obj.session_key
    session_key_display.short_description = _("Session Key")

    def total_items_display(self, obj):
        """Displays the total number of active items in the cart."""
        return obj.total_items
    total_items_display.short_description = _("Items")
    total_items_display.admin_order_field = 'total_items' # Allow sorting

    def subtotal_display(self, obj):
        """Displays the subtotal of the cart."""
        return f"৳{obj.total_price:.2f}" # Use obj.total_price property
    subtotal_display.short_description = _("Subtotal")
    subtotal_display.admin_order_field = 'total_price' # If total_price is an annotated field, otherwise remove

    def discount_amount_display(self, obj):
        """Displays the discount amount."""
        return f"৳{obj.get_discount_amount():.2f}"
    discount_amount_display.short_description = _("Discount")

    def shipping_cost_display(self, obj):
        """Displays the shipping cost."""
        return f"৳{obj.get_shipping_cost():.2f}"
    shipping_cost_display.short_description = _("Shipping")

    def tax_amount_display(self, obj):
        """Displays the tax amount."""
        return f"৳{obj.get_tax_amount():.2f}"
    tax_amount_display.short_description = _("Tax")

    def final_total_display(self, obj):
        """Displays the final total of the cart."""
        return f"৳{obj.final_total:.2f}"
    final_total_display.short_description = _("Final Total")
    final_total_display.admin_order_field = 'final_total' # If final_total is an annotated field, otherwise remove

    @admin.action(description=_("Mark selected carts as checked out"))
    def mark_checked_out(self, request, queryset):
        """Admin action to mark selected carts as checked out."""
        checked_out_count = 0
        for cart in queryset:
            if not cart.checked_out:
                mark_cart_checked_out(cart)
                checked_out_count += 1
        self.message_user(request, _(f"Successfully marked {checked_out_count} carts as checked out."))

    @admin.action(description=_("Clear all items from selected carts"))
    def clear_selected_carts_items(self, request, queryset):
        """Admin action to clear all active items from selected carts."""
        cleared_count = 0
        for cart in queryset:
            # Ensure the cart is not already checked out before clearing
            if not cart.checked_out:
                clear_cart_items(cart)
                cleared_count += 1
        self.message_user(request, _(f"Successfully cleared items from {cleared_count} carts."))

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for the CartItem model.
    """
    list_display    = ['product', 'color', 'size', 'fabric', 'cart_link', 'quantity', 'price', 'total_price', 'saved_for_later', 'added_at']
    list_filter     = ['saved_for_later', 'added_at', 'cart__checked_out']
    search_fields   = ['product__name', 'cart__user__email', 'cart__session_key']
    readonly_fields = ['added_at', 'updated_at']

    def cart_link(self, obj):
        """Creates a link to the associated cart in the admin."""
        from django.urls import reverse
        link = reverse("admin:cart_cart_change", args=[obj.cart.pk])
        return format_html('<a href=\"{}\">{}</a>', link, obj.cart.id)
    cart_link.short_description = _("Cart")

