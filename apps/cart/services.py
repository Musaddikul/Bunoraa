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

        def convert_from(amount, from_currency):
            """Convert a given amount expressed in from_currency into target_currency and return string."""
            if amount is None:
                return '0'
            value = Decimal(str(amount))
            if not from_currency or not target_currency or from_currency.id == target_currency.id:
                return str(value)
            try:
                converted = CurrencyConversionService.convert(value, from_currency, target_currency)
                return str(converted)
            except Exception:  # pragma: no cover - fallback when rate missing
                return str(value)

        items = []
        subtotal_acc = Decimal('0')
        for item in cart.items.select_related('product', 'variant').all():
            primary_image = None
            if item.product.primary_image and getattr(item.product.primary_image, 'image', None):
                primary_image = item.product.primary_image.image.url
            elif item.product.images.exists():
                first_image = item.product.images.first()
                primary_image = first_image.image.url if first_image else None

            # Determine item's currency (product-level)
            item_from_currency = item.product.get_currency() if hasattr(item.product, 'get_currency') else base_currency

            # Convert unit price and total per item
            unit_price_converted = Decimal(str(convert_from(item.unit_price, item_from_currency)))
            total_converted = (unit_price_converted * Decimal(item.quantity)).quantize(Decimal('0.01'))
            subtotal_acc += total_converted

            items.append({
                'id': str(item.id),
                'product_id': str(item.product.id),
                'product_name': item.product.name,
                'product_slug': item.product.slug,
                'variant_id': str(item.variant.id) if item.variant else None,
                'variant_name': item.variant.name if item.variant else None,
                'quantity': item.quantity,
                'unit_price': str(unit_price_converted),
                'total': str(total_converted),
                'image': primary_image,
                'is_available': item.is_available,
                'available_quantity': item.available_quantity,
            })
        
        # Convert coupon/discount and totals
        try:
            discount_conv = Decimal(str(convert_from(cart.discount_amount, base_currency)))
        except Exception:
            discount_conv = Decimal(str(cart.discount_amount or 0))

        # subtotal_acc is computed from converted item totals
        total_calc = subtotal_acc - discount_conv
        if getattr(cart, 'shipping_cost', None):
            # assume shipping_cost is in base_currency; convert
            try:
                shipping_conv = Decimal(str(convert_from(cart.shipping_cost, base_currency)))
            except Exception:
                shipping_conv = Decimal(str(cart.shipping_cost or 0))
            total_calc += shipping_conv
        
        # tax if any
        try:
            tax_conv = Decimal(str(convert_from(cart.tax if hasattr(cart, 'tax') else Decimal('0'), base_currency)))
        except Exception:
            tax_conv = Decimal('0')
        total_calc += tax_conv

        summary = {
            'items': items,
            'item_count': cart.item_count,
            'subtotal': str(subtotal_acc.quantize(Decimal('0.01'))),
            'discount_amount': str(discount_conv.quantize(Decimal('0.01'))),
            'shipping_cost': str(shipping_conv.quantize(Decimal('0.01'))) if 'shipping_conv' in locals() else '0.00',
            'tax': str(tax_conv.quantize(Decimal('0.01'))),
            'total': str(total_calc.quantize(Decimal('0.01'))),
            'coupon': {
                'code': cart.coupon.code,
                'discount': str(discount_conv.quantize(Decimal('0.01')))
            } if cart.coupon else None,
            'currency': None
        }

        currency_obj = target_currency or base_currency
        if currency_obj:
            summary['currency'] = {
                'code': currency_obj.code,
                'symbol': currency_obj.symbol,
                'decimal_places': currency_obj.decimal_places,
                'symbol_position': currency_obj.symbol_position,
                'thousand_separator': currency_obj.thousand_separator,
                'decimal_separator': currency_obj.decimal_separator,
            }

            # Formatted amounts for templates
            try:
                summary['formatted_subtotal'] = currency_obj.format_amount(Decimal(summary['subtotal']))
            except Exception:
                summary['formatted_subtotal'] = f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(summary['subtotal']):,.2f}"

            summary['formatted_discount'] = f"-{currency_obj.format_amount(Decimal(summary['discount_amount']))}" if Decimal(summary['discount_amount']) != Decimal('0') else ''

            try:
                summary['formatted_shipping'] = currency_obj.format_amount(Decimal(summary['shipping_cost'])) if Decimal(summary['shipping_cost']) > 0 else 'Free'
            except Exception:
                summary['formatted_shipping'] = 'Free' if Decimal(summary['shipping_cost']) == Decimal('0') else f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(summary['shipping_cost']):,.2f}"

            try:
                summary['formatted_tax'] = currency_obj.format_amount(Decimal(summary['tax'])) if Decimal(summary['tax']) != Decimal('0') else ''
            except Exception:
                summary['formatted_tax'] = f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(summary['tax']):,.2f}" if Decimal(summary['tax']) != Decimal('0') else ''

            try:
                summary['formatted_total'] = currency_obj.format_amount(Decimal(summary['total']))
            except Exception:
                summary['formatted_total'] = f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(summary['total']):,.2f}"

            # Add per-item formatted values
            for it in summary['items']:
                try:
                    it['formatted_unit_price'] = currency_obj.format_amount(Decimal(it['unit_price']))
                except Exception:
                    it['formatted_unit_price'] = f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(it['unit_price']):,.2f}"
                try:
                    it['formatted_total'] = currency_obj.format_amount(Decimal(it['total']))
                except Exception:
                    it['formatted_total'] = f"{currency_obj.symbol if currency_obj else '৳'}{Decimal(it['total']):,.2f}"
        
        return summary
