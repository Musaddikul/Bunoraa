# core/middleware/activity.py
"""
User Activity Middleware
Tracks user activity and updates last seen timestamp.
"""
from django.utils import timezone
from django.core.cache import cache


class UserActivityMiddleware:
    """
    Middleware to track user activity and online status.
    Updates last_activity timestamp in cache to avoid database hits.
    """
    
    CACHE_KEY_PREFIX = 'user_activity_'
    CACHE_TIMEOUT = 300  # 5 minutes
    UPDATE_INTERVAL = 60  # Update database every 60 seconds
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Track activity for authenticated users
        if request.user.is_authenticated:
            self._update_user_activity(request.user)
        
        return response
    
    def _update_user_activity(self, user):
        """Update user's last activity timestamp."""
        cache_key = f'{self.CACHE_KEY_PREFIX}{user.id}'
        last_update = cache.get(cache_key)
        
        now = timezone.now()
        
        # Only update database periodically to reduce writes
        if last_update is None:
            # Update database
            user.last_activity = now
            user.save(update_fields=['last_activity'])
            cache.set(cache_key, now, self.CACHE_TIMEOUT)
        elif (now - last_update).seconds > self.UPDATE_INTERVAL:
            user.last_activity = now
            user.save(update_fields=['last_activity'])
            cache.set(cache_key, now, self.CACHE_TIMEOUT)
