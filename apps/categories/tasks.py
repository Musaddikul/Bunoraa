"""Background tasks for taxonomy operations (Celery optional).

These are lightweight wrappers that either schedule work via Celery when
available or can be called synchronously by admin actions.
"""
from __future__ import annotations

try:
    from celery import shared_task
except Exception:  # Celery not installed / available
    shared_task = None  # type: ignore

from django.core.management import call_command


if shared_task:
    @shared_task(name='categories.seed_taxonomy')
    def seed_taxonomy(file_path=None, assign_facets=False, seed_external=False, backfill_products=False):
        args = []
        opts = {}
        if file_path:
            opts['file'] = file_path
        if assign_facets:
            opts['assign_facets'] = True
        if seed_external:
            opts['seed_external'] = True
        if backfill_products:
            opts['backfill_products'] = True
        call_command('seed_categories', **opts)

    @shared_task(name='categories.rebuild_paths')
    def rebuild_paths(category_ids=None):
        if not category_ids:
            # rebuild entire tree
            from apps.categories.models import Category
            Category.rebuild_all_paths()
            return
        from apps.categories.models import Category
        for cid in category_ids:
            cat = Category.objects.filter(pk=cid).first()
            if cat:
                cat.rebuild_subtree()

    @shared_task(name='categories.backfill_products')
    def backfill_products(batch_size=100):
        call_command('seed_categories', '--backfill-products')

else:
    # Fallback synchronous wrappers
    def seed_taxonomy(*args, **kwargs):
        return call_command('seed_categories', *args, **kwargs)

    def rebuild_paths(category_ids=None):
        from apps.categories.models import Category
        if not category_ids:
            return Category.rebuild_all_paths()
        for cid in category_ids:
            cat = Category.objects.filter(pk=cid).first()
            if cat:
                cat.rebuild_subtree()

    def backfill_products(batch_size=100):
        return call_command('seed_categories', '--backfill-products')
