# cms/admin.py
from django.contrib import admin
from django.utils import timezone
from .models import Banner, Page, ContentBlock, SiteSetting

class ContentBlockInline(admin.StackedInline):
    model = ContentBlock
    extra = 0
    fields = ('identifier','block_type','order','settings','content')
    readonly_fields = ()
    sortable_field_name = "order"

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display        = ('title','slug','status','publish_date','author')
    list_filter         = ('status','language')
    search_fields       = ('title','slug','content')
    prepopulated_fields = {'slug': ('title',)}
    inlines             = [ContentBlockInline]
    actions             = ['publish_pages','archive_pages']

    def publish_pages(self, request, queryset):
        now = timezone.now()
        queryset.update(status='published', publish_date=now)
    publish_pages.short_description = "Publish selected pages"

    def archive_pages(self, request, queryset):
        queryset.update(status='archived')
    archive_pages.short_description = "Archive selected pages"

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title','is_current','order','start_date','end_date')
    list_filter  = ('is_active','start_date','end_date')
    search_fields= ('title','alt_text')
    fieldsets    = (
        (None, {'fields':('title','image','alt_text','link')}),
        ('Scheduling & Targeting', {'fields':('start_date','end_date','is_active','order','target_groups')}),
        ('A/B Testing', {'fields':('ab_variant','ab_weight')}),
    )
    actions      = ['deactivate_banners']

    def deactivate_banners(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_banners.short_description = "Deactivate selected banners"

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key','updated_at')
    search_fields= ('key','description')
