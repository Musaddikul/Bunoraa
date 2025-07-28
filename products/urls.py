# products/urls.py
from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Product listings (all products) - optional if needed
    path('products/', views.ProductListView.as_view(), name='all_products'),
    
    # Trending, New arrivals, Festivals
    path('trending/', views.TrendingProductsView.as_view(), name='trending'),
    path('new-arrivals/', views.NewArrivalsView.as_view(), name='new_arrivals'),
    path('festivals/', views.FestivalsView.as_view(), name='festivals'),
    
    # Search
    path('products/search/', views.ProductSearchView.as_view(), name='search'),
    
    # AJAX endpoints
    path('products/quick-view/<int:product_id>/', views.quick_view, name='quick_view'),

    # Categories list page (if you want a separate page listing all categories)
    path('categories/', views.CategoryListView.as_view(), name='all_categories'),

    # Categories and Subcategories listing & filtering products
    path('<slug:category_slug>/', views.ProductListView.as_view(), name='category'),
    path('<slug:category_slug>/<slug:subcategory_slug>/', views.ProductListView.as_view(), name='subcategory'),
    
    # Product details under category/subcategory/product_slug
    path('<slug:category_slug>/<slug:subcategory_slug>/<slug:product_slug>/', views.ProductDetailView.as_view(), name='product_detail'),
]
