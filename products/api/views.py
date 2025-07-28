from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from products.models import Product
from products.api.serializers import ProductSerializer

class RelatedProductsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch 4 random products, excluding any product IDs passed in the query parameters
        # (e.g., to exclude products already in the cart or currently being viewed)
        exclude_ids_str = request.query_params.get('exclude_ids', '')
        exclude_ids = [int(id) for id in exclude_ids_str.split(',') if id.isdigit()]

        related_products = Product.objects.exclude(id__in=exclude_ids).order_by('?')[:4]
        serializer = ProductSerializer(related_products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
