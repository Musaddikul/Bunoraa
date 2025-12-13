# core/exceptions/exceptions.py
"""
Custom exceptions for the application.
"""
from rest_framework import status
from rest_framework.exceptions import APIException as DRFAPIException


class APIException(DRFAPIException):
    """Base API exception."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A server error occurred.'
    default_code = 'error'


class ValidationException(APIException):
    """Validation error exception."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input.'
    default_code = 'validation_error'


class NotFoundError(APIException):
    """Resource not found exception."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Resource not found.'
    default_code = 'not_found'


class PermissionDeniedError(APIException):
    """Permission denied exception."""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have permission to perform this action.'
    default_code = 'permission_denied'


class AuthenticationError(APIException):
    """Authentication error exception."""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Authentication credentials were not provided.'
    default_code = 'authentication_error'


class BusinessLogicError(APIException):
    """Business logic error exception."""
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = 'Unable to process the request.'
    default_code = 'business_logic_error'


class ConflictError(APIException):
    """Conflict error exception."""
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Resource conflict.'
    default_code = 'conflict'


class RateLimitError(APIException):
    """Rate limit exceeded exception."""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'Request rate limit exceeded.'
    default_code = 'rate_limit_exceeded'
