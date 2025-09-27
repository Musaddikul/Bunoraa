from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from products.models import Product
from products.api.serializers import ProductSerializer
from django.shortcuts import render

class RelatedProductsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        exclude_ids_str = request.query_params.get('exclude_ids', '')
        exclude_ids = [int(id) for id in exclude_ids_str.split(',') if id.isdigit()]

        related_products = Product.objects.exclude(id__in=exclude_ids).order_by('?')[:4]
        return render(request, 'cart/partials/related_products.html', {'related_products': related_products})
