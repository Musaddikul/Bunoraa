"""
Cart services - Business logic layer
"""
from decimal import Decimal
from django.db import transaction
from core.exceptions import CartException, InsufficientStockException
from apps.currencies.services import CurrencyService, CurrencyConversionService
from .models import Cart, CartItem


class CartService:
    """Service class for cart operations."""
    
    @staticmethod
    def get_or_create_cart(user=None, session_key=None):
        """Get or create a cart for user or session."""
        if user and user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=user)
            
            # Merge session cart if exists
            if session_key:
                try:
                    session_cart = Cart.objects.get(session_key=session_key, user__isnull=True)
                    cart.merge_from_session(session_cart)
                except Cart.DoesNotExist:
                    pass
            
            return cart
        elif session_key:
            cart, created = Cart.objects.get_or_create(
                session_key=session_key,
                user__isnull=True
            )
            return cart
        else:
            raise CartException("Either user or session_key is required.")
    
    @staticmethod
    def get_cart(user=None, session_key=None):
        """Get existing cart without creating."""
        if user and user.is_authenticated:
            try:
                return Cart.objects.get(user=user)
            except Cart.DoesNotExist:
                return None
        elif session_key:
            try:
                return Cart.objects.get(session_key=session_key, user__isnull=True)
            except Cart.DoesNotExist:
                return None
        return None
    
    @staticmethod
    @transaction.atomic
    def add_item(cart, product, quantity=1, variant=None):
        """Add an item to the cart."""
        # Validate product
        if not product.is_active or product.is_deleted:
            raise CartException("This product is not available.")
        
        # Check stock
        if product.track_inventory:
            available = variant.stock_quantity if variant else product.stock_quantity
            if not product.allow_backorder and available < quantity:
                raise InsufficientStockException(
                    f"Only {available} items available."
                )
        
        # Get or create cart item
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={
                'quantity': quantity,
                'price_at_add': variant.price if variant else product.current_price
            }
        )
        
        if not created:
            # Update quantity
            new_quantity = item.quantity + quantity
            
            # Check stock for new quantity
            if product.track_inventory:
                available = variant.stock_quantity if variant else product.stock_quantity
                if not product.allow_backorder and available < new_quantity:
                    raise InsufficientStockException(
                        f"Cannot add more. Only {available} items available."
                    )
            
            item.quantity = new_quantity
            item.save()
        
        return item
    
    @staticmethod
    @transaction.atomic
    def update_item_quantity(cart, item_id, quantity):
        """Update cart item quantity."""
        try:
            item = cart.items.get(pk=item_id)
        except CartItem.DoesNotExist:
            raise CartException("Item not found in cart.")
        
        if quantity <= 0:
            item.delete()
            return None
        
        # Check stock
        product = item.product
        if product.track_inventory:
            available = item.variant.stock_quantity if item.variant else product.stock_quantity
            if not product.allow_backorder and available < quantity:
                raise InsufficientStockException(
                    f"Only {available} items available."
                )
        
        item.quantity = quantity
        item.save()
        return item
    
    @staticmethod
    def remove_item(cart, item_id):
        """Remove an item from the cart."""
        try:
            item = cart.items.get(pk=item_id)
            item.delete()
            return True
        except CartItem.DoesNotExist:
            raise CartException("Item not found in cart.")
    
    @staticmethod
    def clear_cart(cart):
        """Clear all items from the cart."""
        cart.clear()
    
    @staticmethod
    def apply_coupon(cart, coupon):
        """Validate and attach a coupon to the cart."""
        from apps.promotions.services import CouponService

        if coupon is None:
            return False, "Coupon not found."

        subtotal = cart.subtotal or Decimal('0')
        validated_coupon, is_valid, message = CouponService.validate_coupon(
            code=coupon.code,
            user=cart.user,
            subtotal=subtotal
        )

        if not is_valid or not validated_coupon:
            return False, message or "Invalid coupon code."

        cart.coupon = validated_coupon
        cart.save(update_fields=['coupon', 'updated_at'])
        return True, message or "Coupon applied successfully."
    
    @staticmethod
    def remove_coupon(cart):
        """Remove coupon from cart."""
        cart.coupon = None
        cart.save()
    
    @staticmethod
    def validate_cart(cart):
        """
        Validate all items in cart are still available.
        Returns list of issues if any.
        """
        issues = []
        
        for item in cart.items.all():
            # Check product availability
            if not item.product.is_active or item.product.is_deleted:
                issues.append({
                    'item_id': str(item.id),
                    'product': item.product.name,
                    'issue': 'Product is no longer available.',
                    'action': 'remove'
                })
                continue
            
            # Check stock
            if item.product.track_inventory:
                available = item.variant.stock_quantity if item.variant else item.product.stock_quantity
                if available < item.quantity:
                    if available == 0:
                        issues.append({
                            'item_id': str(item.id),
                            'product': item.product.name,
                            'issue': 'Product is out of stock.',
                            'action': 'remove'
                        })
                    else:
                        issues.append({
                            'item_id': str(item.id),
                            'product': item.product.name,
                            'issue': f'Only {available} items available.',
                            'action': 'reduce',
                            'max_quantity': available
                        })
            
            # Check price change
            current_price = item.variant.price if item.variant else item.product.current_price
            if current_price != item.price_at_add:
                issues.append({
                    'item_id': str(item.id),
                    'product': item.product.name,
                    'issue': f'Price has changed from {item.price_at_add} to {current_price}.',
                    'action': 'update_price',
                    'new_price': str(current_price)
                })
        
        return issues
    
    @staticmethod
    def get_cart_summary(cart, currency=None):
        """Get cart summary for display."""
        base_currency = CurrencyService.get_default_currency()
        target_currency = currency or base_currency

        def convert(amount):
            if amount is None:
                return '0'
            value = Decimal(str(amount))
            if not base_currency or not target_currency or base_currency.id == target_currency.id:
                return str(value)
            try:
                converted = CurrencyConversionService.convert(value, base_currency, target_currency)
                return str(converted)
            except Exception:  # pragma: no cover - fallback when rate missing
                return str(value)

        items = []
        for item in cart.items.select_related('product', 'variant').all():
            primary_image = None
            if item.product.primary_image and getattr(item.product.primary_image, 'image', None):
                primary_image = item.product.primary_image.image.url
            elif item.product.images.exists():
                first_image = item.product.images.first()
                primary_image = first_image.image.url if first_image else None

            items.append({
                'id': str(item.id),
                'product_id': str(item.product.id),
                'product_name': item.product.name,
                'product_slug': item.product.slug,
                'variant_id': str(item.variant.id) if item.variant else None,
                'variant_name': item.variant.name if item.variant else None,
                'quantity': item.quantity,
                'unit_price': convert(item.unit_price),
                'total': convert(item.total),
                'image': primary_image,
                'is_available': item.is_available,
                'available_quantity': item.available_quantity,
            })
        
        summary = {
            'items': items,
            'item_count': cart.item_count,
            'subtotal': convert(cart.subtotal),
            'discount_amount': convert(cart.discount_amount),
            'total': convert(cart.total),
            'coupon': {
                'code': cart.coupon.code,
                'discount': convert(cart.discount_amount)
            } if cart.coupon else None,
            'currency': None
        }

        currency_obj = target_currency or base_currency
        if currency_obj:
            summary['currency'] = {
                'code': currency_obj.code,
                'symbol': currency_obj.symbol
            }
        
        return summary
