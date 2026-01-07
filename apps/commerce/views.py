"""
Commerce views - Web views for cart, checkout, and wishlist
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.views.generic import TemplateView, ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.http import JsonResponse, HttpResponseBadRequest, Http404
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone

from .models import (
    Cart, CartItem, Wishlist, WishlistItem, WishlistShare,
    CheckoutSession
)
from .services import CartService, WishlistService, CheckoutService


# =============================================================================
# Cart Views
# =============================================================================

class CartView(TemplateView):
    """Cart page view."""
    template_name = 'cart/cart.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        user = self.request.user if self.request.user.is_authenticated else None
        session_key = self.request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        context['cart'] = cart
        context['cart_items'] = cart.items.select_related('product', 'variant').all() if cart else []
        context['cart_summary'] = CartService.get_cart_summary(cart) if cart else None
        
        return context


class CartAddView(View):
    """Add item to cart."""
    
    def post(self, request):
        from apps.catalog.models import Product, ProductVariant
        
        product_id = request.POST.get('product_id')
        variant_id = request.POST.get('variant_id')
        quantity = int(request.POST.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id, is_active=True, is_deleted=False)
            variant = ProductVariant.objects.get(id=variant_id) if variant_id else None
            
            user = request.user if request.user.is_authenticated else None
            if not request.session.session_key:
                request.session.create()
            session_key = request.session.session_key
            
            cart = CartService.get_or_create_cart(user=user, session_key=session_key)
            item = CartService.add_item(cart, product, quantity, variant)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': f'{product.name} added to cart',
                    'cart_count': cart.item_count,
                    'cart_total': str(cart.total),
                })
            
            messages.success(request, f'{product.name} added to cart')
            return redirect('commerce:cart')
            
        except Product.DoesNotExist:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
            messages.error(request, 'Product not found')
            return redirect('catalog:product_list')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
            messages.error(request, str(e))
            return redirect(request.META.get('HTTP_REFERER', 'commerce:cart'))


class CartUpdateView(View):
    """Update cart item quantity."""
    
    def post(self, request):
        item_id = request.POST.get('item_id')
        quantity = int(request.POST.get('quantity', 1))
        
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'Cart not found'}, status=404)
            messages.error(request, 'Cart not found')
            return redirect('commerce:cart')
        
        try:
            CartService.update_item_quantity(cart, item_id, quantity)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Cart updated',
                    'cart_count': cart.item_count,
                    'cart_total': str(cart.total),
                    'summary': CartService.get_cart_summary(cart),
                })
            
            messages.success(request, 'Cart updated')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
            messages.error(request, str(e))
        
        return redirect('commerce:cart')


class CartRemoveView(View):
    """Remove item from cart."""
    
    def post(self, request):
        item_id = request.POST.get('item_id')
        
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if cart:
            CartService.remove_item(cart, item_id)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Item removed',
                    'cart_count': cart.item_count,
                    'cart_total': str(cart.total),
                })
            
            messages.success(request, 'Item removed from cart')
        
        return redirect('commerce:cart')


class CartClearView(View):
    """Clear all items from cart."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if cart:
            CartService.clear_cart(cart)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'message': 'Cart cleared'})
            
            messages.success(request, 'Cart cleared')
        
        return redirect('commerce:cart')


class CartApplyCouponView(View):
    """Apply coupon to cart."""
    
    def post(self, request):
        coupon_code = request.POST.get('coupon_code', '').strip()
        
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'Cart not found'}, status=404)
            messages.error(request, 'Cart not found')
            return redirect('commerce:cart')
        
        try:
            CartService.apply_coupon(cart, coupon_code)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Coupon applied',
                    'summary': CartService.get_cart_summary(cart),
                })
            
            messages.success(request, 'Coupon applied successfully')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
            messages.error(request, str(e))
        
        return redirect('commerce:cart')


