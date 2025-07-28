# orders/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import FormView
from django.views.generic import TemplateView, ListView
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.urls import reverse_lazy
from django.db import transaction
from django.contrib.staticfiles.storage import staticfiles_storage

import json
import logging
import os
from django.conf import settings

from .forms import OrderCreateForm
from .serializers import CheckoutSerializer, OrderSerializer
from .services import OrderService
from cart.selectors import get_user_cart, get_active_cart_items
from cart.services import get_tax_configuration
from cart.models import Cart
from .models import Order
from products.models import Product
from products.api.serializers import ProductSerializer
from django.core.exceptions import PermissionDenied, ValidationError

# Initialize logger for this module
logger = logging.getLogger(__name__)

class CheckoutView(FormView):
    """
    Handles the display and initial processing of the checkout page.
    This is a Django FormView, rendering an HTML template.
    """
    template_name = 'orders/checkout.html'
    form_class = OrderCreateForm
    success_url = reverse_lazy('orders:checkout') # Redirect back to checkout or a success page
    login_url = '/accounts/login/' # Ensure this is correct for your project

    def dispatch(self, request, *args, **kwargs):
        """
        Ensures the user is authenticated and the cart is not empty before proceeding to checkout.
        """
        if not request.user.is_authenticated:
            messages.info(request, "Please log in to proceed to checkout.")
            return redirect(self.login_url) # Use the defined login_url

        # Fetch the cart here to ensure it's available for the empty check
        # and to avoid re-fetching in get_context_data if not needed.
        cart = get_user_cart(request)

        if not cart.items.exists():
            messages.warning(request, "Your cart is empty! Please add items before checking out.")
            return redirect('products:all_products') # Redirect to a product listing page
        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        """
        Passes the current user to the form for queryset filtering (e.g., user addresses).
        """
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, **kwargs):
        """
        Adds context data required for the checkout page, including cart items,
        shipping information, and geographical data (divisions, districts, upazilas).
        """
        context = super().get_context_data(**kwargs)
        
        # Fetch cart data - Pass self.request directly
        cart = get_user_cart(self.request)
        logger.debug(f"CheckoutView: Cart {cart.id} retrieved. Coupon: {cart.coupon.code if cart.coupon else 'None'}, Shipping Method: {cart.shipping_method.name if cart.shipping_method else 'None'}")
        
        # Access cart data using its properties/methods
        active_cart_items = get_active_cart_items(cart) # Use the selector to get active items
        
        # Convert QuerySet of CartItem objects to a list of dictionaries for JSON serialization
        # Ensure proper access to product details via item.product
        cart_items_for_json = []
        for item in active_cart_items:
            if item.product:
                # Use ProductSerializer to get all product details, including the image URL
                product_data = ProductSerializer(item.product, context={'request': self.request}).data
                
                cart_items_for_json.append({
                    'id': str(item.id),
                    'product_id': str(item.product.id),
                    'name': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.price),
                    'discounted_price': float(item.product.current_price) if hasattr(item.product, 'current_price') else float(item.price),
                    'subtotal': float(item.total_price),
                    'product': product_data, # Include the full serialized product data
                })
            else:
                logger.warning(f"CartItem {item.id} has no associated product. Skipping for JSON serialization.")


        context['cart_items_json'] = json.dumps(cart_items_for_json)
        context['subtotal'] = float(cart.total_price)
        context['vat'] = float(cart.get_tax_amount())
        tax_config = get_tax_configuration()
        context['tax_rate'] = float(tax_config['rate']) if tax_config else 0.0
        context['shipping'] = float(cart.get_shipping_cost())
        context['discount'] = float(cart.get_discount_amount())
        context['selected_shipping_method_id'] = cart.shipping_method.id if cart.shipping_method else None

        # Load geographical data (divisions, districts, upazilas)
        data_path = os.path.join(settings.BASE_DIR, 'static', 'data')

        try:
            with open(os.path.join(data_path, 'bd-divisions.json'), encoding='utf-8') as f:
                divisions_data = json.load(f)
                context['divisions_json'] = json.dumps(divisions_data.get('divisions', []))
        except FileNotFoundError:
            logger.error("bd-divisions.json not found at %s", os.path.join(data_path, 'bd-divisions.json'))
            context['divisions_json'] = json.dumps([])
        except json.JSONDecodeError:
            logger.error("Error decoding bd-divisions.json")
            context['divisions_json'] = json.dumps([])

        try:
            with open(os.path.join(data_path, 'bd-districts.json'), encoding='utf-8') as f:
                districts_data = json.load(f)
                context['districts_json'] = json.dumps(districts_data.get('districts', []))
        except FileNotFoundError:
            logger.error("bd-districts.json not found at %s", os.path.join(data_path, 'bd-districts.json'))
            context['districts_json'] = json.dumps([])
        except json.JSONDecodeError:
            logger.error("Error decoding bd-districts.json")
            context['districts_json'] = json.dumps([])

        try:
            with open(os.path.join(data_path, 'bd-upazilas.json'), encoding='utf-8') as f:
                upazilas_data = json.load(f)
                context['upazilas_json'] = json.dumps(upazilas_data.get('upazilas', []))
        except FileNotFoundError:
            logger.error("bd-upazilas.json not found at %s", os.path.join(data_path, 'bd-upazilas.json'))
            context['upazilas_json'] = json.dumps([])
        except json.JSONDecodeError:
            logger.error("Error decoding bd-upazilas.json")
            context['upazilas_json'] = json.dumps([])
                
        return context

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cancel_order_api(request, order_id):
    """
    API endpoint to cancel an order.
    Requires authentication and appropriate permissions.
    """
    logger.info(f"Received order cancellation request for order {order_id} from user {request.user.id}")
    try:
        order = OrderService.cancel_order(order_id, request.user)

        # Trigger post-order actions (e.g., send confirmation email)
        from .tasks import send_email_task
        logger.info(f"Attempting to dispatch cancellation email task for order {order.id}")
        send_email_task.delay(order.id, 'cancellation')

        return Response(
            {
                "status": "success",
                "message": f"Order {order.order_number} cancelled successfully!",
                "order_id": str(order.id),
                "order_number": order.order_number,
                "new_status": order.status.name
            },
            status=status.HTTP_200_OK
        )
    except (ValueError, PermissionDenied) as e:
        logger.warning(f"Order cancellation failed for order {order_id} for user {request.user.id}: {e}")
        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"An unexpected error occurred during order cancellation for order {order_id} for user {request.user.id}.")
        return Response(
            {
                "status": "error",
                "message": "An unexpected error occurred during cancellation. Please try again later.",
                "detail": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    API endpoint to create an order from checkout data.
    Requires authentication. Handles data validation, order creation via service,
    and provides structured JSON responses for success or failure.
    """
    logger.info(f"Received order creation request from user {request.user.id}")

    # Add user_id to request data for serializer validation
    request.data['user_id'] = request.user.id

    serializer = CheckoutSerializer(data=request.data)

    try:
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            payment_method_id = serializer.validated_data.pop('payment_method_id')

            from payments.models import Payment, PaymentMethod
            from decimal import Decimal

            try:
                payment_method = payment_method_id  # Assign the object directly
                payment = Payment.objects.create(
                    user=request.user,
                    method=payment_method,
                    amount=Decimal(str(serializer.validated_data['total'])), # Use total from validated data
                    currency='BDT', # Assuming BDT as default currency
                    status='pending' # Initial status
                )
                serializer.validated_data['payment'] = payment # Add payment object to validated data
            except PaymentMethod.DoesNotExist:
                logger.error(f"Payment method with ID {payment_method_id} not found.")
                return Response(
                    {
                        "status": "error",
                        "message": "Invalid payment method selected."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.exception(f"Error creating Payment object for user {request.user.id}.")
                return Response(
                    {
                        "status": "error",
                        "message": "An error occurred while processing payment information.",
                        "detail": str(e)
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            order = OrderService.create_order_from_checkout(serializer.validated_data)
            
            if order is None:
                logger.error(f"OrderService.create_order_from_checkout returned None for user {request.user.id}. Check service logs.")
                return Response(
                    {
                        "status": "error",
                        "message": "Order creation failed due to an internal service error. Please try again.",
                        "detail": "Order service returned None."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            logger.info(f"Order {order.order_number} created successfully for user {request.user.id}")
            
            # Trigger post-order actions (e.g., send confirmation email)
            from .tasks import send_email_task
            logger.info(f"Attempting to dispatch confirmation email task for order {order.id}")
            send_email_task.delay(order.id, 'confirmation')

            return Response(
                {
                    "status": "success",
                    "message": "Order placed successfully!",
                    "order_id": str(order.id),
                    "order_number": order.order_number,
                    "redirect_url": reverse_lazy('orders:success', kwargs={'order_id': order.id})
                },
                status=status.HTTP_201_CREATED
            )

    except serializers.ValidationError as e:
        logger.warning(f"Order creation failed due to validation errors for user {request.user.id}: {e.detail}")
        return Response(
            {
                "status": "error",
                "message": "Validation failed. Please check your input.",
                "errors": e.detail
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    except ValidationError as e:
        logger.warning(f"Order creation failed due to service validation error for user {request.user.id}: {e}")
        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"An unexpected error occurred during order creation for user {request.user.id}.")
        return Response(
            {
                "status": "error",
                "message": "An unexpected error occurred. Please try again later.",
                "detail": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Example success view for redirection after order creation
class OrderSuccessView(TemplateView):
    """
    Displays a success page after an order has been placed.
    Retrieves and displays order details to the user.
    """
    template_name = 'orders/order_success.html'

    def get_context_data(self, **kwargs):
        """
        Adds the order object to the context for display on the success page.
        Ensures the order belongs to the current user.
        """
        context = super().get_context_data(**kwargs)
        order_id = self.kwargs.get('order_id')
        # Ensure the order belongs to the authenticated user for security
        order = get_object_or_404(Order, id=order_id, user=self.request.user)
        context['order'] = order
        return context

class OrderDetailView(TemplateView):
    """
    Displays details of a specific order.
    Requires authentication and ensures the order belongs to the current user.
    """
    template_name = 'orders/order_detail.html' # You'll need to create this template

    def dispatch(self, request, *args, **kwargs):
        """
        Ensures the user is authenticated before allowing access to order details.
        """
        if not request.user.is_authenticated:
            messages.info(request, "Please log in to view order details.")
            return redirect(reverse_lazy('login_url')) # Redirect to your login URL
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        """
        Adds the specific order object to the context.
        """
        context = super().get_context_data(**kwargs)
        order_id = self.kwargs.get('order_id') # Assuming URL pattern captures 'order_id'
        
        # Fetch the order and ensure it belongs to the current user for security
        order = get_object_or_404(Order, id=order_id, user=self.request.user)
        context['order'] = order
        return context

class OrderListView(ListView):
    model = Order
    template_name = 'orders/order_list.html'
    context_object_name = 'orders'
    paginate_by = 10

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).order_by('-created_at')
        return Order.objects.none()
