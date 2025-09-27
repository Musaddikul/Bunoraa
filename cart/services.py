# cart/services.py
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
import logging

from products.models import Product
from promotions.models import Coupon
from shipping.models import ShippingMethod
from .models import Cart, CartItem
from core.models import TaxSetting
from .selectors import get_cart_for_user, get_active_cart_items, get_saved_cart_items
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from wishlist.models import Wishlist # Import Wishlist model

logger = logging.getLogger(__name__)

def _get_or_create_cart(request_or_user):
    """
    Helper function to get or create a cart based on request or user object.
    This centralizes the logic for obtaining the cart.
    """
    if isinstance(request_or_user, AnonymousUser) or (hasattr(request_or_user, 'user') and request_or_user.user.is_anonymous):
        # Handle anonymous user via session key
        session_key = request_or_user.session.session_key if hasattr(request_or_user, 'session') else None
        if not session_key:
            if hasattr(request_or_user, 'session'):
                request_or_user.session.save() # Ensure session key is generated
                session_key = request_or_user.session.session_key
            else:
                raise ValueError("Cannot get or create cart for anonymous user without a session key.")
        cart, created = Cart.objects.get_or_create(session_key=session_key, checked_out=False)
        if created:
            logger.info(f"New anonymous cart {cart.id} created for session {session_key}.")
        else:
            logger.info(f"Retrieved existing anonymous cart {cart.id} for session {session_key}.")
        return cart
    elif hasattr(request_or_user, 'user') and request_or_user.user.is_authenticated:
        # Handle authenticated user
        user = request_or_user.user
        cart, created = Cart.objects.get_or_create(user=user, checked_out=False)
        if created:
            logger.info(f"New cart {cart.id} created for user {user.id}.")
        else:
            logger.info(f"Retrieved existing cart {cart.id} for user {user.id}.")
        return cart
    elif hasattr(request_or_user, 'is_authenticated') and request_or_user.is_authenticated:
        # Directly passed a User object
        user = request_or_user
        cart, created = Cart.objects.get_or_create(user=user, checked_out=False)
        if created:
            logger.info(f"New cart {cart.id} created for user {user.id}.")
        else:
            logger.info(f"Retrieved existing cart {cart.id} for user {user.id}.")
        return cart
    else:
        raise ValueError("Invalid argument for _get_or_create_cart. Expected request or authenticated user.")


@transaction.atomic
def add_product_to_cart(request, product: Product, quantity: int = 1, color_id: int = None, size_id: int = None, fabric_id: int = None, override_quantity: bool = False, saved_for_later: bool = False) -> Cart:
    """
    Adds a product to the cart or updates its quantity.
    If override_quantity is True, the item's quantity is set to the given quantity.
    Otherwise, the quantity is added to the existing one.
    Ensures quantity does not exceed product stock.

    :param request: HttpRequest object (for session/user).
    :param product: The Product instance to add.
    :param quantity: The quantity to add or set.
    :param override_quantity: If True, set quantity; otherwise, add to it.
    :param saved_for_later: If True, add/move to saved for later.
    :return: The updated Cart instance.
    :raises ValidationError: If product is unavailable or quantity exceeds stock.
    """
    # Use the helper to get the cart, which handles both authenticated and anonymous users
    cart = _get_or_create_cart(request)

    if not product.available:
        raise ValidationError(_(f"Product '{product.name}' is currently unavailable."))

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        color_id=color_id,
        size_id=size_id,
        fabric_id=fabric_id,
        defaults={'quantity': 0, 'price': product.current_price, 'saved_for_later': saved_for_later}
    )

    if not created:
        cart_item.price = product.current_price # Update price for existing items too

    old_quantity = cart_item.quantity
    if override_quantity:
        new_quantity = quantity
    else:
        new_quantity = cart_item.quantity + quantity

    if new_quantity <= 0:
        # If new quantity is 0 or less, remove the item
        cart_item.delete()
        logger.info(f"Cart item {cart_item.id} (product {product.id}) removed from cart {cart.id} as quantity became zero or less.")
        cart.update_totals() # Recalculate totals after removal
        return cart

    if new_quantity > product.stock:
        # Adjust quantity to max available stock if exceeding
        adjusted_quantity = product.stock
        if adjusted_quantity == 0:
            cart_item.delete()
            logger.warning(f"Product '{product.name}' is out of stock. Item removed from cart {cart.id}.")
            raise ValidationError(_(f"Product '{product.name}' is out of stock and cannot be added."))
        
        if new_quantity > adjusted_quantity: # Only warn if actual adjustment happened
            logger.warning(f"Quantity for product '{product.name}' adjusted from {new_quantity} to {adjusted_quantity} due to stock limits.")
            new_quantity = adjusted_quantity # Set to adjusted quantity if it was higher

    cart_item.quantity = new_quantity
    cart_item.price = product.current_price # Always update price to current
    cart_item.saved_for_later = saved_for_later
    cart_item.save()

    if created:
        logger.info(f"Product '{product.name}' (ID: {product.id}) added to cart {cart.id} with quantity {cart_item.quantity}.")
    else:
        logger.info(f"Product '{product.name}' (ID: {product.id}) quantity updated in cart {cart.id} from {old_quantity} to {cart_item.quantity}.")

    cart.update_totals() # Recalculate totals after item update

    # Remove product from wishlist if it exists and user is authenticated
    if request.user.is_authenticated:
        try:
            wishlist = Wishlist.objects.get(user=request.user)
            if wishlist.has_product(product):
                wishlist.remove_product(product)
                logger.info(f"Product '{product.name}' (ID: {product.id}) removed from wishlist for user {request.user.id}.")
        except Wishlist.DoesNotExist:
            logger.info(f"No wishlist found for user {request.user.id}.")

    return cart

