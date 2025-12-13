# apps/reviews/urls.py
"""
Reviews URL configuration.
"""
from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    # Product reviews
    path('products/<uuid:product_id>/', views.ProductReviewsView.as_view(), name='product-reviews'),
    
    # User review management
    path('create/', views.CreateReviewView.as_view(), name='create-review'),
    path('my-reviews/', views.UserReviewsView.as_view(), name='my-reviews'),
    path('<uuid:review_id>/', views.ReviewDetailView.as_view(), name='review-detail'),
    path('<uuid:review_id>/vote/', views.ReviewVoteView.as_view(), name='review-vote'),
    
    # Admin endpoints
    path('admin/', views.AdminReviewListView.as_view(), name='admin-review-list'),
    path('admin/<uuid:review_id>/moderate/', views.AdminReviewApproveView.as_view(), name='admin-review-moderate'),
    path('admin/<uuid:review_id>/respond/', views.AdminReviewRespondView.as_view(), name='admin-review-respond'),
]
