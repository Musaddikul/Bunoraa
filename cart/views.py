# cart/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext_lazy as _
from collections import defaultdict
from decimal import Decimal
from django.utils.text import slugify
import json # Import json

from products.models import Product
from shipping.models import ShippingMethod
from payments.models import PaymentMethod # Import PaymentMethod
from accounts.models import Seller # Assuming Seller model is in accounts app

from .models import Cart
from .forms import CouponForm, ShippingSelectionForm
from .selectors import get_user_cart, get_active_cart_items, get_saved_cart_items
from .serializers import CartSerializer # Import CartSerializer
from shipping.api.serializers import ShippingMethodSerializer # Import ShippingMethodSerializer
from payments.api.serializers import PaymentMethodSerializer # Import PaymentMethodSerializer

import logging
logger = logging.getLogger(__name__)

@require_GET
def cart_detail(request):
    """
    Displays the full cart details page.
    This view now primarily serves the initial HTML structure.
    All dynamic updates are handled by JavaScript making API calls.
    """
    cart = get_user_cart(request)
    active_items = get_active_cart_items(cart)
    saved_items = get_saved_cart_items(cart)
    shipping_methods_queryset = ShippingMethod.objects.filter(is_active=True).order_by('base_charge')
    payment_methods_queryset = PaymentMethod.objects.filter(is_active=True).order_by('name')

    # Serialize data for Alpine.js
    cart_data_json = json.dumps(CartSerializer(cart, context={'request': request}).data)
    shipping_methods_json = json.dumps(ShippingMethodSerializer(shipping_methods_queryset, many=True).data)
    payment_methods_json = json.dumps(PaymentMethodSerializer(payment_methods_queryset, many=True).data)

    # Group active items by seller for initial render (still needed for server-side rendering)
    grouped_items_by_seller = []
    seller_map = defaultdict(lambda: {'items': [], 'subtotal': Decimal('0.00'), 'item_total': 0})

    for item in active_items:
        seller = item.product.seller
        if seller:
            seller_map[seller.id]['seller'] = seller
            seller_map[seller.id]['items'].append(item)
            seller_map[seller.id]['subtotal'] += item.total_price
            seller_map[seller.id]['item_total'] += item.quantity
        else:
            default_seller_id = 'default_store'
            if default_seller_id not in seller_map:
                class DefaultSeller:
                    def __init__(self, id, store_name, image_url):
                        self.id = id
                        self.store_name = store_name
                        self.email = f"info@{slugify(store_name)}.com"
                        self.profile = type('DefaultProfile', (object,), {'image': type('DefaultImage', (object,), {'url': image_url})})()
                    
                    def __str__(self):
                        return self.store_name

                    def get_full_name(self):
                        return self.store_name

                seller_map[default_seller_id]['seller'] = DefaultSeller(
                    id=default_seller_id,
                    store_name=_('Our Store'),
                    image_url='/static/images/default-store.png'
                )
            seller_map[default_seller_id]['items'].append(item)
            seller_map[default_seller_id]['subtotal'] += item.total_price
            seller_map[default_seller_id]['item_total'] += item.quantity

    for seller_id in seller_map:
        grouped_items_by_seller.append(seller_map[seller_id])
    
    grouped_items_by_seller.sort(key=lambda x: x['seller'].store_name if hasattr(x['seller'], 'store_name') else '')

    ctx = {
        'cart': cart,
        'active_items': active_items,
        'saved_items': saved_items,
        'grouped_items_by_seller': grouped_items_by_seller,
        'shipping_methods': shipping_methods_queryset, # Keep queryset for initial render if needed
        'payment_methods': payment_methods_queryset, # Keep queryset for initial render if needed
        'coupon_form': CouponForm(initial={'code': cart.coupon.code}) if cart.coupon else CouponForm(),
        'shipping_form': ShippingSelectionForm(initial={'shipping_method': cart.shipping_method.id}) if cart.shipping_method else ShippingSelectionForm(),
        'cart_data_json': cart_data_json,
        'shipping_methods_json': shipping_methods_json,
        'payment_methods_json': payment_methods_json,
    }
    return render(request, 'cart/detail.html', ctx)


@require_GET
def cart_sidebar(request):
    """
    Renders the quick cart sidebar content.
    This is still an HTML partial, as it's loaded via a non-API endpoint.
    """
    cart = get_user_cart(request)
    active_items = get_active_cart_items(cart)
    ctx = {
        'cart': cart,
        'active_items': active_items,
        'cart_total': cart.final_total,
        'item_count': cart.total_items
    }
    return render(request, 'cart/partials/sidebar.html', ctx)

@require_GET
def related_products_partial(request):
    """
    Renders a partial for related products.
    This is still an HTML partial.
    """
    from products.models import Product
    related_products = Product.objects.order_by('?')[:4] # Fetch 4 random products
    return render(request, 'cart/partials/related_products.html', {'related_products': related_products})

# Removed all POST views (cart_add, cart_remove, cart_update_quantity,
# cart_toggle_saved, apply_coupon, remove_coupon, update_shipping, cart_empty, sync_cart)
# as their functionality is now handled by API views and JavaScript.