@transaction.atomic
def remove_product_from_cart(request, product: Product, color_id: int = None, size_id: int = None, fabric_id: int = None) -> Cart:
    """
    Removes a product entirely from the cart.

    :param request: HttpRequest object (for session/user).
    :param product: The Product instance to remove.
    :return: The updated Cart instance.
    :raises ValidationError: If the product is not in the cart.
    """
    cart = _get_or_create_cart(request)
    try:
        # Assuming product, color, size, and fabric are passed to identify the specific item
        # If not, you might need to adjust how the item is identified for removal
        cart_item = CartItem.objects.get(cart=cart, product=product, color_id=color_id, size_id=size_id, fabric_id=fabric_id)
        cart_item.delete()
        logger.info(f"Product '{product.name}' (ID: {product.id}) with variations removed from cart {cart.id}.")
    except CartItem.DoesNotExist:
        logger.warning(f"Attempted to remove product '{product.name}' (ID: {product.id}) not found in cart {cart.id}.")
        raise ValidationError(_(f"Product '{product.name}' is not in your cart."))
    
    cart.update_totals()
    return cart

@transaction.atomic
def update_cart_item_quantity(request, product: Product, quantity: int, color_id: int = None, size_id: int = None, fabric_id: int = None) -> Cart:
    """
    Updates the quantity of an existing product in the cart.
    If quantity is 0 or less, the item is removed.

    :param request: HttpRequest object (for session/user).
    :param product: The Product instance to update.
    :param quantity: The new quantity for the product.
    :return: The updated Cart instance.
    :raises ValidationError: If product is unavailable, not in cart, or quantity exceeds stock.
    """
    cart = _get_or_create_cart(request)

    if not product.available:
        raise ValidationError(_(f"Product '{product.name}' is currently unavailable."))

    try:
        cart_item = CartItem.objects.get(cart=cart, product=product, color_id=color_id, size_id=size_id, fabric_id=fabric_id)
    except CartItem.DoesNotExist:
        raise ValidationError(_(f"Product '{product.name}' with selected variations is not in your cart to update."))

    if quantity <= 0:
        cart_item.delete()
        logger.info(f"Cart item {cart_item.id} (product {product.id}) removed from cart {cart.id} due to quantity update to {quantity}.")
        cart.update_totals()
        return cart

    if quantity > product.stock:
        adjusted_quantity = product.stock
        if adjusted_quantity == 0:
            cart_item.delete()
            logger.warning(f"Product '{product.name}' is out of stock. Item removed from cart {cart.id}.")
            raise ValidationError(_(f"Product '{product.name}' is out of stock. Item removed from your cart."))
        
        logger.warning(f"Quantity for product '{product.name}' adjusted from {quantity} to {adjusted_quantity} due to stock limits.")
        quantity = adjusted_quantity # Update the quantity variable to the adjusted quantity

    old_quantity = cart_item.quantity
    cart_item.quantity = quantity
    cart_item.price = product.current_price # Ensure price is current
    cart_item.save()

    cart.refresh_from_db() # Ensure cart totals are fresh before recalculating
    cart.update_totals()
    return cart


