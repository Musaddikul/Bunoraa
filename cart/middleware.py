# cart/middleware.py
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.conf import settings
import logging

from .selectors import get_user_cart
from .services import merge_session_cart_to_user_cart
from .models import Cart # Import Cart model directly
from .tasks import send_abandoned_cart_notification # Import Celery task

logger = logging.getLogger(__name__)
User = get_user_model()

class CartMiddleware(MiddlewareMixin):
    """
    Attaches the user's or session's active cart to the request object.
    Handles session cart migration upon user login.
    """
    def process_request(self, request):
        """
        Handles the request before passing to the view.
        Attaches `request.cart` and manages session/user cart migration.
        """
        # Skip admin and static file requests
        if request.path.startswith('/admin/') or request.path.startswith('/static/'):
            return None

        # Ensure session key exists for anonymous users if not already present
        if not request.session.session_key:
            request.session.save()

        # Get the cart for the current request context (user or session)
        request.cart = get_user_cart(request)

        # If user is authenticated and there was a session cart, merge them
        # This check should happen *after* request.cart is set, as get_user_cart
        # will retrieve the *user's* cart if authenticated.
        if request.user.is_authenticated and request.session.get('session_cart_merged', False) is False:
            # Only attempt merge if user is authenticated and it hasn't been merged in this session yet
            # The actual merge logic is in utils.merge_session_cart_to_user_cart
            # This flag prevents repeated merge attempts on every request after login
            merge_session_cart_to_user_cart(request, request.user)
            request.session['session_cart_merged'] = True # Mark as merged for this session
            request.session.modified = True
            # After merge, ensure request.cart is updated to the user's cart
            request.cart = get_user_cart(request)

    def process_response(self, request, response):
        """
        Handles the response after the view is processed.
        Ensures the cart is saved if it's active and not checked out.
        """
        # Skip admin and static file requests
        if request.path.startswith('/admin/') or request.path.startswith('/static/'):
            return response

        cart = getattr(request, 'cart', None)
        if cart and not cart.checked_out:
            # Ensure the cart object is fresh from the database before saving
            cart.refresh_from_db()
            # Only save if the cart is a database cart (not a SessionCart mock)
            # and it hasn't been checked out.
            if isinstance(cart, Cart):
                cart.save()
        return response

class AbandonedCartNotificationMiddleware(MiddlewareMixin):
    """
    Middleware to trigger abandoned cart notifications asynchronously.
    Checks for carts that have been abandoned and sends a notification if configured.
    """
    def process_response(self, request, response):
        """
        Handles abandoned cart notifications.
        """
        # Only process if the user is not authenticated or if the cart is not checked out
        # and it's a database cart (SessionCart doesn't have 'abandoned' status)
        cart = getattr(request, 'cart', None)
        
        # We only track abandonment for database carts associated with users
        if not isinstance(cart, Cart) or cart.checked_out:
            return response

        # Check if the cart is eligible to be marked as abandoned and notified
        # This logic should be idempotent and handle cases where notifications are already sent
        
        # To avoid sending multiple notifications for the same cart within a short period,
        # or if the cart is actively being used, we rely on a Celery task.
        # The task itself will handle the logic of checking `abandoned` status and `abandoned_at` timestamp.
        
        # Trigger the task only if the cart is not checked out and
        # the request is not an AJAX request (to avoid triggering on every user interaction)
        # and if the cart is not already marked as abandoned (to avoid redundant tasks)
        # The abandoned cart notification logic should be handled by a periodic Celery Beat task,
        # not by middleware on every response.
        # This section is commented out to prevent excessive task queuing.
        # if not cart.checked_out and not cart.abandoned:
        #     send_abandoned_cart_notification.delay(cart.id)
            
        return response

