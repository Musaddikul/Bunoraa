"""
SEO API serializers.
"""
from rest_framework import serializers
from ..models import SEOMetadata, Redirect, SitemapEntry, SearchRanking, Keyword


class SEOMetadataSerializer(serializers.ModelSerializer):
    """SEO Metadata serializer."""
    
    class Meta:
        model = SEOMetadata
        fields = [
            'id',
            'content_type',
            'object_id',
            'title',
            'description',
            'keywords',
            'canonical_url',
            'og_title',
            'og_description',
            'og_image',
            'twitter_card',
            'robots',
            'structured_data',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class RedirectSerializer(serializers.ModelSerializer):
    """URL Redirect serializer."""
    
    class Meta:
        model = Redirect
        fields = [
            'id',
            'old_path',
            'new_path',
            'redirect_type',
            'is_active',
            'hit_count',
            'created_at',
        ]
        read_only_fields = ['hit_count', 'created_at']


class SitemapEntrySerializer(serializers.ModelSerializer):
    """Sitemap entry serializer."""
    
    class Meta:
        model = SitemapEntry
        fields = [
            'id',
            'url',
            'priority',
            'changefreq',
            'last_modified',
            'is_active',
        ]


class KeywordSerializer(serializers.ModelSerializer):
    """Keyword serializer."""
    
    class Meta:
        model = Keyword
        fields = [
            'id',
            'term',
            'search_volume',
            'difficulty',
            'target_page',
            'created_at',
        ]
        read_only_fields = ['created_at']


class SearchRankingSerializer(serializers.ModelSerializer):
    """Search ranking serializer."""
    keyword = KeywordSerializer(read_only=True)
    keyword_id = serializers.PrimaryKeyRelatedField(
        queryset=Keyword.objects.all(),
        source='keyword',
        write_only=True
    )
    
    class Meta:
        model = SearchRanking
        fields = [
            'id',
            'keyword',
            'keyword_id',
            'position',
            'url',
            'search_engine',
            'recorded_at',
        ]
        read_only_fields = ['recorded_at']
