"""
Checkout views
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView, View
from django.contrib import messages
from django.conf import settings

from apps.cart.services import CartService
from apps.orders.models import Order
from .models import CheckoutSession
from .services import CheckoutService


class CheckoutMixin:
    """Mixin for checkout views with common functionality."""
    
    def get_cart(self):
        """Get current cart."""
        if self.request.user.is_authenticated:
            return CartService.get_cart(user=self.request.user)
        elif self.request.session.session_key:
            return CartService.get_cart(session_key=self.request.session.session_key)
        return None
    
    def get_checkout_session(self, cart=None):
        """Get or create checkout session."""
        if not cart:
            cart = self.get_cart()
        
        if not cart:
            return None
        
        if self.request.user.is_authenticated:
            return CheckoutService.get_or_create_session(
                cart=cart,
                user=self.request.user
            )
        else:
            if not self.request.session.session_key:
                self.request.session.create()
            return CheckoutService.get_or_create_session(
                cart=cart,
                session_key=self.request.session.session_key
            )


class CheckoutView(CheckoutMixin, TemplateView):
    """Main checkout entry - cart review step."""
    template_name = 'checkout/cart_review.html'
    
    def get(self, request, *args, **kwargs):
        cart = self.get_cart()
        
        if not cart or not cart.items.exists():
            messages.warning(request, 'Your cart is empty.')
            return redirect('cart:cart')
        
        # Validate cart
        issues = CartService.validate_cart(cart)
        if issues:
            for issue in issues:
                messages.error(request, issue)
            return redirect('cart:cart')
        
        return super().get(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Checkout'
        
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        context['cart'] = cart
        context['cart_items'] = cart.items.select_related('product', 'variant').all() if cart else []
        context['cart_summary'] = CartService.get_cart_summary(cart) if cart else None
        context['checkout_session'] = checkout_session
        context['current_step'] = 'cart'
        context['cart_issues'] = []
        
        return context


class ShippingView(CheckoutMixin, View):
    """Shipping information step."""
    template_name = 'checkout/shipping.html'
    
    def get(self, request):
        cart = self.get_cart()
        
        if not cart or not cart.items.exists():
            return redirect('checkout:checkout')
        
        checkout_session = self.get_checkout_session(cart)
        
        context = {
            'page_title': 'Shipping Information',
            'cart': cart,
            'cart_summary': CartService.get_cart_summary(cart),
            'checkout_session': checkout_session,
            'shipping_options': CheckoutService.get_shipping_options(checkout_session),
            'current_step': 'shipping',
        }
        
        # Get user addresses if authenticated
        if request.user.is_authenticated:
            context['saved_addresses'] = request.user.addresses.filter(
                is_deleted=False
            ).order_by('-is_default_shipping')
        
        return render(request, self.template_name, context)
    
    def post(self, request):
        cart = self.get_cart()
        
        if not cart or not cart.items.exists():
            return redirect('checkout:checkout')
        
        checkout_session = self.get_checkout_session(cart)
        
        # Get shipping address data
        address_data = {
            'first_name': request.POST.get('first_name', ''),
            'last_name': request.POST.get('last_name', ''),
            'email': request.POST.get('email', ''),
            'phone': request.POST.get('phone', ''),
            'address_line_1': request.POST.get('address_line_1', ''),
            'address_line_2': request.POST.get('address_line_2', ''),
            'city': request.POST.get('city', ''),
            'state': request.POST.get('state', ''),
            'postal_code': request.POST.get('postal_code', ''),
            'country': request.POST.get('country', 'United States'),
            'billing_same_as_shipping': request.POST.get('billing_same_as_shipping') == 'on',
        }
        
        # Billing address if different
        if not address_data['billing_same_as_shipping']:
            address_data.update({
                'billing_first_name': request.POST.get('billing_first_name', ''),
                'billing_last_name': request.POST.get('billing_last_name', ''),
                'billing_address_line_1': request.POST.get('billing_address_line_1', ''),
                'billing_address_line_2': request.POST.get('billing_address_line_2', ''),
                'billing_city': request.POST.get('billing_city', ''),
                'billing_state': request.POST.get('billing_state', ''),
                'billing_postal_code': request.POST.get('billing_postal_code', ''),
                'billing_country': request.POST.get('billing_country', 'United States'),
            })
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'address_line_1', 'city', 'postal_code']
        for field in required_fields:
            if not address_data.get(field):
                messages.error(request, f'{field.replace("_", " ").title()} is required.')
                return redirect('checkout:shipping')
        
        # Update checkout session
        CheckoutService.update_shipping_address(checkout_session, address_data)
        
        # Set shipping method
        shipping_method = request.POST.get('shipping_method', CheckoutSession.SHIPPING_STANDARD)
        CheckoutService.set_shipping_method(checkout_session, shipping_method)
        
        return redirect('checkout:payment')


class PaymentView(CheckoutMixin, View):
    """Payment step."""
    template_name = 'checkout/payment.html'
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.can_proceed_to_payment:
            return redirect('checkout:shipping')
        
        # Create payment intent
        if checkout_session.payment_method == CheckoutSession.PAYMENT_STRIPE:
            CheckoutService.create_payment_intent(checkout_session)
        
        context = {
            'page_title': 'Payment',
            'cart': cart,
            'checkout_session': checkout_session,
            'checkout_summary': CheckoutService.get_checkout_summary(checkout_session),
            'current_step': 'payment',
            'stripe_publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
            'client_secret': checkout_session.stripe_client_secret,
        }
        
        return render(request, self.template_name, context)
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return redirect('checkout:checkout')
        
        # Set payment method
        payment_method = request.POST.get('payment_method', CheckoutSession.PAYMENT_STRIPE)
        CheckoutService.set_payment_method(checkout_session, payment_method)
        
        return redirect('checkout:review')


class ReviewView(CheckoutMixin, View):
    """Order review step before final submission."""
    template_name = 'checkout/review.html'
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.can_proceed_to_review:
            return redirect('checkout:payment')
        
        # Mark as review step
        CheckoutService.proceed_to_review(checkout_session)
        
        context = {
            'page_title': 'Review Order',
            'cart': cart,
            'checkout_session': checkout_session,
            'checkout_summary': CheckoutService.get_checkout_summary(checkout_session),
            'current_step': 'review',
        }
        
        return render(request, self.template_name, context)


class CompleteView(CheckoutMixin, View):
    """Complete checkout and create order."""
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return redirect('checkout:checkout')
        
        # Add order notes
        checkout_session.order_notes = request.POST.get('order_notes', '')
        checkout_session.save()
        
        # Complete checkout
        payment_intent_id = request.POST.get('payment_intent_id')
        order, error = CheckoutService.complete_checkout(
            checkout_session,
            payment_intent_id=payment_intent_id
        )
        
        if error:
            messages.error(request, f'Checkout failed: {error}')
            return redirect('checkout:review')
        
        if order:
            return redirect('checkout:success', order_id=order.id)
        
        messages.error(request, 'Failed to create order. Please try again.')
        return redirect('checkout:review')


class SuccessView(TemplateView):
    """Order success page."""
    template_name = 'checkout/success.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order_id = self.kwargs.get('order_id')
        
        # Get order - allow viewing for owner or session
        order = get_object_or_404(Order, id=order_id)
        
        # Security check
        if self.request.user.is_authenticated:
            if order.user != self.request.user:
                from django.http import Http404
                raise Http404("Order not found")
        else:
            # For guest orders, we'd need session verification
            pass
        
        context['page_title'] = f'Order Confirmed - {order.order_number}'
        context['order'] = order
        
        return context
