# apps/orders/services.py
"""
Order service layer for business logic.
"""
from decimal import Decimal
from django.db import transaction
from django.utils import timezone

from .models import Order, OrderItem, OrderStatusHistory


class OrderService:
    """Service class for order operations."""
    
    @classmethod
    @transaction.atomic
    def create_order_from_cart(cls, cart, checkout_data):
        """
        Create an order from a cart.
        Returns the created order.
        """
        shipping = checkout_data['shipping_address']
        billing = checkout_data.get('billing_address', {})
        
        # Calculate totals
        subtotal = cart.subtotal
        discount_amount = cart.discount_amount
        shipping_cost = cls.calculate_shipping_cost(
            checkout_data.get('shipping_method', 'standard'),
            subtotal
        )
        tax_amount = cls.calculate_tax(subtotal - discount_amount, shipping)
        total = subtotal - discount_amount + shipping_cost + tax_amount
        
        # Create order
        order = Order.objects.create(
            user=cart.user,
            email=checkout_data['email'],
            phone=checkout_data.get('phone', ''),
            
            # Shipping address
            shipping_first_name=shipping['first_name'],
            shipping_last_name=shipping['last_name'],
            shipping_address_line1=shipping['address_line1'],
            shipping_address_line2=shipping.get('address_line2', ''),
            shipping_city=shipping['city'],
            shipping_state=shipping['state'],
            shipping_postal_code=shipping['postal_code'],
            shipping_country=shipping.get('country', 'US'),
            
            # Billing address
            billing_same_as_shipping=billing.get('same_as_shipping', True),
            billing_first_name=billing.get('first_name', ''),
            billing_last_name=billing.get('last_name', ''),
            billing_address_line1=billing.get('address_line1', ''),
            billing_address_line2=billing.get('address_line2', ''),
            billing_city=billing.get('city', ''),
            billing_state=billing.get('state', ''),
            billing_postal_code=billing.get('postal_code', ''),
            billing_country=billing.get('country', ''),
            
            # Totals
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total=total,
            
            # Coupon
            coupon=cart.coupon,
            coupon_code=cart.coupon.code if cart.coupon else '',
            
            # Shipping & Payment
            shipping_method=checkout_data.get('shipping_method', 'standard'),
            payment_method=checkout_data.get('payment_method', 'stripe'),
            customer_notes=checkout_data.get('customer_notes', ''),
        )
        
        # Create order items from cart items
        for cart_item in cart.items.select_related('product', 'variant'):
            product = cart_item.product
            variant = cart_item.variant
            
            # Get image URL
            product_image = ''
            if product.images.exists():
                product_image = product.images.first().image.url
            
            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                product_name=product.name,
                product_sku=product.sku,
                variant_name=variant.name if variant else '',
                product_image=product_image,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                original_price=product.price,
                discount_amount=product.price - cart_item.unit_price
            )
        
        # Log status
        cls.log_status_change(order, '', Order.Status.PENDING, 'Order created')
        
        # Clear the cart
        cart.clear()
        cart.coupon = None
        cart.save()
        
        return order
    
    @classmethod
    def calculate_shipping_cost(cls, method, subtotal):
        """Calculate shipping cost based on method and subtotal."""
        # TODO: Implement actual shipping calculation
        shipping_rates = {
            'standard': Decimal('5.99'),
            'express': Decimal('12.99'),
            'overnight': Decimal('24.99'),
            'free': Decimal('0.00'),
        }
        
        # Free shipping over $100
        if subtotal >= Decimal('100.00'):
            return Decimal('0.00')
        
        return shipping_rates.get(method, Decimal('5.99'))
    
    @classmethod
    def calculate_tax(cls, amount, shipping_address):
        """Calculate tax based on shipping address."""
        # TODO: Implement actual tax calculation (integrate with tax service)
        # For now, use a simple 8% tax rate
        tax_rate = Decimal('0.08')
        return (amount * tax_rate).quantize(Decimal('0.01'))
    
    @classmethod
    def log_status_change(cls, order, old_status, new_status, notes='', user=None):
        """Log order status change."""
        OrderStatusHistory.objects.create(
            order=order,
            old_status=old_status,
            new_status=new_status,
            notes=notes,
            changed_by=user
        )
    
    @classmethod
    @transaction.atomic
    def update_order_status(cls, order, new_status, notes='', user=None):
        """Update order status with history logging."""
        old_status = order.status
        order.status = new_status
        
        # Update timestamp based on status
        if new_status == Order.Status.SHIPPED:
            order.shipped_at = timezone.now()
        elif new_status == Order.Status.DELIVERED:
            order.delivered_at = timezone.now()
        elif new_status == Order.Status.CANCELLED:
            order.cancelled_at = timezone.now()
        
        order.save()
        
        cls.log_status_change(order, old_status, new_status, notes, user)
        
        return order
    
    @classmethod
    @transaction.atomic
    def cancel_order(cls, order, reason='', user=None):
        """
        Cancel an order.
        Returns tuple (success, message).
        """
        if not order.can_cancel():
            return False, 'Order cannot be cancelled at this stage'
        
        old_status = order.status
        order.status = Order.Status.CANCELLED
        order.cancelled_at = timezone.now()
        
        if reason:
            order.admin_notes = f'{order.admin_notes}\nCancellation: {reason}'.strip()
        
        order.save()
        
        # Log status change
        cls.log_status_change(
            order, old_status, Order.Status.CANCELLED,
            f'Order cancelled. Reason: {reason}' if reason else 'Order cancelled',
            user
        )
        
        # TODO: Restore stock if payment was not completed
        # TODO: Trigger refund if payment was completed
        
        return True, 'Order cancelled successfully'
    
    @classmethod
    def mark_as_paid(cls, order, payment_intent_id='', user=None):
        """Mark order as paid."""
        old_payment_status = order.payment_status
        
        order.payment_status = Order.PaymentStatus.PAID
        order.paid_at = timezone.now()
        order.status = Order.Status.CONFIRMED
        
        if payment_intent_id:
            order.payment_intent_id = payment_intent_id
        
        order.save()
        
        cls.log_status_change(
            order, Order.Status.PENDING, Order.Status.CONFIRMED,
            'Payment received', user
        )
        
        return order
    
    @classmethod
    def add_tracking(cls, order, tracking_number, tracking_url='', carrier=''):
        """Add tracking information to order."""
        order.tracking_number = tracking_number
        if tracking_url:
            order.tracking_url = tracking_url
        if carrier:
            order.shipping_method = carrier
        
        # If not already shipped, mark as shipped
        if order.status != Order.Status.SHIPPED:
            old_status = order.status
            order.status = Order.Status.SHIPPED
            order.shipped_at = timezone.now()
            
            cls.log_status_change(
                order, old_status, Order.Status.SHIPPED,
                f'Shipped via {carrier}. Tracking: {tracking_number}'
            )
        
        order.save()
        return order
    
    @classmethod
    def get_order_summary(cls, order):
        """Get order summary for emails/display."""
        return {
            'order_number': order.order_number,
            'status': order.get_status_display(),
            'payment_status': order.get_payment_status_display(),
            'email': order.email,
            'shipping_address': {
                'name': order.shipping_full_name,
                'address': order.shipping_full_address,
            },
            'items': [
                {
                    'name': item.product_name,
                    'variant': item.variant_name,
                    'quantity': item.quantity,
                    'price': str(item.unit_price),
                    'total': str(item.line_total),
                }
                for item in order.items.all()
            ],
            'subtotal': str(order.subtotal),
            'discount': str(order.discount_amount),
            'shipping': str(order.shipping_cost),
            'tax': str(order.tax_amount),
            'total': str(order.total),
            'coupon_code': order.coupon_code,
            'tracking_number': order.tracking_number,
            'tracking_url': order.tracking_url,
        }