class CartRemoveCouponView(View):
    """Remove coupon from cart."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if cart:
            CartService.remove_coupon(cart)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Coupon removed',
                    'summary': CartService.get_cart_summary(cart),
                })
            
            messages.success(request, 'Coupon removed')
        
        return redirect('commerce:cart')


# =============================================================================
# Wishlist Views
# =============================================================================

class WishlistView(LoginRequiredMixin, TemplateView):
    """Wishlist page view."""
    template_name = 'wishlist/list.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        wishlist = WishlistService.get_or_create_wishlist(self.request.user)
        items = wishlist.items.select_related('product', 'variant').prefetch_related('product__images').all()
        
        context['wishlist'] = wishlist
        context['wishlist_items'] = items
        context['price_drop_items'] = WishlistService.get_items_with_price_drops(wishlist)
        
        return context


class WishlistAddView(LoginRequiredMixin, View):
    """Add item to wishlist."""
    
    def post(self, request):
        from apps.catalog.models import Product, ProductVariant
        
        product_id = request.POST.get('product_id')
        variant_id = request.POST.get('variant_id')
        
        try:
            product = Product.objects.get(id=product_id, is_active=True, is_deleted=False)
            variant = ProductVariant.objects.get(id=variant_id) if variant_id else None
            
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            WishlistService.add_item(wishlist, product, variant)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': f'{product.name} added to wishlist',
                    'wishlist_count': wishlist.item_count,
                })
            
            messages.success(request, f'{product.name} added to wishlist')
            
        except Product.DoesNotExist:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
            messages.error(request, 'Product not found')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
            messages.error(request, str(e))
        
        return redirect(request.META.get('HTTP_REFERER', 'commerce:wishlist'))


class WishlistRemoveView(LoginRequiredMixin, View):
    """Remove item from wishlist."""
    
    def post(self, request):
        item_id = request.POST.get('item_id')
        
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        WishlistService.remove_item(wishlist, item_id)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Item removed from wishlist',
                'wishlist_count': wishlist.item_count,
            })
        
        messages.success(request, 'Item removed from wishlist')
        return redirect('commerce:wishlist')


class WishlistMoveToCartView(LoginRequiredMixin, View):
    """Move wishlist item to cart."""
    
    def post(self, request):
        item_id = request.POST.get('item_id')
        
        try:
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            item = wishlist.items.get(id=item_id)
            
            if not request.session.session_key:
                request.session.create()
            
            cart = CartService.get_or_create_cart(
                user=request.user,
                session_key=request.session.session_key
            )
            
            WishlistService.move_to_cart(item, cart)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Item moved to cart',
                    'wishlist_count': wishlist.item_count,
                    'cart_count': cart.item_count,
                })
            
            messages.success(request, 'Item moved to cart')
            
        except WishlistItem.DoesNotExist:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'Item not found'}, status=404)
            messages.error(request, 'Item not found')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
            messages.error(request, str(e))
        
        return redirect('commerce:wishlist')


class WishlistShareView(LoginRequiredMixin, View):
    """Create shareable wishlist link."""
    
    def post(self, request):
        wishlist = WishlistService.get_or_create_wishlist(request.user)
        
        share = WishlistService.create_share_link(
            wishlist,
            expires_days=request.POST.get('expires_days', 30),
            allow_purchase=request.POST.get('allow_purchase') == 'true'
        )
        
        share_url = request.build_absolute_uri(
            reverse('commerce:shared_wishlist', kwargs={'token': share.share_token})
        )
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'share_url': share_url,
                'token': share.share_token,
            })
        
        messages.success(request, f'Share link created: {share_url}')
        return redirect('commerce:wishlist')


class SharedWishlistView(TemplateView):
    """View a shared wishlist."""
    template_name = 'wishlist/shared.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        token = kwargs.get('token')
        wishlist = WishlistService.get_shared_wishlist(token)
        
        if not wishlist:
            raise Http404("Wishlist not found or expired")
        
        context['wishlist'] = wishlist
        context['wishlist_items'] = wishlist.items.select_related('product').prefetch_related('product__images').all()
        context['share'] = WishlistShare.objects.get(share_token=token)
        
        return context


# =============================================================================
# Checkout Views
# =============================================================================

class CheckoutView(TemplateView):
    """Main checkout page."""
    template_name = 'checkout/checkout.html'
    
    def get(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart or not cart.items.exists():
            messages.warning(request, 'Your cart is empty')
            return redirect('commerce:cart')
        
        return super().get(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        user = self.request.user if self.request.user.is_authenticated else None
        session_key = self.request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        checkout_session = CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key,
            request=self.request
        )
        
        context['cart'] = cart
        context['cart_items'] = cart.items.select_related('product', 'variant').all()
        context['checkout_session'] = checkout_session
        context['shipping_methods'] = self._get_shipping_methods()
        context['payment_methods'] = self._get_payment_methods()
        
        return context
    
    def _get_shipping_methods(self):
        """Get available shipping methods."""
        return [
            {'value': 'standard', 'label': 'Standard Shipping (5-7 days)', 'price': '60.00'},
            {'value': 'express', 'label': 'Express Shipping (2-3 days)', 'price': '120.00'},
            {'value': 'overnight', 'label': 'Overnight Shipping', 'price': '200.00'},
            {'value': 'pickup', 'label': 'Store Pickup', 'price': '0.00'},
        ]
    
    def _get_payment_methods(self):
        """Get available payment methods."""
        return [
            {'value': 'cod', 'label': 'Cash on Delivery', 'description': '+৳20 COD fee'},
            {'value': 'bkash', 'label': 'bKash', 'description': 'Pay with bKash'},
            {'value': 'nagad', 'label': 'Nagad', 'description': 'Pay with Nagad'},
            {'value': 'card', 'label': 'Credit/Debit Card', 'description': 'Visa, Mastercard'},
        ]


class CheckoutUpdateInfoView(View):
    """Update checkout shipping information."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            return JsonResponse({'success': False, 'message': 'Cart not found'}, status=404)
        
        checkout_session = CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key
        )
        
        data = {
            'email': request.POST.get('email'),
            'shipping_first_name': request.POST.get('first_name'),
            'shipping_last_name': request.POST.get('last_name'),
            'shipping_phone': request.POST.get('phone'),
            'shipping_address_line_1': request.POST.get('address_line_1'),
            'shipping_address_line_2': request.POST.get('address_line_2', ''),
            'shipping_city': request.POST.get('city'),
            'shipping_state': request.POST.get('state', ''),
            'shipping_postal_code': request.POST.get('postal_code'),
            'shipping_country': request.POST.get('country', 'BD'),
        }
        
        CheckoutService.update_shipping_info(checkout_session, data)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Information saved'})
        
        return redirect('commerce:checkout')


