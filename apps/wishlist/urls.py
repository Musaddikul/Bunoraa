"""
Wishlist URL Configuration
"""
from django.urls import path, include
from . import views

app_name = 'wishlist'

urlpatterns = [
    path('', views.WishlistView.as_view(), name='list'),
    path('api/v1/', include('apps.wishlist.api.urls')),
]
