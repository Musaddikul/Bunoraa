# core/exceptions/__init__.py
from .handlers import custom_exception_handler
from .exceptions import (
    APIException,
    ValidationException,
    NotFoundError,
    PermissionDeniedError,
    AuthenticationError,
)

__all__ = [
    'custom_exception_handler',
    'APIException',
    'ValidationException',
    'NotFoundError',
    'PermissionDeniedError',
    'AuthenticationError',
]
