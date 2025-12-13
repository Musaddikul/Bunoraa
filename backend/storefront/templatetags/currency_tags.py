"""
Currency template tags for Bunoraa.
Provides filters and tags for formatting and converting currencies.
"""
from decimal import Decimal

from django import template

register = template.Library()


def get_current_currency(context):
    """Get the current currency from context or session."""
    request = context.get('request')
    if request:
        return getattr(request, 'currency', None)
    return None


def get_exchange_rate(from_currency, to_currency):
    """Get exchange rate between two currencies."""
    if from_currency == to_currency:
        return Decimal('1')
    
    # Import here to avoid circular imports
    from currencies.models import Currency, ExchangeRate
    
    try:
        rate = ExchangeRate.objects.get(
            from_currency=from_currency,
            to_currency=to_currency
        )
        return rate.rate
    except ExchangeRate.DoesNotExist:
        # Try reverse rate
        try:
            rate = ExchangeRate.objects.get(
                from_currency=to_currency,
                to_currency=from_currency
            )
            return Decimal('1') / rate.rate
        except ExchangeRate.DoesNotExist:
            return Decimal('1')


@register.filter
def currency(value, currency_code=None):
    """
    Format a value as currency.
    
    Usage:
        {{ product.price|currency }}
        {{ product.price|currency:"EUR" }}
    """
    if value is None:
        return ''
    
    try:
        value = Decimal(str(value))
    except (ValueError, TypeError):
        return value
    
    # Import here to avoid circular imports
    from currencies.models import Currency
    
    # Get currency object
    if currency_code:
        try:
            curr = Currency.objects.get(code=currency_code.upper())
        except Currency.DoesNotExist:
            curr = None
    else:
        curr = None
    
    # Format based on currency settings
    if curr:
        symbol = curr.symbol
        decimal_places = curr.decimal_places
        symbol_position = curr.symbol_position
    else:
        symbol = '$'
        decimal_places = 2
        symbol_position = 'before'
    
    # Format the value
    formatted_value = f'{value:,.{decimal_places}f}'
    
    # Apply symbol
    if symbol_position == 'before':
        return f'{symbol}{formatted_value}'
    else:
        return f'{formatted_value} {symbol}'


@register.simple_tag(takes_context=True)
def convert_currency(context, value, to_currency=None):
    """
    Convert a value from base currency to target currency.
    
    Usage:
        {% convert_currency product.price %}
        {% convert_currency product.price "EUR" %}
    """
    if value is None:
        return ''
    
    try:
        value = Decimal(str(value))
    except (ValueError, TypeError):
        return value
    
    # Import here to avoid circular imports
    from currencies.models import Currency
    from django.conf import settings
    
    # Get base currency
    base_code = getattr(settings, 'BASE_CURRENCY', 'USD')
    
    # Get target currency
    if to_currency:
        target_code = to_currency
    else:
        curr = get_current_currency(context)
        target_code = curr.code if curr else base_code
    
    if target_code == base_code:
        return currency(value, base_code)
    
    try:
        base_curr = Currency.objects.get(code=base_code)
        target_curr = Currency.objects.get(code=target_code)
    except Currency.DoesNotExist:
        return currency(value)
    
    # Convert
    rate = get_exchange_rate(base_curr, target_curr)
    converted_value = value * rate
    
    return currency(converted_value, target_code)


@register.simple_tag(takes_context=True)
def currency_symbol(context, currency_code=None):
    """
    Get the currency symbol.
    
    Usage:
        {% currency_symbol %}
        {% currency_symbol "EUR" %}
    """
    from currencies.models import Currency
    
    if currency_code:
        code = currency_code.upper()
    else:
        curr = get_current_currency(context)
        code = curr.code if curr else 'USD'
    
    try:
        currency_obj = Currency.objects.get(code=code)
        return currency_obj.symbol
    except Currency.DoesNotExist:
        return '$'


@register.simple_tag(takes_context=True)
def currency_code(context):
    """
    Get the current currency code.
    
    Usage:
        {% currency_code %}
    """
    curr = get_current_currency(context)
    return curr.code if curr else 'USD'


@register.filter
def price_range(products, currency_code=None):
    """
    Get the price range for a list of products.
    
    Usage:
        {{ products|price_range }}
    """
    if not products:
        return ''
    
    prices = [p.current_price for p in products if p.current_price]
    if not prices:
        return ''
    
    min_price = min(prices)
    max_price = max(prices)
    
    if min_price == max_price:
        return currency(min_price, currency_code)
    
    return f'{currency(min_price, currency_code)} - {currency(max_price, currency_code)}'


@register.filter
def discount_amount(original_price, sale_price):
    """
    Calculate the discount amount.
    
    Usage:
        {{ product.price|discount_amount:product.sale_price }}
    """
    if original_price is None or sale_price is None:
        return ''
    
    try:
        original = Decimal(str(original_price))
        sale = Decimal(str(sale_price))
        discount = original - sale
        return currency(discount)
    except (ValueError, TypeError):
        return ''


@register.filter
def discount_percentage(original_price, sale_price):
    """
    Calculate the discount percentage.
    
    Usage:
        {{ product.price|discount_percentage:product.sale_price }}
    """
    if original_price is None or sale_price is None:
        return 0
    
    try:
        original = Decimal(str(original_price))
        sale = Decimal(str(sale_price))
        if original == 0:
            return 0
        percentage = ((original - sale) / original) * 100
        return int(percentage)
    except (ValueError, TypeError, ZeroDivisionError):
        return 0


@register.inclusion_tag('components/currency_selector.html', takes_context=True)
def currency_selector(context, css_class=''):
    """
    Render a currency selector dropdown.
    
    Usage:
        {% currency_selector %}
        {% currency_selector css_class="my-class" %}
    """
    from currencies.models import Currency
    
    currencies = Currency.objects.filter(is_active=True).order_by('code')
    current = get_current_currency(context)
    
    return {
        'currencies': currencies,
        'current_currency': current,
        'css_class': css_class,
        'request': context.get('request'),
    }


@register.simple_tag
def format_money(value, currency_code='USD', show_symbol=True, show_code=False):
    """
    Format a monetary value with various options.
    
    Usage:
        {% format_money product.price "USD" True False %}
    """
    if value is None:
        return ''
    
    try:
        value = Decimal(str(value))
    except (ValueError, TypeError):
        return value
    
    from currencies.models import Currency
    
    try:
        curr = Currency.objects.get(code=currency_code.upper())
        symbol = curr.symbol
        decimal_places = curr.decimal_places
    except Currency.DoesNotExist:
        symbol = '$'
        decimal_places = 2
    
    formatted_value = f'{value:,.{decimal_places}f}'
    
    result = ''
    if show_symbol:
        result = f'{symbol}{formatted_value}'
    else:
        result = formatted_value
    
    if show_code:
        result = f'{result} {currency_code.upper()}'
    
    return result
