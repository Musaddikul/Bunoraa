"""
Wishlist Frontend Views
"""
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class WishlistView(LoginRequiredMixin, TemplateView):
    """Display user's wishlist."""
    template_name = 'wishlist/list.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Wishlist items will be fetched via API
        return context
