# Bunoraa Taxonomy & Governance

This document describes the category taxonomy, naming conventions, facets, and governance for Bunoraa's handcrafted product catalog.

## Overview
- Breadth-first taxonomy
- Max depth: 3 levels (Top → Subcategory → Type)
- Categories are for navigation; facets are for filter attributes
- Clear root naming: e.g., `Home & Living`, `Clothing & Apparel`, `Handcrafted Jewelry`.
- IDs are immutable `code` strings (e.g., `CAT_HOME`)

## Naming conventions
- Display names: Title Case, singular where sensible ("Dress", "Shawl")
- Slugs: lowercase, hyphen-separated, ascii-only (e.g., `handwoven-saree`)
- SEO title template: `{Display Name} | Bunoraa — Handcrafted {TopLevel}`
- No "misc" or ambiguous buckets without analytics-driven justification

## Category schema (short)
- node_id (uuid)
- code (string, immutable)
- parent_id
- display_name
- url_slug
- path (materialized slug path)
- depth (int)
- seo_meta_title
- seo_meta_description
- allowed_facets (M2M)
- visibility: draft/published/archived
- governance: owner, last_reviewed, review_interval_days, version

## Facet catalog (examples)
- material (cotton, silk, wood, ceramic, metal)
- technique (handwoven, block-printed, hand-painted)
- region_of_origin (Rajasthan, Gujarat, etc.)
- occasion (wedding, festive)
- sustainability (organic, upcycled)
- color (palette names)
- size / dimensions
- price_tier (budget, mid, premium)
- customisable (boolean)

## Governance process
1. Owner assigned per top-level category
2. Quarterly review (automated reminder via `review_interval_days`)
3. Proposed taxonomy changes require staging test and analytics validation
4. Versioned releases; keep backward-compatibility for 1 release

## Commands
- Seed default taxonomy:

```bash
python manage.py seed_categories --file=apps/categories/data/taxonomy_full.json --assign-facets

# Backup
You can create a site backup including DB fixtures and optional media/static files using:

```
python manage.py backup_site --apps=categories,products --include-media --output=backups/site.tar.gz
```

To upload directly to S3 add `--upload-s3` and configure `AWS_BACKUP_S3_BUCKET` in your settings or pass `--s3-bucket`:

```
python manage.py backup_site --upload-s3 --remove-local --s3-key-prefix=backups --output=backups/site.tar.gz
```

The command will produce a tar (or tar.gz) archive containing a `fixtures/` folder with per-app JSON fixtures and optional `media/` and `static/` folders.

GitHub Actions example
----------------------
A scheduled workflow can run daily and upload backups to S3 (add AWS creds and bucket name to repo secrets):

```.github/workflows/backup.yml
# example: scheduled backup -> backup_site --upload-s3 --remove-local --no-compress
```
```

- Backfill products (heuristic or ML classifier):

```bash
python manage.py seed_categories --backfill-products
# or use classifier suggestions persisted by:
python manage.py classify_products --limit 1000 --min_confidence 0.2
```

- To use a local PyTorch model, place the model file at `apps/categories/models/classifier.pt`.
  The classifier module will attempt to load it automatically if `torch` is installed; otherwise it falls back to the keyword heuristic.
- Export taxonomy:

```bash
python manage.py export_taxonomy --out /tmp/taxonomy.csv
```

- Classification API (dev & testing):

GET /api/v1/categories/classify/?name=Handwoven+Shawl&description=silk

- Export mappings via API:

GET /api/v1/categories/export_mappings/?provider=google_shopping

## Rollout checklist
- Run in staging with full-product sample
- Validate: paths, depth, SEO fields, search index mapping, marketplace exports
- Run test suite & migration tests
- Soft-launch for a subset and monitor analytics

## Contacts
- Taxonomy owner: taxonomy@bunoraa.com
- Developer: see Git history

