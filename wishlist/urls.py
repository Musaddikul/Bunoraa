# wishlist/urls.py
from django.urls import path
from . import views

app_name = 'wishlist'

urlpatterns = [
    path('', views.wishlist_detail, name='detail'),
    path('toggle/<int:product_id>/', views.toggle_wishlist, name='toggle'),
    path('count/', views.wishlist_count_api, name='count_api'),
]

