from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyViewSet, change_currency

router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('change-currency/', change_currency, name='change_currency'),
]