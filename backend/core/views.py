# core/views.py
"""
Core views for the application.
"""
from django.http import JsonResponse
from django.views.generic import TemplateView


def health_check(request):
    """Health check endpoint for monitoring."""
    return JsonResponse({
        'success': True,
        'message': 'Service is healthy',
        'data': {
            'status': 'healthy',
            'version': '1.0.0'
        },
        'meta': None
    })


class HomeView(TemplateView):
    """Home page view."""
    template_name = 'storefront/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Bunoraa - Premium E-Commerce'
        context['meta_description'] = 'Discover premium products at Bunoraa. Shop the latest fashion, electronics, and more.'
        return context
