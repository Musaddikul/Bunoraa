# cms/urls.py
from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('banners/', views.BannerListView.as_view(), name='banners'),
    path('about/', views.about_view, name='about'),
]