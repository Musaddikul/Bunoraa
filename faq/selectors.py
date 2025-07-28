# faq/selectors.py
from django.core.cache import cache
from django.db.models import Q
from .models import FAQ, Category

CACHE_TTL = 300

def get_categories():
    key = "faq_categories"
    cats = cache.get(key)
    if cats is None:
        cats = list(Category.objects.order_by('name'))
        cache.set(key, cats, CACHE_TTL)
    return cats

def get_faqs(category_slug=None, featured=False, active=True):
    qs = FAQ.objects.filter(is_active=active)
    if category_slug:
        qs = qs.filter(category__slug=category_slug)
    if featured:
        qs = qs.filter(is_featured=True)
    return qs.select_related('category').prefetch_related('tags')

def search_faqs(query, category_slug=None):
    qs = FAQ.objects.filter(is_active=True)
    if category_slug:
        qs = qs.filter(category__slug=category_slug)
    if query:
        qs = qs.filter(Q(question__icontains=query) | Q(answer__icontains=query) | Q(tags__name__icontains=query))
    return qs.distinct().select_related('category')

def get_faq(pk):
    return FAQ.objects.select_related('category').get(pk=pk)
