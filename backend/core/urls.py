# core/urls.py
"""
URL Configuration for Bunoraa e-commerce platform.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from core.views import health_check

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Internationalization (language switching)
    path('i18n/', include('django.conf.urls.i18n')),
    
    # API v1 endpoints
    path('api/v1/', include('core.urls_api')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Web pages (server-rendered templates)
    # Storefront - homepage and product browsing
    path('', include('storefront.urls')),
    
    # Accounts - authentication and user management
    path('account/', include('apps.accounts.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        pass
