# wishlist/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.http import require_POST
from django.db import transaction
from django.db.models import Exists, OuterRef, BooleanField, Value
from .models import Wishlist
from products.models import Product
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

@login_required
def wishlist_detail(request):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

    products = wishlist.products.all().select_related('category', 'brand').annotate(
        is_wished=Value(True, output_field=BooleanField()) # Since these are already in the wishlist
    )

    logger.debug(f"Wishlist products count for user {request.user.id}: {products.count()}")
    return render(request, 'wishlist/detail.html', {
        'wishlist': wishlist,
        'products': products
    })

@require_POST
@login_required
def toggle_wishlist(request, product_id):
    """
    API endpoint to add or remove a product from the user's wishlist.
    This view handles both adding and removing based on the product's current presence.
    It returns a JSON response indicating success/failure and the new wishlist count.
    """
    if not request.user.is_authenticated:
        return HttpResponseForbidden(JsonResponse({'error': 'Authentication required.'}))

    product = get_object_or_404(Product, id=product_id)
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

    with transaction.atomic():
        if wishlist.products.filter(id=product.id).exists():
            wishlist.products.remove(product)
            added = False
            message = "Product removed from your wishlist."
            logger.info(f"User {request.user.id} removed product {product_id} from wishlist.")
        else:
            wishlist.products.add(product)
            added = True
            message = "Product added to your wishlist."
            logger.info(f"User {request.user.id} added product {product_id} to wishlist.")

        return JsonResponse({
            'success': True,
            'added': added,
            'wishlist_count': wishlist.products.count(),
            'message': message
        })


@login_required
def wishlist_count_api(request):
    """
    API endpoint to return the current count of items in the user's wishlist.
    Returns a JSON response.
    """
    if not request.user.is_authenticated:
        # For a count API, it might be better to return 0 for unauthenticated users
        # or require authentication depending on the frontend's needs.
        # Here, we return 0 as it's a count.
        return JsonResponse({'wishlist_count': 0})

    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    count = wishlist.products.count()
    return JsonResponse({'wishlist_count': count})

