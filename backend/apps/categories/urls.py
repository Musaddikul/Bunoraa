# apps/categories/urls.py
"""
URL routes for categories API.
"""
from django.urls import path
from . import views

app_name = 'categories'

urlpatterns = [
    # Main CRUD
    path('', views.CategoryListCreateView.as_view(), name='list_create'),
    path('<uuid:id>/', views.CategoryDetailView.as_view(), name='detail'),
    path('slug/<slug:slug>/', views.CategoryBySlugView.as_view(), name='by_slug'),
    
    # Tree and navigation
    path('tree/', views.CategoryTreeView.as_view(), name='tree'),
    path('root/', views.RootCategoriesView.as_view(), name='root'),
    path('featured/', views.FeaturedCategoriesView.as_view(), name='featured'),
    
    # Category relationships
    path('<uuid:id>/children/', views.CategoryChildrenView.as_view(), name='children'),
    path('<uuid:id>/ancestors/', views.CategoryAncestorsView.as_view(), name='ancestors'),
    path('<uuid:id>/products/', views.CategoryProductsView.as_view(), name='products'),
]
