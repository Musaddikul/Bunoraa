"""
Category admin configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category


class CategoryAdmin(admin.ModelAdmin):
    """Category admin with tree display."""
    
    list_display = [
        'name', 'parent', 'depth', 'order', 'is_active', 'is_featured',
        'product_count_display', 'created_at'
    ]
    list_filter = ['is_active', 'is_featured', 'is_deleted', 'depth', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    # Use default dropdown select for parent (not raw id search)
    ordering = ['depth', 'order', 'name']
    
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'description', 'parent')}),
        ('Display', {'fields': ('image', 'icon', 'order', 'aspect_width', 'aspect_height', 'aspect_unit')}),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Status', {'fields': ('is_active', 'is_featured', 'is_deleted')}),
        ('Info', {
            'fields': ('depth', 'path', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['depth', 'path', 'created_at', 'updated_at']
    
    def product_count_display(self, obj):
        """Display product count."""
        return obj.product_count
    product_count_display.short_description = 'Products'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('parent')
    
    actions = ['seed_default_tree', 'rebuild_paths', 'export_selected_csv', 'make_active', 'make_inactive', 'make_featured', 'remove_featured']

    def seed_default_tree(self, request, queryset):
        """Admin action to run the default category seeder (idempotent)."""
        try:
            from apps.categories import tasks
            # If using Celery, schedule the async task for large operations
            if hasattr(tasks, 'seed_taxonomy') and getattr(tasks.seed_taxonomy, 'delay', None):
                tasks.seed_taxonomy.delay()
                self.message_user(request, 'Seeding scheduled as background task.')
                return
        except Exception:
            pass

        from django.core.management import call_command
        call_command('seed_categories')
        self.message_user(request, 'Default category tree seeded (idempotent).')
    seed_default_tree.short_description = 'Seed default category tree'

    def rebuild_paths(self, request, queryset):
        """Admin action to rebuild path and depth for selected categories (and descendants)."""
        # If no selection (unlikely), rebuild entire tree
        if queryset.count() == 0:
            # prefer background job if available
            try:
                from apps.categories import tasks
                if hasattr(tasks, 'rebuild_paths') and getattr(tasks.rebuild_paths, 'delay', None):
                    tasks.rebuild_paths.delay()
                    self.message_user(request, 'Rebuild scheduled as background task for entire tree.')
                    return
            except Exception:
                pass

            fixed = Category.rebuild_all_paths()
            self.message_user(request, f'Rebuilt paths for entire tree, fixed {fixed} nodes.')
            return

        fixed = 0
        processed = set()
        for cat in queryset:
            # Avoid double-processing if a selected node is descendant of another selected node
            if cat.pk in processed:
                continue
            fixed += 1 if cat.rebuild_subtree() else 0
            # Mark all descendants as processed to skip
            for desc in Category.objects.filter(path__startswith=f"{cat.path}/").values_list('pk', flat=True):
                processed.add(desc)

        self.message_user(request, f'Rebuilt {fixed} selected subtree(s).')
    rebuild_paths.short_description = 'Rebuild path/depth for selected categories'

    def export_selected_csv(self, request, queryset):
        """Export selected categories to a CSV file in tmp and return path via admin message."""
        import csv
        import tempfile
        from django.conf import settings

        fd, path = tempfile.mkstemp(prefix='taxonomy_', suffix='.csv')
        with open(path, 'w', newline='', encoding='utf-8') as fh:
            writer = csv.writer(fh)
            writer.writerow(['code', 'parent_code', 'display_name', 'url_slug', 'path', 'depth', 'visibility'])
            for c in queryset.order_by('path'):
                parent_code = c.parent.code if c.parent else ''
                writer.writerow([c.code or '', parent_code, c.name, c.slug, c.path, c.depth, c.visibility])

        self.message_user(request, f'Exported {queryset.count()} categories to {path}')
    export_selected_csv.short_description = 'Export selected categories as CSV'    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = 'Mark selected categories as active'
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = 'Mark selected categories as inactive'
    
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    make_featured.short_description = 'Mark selected categories as featured'
    
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)
    remove_featured.short_description = 'Remove featured status'


# Register Category admin
admin.site.register(Category, CategoryAdmin)
