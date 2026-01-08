import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault('DJANGO_SETTINGS_MODULE','core.settings')
import django
django.setup()
from apps.products.models import Product
from django.core.management import call_command
from apps.categories.ml import ProductCategorySuggestion

prod = Product.objects.create(name='Handwoven Shawl in silk', price='20.00', description='Beautiful handwoven')
print('Created product', prod.id)
call_command('classify_products', '--limit', '10', '--min_confidence', '0.0')
print('Suggestions exist?', ProductCategorySuggestion.objects.filter(product_id=prod.id).exists())
print(list(ProductCategorySuggestion.objects.filter(product_id=prod.id).values('suggested_category__code','confidence')))
