"""
Orders services
"""
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from django.conf import settings

from .models import Order, OrderItem, OrderStatusHistory


class OrderService:
    """Service for order operations."""
    
    @staticmethod
    @transaction.atomic
    def create_order_from_checkout(checkout_session):
        """
        Create order from completed checkout session.
        
        Args:
            checkout_session: CheckoutSession instance
            
        Returns:
            Order instance
        """
        from apps.cart.services import CartService
        
        cart = checkout_session.cart
        cart_summary = CartService.get_cart_summary(cart)
        
        # Calculate totals - use checkout session values which are already calculated
        subtotal = Decimal(cart_summary['subtotal'])
        
        # Use discount from checkout session (coupon-based) or from cart
        discount = checkout_session.discount_amount or Decimal(cart_summary.get('discount', '0'))
        
        # Shipping cost from checkout session
        shipping = checkout_session.shipping_cost or Decimal('0')
        
        # Gift wrap cost
        gift_wrap_cost = checkout_session.gift_wrap_cost or Decimal('0')
        
        # Tax calculation using checkout session's tax rate
        tax_rate = checkout_session.tax_rate or Decimal('0')
        taxable_amount = subtotal - discount + gift_wrap_cost
        tax = (taxable_amount * tax_rate / 100).quantize(Decimal('0.01'))
        
        # Total
        total = subtotal - discount + shipping + tax + gift_wrap_cost
        
        # Create order
        order = Order.objects.create(
            user=checkout_session.user,
            email=checkout_session.shipping_email,
            phone=checkout_session.shipping_phone,
            
            # Shipping address
            shipping_first_name=checkout_session.shipping_first_name,
            shipping_last_name=checkout_session.shipping_last_name,
            shipping_address_line_1=checkout_session.shipping_address_line_1,
            shipping_address_line_2=checkout_session.shipping_address_line_2,
            shipping_city=checkout_session.shipping_city,
            shipping_state=checkout_session.shipping_state,
            shipping_postal_code=checkout_session.shipping_postal_code,
            shipping_country=checkout_session.shipping_country,
            
            # Billing address
            billing_first_name=checkout_session.get_billing_address_dict()['first_name'],
            billing_last_name=checkout_session.get_billing_address_dict()['last_name'],
            billing_address_line_1=checkout_session.get_billing_address_dict()['address_line_1'],
            billing_address_line_2=checkout_session.get_billing_address_dict().get('address_line_2', ''),
            billing_city=checkout_session.get_billing_address_dict()['city'],
            billing_state=checkout_session.get_billing_address_dict().get('state', ''),
            billing_postal_code=checkout_session.get_billing_address_dict()['postal_code'],
            billing_country=checkout_session.get_billing_address_dict()['country'],
            
            # Shipping & Payment
            shipping_method=checkout_session.shipping_method,
            shipping_cost=shipping,
            payment_method=checkout_session.payment_method,
            stripe_payment_intent_id=checkout_session.stripe_payment_intent_id,
            payment_status='succeeded',  # Assuming payment was successful
            
            # Amounts
            subtotal=subtotal,
            discount=discount,
            tax=tax,
            total=total,
            
            # Coupon - use checkout session coupon if available, fallback to cart
            coupon=checkout_session.coupon or cart.coupon,
            coupon_code=checkout_session.coupon_code or (cart.coupon.code if cart.coupon else ''),
            
            # Gift Options
            is_gift=checkout_session.is_gift,
            gift_message=checkout_session.gift_message or '',
            gift_wrap=checkout_session.gift_wrap,
            gift_wrap_cost=gift_wrap_cost,
            
            # Notes
            customer_notes=checkout_session.order_notes,
            
            # Status
            status=Order.STATUS_CONFIRMED,
            confirmed_at=timezone.now(),
        )
        
        # Create order items and update stock
        for cart_item in cart.items.all():
            # Get product image
            product_image = ''
            if cart_item.product:
                primary_img = cart_item.product.images.filter(is_primary=True).first()
                if primary_img:
                    product_image = primary_img.image.url
                elif cart_item.product.images.exists():
                    product_image = cart_item.product.images.first().image.url
            
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                product_name=cart_item.product.name if cart_item.product else 'Unknown Product',
                product_sku=cart_item.variant.sku if cart_item.variant else (cart_item.product.sku if cart_item.product else ''),
                variant_name=cart_item.variant.name if cart_item.variant else '',
                product_image=product_image,
                unit_price=cart_item.price_at_add,
                quantity=cart_item.quantity,
            )
            
            # Update stock
            if cart_item.variant:
                cart_item.variant.stock_quantity -= cart_item.quantity
                cart_item.variant.save(update_fields=['stock_quantity'])
            elif cart_item.product:
                cart_item.product.stock_quantity -= cart_item.quantity
                cart_item.product.save(update_fields=['stock_quantity'])
        
        return order
    
    @staticmethod
    def get_user_orders(user, status=None):
        """
        Get orders for a user.
        
        Args:
            user: User instance
            status: Optional status filter
            
        Returns:
            QuerySet of orders
        """
        queryset = Order.objects.filter(user=user, is_deleted=False)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.prefetch_related('items')
    
    @staticmethod
    def get_order_by_number(order_number, user=None):
        """
        Get order by order number.
        
        Args:
            order_number: Order number string
            user: Optional user to verify ownership
            
        Returns:
            Order instance or None
        """
        queryset = Order.objects.filter(order_number=order_number, is_deleted=False)
        
        if user:
            queryset = queryset.filter(user=user)
        
        return queryset.prefetch_related('items', 'status_history').first()
    
    @staticmethod
    def update_order_status(order, new_status, changed_by=None, notes=''):
        """
        Update order status.
        
        Args:
            order: Order instance
            new_status: New status string
            changed_by: User who made the change
            notes: Optional notes
            
        Returns:
            Updated order
        """
        if new_status not in dict(Order.STATUS_CHOICES):
            raise ValueError(f"Invalid status: {new_status}")
        
        order.status = new_status
        order.save()
        
        # Create history entry with user
        if notes or changed_by:
            history = OrderStatusHistory.objects.filter(
                order=order,
                new_status=new_status
            ).order_by('-created_at').first()
            
            if history:
                history.changed_by = changed_by
                history.notes = notes
                history.save()
        
        return order
    
    @staticmethod
    def cancel_order(order, reason='', cancelled_by=None):
        """
        Cancel an order.
        
        Args:
            order: Order instance
            reason: Cancellation reason
            cancelled_by: User who cancelled
            
        Returns:
            Tuple (success: bool, message: str)
        """
        if not order.can_cancel:
            return False, "Order cannot be cancelled in current status"
        
        # Process refund if paid
        if order.is_paid and order.stripe_payment_intent_id:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            try:
                stripe.Refund.create(payment_intent=order.stripe_payment_intent_id)
                order.status = Order.STATUS_REFUNDED
            except stripe.error.StripeError as e:
                return False, f"Refund failed: {str(e)}"
        else:
            order.status = Order.STATUS_CANCELLED
        
        order.save()
        
        # Add cancellation note
        if reason:
            OrderStatusHistory.objects.filter(
                order=order,
                new_status__in=[Order.STATUS_CANCELLED, Order.STATUS_REFUNDED]
            ).order_by('-created_at').first()
            
            OrderStatusHistory.objects.create(
                order=order,
                old_status=Order.STATUS_CANCELLED,
                new_status=order.status,
                changed_by=cancelled_by,
                notes=f"Cancellation reason: {reason}"
            )
        
        return True, "Order cancelled successfully"
    
    @staticmethod
    def add_tracking(order, tracking_number, tracking_url=''):
        """
        Add tracking information to order.
        
        Args:
            order: Order instance
            tracking_number: Tracking number
            tracking_url: Optional tracking URL
            
        Returns:
            Updated order
        """
        order.tracking_number = tracking_number
        order.tracking_url = tracking_url
        order.save(update_fields=['tracking_number', 'tracking_url'])
        
        return order
    
    @staticmethod
    def mark_shipped(order, tracking_number='', tracking_url='', shipped_by=None):
        """
        Mark order as shipped.
        
        Args:
            order: Order instance
            tracking_number: Optional tracking number
            tracking_url: Optional tracking URL
            shipped_by: User who marked as shipped
            
        Returns:
            Updated order
        """
        order.status = Order.STATUS_SHIPPED
        order.shipped_at = timezone.now()
        
        if tracking_number:
            order.tracking_number = tracking_number
        if tracking_url:
            order.tracking_url = tracking_url
        
        order.save()
        
        # Update history
        history = OrderStatusHistory.objects.filter(
            order=order,
            new_status=Order.STATUS_SHIPPED
        ).order_by('-created_at').first()
        
        if history:
            history.changed_by = shipped_by
            if tracking_number:
                history.notes = f"Tracking: {tracking_number}"
            history.save()
        
        return order
    
    @staticmethod
    def get_order_statistics(user=None, start_date=None, end_date=None):
        """
        Get order statistics.
        
        Args:
            user: Optional user filter
            start_date: Optional start date
            end_date: Optional end date
            
        Returns:
            Dictionary with statistics
        """
        from django.db.models import Sum, Count, Avg
        
        queryset = Order.objects.filter(is_deleted=False)
        
        if user:
            queryset = queryset.filter(user=user)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        # Exclude cancelled/refunded for revenue
        completed_queryset = queryset.exclude(
            status__in=[Order.STATUS_CANCELLED, Order.STATUS_REFUNDED]
        )
        
        stats = completed_queryset.aggregate(
            total_revenue=Sum('total'),
            total_orders=Count('id'),
            average_order_value=Avg('total'),
        )
        
        # Status breakdown
        status_counts = {}
        for status, label in Order.STATUS_CHOICES:
            status_counts[status] = queryset.filter(status=status).count()
        
        return {
            'total_revenue': str(stats['total_revenue'] or Decimal('0')),
            'total_orders': stats['total_orders'] or 0,
            'average_order_value': str(stats['average_order_value'] or Decimal('0')),
            'status_breakdown': status_counts,
        }