@transaction.atomic
def toggle_saved_for_later(request, product: Product, color_id: int = None, size_id: int = None, fabric_id: int = None) -> Cart:
    """
    Toggles a cart item's 'saved_for_later' status.
    Moves item between active cart and saved items.

    :param request: HttpRequest object (for session/user).
    :param product: The Product instance to toggle.
    :param color_id: The ID of the selected color (optional).
    :param size_id: The ID of the selected size (optional).
    :param fabric_id: The ID of the selected fabric (optional).
    :return: The updated Cart instance.
    :raises ValidationError: If the product is not in the cart.
    """
    cart = _get_or_create_cart(request)
    try:
        cart_item = CartItem.objects.get(cart=cart, product=product, color_id=color_id, size_id=size_id, fabric_id=fabric_id)
        cart_item.saved_for_later = not cart_item.saved_for_later
        cart_item.save()
        logger.info(f"Product '{product.name}' (ID: {product.id}) with variations saved_for_later status toggled to {cart_item.saved_for_later} in cart {cart.id}.")
    except CartItem.DoesNotExist:
        raise ValidationError(_(f"Product '{product.name}' is not in your cart."))
    
    cart.update_totals()
    return cart

@transaction.atomic
def apply_coupon_to_cart(request_or_user, coupon_code: str) -> Cart:
    """
    Applies a coupon to the user's or session's cart.
    """
    from promotions.services import CouponService

    cart = _get_or_create_cart(request_or_user)
    cart = Cart.objects.get(pk=cart.pk) # Re-fetch inside atomic block

    if cart.is_empty:
        raise ValidationError(_("Cannot apply a coupon to an empty cart."))

    user_for_validation = request_or_user.user if hasattr(request_or_user, 'user') else request_or_user
    coupon = CouponService.validate_coupon(coupon_code, cart.total_price, user_for_validation)

    # Apply the coupon
    cart.coupon = coupon
    cart.save()
    
    # Force refresh and recalculate
    cart.refresh_from_db()
    cart.update_totals()
    
    return cart

@transaction.atomic
def remove_coupon_from_cart(request_or_user) -> Cart:
    """
    Removes any applied coupon from the user's or session's cart.

    :param request_or_user: HttpRequest object or User object.
    :return: The updated Cart instance.
    :raises ValidationError: If no coupon is applied.
    """
    from cart.selectors import get_user_cart
    cart = get_user_cart(request_or_user) # Get cart for the authenticated user or anonymous session
    cart = Cart.objects.get(pk=cart.pk) # Force a fresh fetch from DB

    if not cart.coupon:
        
        raise ValidationError(_("No coupon is currently applied to your cart."))
    
    coupon_code = cart.coupon.code
    cart.coupon_id = None
    cart.coupon = None
    cart.save()
    cart.refresh_from_db()
    cart.update_totals()
    logger.info(f"Coupon '{coupon_code}' removed from cart {cart.id} for user {request_or_user.user.id if hasattr(request_or_user, 'user') and request_or_user.user.is_authenticated else 'anonymous'}.")

    

    return cart

from accounts.models import UserAddress

@transaction.atomic
def update_cart_shipping(request_or_user, shipping_method_id: int, is_express: bool, address_id: int = None) -> Cart:
    """
    Updates the shipping method and express status for a cart.
    """
    cart = _get_or_create_cart(request_or_user)

    try:
        shipping_method = ShippingMethod.objects.get(id=shipping_method_id, is_active=True)
    except ShippingMethod.DoesNotExist:
        raise ValidationError(_("Selected shipping method is invalid or inactive."))
    
    if address_id:
        try:
            address = UserAddress.objects.get(id=address_id)
            cart.address = address
        except UserAddress.DoesNotExist:
            raise ValidationError(_("Selected address is invalid."))
    elif request_or_user.user.is_authenticated: # If no address_id provided, try to use default for authenticated user
        default_address = UserAddress.objects.filter(user=request_or_user.user, is_default=True).first()
        if default_address:
            cart.address = default_address
        else:
            cart.address = None # No default address found
    else:
        cart.address = None # Clear address if none provided and user is anonymous
    
    # Clear any previous shipping method to force recalculation
    cart.shipping_method = None
    cart.save(update_fields=['shipping_method', 'address', 'updated_at'])
    
    # Now set the new shipping method
    cart.shipping_method = shipping_method
    cart.is_express = is_express
    cart.save(update_fields=['shipping_method', 'is_express', 'address', 'updated_at'])
    
    # Force refresh from database and recalculate
    cart.refresh_from_db()
    cart.update_totals()
    
    logger.info(f"Shipping updated for cart {cart.id}: method={shipping_method.name}, express={is_express}, address={cart.address.id if cart.address else 'None'}")
    return cart

