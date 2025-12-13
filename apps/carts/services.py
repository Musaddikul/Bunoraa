# apps/carts/services.py
"""
Cart Services
Business logic for cart operations.
"""
from .models import Cart


class CartService:
    """Service class for cart operations."""
    
    @staticmethod
    def get_or_create_cart(request):
        """Get existing cart or create new one."""
        if request.user.is_authenticated:
            # Get user's active cart
            cart, created = Cart.objects.get_or_create(
                user=request.user,
                is_active=True,
                checked_out=False
            )
            
            # Merge session cart if exists
            session_key = request.session.session_key
            if session_key:
                session_cart = Cart.objects.filter(
                    session_key=session_key,
                    user__isnull=True,
                    is_active=True
                ).first()
                
                if session_cart:
                    cart.merge_with(session_cart)
            
            return cart
        else:
            # Get or create session cart
            if not request.session.session_key:
                request.session.create()
            
            cart, created = Cart.objects.get_or_create(
                session_key=request.session.session_key,
                user__isnull=True,
                is_active=True,
                checked_out=False
            )
            return cart
    
    @staticmethod
    def get_cart_count(request):
        """Get cart item count for display."""
        try:
            cart = CartService.get_or_create_cart(request)
            return cart.item_count
        except:
            return 0
