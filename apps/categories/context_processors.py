# apps/categories/context_processors.py
"""
Category Context Processors
"""
from .models import Category


def categories_context(request):
    """Add category data to all templates."""
    return {
        'menu_categories': Category.get_menu_categories(),
    }
