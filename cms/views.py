# cms/views.py
from django.views.generic import ListView, TemplateView
from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .selectors import get_active_banners, get_published_page, get_page_blocks, get_site_settings
from .serializers import BannerSerializer, PageSerializer, SiteSettingSerializer

class BannerListView(ListView):
    template_name = 'cms/banner_list.html'
    context_object_name = 'banners'
    def get_queryset(self):
        return get_active_banners()

class BannerPartialView(TemplateView):
    template_name = 'cms/partials/banner_list.html'
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {'banners': get_active_banners()})

class BannerListAPI(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        banners = get_active_banners()
        serializer = BannerSerializer(banners, many=True, context={'request': request})
        return Response(serializer.data)

class PageDetailView(TemplateView):
    template_name = 'cms/page_detail.html'
    def get(self, request, slug):
        page = get_published_page(slug)
        if not page:
            raise Http404("Page not found")
        context = {
            'page': page,
            'blocks': get_page_blocks(page),
            'settings': get_site_settings()
        }
        return render(request, self.template_name, context)

class BlocksPartialView(TemplateView):
    template_name = 'cms/partials/content_blocks.html'
    def get(self, request, slug):
        page = get_published_page(slug)
        if not page:
            raise Http404()
        return render(request, self.template_name, {'blocks': get_page_blocks(page)})

class PageDetailAPI(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, slug):
        page = get_published_page(slug)
        if not page:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PageSerializer(page, context={'request': request})
        return Response(serializer.data)

class SiteSettingsAPI(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        settings = get_site_settings()
        data = [{'key': k, 'value': v} for k, v in settings.items()]
        return Response(data)

def about_view(request):
    return render(request, 'cms/about.html')
