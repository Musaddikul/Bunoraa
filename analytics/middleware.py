# analytics/middleware.py
from .models import PageView
from django.utils import timezone

class AnalyticsMiddleware:
    """
    Logs every request (excluding static/media) for behavioral analytics.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        try:
            path = request.path
            if not (path.startswith('/static/') or path.startswith('/media/')):
                PageView.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    session_key=request.session.session_key,
                    path=path,
                    method=request.method,
                    status_code=response.status_code,
                    user_agent=request.META.get('HTTP_USER_AGENT',''),
                    ip_address=request.META.get('REMOTE_ADDR',''),
                    timestamp=timezone.now()
                )
        except Exception:
            pass

        return response
