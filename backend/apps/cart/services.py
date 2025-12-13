# apps/cart/services.py
"""
Cart service layer for business logic.
"""
from decimal import Decimal
from django.db import transaction

from .models import Cart, CartItem


class CartService:
    """Service class for cart operations."""
    
    @classmethod
    def get_or_create_cart(cls, request):
        """
        Get existing cart or create new one.
        Links cart to user if authenticated.
        """
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        if user:
            # Try to get user's cart
            cart = Cart.objects.filter(user=user).first()
            
            if not cart:
                # Check if there's a session cart to merge
                session_cart = Cart.objects.filter(
                    session_key=session_key,
                    user__isnull=True
                ).first()
                
                if session_cart:
                    # Assign session cart to user
                    session_cart.user = user
                    session_cart.save()
                    cart = session_cart
                else:
                    # Create new cart for user
                    cart = Cart.objects.create(
                        user=user,
                        session_key=session_key
                    )
            else:
                # Merge any session cart items into user's cart
                session_cart = Cart.objects.filter(
                    session_key=session_key,
                    user__isnull=True
                ).first()
                
                if session_cart:
                    cls.merge_carts(cart, session_cart)
        else:
            # Guest user - use session cart
            cart, created = Cart.objects.get_or_create(
                session_key=session_key,
                user__isnull=True,
                defaults={'session_key': session_key}
            )
        
        return cart
    
    @classmethod
    @transaction.atomic
    def merge_carts(cls, target_cart, source_cart):
        """
        Merge items from source cart into target cart.
        Source cart is deleted after merge.
        """
        for item in source_cart.items.all():
            existing_item = target_cart.items.filter(
                product=item.product,
                variant=item.variant
            ).first()
            
            if existing_item:
                existing_item.quantity += item.quantity
                existing_item.save()
            else:
                item.cart = target_cart
                item.save()
        
        # Preserve coupon from source if target has none
        if source_cart.coupon and not target_cart.coupon:
            target_cart.coupon = source_cart.coupon
            target_cart.save()
        
        source_cart.delete()
    
    @classmethod
    @transaction.atomic
    def add_item(cls, cart, product, variant=None, quantity=1):
        """
        Add item to cart or update quantity if exists.
        Returns the cart item.
        """
        # Check for existing item
        existing_item = cart.items.filter(
            product=product,
            variant=variant
        ).first()
        
        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
            return existing_item
        
        # Determine price
        if variant:
            price = variant.sale_price if variant.sale_price else variant.price
        else:
            price = product.sale_price if product.sale_price else product.price
        
        # Create new item
        item = CartItem.objects.create(
            cart=cart,
            product=product,
            variant=variant,
            quantity=quantity,
            unit_price=price
        )
        
        return item
    
    @classmethod
    def update_item_quantity(cls, cart, item_id, quantity):
        """
        Update item quantity. 
        If quantity is 0, removes the item.
        """
        try:
            item = cart.items.get(pk=item_id)
            
            if quantity <= 0:
                item.delete()
                return None
            
            item.quantity = quantity
            item.save()
            return item
            
        except CartItem.DoesNotExist:
            return None
    
    @classmethod
    def remove_item(cls, cart, item_id):
        """Remove item from cart."""
        try:
            item = cart.items.get(pk=item_id)
            item.delete()
            return True
        except CartItem.DoesNotExist:
            return False
    
    @classmethod
    def apply_coupon(cls, cart, coupon_code):
        """
        Apply coupon to cart by code.
        Returns tuple (success, message).
        """
        from apps.promotions.models import Coupon
        
        try:
            coupon = Coupon.objects.get(code__iexact=coupon_code)
            
            # Validate coupon
            is_valid, message = coupon.is_valid()
            if not is_valid:
                return False, message
            
            # Check minimum purchase
            if coupon.minimum_purchase and cart.subtotal < coupon.minimum_purchase:
                return False, f'Minimum purchase of ${coupon.minimum_purchase} required'
            
            cart.coupon = coupon
            cart.save()
            
            return True, 'Coupon applied successfully'
            
        except Coupon.DoesNotExist:
            return False, 'Invalid coupon code'
    
    @classmethod
    def remove_coupon(cls, cart):
        """Remove coupon from cart."""
        cart.coupon = None
        cart.save()
    
    @classmethod
    def get_cart_totals(cls, cart):
        """Get cart totals breakdown."""
        subtotal = cart.subtotal
        discount = cart.discount_amount
        total = cart.total
        
        return {
            'subtotal': subtotal,
            'discount': discount,
            'total': total,
            'item_count': cart.item_count,
            'coupon_code': cart.coupon.code if cart.coupon else None,
            'savings_percentage': round((discount / subtotal) * 100, 1) if subtotal > 0 else 0
        }
    
    @classmethod
    @transaction.atomic
    def transfer_cart_to_user(cls, session_key, user):
        """
        Transfer a session cart to a user (called after login/registration).
        """
        session_cart = Cart.objects.filter(
            session_key=session_key,
            user__isnull=True
        ).first()
        
        if not session_cart:
            return None
        
        user_cart = Cart.objects.filter(user=user).first()
        
        if user_cart:
            cls.merge_carts(user_cart, session_cart)
            return user_cart
        else:
            session_cart.user = user
            session_cart.save()
            return session_cart
    
    @classmethod
    def validate_cart_for_checkout(cls, cart):
        """
        Validate cart is ready for checkout.
        Returns tuple (is_valid, errors).
        """
        errors = []
        
        if cart.item_count == 0:
            errors.append('Cart is empty')
            return False, errors
        
        # Validate stock for each item
        for item in cart.items.select_related('product', 'variant'):
            product = item.product
            variant = item.variant
            
            if not product.is_active:
                errors.append(f'{product.name} is no longer available')
                continue
            
            stock = variant.stock if variant else product.stock
            
            if stock < item.quantity:
                if stock == 0:
                    errors.append(f'{product.name} is out of stock')
                else:
                    errors.append(
                        f'Only {stock} units of {product.name} available'
                    )
        
        return len(errors) == 0, errors
