# orders/services.py
from django.db import transaction
from django.core.exceptions import ValidationError, PermissionDenied # Import ValidationError and PermissionDenied
from .models import Order, OrderItem, OrderStatus
from products.models import Product
from payments.models import Payment, PaymentMethod
from shipping.models import ShippingCarrier
from accounts.models import UserAddress
from .tasks import send_email_task, generate_invoice_task
from decimal import Decimal
from shipping.services import calculate_shipping_cost
from promotions.services import CouponService
import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_order_confirmation(order_id):
        send_email_task.delay(order_id,'confirmation')

    @staticmethod
    def send_order_shipped(order_id):
        send_email_task.delay(order_id,'shipped')

    @staticmethod
    def send_order_cancellation(order_id, reason=None):
        send_email_task.delay(order_id,'cancellation',reason)

class OrderService:
    @staticmethod
    def generate_invoice(order_id):
        generate_invoice_task.delay(order_id)

    @staticmethod
    @transaction.atomic
    def create_order_from_checkout(validated_data):
        """
        Creates a new order from validated checkout data.
        Handles creation of Order, and OrderItems.
        """
        user              = validated_data['user_id'] # This is now the User object
        address           = validated_data['address_id'] # This is now the UserAddress object
        shipping_carrier  = validated_data['shipping_carrier_id'] # This is now the ShippingCarrier object
        shipping_method   = validated_data['shipping_method_id'] # This is now the ShippingMethod object
        payment           = validated_data['payment'] # This is now the Payment object
        cart_items        = validated_data['items'] # List of dictionaries, each with Product object
        total             = validated_data['total']
        discount_amount   = validated_data.get('discount', Decimal('0.00'))
        tax_amount        = validated_data.get('tax', Decimal('0.00'))
        promo_code        = validated_data.get('promo_code', '') # Get promo code

        if not user.email:
            raise ValidationError("User email is required to place an order.")

        initial_status, created = OrderStatus.objects.get_or_create(name__iexact='Pending', defaults={'name': 'Pending', 'description': 'Order has been placed and is awaiting processing.'})
        cancelled_status, created = OrderStatus.objects.get_or_create(name__iexact='Cancelled', defaults={'name': 'Cancelled', 'description': 'Order has been cancelled by the user or admin.'})

        # 1. Apply promo code and calculate final discount if not already done
        # This is important if the discount on the cart_items is not the final discount
        # For simplicity, we'll assume the 'discount_amount' passed is the final one
        # derived from the cart/coupon logic on the frontend.
        # If you need to re-apply coupon logic here, you would do it like this:
        if promo_code:
            try:
                coupon = CouponService.validate_coupon(promo_code, total, user)
                discount_amount = CouponService.calculate_discount(total, coupon)
            except ValidationError:
                discount_amount = Decimal('0.00') # Invalid coupon, no discount

        
        
        total_weight_kg = sum((item['product_id'].weight or 0) * item['quantity'] for item in cart_items if hasattr(item['product_id'], 'weight'))

        try:
            delivery_charge = calculate_shipping_cost(
                shipping_method=shipping_method,
                address=address,
                weight_kg=Decimal(str(total_weight_kg)),
                order_total=total,
                is_express=False
            )
        except Exception as e:
            logger.error(f"Failed to calculate shipping cost: {e}", exc_info=True)
            delivery_charge = Decimal('0.00')


        # 3. Create the Order
        logger.debug(f"Creating order for user: {user.id}, email: {user.email}")
        order = Order.objects.create(
            user                = user,
            address             = address,
            payment             = payment, # Link the created Payment object
            shipping_carrier    = shipping_carrier,
            shipping_method     = shipping_method,
            shipping_method_name= shipping_method.name, # Use shipping_method.name
            status              = initial_status,
            order_note          = validated_data.get('order_note',''),
            delivery_charge     = delivery_charge,
            tax                 = tax_amount,
            discount            = discount_amount,
            # total is a calculated property, do not assign here
            # grand_total will be calculated automatically by Order model's property
        )

        # 4. Create Order Items
        for item_data in cart_items:
            prod = item_data['product_id'] # This is already the Product object from serializer validation
            OrderItem.objects.create(
                order        = order,
                product      = prod,
                product_name = prod.name, # Use product object's name
                product_sku  = getattr(prod,'sku', ''), # Safely get SKU
                price        = item_data['price'],
                quantity     = item_data['quantity'],
                discount     = item_data.get('discount', Decimal('0.00'))
            )
            # Optionally, reduce product stock here
            if prod.stock < item_data['quantity']:
                raise ValidationError(f"Insufficient stock for product {prod.name}. Available: {prod.stock}, Ordered: {item_data['quantity']}")
            prod.stock -= item_data['quantity']
            prod.save(update_fields=['stock'])

        # After successful order creation, clear the user's cart
        from cart.models import Cart # Import Cart model here to avoid circular dependency
        try:
            user_cart = Cart.objects.get(user=user, checked_out=False)
            user_cart.mark_checked_out() # Marks cart as checked out and converted
            user_cart.clear_cart() # Clear items from the cart after successful order
        except Cart.DoesNotExist:
            logger.warning(f"Active cart not found for user {user.id} after order creation.")
        
        # Recalculate grand_total after all items are added and delivery_charge is set
        
        order.save()

        return order

    @staticmethod
    @transaction.atomic
    def cancel_order(order_id, user):
        """
        Cancels an order, restocks inventory, and processes a refund (placeholder).
        """
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise ValueError("Order not found.")

        # Permission check: Only the order owner or staff can cancel
        if not user.is_staff and order.user != user:
            raise PermissionDenied("You do not have permission to cancel this order.")

        # Check if the order can be cancelled
        if not order.can_be_cancelled():
            raise ValueError(f"Order {order.order_number} cannot be cancelled in its current status: {order.status.name}.")

        # Restock inventory
        for item in order.items.all():
            product = item.product
            if product:
                product.stock += item.quantity
                product.save()
                logger.info(f"Restocked {item.quantity} of product {product.name} (SKU: {product.sku}) for order {order.order_number}.")

        # Process refund (placeholder for actual payment gateway integration)
        if order.payment and order.payment.status == 'completed':
            logger.info(f"Initiating refund for order {order.order_number} (Payment ID: {order.payment.id}).")
            # In a real application, you would integrate with your payment gateway here
            # Example: payment_gateway.process_refund(order.payment.transaction_id, order.grand_total)
            order.payment.status = 'refunded'
            order.payment.save()
            logger.info(f"Payment {order.payment.id} status updated to 'refunded' for order {order.order_number}.")
        else:
            logger.info(f"No refund needed for order {order.order_number} as payment status is {order.payment.status if order.payment else 'N/A'}.")

        # Update order status to 'Cancelled'
        cancelled_status = OrderStatus.objects.get(name__iexact='Cancelled')
        order.status = cancelled_status
        order.save()
        logger.info(f"Order {order.order_number} successfully cancelled by user {user.id}.")

        return order
