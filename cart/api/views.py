# cart/api/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
import logging

from products.models import Product
from ..models import Cart, CartItem
from ..serializers import (
    CartSerializer, CartItemCreateUpdateSerializer, CartItemUpdateSerializer,
    CouponApplySerializer, ShippingUpdateSerializer
)
from ..services import (
    add_product_to_cart, remove_product_from_cart,
    update_cart_item_quantity, toggle_saved_for_later,
    apply_coupon_to_cart, remove_coupon_from_cart,
    update_cart_shipping, mark_cart_checked_out, clear_cart_items
)
from ..selectors import get_user_cart # Corrected import to use the unified selector

logger = logging.getLogger(__name__)

class StandardThrottle(UserRateThrottle):
    """
    Standard throttle scope for API views.
    """
    scope = 'standard'

class CartDetailAPIView(APIView):
    """
    API view to retrieve the current user's or session's cart details.
    """
    permission_classes = [AllowAny] # Allow anonymous users to view cart
    throttle_classes = [StandardThrottle]

    def get(self, request, *args, **kwargs):
        """
        Retrieves the active cart for the current user or session.
        """
        cart = get_user_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartItemAPIView(APIView):
    """
    API view for adding, updating, and deleting cart items.
    """
    permission_classes = [AllowAny]
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Adds a product to the cart or updates its quantity.
        """
        serializer = CartItemCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        override_quantity = serializer.validated_data.get('override_quantity', False)
        saved_for_later = serializer.validated_data.get('saved_for_later', False)

        product = get_object_or_404(Product, id=product_id)

        try:
            # Service returns the updated cart
            # Pass request (HttpRequest object) to add_product_to_cart
            updated_cart = add_product_to_cart(request, product, quantity, override_quantity, saved_for_later)
            
            # Prepare response message
            message = _(f"'{product.name}' added to cart.")
            # Check if quantity was adjusted due to stock limits
            cart_item_in_cart = updated_cart.items.filter(product=product, saved_for_later=False).first()
            if cart_item_in_cart and cart_item_in_cart.quantity > product.stock:
                message = _(f"Quantity for '{product.name}' adjusted to maximum available stock: {product.stock}.")

            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error adding product {product_id} to cart via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while adding to cart: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, product_id, *args, **kwargs):
        """
        Updates the quantity of a specific cart item.
        """
        product = get_object_or_404(Product, id=product_id)
        serializer = CartItemUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            raise ValidationError(serializer.errors)

        quantity = serializer.validated_data['quantity']

        try:
            # Service returns the updated cart
            # Pass request (HttpRequest object) to update_cart_item_quantity
            updated_cart = update_cart_item_quantity(request, product, quantity)

            message = _(f"Quantity for '{product.name}' updated to {quantity}.")
            # Check if quantity was adjusted due to stock limits
            cart_item_in_cart = updated_cart.items.filter(product=product, saved_for_later=False).first()
            if cart_item_in_cart and cart_item_in_cart.quantity > product.stock:
                message = _(f"Quantity for '{product.name}' adjusted to maximum available stock: {product.stock}.")

            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error updating quantity for product {product_id} via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while updating quantity: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, product_id, *args, **kwargs):
        """
        Removes a product from the cart.
        """
        product = get_object_or_404(Product, id=product_id)
        try:
            # Service returns the updated cart
            # Pass request (HttpRequest object) to remove_product_from_cart
            updated_cart = remove_product_from_cart(request, product)
            message = _(f"'{product.name}' removed from cart.")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error removing product {product_id} from cart via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while removing product: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartItemToggleSavedAPIView(APIView):
    """
    API view to toggle a cart item's 'saved_for_later' status.
    """
    permission_classes = [AllowAny]
    throttle_classes = [StandardThrottle]

    def post(self, request, product_id, *args, **kwargs):
        """
        Toggles the 'saved_for_later' status for a cart item.
        """
        product = get_object_or_404(Product, id=product_id)
        try:
            # Service returns the updated cart
            # Pass request (HttpRequest object) to toggle_saved_for_later
            updated_cart = toggle_saved_for_later(request, product)
            is_saved = updated_cart.items.get(product=product).saved_for_later # Get the latest status
            action_msg = _("moved to 'Saved for Later'") if is_saved else _("moved to active cart")
            message = _(f"'{product.name}' {action_msg}.")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error toggling saved status for product {product_id} via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while toggling saved status: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class CartShippingAPIView(APIView):
    """
    API view for updating cart shipping method.
    """
    permission_classes = [AllowAny] # Allow anonymous users to update shipping
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Updates the shipping method for the cart.
        """
        serializer = ShippingUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shipping_method_id = serializer.validated_data['shipping_method_id']
        is_express = serializer.validated_data.get('is_express', False)
        address_id = serializer.validated_data.get('address_id')

        try:
            # Pass request (HttpRequest object) to update_cart_shipping
            updated_cart = update_cart_shipping(request, shipping_method_id, is_express, address_id) # The service expects the request object
            message = _("Shipping method updated.")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating shipping via API for cart (unknown ID at this point): {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while updating shipping: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartCheckoutAPIView(APIView):
    """
    API view to mark the cart as checked out.
    This should typically be called after a successful order creation.
    """
    permission_classes = [IsAuthenticated] # Only authenticated users can checkout
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Marks the user's cart as checked out.
        """
        try:
            # FIX: Use the unified get_user_cart selector which handles both
            # authenticated users and anonymous sessions correctly.
            cart = get_user_cart(request)
            if cart.is_empty:
                return Response({'error': _('Cannot checkout an empty cart.')}, status=status.HTTP_400_BAD_REQUEST)
            
            if cart.checked_out:
                return Response({'message': _('Cart is already checked out.')}, status=status.HTTP_200_OK)

            mark_cart_checked_out(cart)
            return Response({'message': _('Cart successfully marked as checked out.')}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking cart as checked out for user {request.user.id}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred during checkout: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartClearAPIView(APIView):
    """
    API view to clear all active items from the cart.
    """
    permission_classes = [AllowAny]
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        """
        Clears all active items from the user's or session's cart.
        """
        try:
            # Pass request (HttpRequest object) to clear_cart_items
            updated_cart = clear_cart_items(request) # The service expects the request object
            message = _(f"Your cart has been emptied ({updated_cart.total_items} items removed).")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error emptying cart via API for user {request.user.id}: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while emptying the cart: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartCouponApplyAPIView(APIView):
    """
    API view to apply a coupon to the cart.
    """
    permission_classes = [AllowAny]
    throttle_classes = [StandardThrottle]

    def post(self, request, *args, **kwargs):
        serializer = CouponApplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        coupon_code = serializer.validated_data['code']

        try:
            updated_cart = apply_coupon_to_cart(request, coupon_code)
            message = _(f"Coupon '{coupon_code}' applied successfully.")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error applying coupon '{coupon_code}' to cart via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while applying coupon: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, *args, **kwargs):
        try:
            updated_cart = remove_coupon_from_cart(request)
            message = _("Coupon removed successfully.")
            return Response(
                {'message': message, 'cart': CartSerializer(updated_cart, context={'request': request}).data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error removing coupon from cart via API: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'An unexpected error occurred while removing coupon: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
