# legal/urls.py
from django.urls import path
from . import views

app_name = 'legal'

urlpatterns = [
    path('', views.PolicyListView.as_view(), name='policy_list'),
    path('subscribe/', views.SubscribeView.as_view(), name='subscribe'),
    path('confirm/',   views.ConfirmSubscriptionView.as_view(), name='confirm'),
    path('unsubscribe/', views.UnsubscribeView.as_view(), name='unsubscribe'),
    path('<slug:slug>/', views.PolicyDetailView.as_view(), name='policy'),
    path('<slug:slug>/accept/', views.AcceptPolicyView.as_view(), name='accept'),
    # API
    path('api/policies/',      views.PolicyListAPI.as_view(),      name='policies_api'),
    path('api/policies/<int:pk>/', views.PolicyDetailAPI.as_view(), name='policy_api'),
    path('api/subscribe/',     views.SubscribeAPI.as_view(),       name='subscribe_api'),
]