@transaction.atomic
def mark_cart_checked_out(cart: Cart):
    """
    Marks a cart as checked out and sets the conversion timestamp.
    This should be called after a successful order creation.

    :param cart: The Cart instance to mark.
    """
    if cart.checked_out:
        logger.info(f"Cart {cart.id} is already marked as checked out.")
        return

    cart.checked_out = True
    cart.converted = True # Mark as converted when checked out
    cart.converted_at = timezone.now()
    cart.save(update_fields=['checked_out', 'converted', 'converted_at', 'updated_at'])
    logger.info(f"Cart {cart.id} marked as checked out and converted.")

@transaction.atomic
def clear_cart_items(request_or_user) -> int:
    """
    Removes all active items from the cart.

    :param request_or_user: HttpRequest object or User object.
    :return: The number of items cleared.
    """
    cart = _get_or_create_cart(request_or_user)
    
    # Get count before deleting
    cleared_count = cart.items.filter(saved_for_later=False).count()
    
    # Delete only active items
    cart.items.filter(saved_for_later=False).delete()
    
    cart.update_totals() # Recalculate totals after clearing
    logger.info(f"Cleared {cleared_count} active items from cart {cart.id}.")
    return cleared_count

@transaction.atomic
def merge_session_cart_to_user_cart(request, user):
    """
    Merges an anonymous session cart into an authenticated user's cart.
    Prioritizes the user's existing cart if it has items.
    If both have items, items from the anonymous cart are added to the user's cart.
    """
    if not user.is_authenticated:
        logger.warning("Attempted to merge session cart to an unauthenticated user.")
        return

    session_key = request.session.session_key
    if not session_key:
        logger.info("No session key found, no anonymous cart to merge.")
        return

    try:
        anonymous_cart = Cart.objects.get(session_key=session_key, checked_out=False)
    except Cart.DoesNotExist:
        logger.info(f"No anonymous cart found for session {session_key}.")
        return

    if anonymous_cart.is_empty:
        logger.info(f"Anonymous cart {anonymous_cart.id} is empty, no merge needed.")
        anonymous_cart.delete() # Clean up empty anonymous cart
        return

    user_cart, created = Cart.objects.get_or_create(user=user, checked_out=False)

    if user_cart.id == anonymous_cart.id: # Should not happen if session_key is unique for anonymous carts
        logger.info(f"User cart and anonymous cart are the same ({user_cart.id}), no merge needed.")
        return

    items_merged_count = 0
    with transaction.atomic():
        for anon_item in anonymous_cart.items.all():
            # Try to find an existing item in the user's cart
            existing_item = user_cart.items.filter(product=anon_item.product, saved_for_later=anon_item.saved_for_later).first()

            if existing_item:
                # Update quantity if item exists, respecting stock limits
                new_quantity = existing_item.quantity + anon_item.quantity
                if new_quantity > anon_item.product.stock:
                    new_quantity = anon_item.product.stock
                    logger.warning(f"Merged quantity for '{anon_item.product.name}' adjusted to stock limit: {new_quantity}.")
                
                if existing_item.quantity != new_quantity:
                    existing_item.quantity = new_quantity
                    existing_item.price = anon_item.product.current_price # Update price
                    existing_item.save()
                    items_merged_count += 1
            else:
                # Move the item to the user's cart
                anon_item.cart = user_cart
                anon_item.save()
                items_merged_count += 1
        
        # After merging items, delete the anonymous cart
        # Transfer coupon from anonymous cart to user cart
        user_cart.coupon = anonymous_cart.coupon
        user_cart.save(update_fields=['coupon', 'updated_at'])
        user_cart.update_totals() # Recalculate totals for the user's cart
        logger.info(f"Merged anonymous cart {anonymous_cart.id} into user cart {user_cart.id}. {items_merged_count} items merged. User cart coupon set to: {user_cart.coupon}")

        # Clear coupon from anonymous cart and delete it
        anonymous_cart.coupon = None
        anonymous_cart.save(update_fields=['coupon', 'updated_at'])
        anonymous_cart.delete()
        logger.info(f"Anonymous cart {anonymous_cart.id} deleted after merge.")

    return user_cart


