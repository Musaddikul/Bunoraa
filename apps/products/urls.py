"""
Product URL configuration - Frontend views
"""
from django.urls import path, re_path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.ProductListView.as_view(), name='list'),
    path('search/', views.ProductSearchView.as_view(), name='search'),
    path('sale/', views.ProductListView.as_view(), {'on_sale': True}, name='sale'),
    path('featured/', views.ProductListView.as_view(), {'featured': True}, name='featured'),
    path('new-arrivals/', views.ProductListView.as_view(), {'new_arrivals': True}, name='new_arrivals'),
    path('brand/<slug:brand_slug>/', views.ProductListView.as_view(), name='by_brand'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='detail'),
]
