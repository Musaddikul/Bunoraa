# custom_order/api_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.throttling import UserRateThrottle
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from django.http import HttpResponseRedirect
from django.urls import reverse
from decimal import Decimal, InvalidOperation # Import InvalidOperation

from .models import Category, SubCategory, FabricType, ColorOption, SizeOption, CustomOrder
from .serializers import (
    CategorySerializer, SubCategorySerializer,
    FabricTypeSerializer, ColorOptionSerializer,
    SizeOptionSerializer, CustomOrderCreateSerializer,
    CustomOrderSerializer
)
from promotions.services import CouponService # Use CouponService
from accounts.models import UserAddress
from accounts.api.serializers import UserAddressSerializer
import logging
from .services import calculate_base_price, calculate_vat, finalize_pricing, create_order_from_draft

logger = logging.getLogger(__name__)

class StandardThrottle(UserRateThrottle):
    """
    Standard throttle scope for API views.
    """
    scope = 'standard'

class CategoryListAPIView(generics.ListAPIView):
    """
    API view to list active categories.
    """
    throttle_classes = [StandardThrottle]
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(is_active=True).order_by('name')

class SubCategoryListAPIView(generics.ListAPIView):
    pagination_class = None
    """
    API view to list active subcategories for a given category.
    """
    throttle_classes = [StandardThrottle]
    serializer_class = SubCategorySerializer

    def get_queryset(self):
        """
        Returns a queryset of subcategories for a specific category.
        """
        category_id = self.kwargs['category_id']
        category = get_object_or_404(Category, pk=category_id, is_active=True)
        return SubCategory.objects.filter(category=category, is_active=True).order_by('name')

class FabricTypeListAPIView(generics.ListAPIView):
    """
    API view to list active fabric types.
    """
    throttle_classes = [StandardThrottle]
    serializer_class = FabricTypeSerializer
    queryset = FabricType.objects.filter(is_active=True).order_by('name')

class ColorOptionListAPIView(generics.ListAPIView):
    pagination_class = None
    """
    API view to list active color options.
    """
    throttle_classes = [StandardThrottle]
    serializer_class = ColorOptionSerializer
    queryset = ColorOption.objects.filter(is_active=True).order_by('name')

class SizeOptionListAPIView(generics.ListAPIView):
    pagination_class = None
    """
    API view to list active size options, optionally filtered by subcategory.
    """
    throttle_classes = [StandardThrottle]
    serializer_class = SizeOptionSerializer

    def get_queryset(self):
        """
        Returns a queryset of size options.
        """
        queryset = SizeOption.objects.filter(is_active=True)
        subcategory_id = self.request.query_params.get('subcategory_id')
        if subcategory_id:
            queryset = queryset.filter(subcategories__id=subcategory_id)
        return queryset.order_by('name')


