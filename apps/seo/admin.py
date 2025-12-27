from django.contrib import admin
from .models import Keyword, KeywordURLMapping, SERPSnapshot, GSCMetric, ContentBrief


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ('term', 'intent', 'monthly_volume', 'is_target', 'created_at')
    search_fields = ('term',)
    list_filter = ('intent', 'is_target')


@admin.register(KeywordURLMapping)
class MappingAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'url', 'score', 'intent', 'created_at')
    search_fields = ('url', 'keyword__term')


@admin.register(SERPSnapshot)
class SERPSnapshotAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'date', 'position', 'url', 'search_engine', 'source')
    list_filter = ('search_engine', 'source', 'date')
    search_fields = ('url', 'keyword__term')


@admin.register(GSCMetric)
class GSCMetricAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'date', 'clicks', 'impressions', 'ctr', 'position')
    search_fields = ('keyword__term',)


@admin.register(ContentBrief)
class ContentBriefAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'created_at', 'recommended_word_count')
    readonly_fields = ('top_urls', 'suggested_headings', 'top_terms', 'notes')
    search_fields = ('keyword__term',)