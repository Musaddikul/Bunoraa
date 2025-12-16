"""
Cart URL configuration - Frontend views
"""
from django.urls import path
from . import views

app_name = 'cart'

cart_view = views.CartView.as_view()

urlpatterns = [
    path('', cart_view, name='cart'),
    path('', cart_view, name='view'),
]
