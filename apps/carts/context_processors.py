# apps/carts/context_processors.py
"""
Cart Context Processors
"""
from .services import CartService


def cart_context(request):
    """Add cart data to all templates."""
    try:
        cart = CartService.get_or_create_cart(request)
        return {
            'cart': cart,
            'cart_count': cart.item_count,
        }
    except:
        return {
            'cart': None,
            'cart_count': 0,
        }
