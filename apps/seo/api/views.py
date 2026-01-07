"""
SEO API endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404

from .models import SEOMetadata, Redirect, SitemapEntry, SearchRanking, Keyword
from .serializers import (
    SEOMetadataSerializer,
    RedirectSerializer,
    SitemapEntrySerializer,
    SearchRankingSerializer,
    KeywordSerializer,
)


class SEOMetadataViewSet(viewsets.ModelViewSet):
    """SEO Metadata management."""
    queryset = SEOMetadata.objects.all()
    serializer_class = SEOMetadataSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        content_type = self.request.query_params.get('content_type')
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def for_url(self, request):
        """Get SEO metadata for a specific URL."""
        url = request.query_params.get('url', '')
        if not url:
            return Response({'error': 'URL required'}, status=status.HTTP_400_BAD_REQUEST)
        
        metadata = self.queryset.filter(canonical_url=url).first()
        if metadata:
            return Response(SEOMetadataSerializer(metadata).data)
        return Response({})


class RedirectViewSet(viewsets.ModelViewSet):
    """URL redirect management."""
    queryset = Redirect.objects.filter(is_active=True)
    serializer_class = RedirectSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check(self, request):
        """Check if URL has a redirect."""
        path = request.query_params.get('path', '')
        redirect = self.queryset.filter(old_path=path).first()
        if redirect:
            return Response({
                'redirect': True,
                'new_path': redirect.new_path,
                'type': redirect.redirect_type,
            })
        return Response({'redirect': False})


class SitemapViewSet(viewsets.ReadOnlyModelViewSet):
    """Sitemap entries."""
    queryset = SitemapEntry.objects.filter(is_active=True).order_by('-priority')
    serializer_class = SitemapEntrySerializer
    permission_classes = [AllowAny]


class SearchRankingViewSet(viewsets.ModelViewSet):
    """Search ranking tracking."""
    queryset = SearchRanking.objects.all()
    serializer_class = SearchRankingSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get ranking summary statistics."""
        from django.db.models import Avg, Count
        
        stats = self.queryset.aggregate(
            avg_position=Avg('position'),
            total_keywords=Count('keyword', distinct=True),
        )
        return Response(stats)


class KeywordViewSet(viewsets.ModelViewSet):
    """Keyword management."""
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = [IsAdminUser]
