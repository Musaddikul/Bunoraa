# notifications/views.py
from django.views.generic import TemplateView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .models import Notification, NotificationTemplate, NotificationPreference
from .serializers import (
    NotificationSerializer, NotificationTemplateSerializer, NotificationPreferenceSerializer
)
from .selectors import get_recent_notifications, get_unread_count

class NotificationDashboardView(TemplateView):
    template_name = 'notifications/dashboard.html'
    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['notifications'] = get_recent_notifications(self.request.user)
        ctx['unread_count']  = get_unread_count(self.request.user)
        return ctx

class MarkReadAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        notif = get_object_or_404(Notification, pk=pk, user=request.user)
        notif.mark_read()
        return Response({'status':'ok','read_at':notif.read_at})

class MarkAllReadAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        for notif in notifications:
            notif.mark_read()
        return Response({'status':'ok'})

class UnreadCountAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        count = get_unread_count(request.user)
        return Response({'unread_count': count})

class NotificationTemplateListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer

class PreferenceListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationPreferenceSerializer
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
