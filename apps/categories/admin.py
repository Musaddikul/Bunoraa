# apps/categories/admin.py
"""
Category Admin Configuration
"""
from django.contrib import admin
# format_html available if needed
from mptt.admin import DraggableMPTTAdmin
from .models import Category


@admin.register(Category)
class CategoryAdmin(DraggableMPTTAdmin):
    list_display = [
        'tree_actions',
        'indented_title',
        'slug',
        'is_active',
        'is_featured',
        'show_in_menu',
        'product_count_display',
        'display_order',
    ]
    list_display_links = ['indented_title']
    list_filter = ['is_active', 'is_featured', 'show_in_menu', 'level']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_featured', 'show_in_menu', 'display_order']
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'parent', 'description')
        }),
        ('Display', {
            'fields': ('image', 'icon', 'banner_image', 'display_order')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_active', 'is_featured', 'show_in_menu')
        }),
    )
    
    @admin.display(description='Products')
    def product_count_display(self, obj):
        return obj.product_count_cache
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('parent')
    
    actions = ['make_active', 'make_inactive', 'update_product_counts']
    
    @admin.action(description='Activate selected categories')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    
    @admin.action(description='Deactivate selected categories')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    
    @admin.action(description='Update product counts')
    def update_product_counts(self, request, queryset):
        for category in queryset:
            category.update_product_count()
        self.message_user(request, f'Updated product counts for {queryset.count()} categories.')
