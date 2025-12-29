"""Management command to seed categories with a robust hierarchical tree.

- Idempotent: creates or updates categories by (parent, slug).
- Optional `--force` flag will soft-delete existing categories before seeding.
- Supports JSON taxonomy input, default facet assignments, and external mappings.
"""
from __future__ import annotations

import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from typing import List, Union, Dict, Any

from apps.categories.ml import Category, Facet, CategoryAllowedFacet, ExternalCategoryMapping


CATEGORY_TREE: List[Dict[str, Any]] = [
    {
        'code': 'CAT_HOME',
        'display_name': 'Home & Living',
        'url_slug': 'home-living',
        'children': [
            {'code': 'CAT_HOME_DECOR', 'display_name': 'Decor', 'url_slug': 'decor', 'children': [
                {'code': 'CAT_HOME_DECOR_WALL', 'display_name': 'Wall Art', 'url_slug': 'wall-art'},
                {'code': 'CAT_HOME_DECOR_SCULPT', 'display_name': 'Sculptures', 'url_slug': 'sculptures'},
                {'code': 'CAT_HOME_DECOR_TERR', 'display_name': 'Terracotta & Ceramics', 'url_slug': 'terracotta-ceramics'}
            ]},
            {'code': 'CAT_HOME_TEXTILES', 'display_name': 'Textiles', 'url_slug': 'textiles', 'children': [
                {'code': 'CAT_HOME_TEXTILES_RUGS', 'display_name': 'Rugs', 'url_slug': 'rugs'},
                {'code': 'CAT_HOME_TEXTILES_CUSH', 'display_name': 'Cushions', 'url_slug': 'cushions'},
                {'code': 'CAT_HOME_TEXTILES_THROWS', 'display_name': 'Throws', 'url_slug': 'throws'}
            ]},
            {'code': 'CAT_HOME_TABLE', 'display_name': 'Tabletop', 'url_slug': 'tabletop', 'children': [
                {'code': 'CAT_HOME_TABLE_CERAMICS', 'display_name': 'Ceramics', 'url_slug': 'ceramics'},
                {'code': 'CAT_HOME_TABLE_SERVE', 'display_name': 'Serveware', 'url_slug': 'serveware'},
                {'code': 'CAT_HOME_TABLE_UTENSILS', 'display_name': 'Utensils', 'url_slug': 'utensils'}
            ]}
        ]
    },
    {
        'code': 'CAT_APPAREL',
        'display_name': 'Clothing & Apparel',
        'url_slug': 'clothing-apparel',
        'children': [
            {'code': 'CAT_APP_WOMEN', 'display_name': 'Women', 'url_slug': 'women', 'children': [
                {'code': 'CAT_APP_WOMEN_HANDWOVEN', 'display_name': 'Handwoven', 'url_slug': 'handwoven'},
                {'code': 'CAT_APP_WOMEN_DRESSES', 'display_name': 'Dresses', 'url_slug': 'dresses'},
                {'code': 'CAT_APP_WOMEN_SHAWLS', 'display_name': 'Shawls', 'url_slug': 'shawls'}
            ]},
            {'code': 'CAT_APP_MEN', 'display_name': 'Men', 'url_slug': 'men', 'children': [
                {'code': 'CAT_APP_MEN_KURTAS', 'display_name': 'Kurtas', 'url_slug': 'kurtas'},
                {'code': 'CAT_APP_MEN_SHIRTS', 'display_name': 'Shirts', 'url_slug': 'shirts'}
            ]},
            {'code': 'CAT_APP_BAGS', 'display_name': 'Bags', 'url_slug': 'bags', 'children': [
                {'code': 'CAT_APP_BAGS_TOTES', 'display_name': 'Totes', 'url_slug': 'totes'},
                {'code': 'CAT_APP_BAGS_CLUTCHES', 'display_name': 'Clutches', 'url_slug': 'clutches'}
            ]}
        ]
    },
    {
        'code': 'CAT_JEWELRY',
        'display_name': 'Handcrafted Jewelry',
        'url_slug': 'handcrafted-jewelry',
        'children': [
            {'code': 'CAT_JEW_NECK', 'display_name': 'Necklaces', 'url_slug': 'necklaces', 'children': [
                {'code': 'CAT_JEW_NECK_BEAD', 'display_name': 'Beaded', 'url_slug': 'beaded'},
                {'code': 'CAT_JEW_NECK_SILVER', 'display_name': 'Silver', 'url_slug': 'silver'}
            ]},
            {'code': 'CAT_JEW_EAR', 'display_name': 'Earrings', 'url_slug': 'earrings'},
            {'code': 'CAT_JEW_RING', 'display_name': 'Rings', 'url_slug': 'rings'}
        ]
    },
    {
        'code': 'CAT_ART',
        'display_name': 'Art & Collectibles',
        'url_slug': 'art-collectibles',
        'children': [
            {'code': 'CAT_ART_PAINT', 'display_name': 'Paintings', 'url_slug': 'paintings', 'children': [
                {'code': 'CAT_ART_PAINT_WAT', 'display_name': 'Watercolor', 'url_slug': 'watercolor'},
                {'code': 'CAT_ART_PAINT_ACR', 'display_name': 'Acrylic', 'url_slug': 'acrylic'}
            ]},
            {'code': 'CAT_ART_PRINTS', 'display_name': 'Prints', 'url_slug': 'prints'},
            {'code': 'CAT_ART_SCULPT', 'display_name': 'Sculptures', 'url_slug': 'sculptures'}
        ]
    },
    {
        'code': 'CAT_GIFTS',
        'display_name': 'Gifts & Occasions',
        'url_slug': 'gifts-occasions',
        'children': [
            {'code': 'CAT_GIFTS_SETS', 'display_name': 'Gift Sets', 'url_slug': 'gift-sets'},
            {'code': 'CAT_GIFTS_BY_OCC', 'display_name': 'By Occasion', 'url_slug': 'by-occasion', 'children': [
                {'code': 'CAT_GIFTS_WED', 'display_name': 'Wedding', 'url_slug': 'wedding'},
                {'code': 'CAT_GIFTS_HOMEWARM', 'display_name': 'Housewarming', 'url_slug': 'housewarming'}
            ]}
        ]
    },
    {
        'code': 'CAT_WELLNESS',
        'display_name': 'Personal Care & Wellness',
        'url_slug': 'personal-care-wellness',
        'children': [
            {'code': 'CAT_WELL_SOAPS', 'display_name': 'Soaps', 'url_slug': 'soaps'},
            {'code': 'CAT_WELL_SKIN', 'display_name': 'Skincare', 'url_slug': 'skincare'},
            {'code': 'CAT_WELL_AROMA', 'display_name': 'Aromatherapy', 'url_slug': 'aromatherapy'}
        ]
    },
    {
        'code': 'CAT_KIDS',
        'display_name': 'Kids & Baby',
        'url_slug': 'kids-baby',
        'children': [
            {'code': 'CAT_KIDS_TOYS', 'display_name': 'Toys', 'url_slug': 'toys', 'children': [
                {'code': 'CAT_KIDS_TOYS_WOOD', 'display_name': 'Wooden Toys', 'url_slug': 'wooden-toys'},
                {'code': 'CAT_KIDS_TOYS_SOFT', 'display_name': 'Soft Toys', 'url_slug': 'soft-toys'}
            ]},
            {'code': 'CAT_KIDS_NURSERY', 'display_name': 'Nursery', 'url_slug': 'nursery'}
        ]
    },
    {
        'code': 'CAT_CUSTOM',
        'display_name': 'Custom & Made-to-Order',
        'url_slug': 'custom-made-to-order',
        'children': [
            {'code': 'CAT_CUSTOM_JEW', 'display_name': 'Custom Jewelry', 'url_slug': 'custom-jewelry'},
            {'code': 'CAT_CUSTOM_PERSON', 'display_name': 'Personalized', 'url_slug': 'personalized'}
        ]
    }
]


