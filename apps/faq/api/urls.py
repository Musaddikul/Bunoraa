"""
FAQ API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    FAQCategoryViewSet, FAQQuestionViewSet,
    FAQSearchView, FAQSearchClickView, FAQFeedbackView,
    FAQSuggestionView, PopularSearchesView
)


router = DefaultRouter()
router.register(r'categories', FAQCategoryViewSet, basename='faq-category')
router.register(r'questions', FAQQuestionViewSet, basename='faq-question')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', FAQSearchView.as_view(), name='faq-search'),
    path('search/click/', FAQSearchClickView.as_view(), name='faq-search-click'),
    path('feedback/', FAQFeedbackView.as_view(), name='faq-feedback'),
    path('suggest/', FAQSuggestionView.as_view(), name='faq-suggest'),
    path('popular-searches/', PopularSearchesView.as_view(), name='faq-popular-searches'),
]
