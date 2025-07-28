# promotions/api/views.py
from decimal import Decimal
import logging
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.utils.decorators import method_decorator

from ..models import Coupon
from ..serializers import CouponSerializer
from ..services import CouponService # Import the service class directly


logger = logging.getLogger(__name__)

class CouponListAPIView(generics.ListAPIView):
    """
    API view to list all active and currently valid coupons.
    Accessible by any user (AllowAny).
    """
    queryset = Coupon.objects.filter(
        is_active=True,
        valid_from__lte=timezone.now()
    ).filter(
        Q(valid_until__gte=timezone.now()) | Q(valid_until__isnull=True)
    ).order_by('-created_at')
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]

class CouponDetailAPIView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a specific coupon by its code.
    Accessible by any user (AllowAny).
    """
    queryset = Coupon.objects.filter(
        is_active=True,
        valid_from__lte=timezone.now()
    ).filter(
        Q(valid_until__gte=timezone.now()) | Q(valid_until__isnull=True)
    )
    serializer_class = CouponSerializer
    lookup_field = 'code' # Use 'code' field for lookup instead of 'pk'
    permission_classes = [AllowAny]

class ApplyCouponAPIView(APIView):
    """
    API view to apply a coupon to a target amount (e.g., cart total, order total).
    This endpoint validates the coupon and calculates the discount.
    It does NOT mark the coupon as used; that responsibility lies with the
    consuming application (e.g., Order creation/payment success logic).
    """
    permission_classes = [AllowAny] # Can be changed to IsAuthenticated for logged-in users only
    http_method_names = ['post', 'delete', 'options'] # Allow POST for application, DELETE for removal, OPTIONS for preflight requests

    def post(self, request, *args, **kwargs):
        """
        Handles the POST request to apply a coupon.
        Expects 'code' and 'target_amount' in the request data.
        """
        try:
            data = request.data

            code = data.get('code')
            # target_amount_str = data.get('target_amount') # No longer needed here, handled by cart service
            # user = request.user if request.user.is_authenticated else None # No longer needed here, handled by cart service

            # Input validation
            if not code:
                logger.error("Coupon application failed: 'code' is missing.")
                return Response(
                    {"detail": "Coupon code is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # The target_amount validation is now handled within cart.services.apply_coupon_to_cart
            # try:
            #     target_amount = Decimal(str(target_amount_str))
            #     if target_amount < 0:
            #         raise ValueError("Target amount cannot be negative.")
            # except (TypeError, ValueError, InvalidOperation) as e:
            #     logger.error(f"Coupon application failed: Invalid target amount '{target_amount_str}'. Error: {e}")
            #     return Response(
            #         {"detail": "Invalid target amount provided. Must be a positive number."},
            #         status=status.HTTP_400_BAD_REQUEST
            # )

            target_amount_str = data.get('target_amount')
            if not target_amount_str:
                logger.error("Coupon application failed: 'target_amount' is missing.")
                return Response(
                    {"detail": "Target amount is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                target_amount = Decimal(str(target_amount_str))
                if target_amount < 0:
                    raise ValueError("Target amount cannot be negative.")
            except (TypeError, ValueError) as e:
                logger.error(f"Coupon application failed: Invalid target amount '{target_amount_str}'. Error: {e}")
                return Response(
                    {"detail": "Invalid target amount provided. Must be a positive number."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = request.user if request.user.is_authenticated else None
            
            coupon_application_result = CouponService.apply_coupon(
                code=code,
                target_amount=target_amount,
                user=user
            )

            response_data = {
                "status": "success",
                "message": "Coupon applied successfully.",
                "discount_amount": str(coupon_application_result['discount_amount']),
                "new_total": str(coupon_application_result['new_total']),
                "coupon_code": code # Optionally return the applied coupon code
            }

            logger.info(f"Coupon '{code}' successfully applied for user '{request.user.id if request.user.is_authenticated else 'anonymous'}'.")
            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            # Handle business logic validation errors from CouponService
            logger.warning(f"Coupon application failed due to validation error: {e.message}")
            return Response(
                {"status": "error", "detail": e.message}, # ValidationError has a 'message' attribute
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Catch any unexpected errors
            logger.exception(f"An unexpected error occurred while applying coupon: {str(e)}")
            return Response(
                {"status": "error", "detail": "An internal server error occurred while applying coupon. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to remove a coupon.
        """
        try:
            from cart.serializers import CartSerializer
            from cart.services import remove_coupon_from_cart as cart_remove_coupon

            updated_cart = cart_remove_coupon(request)

            response_data = {
                "status": "success",
                "message": "Coupon removed successfully."
            }
            logger.info(f"Coupon removed for user '{request.user.id if request.user.is_authenticated else 'anonymous'}'.")
            return Response(response_data, status=status.HTTP_200_OK)
            logger.info(f"Coupon removed for user '{request.user.id if request.user.is_authenticated else 'anonymous'}'.")
            return Response(response_data, status=status.HTTP_200_OK)
        except ValidationError as e:
            logger.warning(f"Coupon removal failed due to validation error: {e.message}")
            return Response(
                {"status": "error", "detail": e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception(f"An unexpected error occurred while removing coupon: {str(e)}")
            return Response(
                {"status": "error", "detail": "An internal server error occurred while removing coupon. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def options(self, request, *args, **kwargs):
        """
        Handles preflight requests for CORS.
        """
        response = Response(status=status.HTTP_200_OK)
        response['Access-Control-Allow-Origin'] = '*' # Adjust this to your frontend domain in production
        response['Access-Control-Allow-Methods'] = 'POST, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRFToken' # Include Authorization if using tokens
        response['Access-Control-Max-Age'] = '86400' # Cache preflight response for 24 hours
        logger.debug("Handled CORS OPTIONS request.")
        return response

