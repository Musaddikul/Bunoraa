# apps/pages/urls.py
"""
Pages URL configuration.
"""
from django.urls import path
from . import views

app_name = 'pages'

urlpatterns = [
    # Public pages
    path('', views.PageListView.as_view(), name='page-list'),
    path('page/<slug:slug>/', views.PageDetailView.as_view(), name='page-detail'),
    
    # FAQs
    path('faqs/', views.FAQListView.as_view(), name='faq-list'),
    
    # Contact
    path('contact/', views.ContactSubmitView.as_view(), name='contact-submit'),
    
    # Site settings
    path('settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    
    # Admin endpoints
    path('admin/contacts/', views.AdminContactListView.as_view(), name='admin-contact-list'),
    path('admin/contacts/<uuid:message_id>/', views.AdminContactUpdateView.as_view(), name='admin-contact-update'),
]
