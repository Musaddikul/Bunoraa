# legal/urls.py
from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = 'legal'

urlpatterns = [
    # Static legal pages
    path('terms/', TemplateView.as_view(template_name='legal/terms.html'), name='terms'),
    path('privacy/', TemplateView.as_view(template_name='legal/privacy.html'), name='privacy'),
    path('shipping/', TemplateView.as_view(template_name='legal/shipping_info.html'), name='shipping_info'),
    path('returns/', TemplateView.as_view(template_name='legal/returns_policy.html'), name='returns_policy'),
    
    # Dynamic policy pages
    path('', views.PolicyListView.as_view(), name='policy_list'),
    path('subscribe/', views.SubscribeView.as_view(), name='subscribe'),
    path('confirm/',   views.ConfirmSubscriptionView.as_view(), name='confirm'),
    path('unsubscribe/', views.UnsubscribeView.as_view(), name='unsubscribe'),
    path('policy/<slug:slug>/', views.PolicyDetailView.as_view(), name='policy'),
    path('policy/<slug:slug>/accept/', views.AcceptPolicyView.as_view(), name='accept'),
    
    # API
    path('api/policies/',      views.PolicyListAPI.as_view(),      name='policies_api'),
    path('api/policies/<int:pk>/', views.PolicyDetailAPI.as_view(), name='policy_api'),
    path('api/subscribe/',     views.SubscribeAPI.as_view(),       name='subscribe_api'),
]
