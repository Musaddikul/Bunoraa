"""
Frontend views for payments.
"""
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class PaymentMethodsView(LoginRequiredMixin, TemplateView):
    """Payment methods management page."""
    template_name = 'payments/payment_methods.html'
    login_url = '/account/login/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Payment Methods'
        return context
