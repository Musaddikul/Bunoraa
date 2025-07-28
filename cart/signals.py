# cart/signals.py
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .services import merge_session_cart_to_user_cart # Corrected import path

@receiver(user_logged_in)
def on_user_login(sender, request, user, **kwargs):
    """
    Signal receiver to merge an anonymous session cart into the user's
    database cart upon successful user login.
    """
    # Check if the session has a cart that needs to be merged
    # The middleware will handle the actual merge, this just ensures the flag is set
    # and the merge is attempted if not already done for this session.
    if not request.session.get('session_cart_merged', False):
        # The merge_session_cart_to_user_cart function handles the logic
        # of checking if there's an anonymous cart and merging it.
        merge_session_cart_to_user_cart(request, user)
        request.session['session_cart_merged'] = True # Mark as merged for this session
        request.session.modified = True # Ensure session is saved
