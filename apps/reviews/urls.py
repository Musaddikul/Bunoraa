# apps/reviews/urls.py
"""
Review URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductReviewViewSet, MyReviewViewSet, AdminReviewViewSet,
    ReviewVoteView, ReviewReportView
)

app_name = 'reviews'

router = DefaultRouter()
router.register('my-reviews', MyReviewViewSet, basename='my-reviews')
router.register('admin', AdminReviewViewSet, basename='admin')

urlpatterns = [
    path('', include(router.urls)),
    path('products/<int:product_id>/', ProductReviewViewSet.as_view({
        'get': 'list'
    }), name='product-reviews'),
    path('products/<int:product_id>/stats/', ProductReviewViewSet.as_view({
        'get': 'stats'
    }), name='product-review-stats'),
    path('<int:review_id>/vote/', ReviewVoteView.as_view(), name='vote'),
    path('<int:review_id>/report/', ReviewReportView.as_view(), name='report'),
]
