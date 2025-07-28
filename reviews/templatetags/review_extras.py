# reviews/templatetags/review_extras.py
from django import template

register = template.Library()

@register.filter
def dict_get(d, key):
    try:
        return d.get(int(key))
    except Exception:
        return 0
