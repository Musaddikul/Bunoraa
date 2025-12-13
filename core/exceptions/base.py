# core/exceptions/base.py
"""
Base Exception Classes
Custom exception classes for the Bunoraa platform.
"""
from rest_framework import status


class BunoraaException(Exception):
    """Base exception for all Bunoraa-specific exceptions."""
    
    default_message = 'An error occurred'
    default_code = 'error'
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    
    def __init__(self, message=None, code=None, details=None):
        self.message = message or self.default_message
        self.code = code or self.default_code
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self):
        return {
            'error': {
                'code': self.code,
                'message': self.message,
                'details': self.details,
            }
        }


class ValidationException(BunoraaException):
    """Exception for validation errors."""
    
    default_message = 'Validation failed'
    default_code = 'validation_error'
    status_code = status.HTTP_400_BAD_REQUEST
    
    def __init__(self, message=None, field_errors=None):
        super().__init__(message)
        self.field_errors = field_errors or {}
    
    def to_dict(self):
        result = super().to_dict()
        if self.field_errors:
            result['error']['fields'] = self.field_errors
        return result


class NotFoundException(BunoraaException):
    """Exception for resource not found errors."""
    
    default_message = 'Resource not found'
    default_code = 'not_found'
    status_code = status.HTTP_404_NOT_FOUND


class PermissionDeniedException(BunoraaException):
    """Exception for permission denied errors."""
    
    default_message = 'Permission denied'
    default_code = 'permission_denied'
    status_code = status.HTTP_403_FORBIDDEN


class ConflictException(BunoraaException):
    """Exception for conflict errors (duplicate resources, etc.)."""
    
    default_message = 'Resource conflict'
    default_code = 'conflict'
    status_code = status.HTTP_409_CONFLICT


class ServiceUnavailableException(BunoraaException):
    """Exception for service unavailable errors."""
    
    default_message = 'Service temporarily unavailable'
    default_code = 'service_unavailable'
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE


class PaymentException(BunoraaException):
    """Exception for payment-related errors."""
    
    default_message = 'Payment processing failed'
    default_code = 'payment_error'
    status_code = status.HTTP_402_PAYMENT_REQUIRED


class AuthenticationException(BunoraaException):
    """Exception for authentication errors."""
    
    default_message = 'Authentication required'
    default_code = 'authentication_required'
    status_code = status.HTTP_401_UNAUTHORIZED


class RateLimitException(BunoraaException):
    """Exception for rate limiting."""
    
    default_message = 'Rate limit exceeded'
    default_code = 'rate_limit_exceeded'
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
