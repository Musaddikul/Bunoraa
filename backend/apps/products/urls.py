# apps/products/urls.py
"""
URL routes for products API.
"""
from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Main CRUD
    path('', views.ProductListCreateView.as_view(), name='list'),
    path('<uuid:id>/', views.ProductDetailView.as_view(), name='detail'),
    path('slug/<slug:slug>/', views.ProductBySlugView.as_view(), name='by_slug'),
    
    # Collections
    path('featured/', views.FeaturedProductsView.as_view(), name='featured'),
    path('new-arrivals/', views.NewArrivalsView.as_view(), name='new_arrivals'),
    path('best-sellers/', views.BestSellersView.as_view(), name='best_sellers'),
    path('on-sale/', views.OnSaleProductsView.as_view(), name='on_sale'),
    
    # Search
    path('search/', views.ProductSearchView.as_view(), name='search'),
    
    # Related products
    path('<uuid:id>/related/', views.RelatedProductsView.as_view(), name='related'),
    
    # Images
    path('<uuid:id>/images/', views.ProductImageUploadView.as_view(), name='images_upload'),
    path('<uuid:id>/images/<uuid:image_id>/', views.ProductImageDeleteView.as_view(), name='image_delete'),
    
    # Bulk operations
    path('bulk/', views.BulkProductCreateView.as_view(), name='bulk_create'),
    
    # Tags
    path('tags/', views.TagListCreateView.as_view(), name='tags_list'),
    path('tags/<uuid:id>/', views.TagDetailView.as_view(), name='tag_detail'),
    
    # Brands
    path('brands/', views.BrandListCreateView.as_view(), name='brands_list'),
    path('brands/<uuid:id>/', views.BrandDetailView.as_view(), name='brand_detail'),
    
    # Attributes
    path('attributes/', views.AttributeTypeListView.as_view(), name='attribute_types'),
    path('attributes/<uuid:type_id>/values/', views.AttributeValueListView.as_view(), name='attribute_values'),
]
