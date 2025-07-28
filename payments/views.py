# payments/views.py
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .models import Payment
import logging

logger = logging.getLogger(__name__)

class PaymentSuccessView(View):
    """
    View for handling successful payment redirects from gateways.
    Fetches payment details and displays a success message.
    """
    def get(self, request, payment_id, *args, **kwargs):
        """
        Handles GET requests for payment success.
        """
        payment = get_object_or_404(Payment, id=payment_id)
        context = {
            'payment': payment,
            'message': _("Your payment was successful!"),
            'status': 'success'
        }
        return render(request, 'payments/payment_status.html', context)

class PaymentFailureView(View):
    """
    View for handling failed payment redirects from gateways.
    Fetches payment details and displays a failure message.
    """
    def get(self, request, payment_id, *args, **kwargs):
        """
        Handles GET requests for payment failure.
        """
        payment = get_object_or_404(Payment, id=payment_id)
        context = {
            'payment': payment,
            'message': _("Your payment failed. Please try again or choose a different method."),
            'status': 'failure'
        }
        return render(request, 'payments/payment_status.html', context)

class PaymentCancelView(View):
    """
    View for handling cancelled payment redirects from gateways.
    """
    def get(self, request, payment_id, *args, **kwargs):
        """
        Handles GET requests for payment cancellation.
        """
        payment = get_object_or_404(Payment, id=payment_id)
        context = {
            'payment': payment,
            'message': _("Your payment was cancelled. You can try again or choose another payment method."),
            'status': 'cancelled'
        }
        return render(request, 'payments/payment_status.html', context)
