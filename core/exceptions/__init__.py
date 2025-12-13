# core/exceptions/__init__.py
"""
Bunoraa Custom Exceptions
Centralized exception handling and custom exception classes.
"""
from .handlers import custom_exception_handler
from .base import (
    BunoraaException,
    ValidationException,
    NotFoundException,
    PermissionDeniedException,
    ConflictException,
    ServiceUnavailableException,
)

__all__ = [
    'custom_exception_handler',
    'BunoraaException',
    'ValidationException',
    'NotFoundException',
    'PermissionDeniedException',
    'ConflictException',
    'ServiceUnavailableException',
]
