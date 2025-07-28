from django.urls import path
from .views import RelatedProductsAPIView

urlpatterns = [
    path('related-products/', RelatedProductsAPIView.as_view(), name='related_products_api'),
]
