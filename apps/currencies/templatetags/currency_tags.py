from django import template
from django.utils.safestring import mark_safe
from django.template.defaultfilters import floatformat

register = template.Library()


@register.simple_tag(takes_context=True)
def format_price(context, amount, from_currency=None, show_original=False):
    """Format an amount in the user's current currency.

    Usage:
        {% format_price product.price product.get_currency %}
        {% format_price 12.5 "USD" %}
    """
    try:
        request = context.get('request')
        from apps.currencies.services import CurrencyService, CurrencyConversionService

        # Resolve from_currency to code
        from_code = None
        if from_currency is None:
            # Try to obtain from context: product
            prod = context.get('product') or context.get('object')
            if prod and hasattr(prod, 'get_currency'):
                cur = prod.get_currency()
                from_code = cur.code if cur else None
        else:
            # Accept Currency instance or code string
            if hasattr(from_currency, 'code'):
                from_code = from_currency.code
            else:
                from_code = str(from_currency)

        # Determine target currency
        target = CurrencyService.get_user_currency(user=request.user if hasattr(request, 'user') and request.user.is_authenticated else None, request=request)
        if not target:
            target = CurrencyService.get_default_currency()

        # If conversion needed
        if from_code and target and from_code.upper() != target.code:
            converted = CurrencyConversionService.convert_by_code(amount, from_code.upper(), target.code)
            formatted = target.format_amount(converted)
        else:
            # No conversion needed; format with target or default
            cur = target or CurrencyService.get_default_currency()
            formatted = cur.format_amount(amount)

        return mark_safe(formatted)
    except Exception:
        # Fallback: basic formatting
        try:
            return f"{floatformat(amount, 2)}"
        except Exception:
            return str(amount)
