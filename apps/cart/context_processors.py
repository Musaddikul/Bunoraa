"""
Cart context processor
"""
from .services import CartService


def cart_context(request):
    """Add cart data to template context."""
    cart = None
    cart_count = 0
    cart_total = '0.00'
    
    try:
        if request.user.is_authenticated:
            cart = CartService.get_cart(user=request.user)
        elif hasattr(request, 'session') and request.session.session_key:
            cart = CartService.get_cart(session_key=request.session.session_key)
        
        if cart:
            cart_count = cart.item_count
            cart_total = str(cart.total)
    except Exception:
        pass
    
    return {
        'cart_count': cart_count,
        'cart_total': cart_total,
    }
