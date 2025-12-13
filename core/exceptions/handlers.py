# core/exceptions/handlers.py
"""
Custom Exception Handlers
Centralized exception handling for REST API.
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from .base import BunoraaException

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for Django REST Framework.
    Provides consistent error response format.
    """
    # Handle custom Bunoraa exceptions
    if isinstance(exc, BunoraaException):
        logger.warning(f'BunoraaException: {exc.code} - {exc.message}')
        return Response(exc.to_dict(), status=exc.status_code)
    
    # Handle Django validation errors
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, 'message_dict'):
            errors = exc.message_dict
        else:
            errors = {'non_field_errors': exc.messages}
        
        return Response({
            'error': {
                'code': 'validation_error',
                'message': 'Validation failed',
                'fields': errors,
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle 404 errors
    if isinstance(exc, Http404):
        return Response({
            'error': {
                'code': 'not_found',
                'message': str(exc) or 'Resource not found',
            }
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Call REST framework's default exception handler
    response = exception_handler(exc, context)
    
    if response is not None:
        # Normalize error response format
        error_data = response.data
        
        # Handle DRF validation errors
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            return Response({
                'error': {
                    'code': 'validation_error',
                    'message': 'Request validation failed',
                    'fields': error_data,
                }
            }, status=response.status_code)
        
        # Handle authentication errors
        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            return Response({
                'error': {
                    'code': 'authentication_required',
                    'message': error_data.get('detail', 'Authentication required'),
                }
            }, status=response.status_code)
        
        # Handle permission errors
        if response.status_code == status.HTTP_403_FORBIDDEN:
            return Response({
                'error': {
                    'code': 'permission_denied',
                    'message': error_data.get('detail', 'Permission denied'),
                }
            }, status=response.status_code)
        
        # Handle throttling
        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            return Response({
                'error': {
                    'code': 'rate_limit_exceeded',
                    'message': 'Too many requests. Please try again later.',
                }
            }, status=response.status_code)
        
        return response
    
    # Log unhandled exceptions
    logger.exception(f'Unhandled exception: {exc}')
    
    # Return generic error for unhandled exceptions
    return Response({
        'error': {
            'code': 'internal_error',
            'message': 'An unexpected error occurred',
        }
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