def get_tax_configuration():
    """
    Retrieves the active tax configuration from the TaxSetting model.
    Caches the result to avoid repeated database queries.
    """
    try:
        # Fetch the active tax setting
        tax_setting = TaxSetting.objects.filter(is_active=True).first()
        if tax_setting:
            return {
                'rate': tax_setting.vat_rate,
                'label': tax_setting.name,
                'is_inclusive': False  # Assuming tax is exclusive unless specified otherwise
            }
    except Exception as e:
        logger.error(f"Error retrieving tax configuration: {e}")
    
    # Return a default or empty configuration if no active setting is found
    return {
        'rate': Decimal('0.00'),
        'label': 'VAT',
        'is_inclusive': False
    }

def calculate_cart_tax(cart: Cart) -> (Decimal, Decimal):
    """
    Calculates the tax for a given cart based on the active tax configuration.

    :param cart: The Cart instance.
    :return: A tuple of (tax_rate, tax_amount).
    """
    tax_config = get_tax_configuration()
    if not tax_config or not tax_config.get('rate'):
        return Decimal('0.00'), Decimal('0.00')

    taxable_amount = cart.total_price # Tax is usually calculated on the subtotal
    tax_rate = tax_config['rate']
    tax_amount = taxable_amount * tax_rate
    
    return tax_rate, tax_amount.quantize(Decimal('0.01'))

@transaction.atomic
def set_cart_abandoned(cart: Cart):
    """
    Marks a cart as abandoned.
    """
    if not cart.abandoned:
        cart.abandoned = True
        cart.save(update_fields=['abandoned', 'updated_at'])
        logger.info(f"Cart {cart.id} marked as abandoned.")
        
        
@transaction.atomic
def update_cart_from_request_data(cart: Cart, data: dict) -> Cart:
    """
    Updates cart items based on data from a request, typically from a formset.
    This is useful for updating multiple item quantities at once from the cart view page.

    :param cart: The Cart instance to update.
    :param data: A dictionary-like object (e.g., request.POST) containing formset data.
    :return: The updated Cart instance.
    """
    # Example data format from a formset:
    # 'form-TOTAL_FORMS': ['2'], 'form-INITIAL_FORMS': ['2'], 'form-MIN_NUM_FORMS': ['0'],
    # 'form-MAX_NUM_FORMS': ['1000'], 'form-0-id': ['1'], 'form-0-quantity': ['3'],
    # 'form-1-id': ['2'], 'form-1-quantity': ['1']

    total_forms = int(data.get('form-TOTAL_FORMS', 0))
    
    with transaction.atomic():
        for i in range(total_forms):
            prefix = f'form-{i}-'
            item_id_key = f'{prefix}id'
            quantity_key = f'{prefix}quantity'
            
            if item_id_key in data and quantity_key in data:
                try:
                    item_id = int(data[item_id_key])
                    quantity = int(data[quantity_key])
                    
                    item = cart.items.get(id=item_id)
                    
                    if quantity > 0:
                        if quantity > item.product.stock:
                            # Handle stock limit - maybe set a message for the user
                            logger.warning(f"Stock limit exceeded for product {item.product.id}. Requested {quantity}, available {item.product.stock}.")
                            # Optionally, you can raise a validation error or just cap the quantity
                            item.quantity = item.product.stock
                        else:
                            item.quantity = quantity
                        item.save()
                    else:
                        # If quantity is 0 or less, remove the item
                        item.delete()
                        
                except (ValueError, CartItem.DoesNotExist) as e:
                    logger.error(f"Error updating cart item from request data: {e}")
                    # Decide how to handle errors: continue, log, or raise
                    continue
    
    cart.update_totals()
    return cart