# core/urls_main.py
"""
Main URL Configuration for Bunoraa
Combines API and Web routes.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# TemplateView available when needed

# Admin customization
admin.site.site_header = 'Bunoraa Admin'
admin.site.site_title = 'Bunoraa'
admin.site.index_title = 'Dashboard'

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include('core.urls_api')),
    
    # Web Routes (Storefront)
    path('', include('storefront.urls', namespace='storefront')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handlers
handler404 = 'storefront.views.error_404'
handler500 = 'storefront.views.error_500'
