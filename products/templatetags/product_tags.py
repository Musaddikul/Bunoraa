# products/templatetags/product_tags.py
from django import template
from products.models import Product

register = template.Library()

@register.filter
def featured(products, display_type):
    """
    Usage: {% for product in products|featured:"HOME" %}
    Filters products by featured_weight threshold according to display_type.
    """
    weight_threshold = {
        'HOME': 5,
        'CATEGORY': 3,
        'ALL': 1
    }.get(display_type, 0)
    
    return products.filter(
        featured_weight__gte=weight_threshold,
        available=True
    ).order_by('-featured_weight')

@register.simple_tag
def get_featured_products(category=None, limit=5):
    """
    Usage: {% get_featured_products category limit as featured_products %}
    Returns featured products optionally filtered by category and limited by `limit`.
    """
    qs = Product.objects.filter(featured_weight__gt=0, available=True)
    if category:
        qs = qs.filter(category__in=category.get_all_subcategories())
    return qs.order_by('-featured_weight')[:limit]

@register.filter
def get_item(dictionary, key):
    """
    Usage: {{ dictionary|get_item:key }}
    Safely gets the value for key in dictionary, returns empty list if key not found.
    """
    if dictionary is None:
        return []
    return dictionary.get(key, [])

@register.filter
def get_range(value):
    """
    Usage: {% for i in some_number|get_range %}
    Returns a reversed range from value down to 1.
    """
    try:
        value = int(value)
        if value < 1:
            return []
        return range(value, 0, -1)
    except (ValueError, TypeError):
        return []

@register.filter
def getlist(querydict, key):
    """
    Usage: {{ request.GET|getlist:"filter_name" }}
    Returns list of values for the given key from a QueryDict.
    """
    if querydict is None:
        return []
    return querydict.getlist(key)

