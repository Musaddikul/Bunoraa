from django.urls import path
from . import views

app_name = 'accounts_api'

urlpatterns = [
    path('profile/', views.UserProfileAPIView.as_view(), name='profile'),
    path('addresses/', views.UserAddressListCreateAPIView.as_view(), name='addresses'),
    path('addresses/<int:pk>/', views.UserAddressRetrieveUpdateDestroyAPIView.as_view(), name='address_detail'),
]