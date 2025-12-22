"""
Request logging middleware
"""
import time
import logging
import json

logger = logging.getLogger('bunoraa')


class RequestLoggingMiddleware:
    """
    Middleware to log request details for debugging and monitoring.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Record start time
        start_time = time.time()

        # Run the view and capture unhandled exceptions so tracebacks are logged
        try:
            response = self.get_response(request)
        except Exception as exc:
            duration_exc = time.time() - start_time
            # Log the full traceback for debugging (especially for API endpoints)
            if request.path.startswith('/api/'):
                logger.error(
                    json.dumps({
                        'method': request.method,
                        'path': request.path,
                        'status': 'error',
                        'duration_ms': round(duration_exc * 1000, 2),
                        'user': str(getattr(request, 'user', 'AnonymousUser')),
                        'ip': self.get_client_ip(request),
                    }),
                    exc_info=True,
                )
            else:
                logger.exception('Unhandled exception processing request')
            # Re-raise so Django's normal error handling still runs
            raise

        # Calculate duration
        duration = time.time() - start_time

        # Log request details (only for API endpoints)
        if request.path.startswith('/api/'):
            log_data = {
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'duration_ms': round(duration * 1000, 2),
                'user': str(request.user) if hasattr(request, 'user') else 'anonymous',
                'ip': self.get_client_ip(request),
            }

            if response.status_code >= 400:
                logger.warning(f"API Request: {json.dumps(log_data)}")
            else:
                logger.info(f"API Request: {json.dumps(log_data)}")

        return response
    
    def get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
