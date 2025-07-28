# payments/selectors.py
import uuid
from django.db.models import QuerySet, Sum
from django.core.cache import cache
from decimal import Decimal
from .models import Payment, PaymentMethod, Refund, PaymentEvent, PaymentStatus
import logging

logger = logging.getLogger(__name__)

CACHE_TTL_SHORT = 60 * 5 # 5 minutes
CACHE_TTL_LONG = 60 * 60 # 1 hour

def get_active_payment_methods() -> QuerySet[PaymentMethod]:
    """
    Retrieves all active payment methods.

    Returns:
        QuerySet[PaymentMethod]: A queryset of active PaymentMethod objects.
    """
    cache_key = "active_payment_methods"
    methods = cache.get(cache_key)
    if methods is None:
        methods = PaymentMethod.objects.filter(is_active=True).order_by('name')
        cache.set(cache_key, methods, CACHE_TTL_LONG)
    return methods

def get_payment_by_id(payment_id: uuid.UUID) -> Payment | None:
    """
    Retrieves a single payment by its UUID, with related data prefetched.

    Args:
        payment_id (uuid.UUID): The UUID of the payment.

    Returns:
        Payment | None: The Payment object, or None if not found.
    """
    try:
        return Payment.objects.select_related('user', 'method').prefetch_related(
            'refunds', 'events'
        ).get(id=payment_id)
    except Payment.DoesNotExist:
        logger.info(f"Payment with ID {payment_id} not found.")
        return None

def get_payments_for_order(order_id: str) -> QuerySet[Payment]:
    """
    Retrieves all payments associated with a specific order ID.

    Args:
        order_id (str): The ID of the order.

    Returns:
        QuerySet[Payment]: A queryset of Payment objects for the given order.
    """
    return Payment.objects.filter(order_id=order_id).select_related('method').order_by('-created_at')

def get_total_refunded_amount(payment: Payment) -> Decimal:
    """
    Calculates the total amount refunded for a given payment.

    Args:
        payment (Payment): The Payment object.

    Returns:
        Decimal: The total amount refunded.
    """
    total = payment.refunds.filter(status=Refund.RefundStatus.COMPLETED).aggregate(Sum('amount'))['amount__sum']
    return total or Decimal('0.00')

def get_payment_events_for_payment(payment: Payment) -> QuerySet[PaymentEvent]:
    """
    Retrieves all events for a specific payment, ordered by creation time.

    Args:
        payment (Payment): The Payment object.

    Returns:
        QuerySet[PaymentEvent]: A queryset of PaymentEvent objects for the given payment.
    """
    return payment.events.all().order_by('created_at')
