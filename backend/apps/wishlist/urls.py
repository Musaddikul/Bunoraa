# apps/wishlist/urls.py
"""
Wishlist URL configuration.
"""
from django.urls import path
from . import views

app_name = 'wishlist'

urlpatterns = [
    path('', views.WishlistView.as_view(), name='wishlist'),
    path('items/', views.WishlistItemsView.as_view(), name='wishlist-items'),
    path('items/<uuid:item_id>/', views.WishlistItemDetailView.as_view(), name='wishlist-item-detail'),
    path('check/<uuid:product_id>/', views.WishlistCheckView.as_view(), name='wishlist-check'),
    path('clear/', views.WishlistClearView.as_view(), name='wishlist-clear'),
    path('items/<uuid:item_id>/move-to-cart/', views.WishlistMoveToCartView.as_view(), name='wishlist-move-to-cart'),
]
