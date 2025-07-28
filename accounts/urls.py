# accounts/urls.py
from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

app_name = 'accounts'

urlpatterns = [
    # Profile URLs (Existing Django views)
    path('profile/', views.profile, name='profile'),
    path('address/add/', views.add_address, name='add_address'),
    path('address/<int:pk>/edit/', views.edit_address, name='edit_address'),
    path('address/<int:pk>/delete/', views.delete_address, name='delete_address'),
    path('address/<int:pk>/set-default/', views.set_default_address, name='set_default_address'),
    path('orders/', views.user_orders, name='user_orders'),
    
    # API Endpoints for Accounts
    path('api/', include('accounts.api.urls')),
]