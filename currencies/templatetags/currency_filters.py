
from django import template
from django.utils.html import format_html
from decimal import Decimal, InvalidOperation # Import InvalidOperation for better error handling

register = template.Library()

@register.filter
def convert_price(price, selected_currency):
    # Ensure price is a Decimal for accurate calculations
    try:
        # Convert to string first to handle SafeString, then to Decimal
        price = Decimal(str(price))
    except (TypeError, InvalidOperation):
        # If price cannot be converted, return it as is or with a default format
        # For now, let's just format it as a string if it's not a valid number
        return str(price)

    # If no selected_currency or exchange_rate, format the original price
    if not selected_currency or not selected_currency.exchange_rate:
        # Format the price as a string before passing to format_html
        return format_html("{}{}", "", f"{price:.2f}")

    # Ensure exchange_rate is also a Decimal
    try:
        exchange_rate = Decimal(str(selected_currency.exchange_rate))
    except (TypeError, InvalidOperation):
        # Fallback: if exchange_rate is invalid, just format the original price
        return format_html("{}{}", selected_currency.symbol, f"{price:.2f}")

    converted_price = price * exchange_rate
    # Format the converted_price as a string before passing to format_html
    return format_html("{}{}", selected_currency.symbol, f"{converted_price:.2f}")
