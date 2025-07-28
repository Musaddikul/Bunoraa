# faq/urls.py
from django.urls import path
from . import views

app_name = 'faq'

urlpatterns = [
    path('', views.FAQListView.as_view(), name='list'),
    path('search/', views.FAQSearchView.as_view(), name='search'),
    path('category/<slug:slug>/', views.FAQListView.as_view(), name='by_category'),
    path('<slug:slug>/', views.FAQDetailView.as_view(), name='detail'),
    path('request/', views.FAQRequestView.as_view(), name='request'),
    path('feedback/', views.FAQFeedbackAPI.as_view(), name='feedback_api'),
    # API
    path('api/faqs/', views.FAQListAPI.as_view(), name='faqs_api'),
    path('api/faqs/<int:pk>/', views.FAQDetailAPI.as_view(), name='faq_api'),
]
