#wishlist/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import Wishlist

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Wishlist model.
    Provides an enhanced interface for managing wishlists in the Django admin.
    """
    list_display = [
        'user_link',
        'product_count',
        'wishlist_items_summary',
        'created_at',
        'updated_at'
    ]
    list_select_related = ['user']  # Optimize query for user field
    filter_horizontal = ['products']  # Provides a nice interface for ManyToMany
    search_fields = ['user__email', 'products__name']  # Enable searching by user email and product name
    list_filter = ['created_at', 'updated_at']  # Add filters for date fields
    list_per_page = 25  # Number of items per page in the admin list view

    def get_queryset(self, request):
        """
        Overrides the default queryset to:
        - Only show wishlists that have products.
        - Annotate with the count of products in the wishlist.
        """
        queryset = super().get_queryset(request).prefetch_related('products')
        # Only include wishlists that have at least one product
        queryset = queryset.filter(products__isnull=False).distinct()
        queryset = queryset.annotate(product_count=Count('products'))  # Annotate the product count
        return queryset

    def user_link(self, obj):
        """
        Generates an HTML link to the user's admin change page.
        """
        url = reverse("admin:accounts_user_change", args=[obj.user.id])  # Adjusted for custom user model
        return format_html('<a href="{}">{}</a>', url, obj.user.email)
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user__email'

    def product_count(self, obj):
        """
        Returns the annotated count of products in the wishlist.
        """
        return obj.product_count  # Access the annotated count
    product_count.short_description = 'Product Count'
    product_count.admin_order_field = 'product_count'  # Allows sorting by the annotated product count

    def wishlist_items_summary(self, obj):
        """
        Displays a summary of the first few products in the wishlist with links.
        """
        items = obj.products.all()[:5]  # Get first 5 products
        item_links = []
        for product in items:
            # Assuming 'products' app has an admin change view named 'products_product_change'
            url = reverse("admin:products_product_change", args=[product.id])
            item_links.append(f'<a href="{url}">{product.name}</a>')
        
        if obj.products.count() > 5:
            item_links.append('...')  # Indicate more items if present
            
        if not item_links:
            return "No products"

        return format_html("<br>".join(item_links))
    wishlist_items_summary.short_description = 'Wishlist Items (Summary)'

