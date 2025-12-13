# apps/storefront/urls.py
"""
Storefront URL Configuration
Main customer-facing URLs.
"""
from django.urls import path
from . import views

app_name = 'storefront'

urlpatterns = [
    # Home
    path('', views.HomeView.as_view(), name='home'),
    
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('category/<path:category_path>/', views.CategoryDetailView.as_view(), name='category_detail'),
    
    # Products
    path('products/', views.ProductListView.as_view(), name='product_list'),
    path('product/<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('search/', views.SearchView.as_view(), name='search'),
    
    # Brands
    path('brands/', views.BrandListView.as_view(), name='brand_list'),
    path('brand/<slug:slug>/', views.BrandDetailView.as_view(), name='brand_detail'),
    
    # Vendor Storefronts
    path('shop/<slug:vendor_slug>/', views.VendorStorefrontView.as_view(), name='vendor_storefront'),
    path('shop/<slug:vendor_slug>/products/', views.VendorProductsView.as_view(), name='vendor_products'),
    path('shop/<slug:vendor_slug>/about/', views.VendorAboutView.as_view(), name='vendor_about'),
    path('shop/<slug:vendor_slug>/reviews/', views.VendorReviewsView.as_view(), name='vendor_reviews'),
    path('shop/<slug:vendor_slug>/page/<slug:page_slug>/', views.VendorPageView.as_view(), name='vendor_page'),
    
    # Collections
    path('new-arrivals/', views.NewArrivalsView.as_view(), name='new_arrivals'),
    path('bestsellers/', views.BestsellersView.as_view(), name='bestsellers'),
    path('featured/', views.FeaturedView.as_view(), name='featured'),
    path('deals/', views.DealsView.as_view(), name='deals'),
    
    # Quick view (AJAX)
    path('product/<slug:slug>/quick-view/', views.ProductQuickView.as_view(), name='product_quick_view'),
]
