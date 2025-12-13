# core/middleware/timing.py
"""
Request Timing Middleware
Adds processing time information to responses.
"""
import time
import logging

logger = logging.getLogger(__name__)


class RequestTimingMiddleware:
    """
    Middleware to measure and log request processing time.
    Adds X-Request-Time header to responses.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        duration_ms = round(duration * 1000, 2)
        
        # Add timing header
        response['X-Request-Time'] = f'{duration_ms}ms'
        
        # Log slow requests (> 1 second)
        if duration > 1.0:
            logger.warning(
                f'Slow request: {request.method} {request.path} '
                f'took {duration_ms}ms'
            )
        
        return response