class UserAddressListAPIView(generics.ListAPIView):
    """
    API view to list user's addresses.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]
    serializer_class = UserAddressSerializer

    def get_queryset(self):
        """
        Returns a queryset of addresses belonging to the authenticated user.
        """
        return UserAddress.objects.filter(user=self.request.user).order_by('-is_default', 'address_line1')

class CalculatePriceAPIView(APIView):
    """
    API view to calculate the price of a custom order based on selected options.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    def post(self, request):
        """
        Handles POST requests to calculate order price.
        """
        fabric_id = request.data.get('fabric_id')
        subcategory_id = request.data.get('subcategory_id')
        quantity = request.data.get('quantity')
        coupon_code = request.data.get('code')

        if not all([fabric_id, subcategory_id, quantity]):
            return Response(
                {'error': _('Fabric type, subcategory, and quantity are required for price calculation.')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            fabric_type = get_object_or_404(FabricType, pk=fabric_id)
            subcategory = get_object_or_404(SubCategory, pk=subcategory_id)

            # Create a temporary CustomOrder instance for price calculation
            # Note: This temp_order won't be saved, so no signals are triggered here.
            temp_order = CustomOrder(
                fabric_type=fabric_type,
                subcategory=subcategory,
                quantity=quantity,
                # Assign a dummy user for coupon validation if needed, or pass None
                user=request.user if request.user.is_authenticated else None
            )

            # Use calculation functions directly from services, not finalize_pricing
            base_price = calculate_base_price(temp_order)
            vat_amount = calculate_vat(base_price) 

            discount_amount = Decimal('0.00')
            if coupon_code and request.user.is_authenticated: # Only validate coupon if user is authenticated
                try:
                    coupon_obj = CouponService.validate_coupon(coupon_code, base_price, request.user)
                    discount_amount = CouponService.calculate_discount(base_price, coupon_obj)
                except ValidationError as e:
                    logger.warning(f"Coupon '{coupon_code}' validation failed during price calculation: {e.message}")
                except Exception as e:
                    logger.error(f"Error during coupon validation/calculation in price API: {str(e)}", exc_info=True)
            
            total_amount = (base_price + vat_amount - discount_amount).quantize(Decimal('0.01'))
            if total_amount < 0:
                total_amount = Decimal('0.00') 

            return Response({
                'base_price': str(base_price),
                'vat_amount': str(vat_amount),
                'discount_amount': str(discount_amount),
                'total_amount': str(total_amount),
            })

        except (FabricType.DoesNotExist, SubCategory.DoesNotExist):
            return Response(
                {'error': _('Invalid fabric type or subcategory selected.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error calculating price: {str(e)}", exc_info=True)
            return Response(
                {'error': _(f'Price calculation failed: {str(e)}')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CustomOrderCreateAPIView(generics.CreateAPIView):
    """
    API view for creating a CustomOrder.
    Handles order submission and initiates payment if an online method is selected.
    """
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderCreateSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Overrides perform_create to handle order finalization and payment initiation.
        The 'is_draft' and 'status' fields are now primarily managed by the pre_save signal.
        """
        order = serializer.save(user=self.request.user) # pre_save signal will set status and pricing fields
        logger.debug(f"API perform_create: Order {order.order_id} created by serializer. Initial DB status: {order.status}, is_draft: {order.is_draft}")

        if not order.is_draft: # Only finalize if it's not a draft
            logger.info(f"API perform_create: Order {order.order_id} is NOT a draft. Proceeding with finalization (create_order_from_draft).")
            try:
                # create_order_from_draft will re-run finalize_pricing (which saves the order)
                # and handle payment/shipment creation.
                updated_order, payment_intent_details = create_order_from_draft(order, self.request.user)
                logger.debug(f"API perform_create: After create_order_from_draft, order {updated_order.order_id} has status: {updated_order.status}, is_draft: {updated_order.is_draft}")

                serializer.instance.payment_intent_id = payment_intent_details.get('payment_intent_id') if payment_intent_details else None
                serializer.instance.client_secret = payment_intent_details.get('client_secret') if payment_intent_details else None
                serializer.instance.payment_redirect_url = payment_intent_details.get('redirect_url') if payment_intent_details else None

                if serializer.instance.payment_redirect_url:
                    raise PaymentRedirectException(serializer.instance.payment_redirect_url)

            except PaymentRedirectException as e:
                raise e
            except ValidationError as e:
                logger.error(f"API perform_create: Validation error during order creation/payment initiation for order {order.order_id}: {e.message}")
                order.status = CustomOrder.Status.REJECTED
                order.is_draft = False
                order.save(update_fields=['status', 'is_draft']) # Save explicit state on error
                raise serializers.ValidationError({'detail': e.message})
            except Exception as e:
                logger.critical(f"API perform_create: Critical error during order creation/payment initiation for order {order.order_id}: {str(e)}", exc_info=True)
                order.status = CustomOrder.Status.REJECTED
                order.is_draft = False
                order.save(update_fields=['status', 'is_draft']) # Save explicit state on error
                raise serializers.ValidationError({'detail': _(f"An unexpected error occurred during order submission: {str(e)}")})
        else:
            logger.info(f"API perform_create: Order {order.order_id} is a DRAFT. Skipping finalization. Status: {order.status}, Is Draft: {order.is_draft}")


    def create(self, request, *args, **kwargs):
        """
        Overrides the default create method to handle PaymentRedirectException.
        """
        try:
            return super().create(request, *args, **kwargs)
        except PaymentRedirectException as e:
            return Response(
                {'redirect_url': e.redirect_url},
                status=status.HTTP_303_SEE_OTHER,
                headers={'Location': e.redirect_url}
            )

class CustomOrderDetailAPIView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a single CustomOrder.
    """
    queryset = CustomOrder.objects.all().select_related(
        'user', 'category', 'subcategory', 'fabric_type',
        'size_option', 'color_option', 'shipping_address',
        'shipping_method', 'payment_method', 'coupon'
    ).prefetch_related(
        'design_images', 'customer_item_images', 'status_updates'
    )
    serializer_class = CustomOrderSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]
    lookup_field = 'order_id'

    def get_queryset(self):
        """
        Filters orders to only show those belonging to the requesting user,
        or all if the user is a staff member.
        """
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=self.request.user)

class CustomOrderUpdateAPIView(generics.UpdateAPIView):
    """
    API view to update a CustomOrder.
    Limited fields can be updated, typically for draft orders or specific status changes.
    """
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderCreateSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [StandardThrottle]
    lookup_field = 'order_id'

    def get_queryset(self):
        """
        Filters orders to only allow updating by the owner or staff.
        Typically, only draft orders should be fully editable by the user.
        """
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=self.request.user, is_draft=True)

    @transaction.atomic
    def perform_update(self, serializer):
        """
        Overrides perform_update to handle order finalization if status changes from draft.
        The 'is_draft' and 'status' fields are now primarily managed by the pre_save signal.
        """
        instance = self.get_object()
        was_draft = instance.is_draft # Get original state before serializer.save()

        serializer.save() # pre_save signal will set status and pricing fields
        logger.debug(f"API perform_update: Order {instance.order_id} updated by serializer. is_draft received: {serializer.instance.is_draft}, old_is_draft: {was_draft}, current DB status: {serializer.instance.status}")


        # If it was a draft and now it's not, trigger finalization
        if was_draft and not serializer.instance.is_draft:
            logger.info(f"API perform_update: Order {instance.order_id} transitioned from draft to non-draft. Proceeding with finalization.")
            try:
                updated_order, payment_intent_details = create_order_from_draft(serializer.instance, self.request.user)
                logger.debug(f"API perform_update: After create_order_from_draft, order {updated_order.order_id} has status: {updated_order.status}, is_draft: {updated_order.is_draft}")


                serializer.instance.payment_intent_id = payment_intent_details.get('payment_intent_id') if payment_intent_details else None
                serializer.instance.client_secret = payment_intent_details.get('client_secret') if payment_intent_details else None
                serializer.instance.payment_redirect_url = payment_intent_details.get('redirect_url') if payment_intent_details else None

                if serializer.instance.payment_redirect_url:
                    raise PaymentRedirectException(serializer.instance.payment_redirect_url)

            except PaymentRedirectException as e:
                raise e
            except ValidationError as e:
                logger.error(f"API perform_update: Validation error during order update/payment initiation for order {instance.order_id}: {e.message}")
                instance.status = CustomOrder.Status.REJECTED
                instance.is_draft = False
                instance.save(update_fields=['status', 'is_draft']) # Save explicit state on error
                raise serializers.ValidationError({'detail': e.message})
            except Exception as e:
                logger.critical(f"API perform_update: Critical error during order update/payment initiation for order {instance.order_id}: {str(e)}", exc_info=True)
                instance.status = CustomOrder.Status.REJECTED
                instance.is_draft = False
                instance.save(update_fields=['status', 'is_draft']) # Save explicit state on error
                raise serializers.ValidationError({'detail': _(f"An unexpected error occurred during order update: {str(e)}")})

    def update(self, request, *args, **kwargs):
        """
        Overrides the default update method to handle PaymentRedirectException.
        """
        try:
            return super().update(request, *args, **kwargs)
        except PaymentRedirectException as e:
            return Response(
                {'redirect_url': e.redirect_url},
                status=status.HTTP_303_SEE_OTHER,
                headers={'Location': e.redirect_url}
            )

class PaymentRedirectException(Exception):
    """
    Custom exception to signal a payment redirect is needed from an API view.
    """
    def __init__(self, redirect_url):
        self.redirect_url = redirect_url
        super().__init__(f"Payment requires redirect to: {redirect_url}")
