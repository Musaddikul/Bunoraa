# core/utils/helpers.py
"""
Utility helper functions.
"""
import re
import uuid
from decimal import Decimal, ROUND_HALF_UP
from django.utils.text import slugify


def generate_unique_slug(model_class, value, slug_field='slug'):
    """
    Generate a unique slug for a model instance.
    """
    base_slug = slugify(value)
    slug = base_slug
    counter = 1
    
    while model_class.objects.filter(**{slug_field: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug


def generate_unique_code(prefix='', length=8):
    """
    Generate a unique alphanumeric code.
    """
    unique_id = uuid.uuid4().hex[:length].upper()
    return f"{prefix}{unique_id}" if prefix else unique_id


def generate_order_number():
    """
    Generate a unique order number.
    """
    from datetime import datetime
    timestamp = datetime.now().strftime('%Y%m%d')
    unique_part = uuid.uuid4().hex[:6].upper()
    return f"ORD-{timestamp}-{unique_part}"


def generate_sku(prefix='SKU'):
    """
    Generate a unique SKU.
    """
    unique_id = uuid.uuid4().hex[:8].upper()
    return f"{prefix}-{unique_id}"


def round_decimal(value, places=2):
    """
    Round a decimal value to specified places.
    """
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return value.quantize(Decimal(10) ** -places, rounding=ROUND_HALF_UP)


def sanitize_string(value):
    """
    Sanitize a string by removing potentially harmful characters.
    """
    if not value:
        return value
    # Remove HTML tags
    value = re.sub(r'<[^>]+>', '', value)
    # Remove script tags content
    value = re.sub(r'<script[^>]*>.*?</script>', '', value, flags=re.DOTALL | re.IGNORECASE)
    return value.strip()


def mask_email(email):
    """
    Mask an email address for privacy.
    """
    if not email or '@' not in email:
        return email
    
    local, domain = email.split('@')
    if len(local) <= 2:
        masked_local = local[0] + '*'
    else:
        masked_local = local[0] + '*' * (len(local) - 2) + local[-1]
    
    return f"{masked_local}@{domain}"


def mask_phone(phone):
    """
    Mask a phone number for privacy.
    """
    if not phone:
        return phone
    
    phone_str = str(phone)
    if len(phone_str) <= 4:
        return phone_str
    
    return phone_str[:2] + '*' * (len(phone_str) - 4) + phone_str[-2:]


def calculate_percentage(part, whole):
    """
    Calculate percentage.
    """
    if whole == 0:
        return Decimal('0')
    return round_decimal((Decimal(str(part)) / Decimal(str(whole))) * 100)


def get_client_ip(request):
    """
    Get client IP address from request.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
