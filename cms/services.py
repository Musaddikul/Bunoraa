# cms/services.py
from django.core.cache import cache
from django.template import Template, Context
from .selectors import get_published_page, get_active_banners, get_site_settings

def render_page_content(slug, extra_context=None):
    page = get_published_page(slug)
    if not page:
        return None
    ctx = Context({'page': page, **(extra_context or {})})
    tmpl = Template(page.content)
    return tmpl.render(ctx)

def invalidate_cms_cache(slug=None):
    cache.delete("cms_active_banners")
    cache.delete("cms_site_settings")
    if slug:
        cache.delete(f"cms_page_{slug}")
