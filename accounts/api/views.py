# accounts/api/views.py
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from ..models import User, UserAddress
from .serializers import UserSerializer, UserAddressSerializer

class UserProfileAPIView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class UserAddressListCreateAPIView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            addresses = UserAddress.objects.filter(user=user)
            serializer = UserAddressSerializer(addresses, many=True)
            return Response({'results': serializer.data})
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        user = request.user
        if user.is_authenticated:
            serializer = UserAddressSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class UserAddressRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk, user):
        try:
            return UserAddress.objects.get(pk=pk, user=user)
        except UserAddress.DoesNotExist:
            return None

    def get(self, request, pk):
        address = self.get_object(pk, request.user)
        if address:
            serializer = UserAddressSerializer(address)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        address = self.get_object(pk, request.user)
        if address:
            serializer = UserAddressSerializer(address, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        address = self.get_object(pk, request.user)
        if address:
            address.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_default_address_api(request, pk):
    """
    API endpoint to set a specific address as the default for the authenticated user.
    """
    try:
        with transaction.atomic():
            # Get the address to set as default
            address_to_set_default = UserAddress.objects.get(pk=pk, user=request.user)

            # Set all other addresses for this user to not default
            UserAddress.objects.filter(user=request.user).exclude(pk=pk).update(is_default=False)

            # Set the chosen address as default
            address_to_set_default.is_default = True
            address_to_set_default.save()

            return Response({'detail': 'Default address updated successfully.'}, status=status.HTTP_200_OK)
    except UserAddress.DoesNotExist:
        return Response({'error': 'Address not found or does not belong to the user.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

