
from .models import Currency

def currency_context(request):
    selected_currency_code = request.session.get('selected_currency', 'BDT') # Default to BDT
    try:
        selected_currency = Currency.objects.get(code=selected_currency_code, is_active=True)
    except Currency.DoesNotExist:
        selected_currency = Currency.objects.filter(is_default=True, is_active=True).first()
        if not selected_currency:
            selected_currency = Currency.objects.filter(is_active=True).first()
            if not selected_currency:
                selected_currency = None # No active currencies found
        if selected_currency:
            request.session['selected_currency'] = selected_currency.code

    available_currencies = Currency.objects.filter(is_active=True).order_by('name')

    return {
        'selected_currency': selected_currency,
        'available_currencies': available_currencies,
    }
