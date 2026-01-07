from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Badge,
    ShippingMaterial,
    Spotlight,
    Product3DAsset,
    Attribute,
    AttributeValue,
    Facet,
    CategoryFacet,
    Tag,
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "is_primary", "ordering")


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ("sku", "price", "stock_quantity", "is_default")


class Product3DAssetInline(admin.TabularInline):
    model = Product3DAsset
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "display_path", "depth", "product_count", "is_visible", "aspect_ratio")
    search_fields = ("name", "slug")
    list_filter = ("is_visible", "aspect_ratio")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["depth", "name"]
    
    actions = [
        "seed_default_tree",
        "rebuild_paths",
        "make_visible",
        "make_hidden",
        "export_selected_csv",
    ]

    def display_path(self, obj):
        crumbs = obj.breadcrumbs()
        return " / ".join([c.name for c in crumbs])

    display_path.short_description = "Path"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("parent")

    def seed_default_tree(self, request, queryset):
        """Admin action to run the default category seeder (idempotent)."""
        from django.core.management import call_command
        try:
            call_command("seed_categories")
            self.message_user(request, "Default category tree seeded successfully (idempotent).")
        except Exception as e:
            self.message_user(request, f"Error seeding categories: {e}", level="error")
    seed_default_tree.short_description = "Seed default category tree"

    def rebuild_paths(self, request, queryset):
        """Admin action to rebuild path and depth for selected categories."""
        if queryset.count() == 0:
            # Rebuild entire tree
            fixed = Category.rebuild_all_paths() if hasattr(Category, "rebuild_all_paths") else 0
            self.message_user(request, f"Rebuilt paths for entire tree, fixed {fixed} nodes.")
            return

        fixed = 0
        for cat in queryset:
            if hasattr(cat, "rebuild_subtree"):
                fixed += 1 if cat.rebuild_subtree() else 0
            else:
                # Fallback: manually update depth and path
                cat.depth = cat.calculate_depth() if hasattr(cat, "calculate_depth") else 0
                cat.save(update_fields=["depth"])
                fixed += 1

        self.message_user(request, f"Rebuilt paths for {fixed} selected categories.")
    rebuild_paths.short_description = "Rebuild path/depth for selected categories"

    def make_visible(self, request, queryset):
        """Mark selected categories as visible."""
        updated = queryset.update(is_visible=True)
        self.message_user(request, f"Marked {updated} categories as visible.")
    make_visible.short_description = "Mark selected as visible"

    def make_hidden(self, request, queryset):
        """Mark selected categories as hidden."""
        updated = queryset.update(is_visible=False)
        self.message_user(request, f"Marked {updated} categories as hidden.")
    make_hidden.short_description = "Mark selected as hidden"

    def export_selected_csv(self, request, queryset):
        """Export selected categories to CSV."""
        import csv
        import tempfile

        fd, path = tempfile.mkstemp(prefix="categories_", suffix=".csv")
        with open(path, "w", newline="", encoding="utf-8") as fh:
            writer = csv.writer(fh)
            writer.writerow(["id", "name", "slug", "parent_id", "depth", "is_visible"])
            for c in queryset.order_by("depth", "name"):
                parent_id = c.parent_id if c.parent_id else ""
                writer.writerow([c.id, c.name, c.slug, parent_id, c.depth, c.is_visible])

        self.message_user(request, f"Exported {queryset.count()} categories to {path}")
    export_selected_csv.short_description = "Export selected categories as CSV"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "primary_category_display", "current_price", "stock_quantity", "views_count", "sales_count", "wishlist_count", "is_active")
    search_fields = ("name", "sku")
    list_filter = ("is_active", "is_featured", "is_bestseller", "is_new_arrival", "aspect_ratio")
    inlines = [ProductImageInline, ProductVariantInline, Product3DAssetInline]
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = (
        (None, {"fields": ("name", "slug", "sku", "primary_category", "categories")}),
        ("Pricing", {"fields": ("price", "sale_price", "cost", "currency")} ),
        ("Shipping", {"fields": ("weight", "length", "width", "height", "shipping_material")}),
        ("Display", {"fields": ("aspect_ratio",)}),        ("Sustainability", {"fields": ("carbon_footprint_kg", "recycled_content_percentage", "sustainability_score", "ethical_sourcing_notes", "eco_certifications")} ),
        ("Mobile & Voice", {"fields": ("is_mobile_optimized", "voice_keywords")} ),        ("Flags & SEO", {"fields": ("is_active", "is_featured", "is_bestseller", "is_new_arrival", "meta_title", "meta_description")}),
    )

    def primary_category_display(self, obj):
        return obj.primary_category.name if obj.primary_category else "-"

    primary_category_display.short_description = "Primary Category"


@admin.register(ShippingMaterial)
class ShippingMaterialAdmin(admin.ModelAdmin):
    list_display = ("name", "eco_score", "created_at")
    search_fields = ("name",)


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "start", "end", "priority")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Spotlight)
class SpotlightAdmin(admin.ModelAdmin):
    list_display = ("name", "placement", "product", "category", "start", "end", "priority", "is_active")
    list_filter = ("placement", "is_active")


@admin.register(Product3DAsset)
class Product3DAssetAdmin(admin.ModelAdmin):
    list_display = ("product", "file_type", "validated", "is_ar_compatible", "uploaded_at")
    readonly_fields = ("uploaded_at",)


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ("attribute", "value")
    search_fields = ("value",)


@admin.register(Facet)
class FacetAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "type")
    search_fields = ("name",)


@admin.register(CategoryFacet)
class CategoryFacetAdmin(admin.ModelAdmin):
    list_display = ("category", "facet")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


# Inline registered for ProductVariant to ensure attribute M2M is manageable
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ("sku", "product", "price", "stock_quantity", "is_default")
    search_fields = ("sku", "product__name")