class CheckoutSelectShippingView(View):
    """Select shipping method."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            return JsonResponse({'success': False, 'message': 'Cart not found'}, status=404)
        
        checkout_session = CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key
        )
        
        method = request.POST.get('shipping_method')
        CheckoutService.select_shipping_method(checkout_session, method)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Shipping method selected',
                'shipping_cost': str(checkout_session.shipping_cost),
                'total': str(checkout_session.total),
            })
        
        return redirect('commerce:checkout')


class CheckoutSelectPaymentView(View):
    """Select payment method."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            return JsonResponse({'success': False, 'message': 'Cart not found'}, status=404)
        
        checkout_session = CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key
        )
        
        method = request.POST.get('payment_method')
        CheckoutService.select_payment_method(checkout_session, method)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Payment method selected'})
        
        return redirect('commerce:checkout')


class CheckoutCompleteView(View):
    """Complete checkout and place order."""
    
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        if not cart:
            messages.error(request, 'Cart not found')
            return redirect('commerce:cart')
        
        checkout_session = CheckoutService.get_or_create_session(
            cart=cart,
            user=user,
            session_key=session_key
        )
        
        try:
            order = CheckoutService.complete_checkout(checkout_session)
            
            messages.success(request, f'Order placed successfully! Order number: {order.order_number}')
            return redirect('commerce:order_confirmation', order_number=order.order_number)
            
        except Exception as e:
            messages.error(request, str(e))
            return redirect('commerce:checkout')


class OrderConfirmationView(TemplateView):
    """Order confirmation page."""
    template_name = 'checkout/confirmation.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        order_number = kwargs.get('order_number')
        user = self.request.user if self.request.user.is_authenticated else None
        
        # Get order from orders app
        from apps.orders.services import OrderService
        order = OrderService.get_order_by_number(order_number, user)
        
        if not order:
            raise Http404("Order not found")
        
        context['order'] = order
        context['order_items'] = order.items.all()
        
        return context


# =============================================================================
# AJAX/API Helper Views
# =============================================================================

class CartCountView(View):
    """Get current cart item count (AJAX)."""
    
    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        cart = CartService.get_cart(user=user, session_key=session_key)
        
        return JsonResponse({
            'count': cart.item_count if cart else 0,
            'total': str(cart.total) if cart else '0',
        })


class WishlistCountView(LoginRequiredMixin, View):
    """Get current wishlist item count (AJAX)."""
    
    def get(self, request):
        try:
            wishlist = Wishlist.objects.get(user=request.user)
            count = wishlist.item_count
        except Wishlist.DoesNotExist:
            count = 0
        
        return JsonResponse({'count': count})


class CheckWishlistView(LoginRequiredMixin, View):
    """Check if product is in wishlist (AJAX)."""
    
    def get(self, request):
        product_id = request.GET.get('product_id')
        
        try:
            wishlist = Wishlist.objects.get(user=request.user)
            in_wishlist = wishlist.items.filter(product_id=product_id).exists()
        except Wishlist.DoesNotExist:
            in_wishlist = False
        
        return JsonResponse({'in_wishlist': in_wishlist})


class ToggleWishlistView(LoginRequiredMixin, View):
    """Toggle product in wishlist (AJAX)."""
    
    def post(self, request):
        from apps.catalog.models import Product
        
        product_id = request.POST.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
            wishlist = WishlistService.get_or_create_wishlist(request.user)
            
            # Check if already in wishlist
            existing = wishlist.items.filter(product=product).first()
            
            if existing:
                WishlistService.remove_item(wishlist, existing.id)
                return JsonResponse({
                    'success': True,
                    'in_wishlist': False,
                    'message': 'Removed from wishlist',
                    'count': wishlist.item_count,
                })
            else:
                WishlistService.add_item(wishlist, product)
                return JsonResponse({
                    'success': True,
                    'in_wishlist': True,
                    'message': 'Added to wishlist',
                    'count': wishlist.item_count,
                })
                
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
