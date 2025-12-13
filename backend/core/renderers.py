# core/renderers.py
"""
Custom renderers for standardized API responses.
"""
from rest_framework.renderers import JSONRenderer


class StandardJSONRenderer(JSONRenderer):
    """
    Custom JSON renderer that wraps responses in standard format.
    """
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response') if renderer_context else None
        
        # If data is already in standard format, don't wrap it again
        if isinstance(data, dict) and 'success' in data:
            return super().render(data, accepted_media_type, renderer_context)
        
        # Determine success based on response status code
        success = True
        message = 'Request successful'
        
        if response and response.status_code >= 400:
            success = False
            message = 'Request failed'
            
            # Extract error message if available
            if isinstance(data, dict):
                if 'detail' in data:
                    message = data['detail']
                elif 'non_field_errors' in data:
                    message = data['non_field_errors'][0] if data['non_field_errors'] else message
                elif 'error' in data:
                    message = data['error']
        
        # Wrap in standard format
        wrapped_data = {
            'success': success,
            'message': message,
            'data': data if success else None,
            'meta': None
        }
        
        # Include errors in data field for failed requests
        if not success:
            wrapped_data['data'] = {'errors': data}
        
        return super().render(wrapped_data, accepted_media_type, renderer_context)
