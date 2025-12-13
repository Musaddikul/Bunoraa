# apps/pages/views.py
"""
Pages views.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Page, FAQ, ContactMessage, SiteSettings
from .serializers import (
    PageSerializer,
    FAQSerializer,
    ContactMessageCreateSerializer,
    ContactMessageSerializer,
    SiteSettingsSerializer,
)


class PageListView(ListAPIView):
    """List all published pages."""
    
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Page.objects.filter(is_published=True)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Pages retrieved',
            'data': serializer.data,
            'meta': None
        })


class PageDetailView(RetrieveAPIView):
    """Get a page by slug."""
    
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Page.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            return Response({
                'success': True,
                'message': 'Page retrieved',
                'data': serializer.data,
                'meta': None
            })
        except Exception:
            return Response({
                'success': False,
                'message': 'Page not found',
                'data': None,
                'meta': None
            }, status=status.HTTP_404_NOT_FOUND)


class FAQListView(ListAPIView):
    """List all FAQs, grouped by category."""
    
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = FAQ.objects.filter(is_active=True)
        
        # Filter by category if specified
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Group by category
        grouped = {}
        for faq in serializer.data:
            cat = faq['category']
            if cat not in grouped:
                grouped[cat] = []
            grouped[cat].append(faq)
        
        return Response({
            'success': True,
            'message': 'FAQs retrieved',
            'data': serializer.data,
            'meta': {'grouped': grouped}
        })


class ContactSubmitView(APIView):
    """Submit a contact message."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ContactMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        message = serializer.save()
        
        # Send notification email to admin
        from .tasks import send_contact_notification
        send_contact_notification.delay(str(message.id))
        
        return Response({
            'success': True,
            'message': 'Your message has been sent. We will get back to you soon.',
            'data': {'id': str(message.id)},
            'meta': None
        }, status=status.HTTP_201_CREATED)


class SiteSettingsView(APIView):
    """Get public site settings."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        settings_obj = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings_obj)
        
        return Response({
            'success': True,
            'message': 'Site settings retrieved',
            'data': serializer.data,
            'meta': None
        })


# Admin views
class AdminContactListView(ListAPIView):
    """Admin: List contact messages."""
    
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = ContactMessage.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset


class AdminContactUpdateView(APIView):
    """Admin: Update contact message status."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def patch(self, request, message_id):
        message = get_object_or_404(ContactMessage, id=message_id)
        
        status_update = request.data.get('status')
        notes = request.data.get('admin_notes')
        
        if status_update:
            message.status = status_update
        if notes:
            message.admin_notes = notes
        
        message.handled_by = request.user
        message.save()
        
        return Response({
            'success': True,
            'message': 'Contact message updated',
            'data': ContactMessageSerializer(message).data,
            'meta': None
        })
