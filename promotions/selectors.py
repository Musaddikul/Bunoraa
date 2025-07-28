# promotions/selectors.py
from django.utils import timezone
from .models import Coupon
from django.db.models import Q

def get_active_coupons_for_user(user):
    """
    Retrieves a queryset of active coupons available for a specific user.
    Filters out expired, inactive, or fully used coupons, and those already used by the user
    if a per-user limit applies.

    :param user: The user object for whom to retrieve coupons. Can be an anonymous user.
    :return: QuerySet of available Coupon objects.
    """
    current_time = timezone.now()
    queryset = Coupon.objects.filter(
        is_active=True,
        valid_from__lte=current_time,
    ).filter(
        Q(valid_until__gte=current_time) | Q(valid_until__isnull=True)
    ).filter(
        Q(usage_limit__gt=models.F('used_count')) | Q(usage_limit__isnull=True)
    )

    if user and user.is_authenticated:
        # Exclude coupons where the user has reached their individual limit
        # This is done by checking if usage_limit_per_user is not null AND
        # if the user is already in the `users_used` ManyToMany field for this coupon
        # AND the count of times the user has used it is >= usage_limit_per_user
        queryset = queryset.exclude(
            Q(usage_limit_per_user__isnull=False) & Q(users_used=user)
        )
        # Note: The actual count of how many times a user used a coupon is better
        # tracked in the Order model or a dedicated CouponUsage model for more accuracy.
        # This selector primarily checks if the user has *ever* used it,
        # and relies on the service layer for the exact count validation against usage_limit_per_user.
        # The `users_used` M2M field here acts as a quick check for "has this specific user used this coupon at all?"
        # For precise 'usage_limit_per_user' enforcement, the service layer's `validate_coupon` is key.

    return queryset.distinct() # Use distinct to avoid duplicates if a coupon can be related to a user multiple times through other relations

def get_coupon_by_code(code: str) -> Coupon:
    """
    Retrieves a coupon by its code, case-insensitive.

    :param code: The coupon code string.
    :return: The Coupon object.
    :raises Coupon.DoesNotExist: If no coupon with the given code is found.
    """
    return Coupon.objects.get(code__iexact=code)

