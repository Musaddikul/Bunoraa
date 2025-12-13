# core/middleware/api_response.py
"""
Middleware for API response standardization.
"""
import json
from django.http import JsonResponse


class APIResponseMiddleware:
    """
    Middleware to standardize API responses.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_exception(self, request, exception):
        """Handle exceptions and return standardized error response."""
        if request.path.startswith('/api/'):
            return JsonResponse({
                'success': False,
                'message': str(exception),
                'data': None,
                'meta': None
            }, status=500)
        return None
