# cart/tasks.py
from celery import shared_task
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _ # Added for internationalization
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=300) # Retry after 5 minutes
def send_abandoned_cart_notification(self, cart_id: int):
    """
    Celery task to send an abandoned cart notification for a *single* cart.
    It's idempotent and handles retries.
    """
    from .models import Cart # Import inside task to avoid circular imports
    from django.core.mail import send_mail
    from django.template.loader import render_to_string
    from django.urls import reverse

    try:
        cart = Cart.objects.get(id=cart_id)

        # Only send if cart is not checked out, not converted, and not already abandoned
        # and if it has items.
        if cart.checked_out or cart.converted or cart.abandoned or cart.is_empty:
            return

        # Define abandonment threshold (e.g., 24 hours of inactivity)
        abandonment_threshold_hours = getattr(settings, 'CART_ABANDONMENT_THRESHOLD_HOURS', 24)
        if cart.updated_at > timezone.now() - timezone.timedelta(hours=abandonment_threshold_hours):
            return

        # Mark the cart as abandoned
        cart.mark_abandoned()

        # Prepare email content
        subject = _("Don't Miss Out! Your Cart Awaits at {site_name}").format(site_name=settings.SITE_NAME)
        
        # Assuming you have a URL for resuming the cart
        # This might require a custom view or a deep link
        cart_resume_url = settings.FRONTEND_BASE_URL + reverse('cart:detail') # Example: your frontend cart URL
        if cart.user:
            # If user is authenticated, you might add a token for direct login/cart access
            # For simplicity, we'll just link to the cart page.
            pass

        context = {
            'cart': cart,
            'user': cart.user,
            'cart_items': cart.active_items,
            'site_name': settings.SITE_NAME,
            'cart_resume_url': cart_resume_url,
            'contact_email': settings.DEFAULT_FROM_EMAIL,
        }

        html_message = render_to_string('cart/emails/abandoned_cart_notification.html', context)
        plain_message = render_to_string('cart/emails/abandoned_cart_notification.txt', context)

        recipient_list = []
        if cart.user and cart.user.email:
            recipient_list.append(cart.user.email)
        elif cart.session_key:
            # For anonymous carts, you might not have an email.
            # You could potentially store a temporary email during checkout process.
            # For now, we'll skip if no user email.
            logger.warning(f"No email address found for anonymous cart {cart_id}. Skipping email notification.")
            return

        if not recipient_list:
            logger.warning(f"No recipient email found for cart {cart_id}. Skipping email notification.")
            return

        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            html_message=html_message,
            fail_silently=False,
        )

    except Cart.DoesNotExist:
        logger.warning(f"Abandoned cart task: Cart {cart_id} does not exist. Skipping notification.")
    except Exception as e:
        logger.error(f"Error sending abandoned cart notification for cart {cart_id}: {e}", exc_info=True)
        # Retry the task if it's a recoverable error
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.critical(f"Max retries exceeded for abandoned cart notification for cart {cart_id}. Manual intervention may be required.")

@shared_task
def find_and_notify_abandoned_carts():
    """
    Celery task to find abandoned carts and dispatch individual notification tasks.
    This task should be triggered periodically (e.g., via Celery Beat or a management command).
    """
    from .models import Cart # Import inside task to avoid circular imports
    from django.utils import timezone
    from django.conf import settings

    abandonment_threshold_hours = getattr(settings, 'CART_ABANDONMENT_THRESHOLD_HOURS', 24)
    time_threshold = timezone.now() - timezone.timedelta(hours=abandonment_threshold_hours)

    # Find carts that are:
    # 1. Not checked out
    # 2. Not converted to an order
    # 3. Not already marked as abandoned
    # 4. Have active items
    # 5. Have not been updated recently (older than the threshold)
    # 6. Are associated with a user (for sending email notifications)
    #    (You might extend this to anonymous carts if you collect emails during checkout)
    eligible_carts = Cart.objects.filter(
        checked_out=False,
        converted=False,
        abandoned=False,
        updated_at__lt=time_threshold,
        user__isnull=False, # Only consider carts with an associated user for now
    ).exclude(items__isnull=True) # Exclude carts with no items

    for cart in eligible_carts:
        # Dispatch the individual notification task for each eligible cart
        send_abandoned_cart_notification.delay(cart.id)

@shared_task
def generate_invoice_task(order_id):
    """
    Asynchronous task to generate a PDF invoice and save its URL.
    """
    from .models import Order # Import inside task to avoid circular imports
    from django.template.loader import render_to_string
    import tempfile
    from weasyprint import HTML

    try:
        order = Order.objects.get(pk=order_id)
        context = {'order': order}
        html_string = render_to_string("orders/invoice_template.html", context)
        
        # In a real enterprise app, this would upload to cloud storage (e.g., S3)
        # and save the public URL. For now, we simulate it.
        # pdf_url = upload_to_s3(pdf_file)
        # order.invoice_url = pdf_url
        # order.save(update_fields=['invoice_url'])
        
    except Order.DoesNotExist:
        # Log this error
        logger.error(f"Invoice generation task: Order {order_id} does not exist.")
        return
    except Exception as e:
        logger.error(f"Error generating invoice for order {order_id}: {e}", exc_info=True)

@shared_task
def process_pending_orders():
    # ... logic for periodic tasks
    pass