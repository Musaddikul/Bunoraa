# core/exceptions/handlers.py
"""
Custom exception handlers for DRF.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied, ValidationError


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns responses in standard format.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Standardize the response format
        error_message = 'An error occurred'
        errors = None
        
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, str):
                error_message = exc.detail
            elif isinstance(exc.detail, dict):
                errors = exc.detail
                # Try to extract a meaningful message
                if 'detail' in exc.detail:
                    error_message = exc.detail['detail']
                elif 'non_field_errors' in exc.detail:
                    error_message = exc.detail['non_field_errors'][0]
                else:
                    error_message = 'Validation failed'
            elif isinstance(exc.detail, list):
                error_message = exc.detail[0] if exc.detail else 'Validation failed'
                errors = exc.detail
        
        response.data = {
            'success': False,
            'message': error_message,
            'data': {'errors': errors} if errors else None,
            'meta': {
                'status_code': response.status_code
            }
        }
    
    # Handle Django exceptions not caught by DRF
    elif isinstance(exc, Http404):
        response = Response({
            'success': False,
            'message': 'Resource not found',
            'data': None,
            'meta': {'status_code': 404}
        }, status=status.HTTP_404_NOT_FOUND)
    
    elif isinstance(exc, PermissionDenied):
        response = Response({
            'success': False,
            'message': 'Permission denied',
            'data': None,
            'meta': {'status_code': 403}
        }, status=status.HTTP_403_FORBIDDEN)
    
    elif isinstance(exc, ValidationError):
        response = Response({
            'success': False,
            'message': 'Validation error',
            'data': {'errors': exc.messages if hasattr(exc, 'messages') else [str(exc)]},
            'meta': {'status_code': 400}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return response
