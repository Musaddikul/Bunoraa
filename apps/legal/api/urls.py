"""
Legal API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LegalDocumentViewSet, ConsentViewSet, CookieConsentView,
    CookieConsentAcceptAllView, CookieConsentRejectAllView,
    GDPRRequestViewSet, GDPRVerifyView
)

router = DefaultRouter()
router.register(r'documents', LegalDocumentViewSet, basename='legal-document')
router.register(r'consents', ConsentViewSet, basename='consent')
router.register(r'gdpr', GDPRRequestViewSet, basename='gdpr-request')

urlpatterns = [
    path('', include(router.urls)),
    path('cookies/', CookieConsentView.as_view(), name='cookie-consent'),
    path('cookies/accept-all/', CookieConsentAcceptAllView.as_view(), name='cookie-accept-all'),
    path('cookies/reject-all/', CookieConsentRejectAllView.as_view(), name='cookie-reject-all'),
    path('gdpr/verify/<str:token>/', GDPRVerifyView.as_view(), name='gdpr-verify'),
]
