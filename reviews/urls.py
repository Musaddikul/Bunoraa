# reviews/urls.py
from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    # Traditional Django view for form submission (if still in use)
    path('submit/<int:product_id>/', views.SubmitReviewView.as_view(), name='submit'),

    # REST API Endpoints
    path('api/create/<int:product_id>/', views.ReviewCreateAPI.as_view(), name='api_create'), # New API for creating reviews
    path('api/list/<int:product_id>/', views.ReviewListAPI.as_view(), name='api_list'),
    path('api/detail/<int:pk>/', views.ReviewDetailAPI.as_view(), name='api_detail'),
    path('api/vote/<int:pk>/', views.VoteAPI.as_view(), name='api_vote'),
    path('api/flag/<int:pk>/', views.FlagAPI.as_view(), name='api_flag'),
    path('api/summary/<int:product_id>/', views.SummaryAPI.as_view(), name='api_summary'),
]