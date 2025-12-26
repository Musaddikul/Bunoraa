"""
Cart views - Frontend pages
"""
from django.shortcuts import render
from django.views.generic import TemplateView
from .services import CartService


class CartView(TemplateView):
    """Shopping cart page."""
    template_name = 'cart/cart.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Shopping Cart'
        
        # Get cart
        cart = None
        if self.request.user.is_authenticated:
            cart = CartService.get_cart(user=self.request.user)
        elif self.request.session.session_key:
            cart = CartService.get_cart(session_key=self.request.session.session_key)
        
        if cart:
            from apps.currencies.services import CurrencyService
            target_currency = CurrencyService.get_user_currency(user=self.request.user if self.request.user.is_authenticated else None, request=self.request)
            context['cart'] = cart
            context['cart_summary'] = CartService.get_cart_summary(cart, currency=target_currency)
            context['cart_issues'] = CartService.validate_cart(cart)
        else:
            context['cart'] = None
            context['cart_summary'] = {'items': [], 'item_count': 0, 'subtotal': '0.00', 'total': '0.00', 'currency': {'code': 'BDT', 'symbol': '৳'}}
        
        return context
