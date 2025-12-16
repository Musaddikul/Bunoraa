"""
Support API URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TicketCategoryViewSet, TicketViewSet, GuestTicketView,
    HelpArticleViewSet, ContactMessageView
)

router = DefaultRouter()
router.register(r'ticket-categories', TicketCategoryViewSet, basename='ticket-category')
router.register(r'tickets', TicketViewSet, basename='tickets')
router.register(r'help', HelpArticleViewSet, basename='help-article')

urlpatterns = [
    path('', include(router.urls)),
    path('tickets/guest/', GuestTicketView.as_view(), name='guest-ticket-create'),
    path('tickets/guest/<str:ticket_number>/', GuestTicketView.as_view(), name='guest-ticket-lookup'),
    path('contact/', ContactMessageView.as_view(), name='contact-message'),
]
