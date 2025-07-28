# notifications/urls.py
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    # In-app UI
    path('', views.NotificationDashboardView.as_view(), name='dashboard'),
    path('mark-read/<int:pk>/', views.MarkReadAPI.as_view(), name='mark_read'),
    path('mark-all-read/', views.MarkAllReadAPI.as_view(), name='mark_all_read'),
    path('unread-count/', views.UnreadCountAPI.as_view(), name='unread_count'),
    # Admin templates & prefs
    path('templates/', views.NotificationTemplateListView.as_view(), name='templates'),
    path('preferences/', views.PreferenceListCreateView.as_view(), name='preferences'),
]
