# apps/orders/services.py
"""
Order Services
Business logic for order operations.
"""
from decimal import Decimal
from django.db import transaction
from django.utils import timezone

from .models import Order, OrderItem


class OrderService:
    """Service class for order operations."""
    
    @staticmethod
    @transaction.atomic
    def create_from_cart(user, data):
        """Create order from user's cart."""
        from apps.carts.models import Cart
        from apps.accounts.models import UserAddress
        from apps.shipping.models import ShippingMethod
        
        # Get active cart
        cart = Cart.objects.filter(
            user=user,
            is_active=True,
            checked_out=False
        ).first()
        
        if not cart or cart.is_empty:
            raise ValueError('Cart is empty')
        
        # Get addresses
        shipping_address = UserAddress.objects.get(pk=data['shipping_address_id'])
        billing_address = None
        if data.get('billing_address_id'):
            billing_address = UserAddress.objects.get(pk=data['billing_address_id'])
        
        # Get shipping method
        shipping_method = ShippingMethod.objects.get(pk=data['shipping_method_id'])
        
        # Create order
        order = Order.objects.create(
            user=user,
            email=user.email,
            phone=user.phone or '',
            shipping_address=OrderService._serialize_address(shipping_address),
            billing_address=OrderService._serialize_address(billing_address) if billing_address else None,
            shipping_method=shipping_method.name,
            subtotal=cart.subtotal,
            discount_amount=cart.discount_amount,
            shipping_cost=cart.shipping_cost,
            tax_amount=cart.tax_amount,
            total=cart.total,
            coupon_code=cart.coupon.code if cart.coupon else '',
            coupon_discount=cart.discount_amount,
            payment_method=data['payment_method'],
            customer_notes=data.get('customer_notes', '')
        )
        
        # Create order items
        for cart_item in cart.items.filter(saved_for_later=False):
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                vendor=cart_item.product.vendor,
                product_name=cart_item.product.name,
                product_sku=cart_item.variant.sku if cart_item.variant else cart_item.product.sku,
                product_image=cart_item.product.primary_image_url or '',
                variant_name=cart_item.variant.name if cart_item.variant else '',
                quantity=cart_item.quantity,
                unit_price=cart_item.price,
                total=cart_item.line_total
            )
            
            # Reduce inventory
            if cart_item.variant:
                cart_item.variant.stock -= cart_item.quantity
                cart_item.variant.save()
            else:
                cart_item.product.stock -= cart_item.quantity
                cart_item.product.save()
        
        # Mark cart as checked out
        cart.checked_out = True
        cart.checked_out_at = timezone.now()
        cart.is_active = False
        cart.save()
        
        return order
    
    @staticmethod
    def _serialize_address(address):
        """Serialize address for storage."""
        return {
            'name': address.name,
            'street_address': address.street_address,
            'apartment': address.apartment,
            'city': address.city,
            'state': address.state,
            'postal_code': address.postal_code,
            'country': str(address.country),
            'phone': address.phone or '',
        }
    
    @staticmethod
    def calculate_order_totals(order):
        """Recalculate order totals from items."""
        from django.db.models import Sum
        
        totals = order.items.aggregate(
            subtotal=Sum('total')
        )
        
        order.subtotal = totals['subtotal'] or Decimal('0.00')
        order.total = order.subtotal - order.discount_amount + order.shipping_cost + order.tax_amount
        order.save()
        
        return order