DEFAULT_TAXONOMY_PATH = Path(__file__).resolve().parent.parent / 'data' / 'taxonomy_full.json'

# Basic facet map (can be extended / moved to DB)
DEFAULT_FACET_MAP = {
    'CAT_JEWELRY': ['material', 'technique', 'price_tier', 'size', 'customisable'],
    'CAT_HOME': ['material', 'region_of_origin', 'color'],
    'CAT_APPAREL': ['material', 'size', 'gender', 'technique', 'price_tier'],
    'CAT_WELLNESS': ['sustainability', 'size', 'price_tier']
}


class Command(BaseCommand):
    help = 'Seed the categories tree. Safe to run multiple times (idempotent).'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Soft-delete existing categories before seeding')
        parser.add_argument('--file', type=str, default=str(DEFAULT_TAXONOMY_PATH), help='Path to taxonomy JSON file')
        parser.add_argument('--assign-facets', action='store_true', default=True, help='Assign default facets to top-level categories')
        parser.add_argument('--no-assign-facets', action='store_false', dest='assign_facets', help='Do not assign default facets')
        parser.add_argument('--seed-external', action='store_true', help='Seed external mappings if present in taxonomy')
        parser.add_argument('--backfill-products', action='store_true', help='Run heuristic product-category backfill for unassigned products')

    def handle(self, *args, **options):
        force = options.get('force')
        taxonomy_file = options.get('file')
        assign_facets = options.get('assign_facets')
        seed_external = options.get('seed_external')

        if force:
            self.stdout.write(self.style.WARNING('Soft-deleting existing categories (force).'))
            for c in Category.objects.filter(is_deleted=False):
                c.soft_delete()

        # Load taxonomy JSON if provided
        if taxonomy_file and Path(taxonomy_file).exists():
            try:
                with open(taxonomy_file, 'r', encoding='utf-8') as fh:
                    data = json.load(fh)
                    tree = data.get('categories', [])
            except Exception as exc:
                self.stderr.write(f'Failed to load taxonomy file: {exc}')
                tree = CATEGORY_TREE
        else:
            tree = CATEGORY_TREE

        with transaction.atomic():
            created = 0
            updated = 0

            def create_node(node: Union[str, Dict[str, Any]], parent: Category | None = None, order: int = 0):
                nonlocal created, updated

                if isinstance(node, str):
                    name = node
                    children = None
                    code = None
                    url_slug = slugify(name)
                else:
                    name = node.get('display_name') or node.get('name')
                    children = node.get('children')
                    code = node.get('code')
                    url_slug = node.get('url_slug') or slugify(name)

                defaults = {
                    'name': name,
                    'is_active': True,
                    'order': order,
                    'slug': url_slug,
                }

                category, cat_created = Category.objects.get_or_create(parent=parent, slug=url_slug, defaults=defaults)
                if cat_created:
                    created += 1
                    self.stdout.write(self.style.SUCCESS(f'Created category: {category.full_path or category.name}'))
                else:
                    # Update name/order/is_active if changed
                    changed = False
                    if category.name != name:
                        category.name = name
                        changed = True
                    if category.order != order:
                        category.order = order
                        changed = True
                    if not category.is_active:
                        category.is_active = True
                        changed = True
                    if changed:
                        category.save()
                        updated += 1
                        self.stdout.write(self.style.NOTICE(f'Updated category: {category.full_path or category.name}'))

                # Ensure code is populated
                if code and category.code != code:
                    category.code = code
                    category.save(update_fields=['code'])

                # Assign default facets for top-level categories if requested
                if assign_facets and code in DEFAULT_FACET_MAP:
                    facet_list = DEFAULT_FACET_MAP.get(code, [])
                    for fcode in facet_list:
                        facet, _ = Facet.objects.get_or_create(facet_code=fcode, defaults={'label': fcode.title(), 'data_type': 'enum'})
                        CategoryAllowedFacet.objects.get_or_create(category=category, facet=facet)

                # External mappings
                if seed_external and isinstance(node, dict) and node.get('external_mappings'):
                    for mapping in node.get('external_mappings'):
                        provider = mapping.get('provider')
                        ext_code = mapping.get('code')
                        if provider and ext_code:
                            ExternalCategoryMapping.objects.update_or_create(category=category, provider=provider, defaults={'external_code': ext_code, 'extra': mapping.get('extra')})

                # Recursively create children
                if children:
                    for idx, child in enumerate(children, start=1):
                        create_node(child, parent=category, order=idx)

            for idx, item in enumerate(tree, start=1):
                create_node(item, parent=None, order=idx)

            # Rebuild paths and depths to ensure consistency
            fixed = Category.rebuild_all_paths()

            # Optional heuristic backfill for products
            backfilled = 0
            if options.get('backfill_products'):
                try:
                    from apps.products.models import Product
                    # Preload categories for matching
                    cats = list(Category.objects.filter(is_active=True, is_deleted=False).order_by('depth').all())
                    cat_keywords = []
                    for c in cats:
                        keywords = set((c.slug or '').split('-') + (c.name or '').lower().split())
                        cat_keywords.append((c, keywords))

                    batch = []
                    for p in Product.objects.filter(categories__isnull=True, is_deleted=False).iterator():
                        name_text = f"{p.name or ''} {p.description or ''}".lower()
                        best = None
                        best_score = 0
                        for c, kws in cat_keywords:
                            score = sum(1 for kw in kws if kw and kw in name_text)
                            if score > best_score:
                                best_score = score
                                best = c
                        if best and best_score >= 1:
                            batch.append((p, best))
                        if len(batch) >= 50:
                            for prod, cat in batch:
                                prod.categories.add(cat)
                                backfilled += 1
                            batch = []
                    # flush
                    for prod, cat in batch:
                        prod.categories.add(cat)
                        backfilled += 1
                except Exception as exc:
                    self.stderr.write(f'Product backfill failed: {exc}')

            self.stdout.write(self.style.SUCCESS(f'Seeding complete: {created} created, {updated} updated, {fixed} paths fixed, {backfilled} products backfilled.'))
