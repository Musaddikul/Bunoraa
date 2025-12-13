# core/middleware/rate_limit.py
"""
Rate Limiting Middleware
Provides IP-based rate limiting for API endpoints.
"""
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings


class RateLimitMiddleware:
    """
    Middleware to implement rate limiting based on IP address.
    """
    
    # Default rate limits (requests per minute)
    DEFAULT_RATE_LIMIT = 60
    API_RATE_LIMIT = 100
    AUTH_RATE_LIMIT = 10
    
    CACHE_KEY_PREFIX = 'rate_limit_'
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Skip rate limiting in debug mode
        if settings.DEBUG:
            return self.get_response(request)
        
        # Get client IP
        ip = self._get_client_ip(request)
        
        # Determine rate limit based on path
        rate_limit = self._get_rate_limit(request.path)
        
        # Check rate limit
        if self._is_rate_limited(ip, rate_limit, request.path):
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'message': 'Too many requests. Please try again later.',
            }, status=429)
        
        return self.get_response(request)
    
    def _get_client_ip(self, request):
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '0.0.0.0')
    
    def _get_rate_limit(self, path):
        """Determine rate limit based on request path."""
        if path.startswith('/api/auth/'):
            return self.AUTH_RATE_LIMIT
        elif path.startswith('/api/'):
            return self.API_RATE_LIMIT
        return self.DEFAULT_RATE_LIMIT
    
    def _is_rate_limited(self, ip, rate_limit, path):
        """Check if IP has exceeded rate limit."""
        # Create cache key based on IP and path prefix
        path_key = 'api' if path.startswith('/api/') else 'web'
        cache_key = f'{self.CACHE_KEY_PREFIX}{ip}_{path_key}'
        
        # Get current request count
        current = cache.get(cache_key)
        
        if current is None:
            # First request, initialize counter
            cache.set(cache_key, 1, 60)  # 1 minute window
            return False
        
        if current >= rate_limit:
            return True
        
        # Increment counter
        cache.incr(cache_key)
        return False
