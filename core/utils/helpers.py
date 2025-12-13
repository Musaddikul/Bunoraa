# core/utils/helpers.py
"""
Helper Functions
Common utility functions used across the application.
"""
import re
import uuid
import hashlib
from datetime import datetime
from decimal import Decimal
from django.utils.text import slugify
from django.utils.crypto import get_random_string


def generate_unique_slug(model_class, value, slug_field='slug'):
    """
    Generate a unique slug for a model instance.
    
    Args:
        model_class: The Django model class
        value: The value to slugify
        slug_field: The name of the slug field (default: 'slug')
    
    Returns:
        A unique slug string
    """
    base_slug = slugify(value)
    slug = base_slug
    counter = 1
    
    while model_class.objects.filter(**{slug_field: slug}).exists():
        slug = f'{base_slug}-{counter}'
        counter += 1
    
    return slug


def generate_sku(prefix='BN'):
    """
    Generate a unique SKU (Stock Keeping Unit).
    
    Args:
        prefix: The SKU prefix (default: 'BN')
    
    Returns:
        A unique SKU string
    """
    timestamp = datetime.now().strftime('%y%m%d')
    random_part = get_random_string(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    return f'{prefix}-{timestamp}-{random_part}'


def generate_order_number():
    """
    Generate a unique order number.
    
    Returns:
        A unique order number string
    """
    timestamp = datetime.now().strftime('%Y%m%d')
    unique_part = uuid.uuid4().hex[:6].upper()
    return f'ORD-{timestamp}-{unique_part}'


def generate_tracking_number():
    """
    Generate a unique tracking number.
    
    Returns:
        A unique tracking number string
    """
    timestamp = datetime.now().strftime('%Y%m%d%H%M')
    unique_part = get_random_string(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    return f'TRK-{timestamp}-{unique_part}'


def get_client_ip(request):
    """
    Extract the client IP address from a request.
    
    Args:
        request: Django request object
    
    Returns:
        Client IP address string
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '0.0.0.0')


def sanitize_filename(filename):
    """
    Sanitize a filename by removing dangerous characters.
    
    Args:
        filename: The original filename
    
    Returns:
        Sanitized filename string
    """
    # Remove any path components
    filename = filename.split('/')[-1].split('\\')[-1]
    
    # Remove dangerous characters
    filename = re.sub(r'[^\w\s\-\.]', '', filename)
    
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    
    # Limit length
    if len(filename) > 100:
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        filename = f'{name[:90]}.{ext}' if ext else name[:100]
    
    return filename


def truncate_text(text, max_length=160, suffix='...'):
    """
    Truncate text to a maximum length.
    
    Args:
        text: The text to truncate
        max_length: Maximum length (default: 160)
        suffix: Suffix to add when truncated (default: '...')
    
    Returns:
        Truncated text string
    """
    if not text or len(text) <= max_length:
        return text
    
    truncated = text[:max_length - len(suffix)].rsplit(' ', 1)[0]
    return f'{truncated}{suffix}'


def format_price(amount, currency='BDT', locale='en'):
    """
    Format a price with currency symbol.
    
    Args:
        amount: The amount to format
        currency: Currency code (default: 'BDT')
        locale: Locale for formatting (default: 'en')
    
    Returns:
        Formatted price string
    """
    if amount is None:
        return ''
    
    amount = Decimal(str(amount))
    
    currency_symbols = {
        'BDT': '৳',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
    }
    
    symbol = currency_symbols.get(currency, currency)
    
    if locale == 'bn':
        return f'{symbol}{amount:,.2f}'
    
    return f'{symbol}{amount:,.2f}'


def generate_hash(data, algorithm='sha256'):
    """
    Generate a hash of the given data.
    
    Args:
        data: The data to hash
        algorithm: Hash algorithm (default: 'sha256')
    
    Returns:
        Hash string
    """
    if isinstance(data, str):
        data = data.encode('utf-8')
    
    hasher = hashlib.new(algorithm)
    hasher.update(data)
    return hasher.hexdigest()


def calculate_percentage(part, whole):
    """
    Calculate percentage.
    
    Args:
        part: The part value
        whole: The whole value
    
    Returns:
        Percentage as Decimal
    """
    if whole == 0:
        return Decimal('0')
    return (Decimal(str(part)) / Decimal(str(whole)) * 100).quantize(Decimal('0.01'))


def mask_email(email):
    """
    Mask an email address for privacy.
    
    Args:
        email: Email address to mask
    
    Returns:
        Masked email string
    """
    if not email or '@' not in email:
        return email
    
    local, domain = email.split('@')
    if len(local) <= 2:
        masked_local = local[0] + '*'
    else:
        masked_local = local[0] + '*' * (len(local) - 2) + local[-1]
    
    return f'{masked_local}@{domain}'


def mask_phone(phone):
    """
    Mask a phone number for privacy.
    
    Args:
        phone: Phone number to mask
    
    Returns:
        Masked phone string
    """
    if not phone:
        return phone
    
    phone_str = str(phone)
    if len(phone_str) <= 4:
        return phone_str
    
    return phone_str[:3] + '*' * (len(phone_str) - 6) + phone_str[-3:]
