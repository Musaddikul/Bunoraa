
from rest_framework import viewsets
from .models import Currency
from .serializers import CurrencySerializer
from django.shortcuts import redirect
from django.urls import reverse

class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows currencies to be viewed.
    """
    queryset = Currency.objects.filter(is_active=True)
    serializer_class = CurrencySerializer

def change_currency(request):
    if request.method == 'POST':
        currency_code = request.POST.get('currency_code')
        if currency_code:
            request.session['selected_currency'] = currency_code
    
    # Redirect to the previous page or a default page
    return redirect(request.META.get('HTTP_REFERER', reverse('home')))
