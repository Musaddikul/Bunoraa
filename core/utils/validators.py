# core/utils/validators.py
"""
Custom Validators
Validation functions for files, images, and data.
"""
import os
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible


@deconstructible
class FileSizeValidator:
    """
    Validator for file size limits.
    """
    
    def __init__(self, max_size_mb=5):
        self.max_size_mb = max_size_mb
        self.max_size_bytes = max_size_mb * 1024 * 1024
    
    def __call__(self, value):
        if value.size > self.max_size_bytes:
            raise ValidationError(
                f'File size must not exceed {self.max_size_mb}MB. '
                f'Current size: {value.size / (1024 * 1024):.2f}MB'
            )
    
    def __eq__(self, other):
        return isinstance(other, FileSizeValidator) and self.max_size_mb == other.max_size_mb


@deconstructible
class FileExtensionValidator:
    """
    Validator for file extensions.
    """
    
    def __init__(self, allowed_extensions=None):
        self.allowed_extensions = allowed_extensions or ['jpg', 'jpeg', 'png', 'gif', 'webp']
    
    def __call__(self, value):
        ext = os.path.splitext(value.name)[1][1:].lower()
        if ext not in self.allowed_extensions:
            raise ValidationError(
                f'File extension "{ext}" is not allowed. '
                f'Allowed extensions: {", ".join(self.allowed_extensions)}'
            )
    
    def __eq__(self, other):
        return isinstance(other, FileExtensionValidator) and self.allowed_extensions == other.allowed_extensions


def validate_image_size(image, max_width=4000, max_height=4000):
    """
    Validate image dimensions.
    
    Args:
        image: Image file
        max_width: Maximum width in pixels
        max_height: Maximum height in pixels
    """
    from PIL import Image
    
    img = Image.open(image)
    width, height = img.size
    
    if width > max_width or height > max_height:
        raise ValidationError(
            f'Image dimensions must not exceed {max_width}x{max_height}. '
            f'Current dimensions: {width}x{height}'
        )


def validate_file_extension(filename, allowed_extensions):
    """
    Validate file extension.
    
    Args:
        filename: Name of the file
        allowed_extensions: List of allowed extensions
    """
    ext = os.path.splitext(filename)[1][1:].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            f'File extension "{ext}" is not allowed. '
            f'Allowed: {", ".join(allowed_extensions)}'
        )


def validate_phone_number(phone):
    """
    Validate phone number format.
    
    Args:
        phone: Phone number string
    """
    import re
    
    # Remove common formatting characters
    cleaned = re.sub(r'[\s\-\.\(\)]', '', str(phone))
    
    # Check for valid phone number pattern
    if not re.match(r'^\+?[0-9]{10,15}$', cleaned):
        raise ValidationError(
            'Invalid phone number format. Please enter a valid phone number.'
        )


def validate_postal_code(postal_code, country='BD'):
    """
    Validate postal code format based on country.
    
    Args:
        postal_code: Postal code string
        country: Country code
    """
    import re
    
    patterns = {
        'BD': r'^\d{4}$',  # Bangladesh: 4 digits
        'US': r'^\d{5}(-\d{4})?$',  # USA: 5 digits or 5+4
        'UK': r'^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$',  # UK format
        'IN': r'^\d{6}$',  # India: 6 digits
    }
    
    pattern = patterns.get(country.upper())
    if pattern and not re.match(pattern, postal_code, re.IGNORECASE):
        raise ValidationError(
            f'Invalid postal code format for {country}.'
        )


def validate_slug(slug):
    """
    Validate slug format.
    
    Args:
        slug: Slug string
    """
    import re
    
    if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', slug):
        raise ValidationError(
            'Slug must contain only lowercase letters, numbers, and hyphens.'
        )


def validate_positive_decimal(value):
    """
    Validate that a value is a positive decimal.
    
    Args:
        value: Decimal value
    """
    from decimal import Decimal
    
    if value is None:
        return
    
    if Decimal(str(value)) <= 0:
        raise ValidationError('Value must be a positive number.')


def validate_percentage(value):
    """
    Validate that a value is a valid percentage (0-100).
    
    Args:
        value: Percentage value
    """
    from decimal import Decimal
    
    if value is None:
        return
    
    value = Decimal(str(value))
    if value < 0 or value > 100:
        raise ValidationError('Percentage must be between 0 and 100.')
