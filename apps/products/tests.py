"""
Product tests
"""
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, ProductImage, ProductVariant, Tag
from .services import ProductService
from apps.categories.models import Category

User = get_user_model()


class ProductModelTest(TestCase):
    """Tests for Product model."""
    
    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
    
    def test_create_product(self):
        """Test creating a product."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('99.99'),
            stock_quantity=10
        )
        self.assertEqual(product.name, 'Test Product')
        self.assertIsNotNone(product.slug)
        self.assertIsNotNone(product.sku)
    
    def test_current_price_regular(self):
        """Test current_price when not on sale."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00')
        )
        self.assertEqual(product.current_price, Decimal('100.00'))
    
    def test_current_price_on_sale(self):
        """Test current_price when on sale."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00'),
            sale_price=Decimal('80.00')
        )
        self.assertEqual(product.current_price, Decimal('80.00'))
    
    def test_discount_percentage(self):
        """Test discount percentage calculation."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00'),
            sale_price=Decimal('75.00')
        )
        self.assertEqual(product.discount_percentage, 25)
    
    def test_is_in_stock(self):
        """Test is_in_stock property."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00'),
            stock_quantity=10,
            track_inventory=True
        )
        self.assertTrue(product.is_in_stock)
        
        product.stock_quantity = 0
        product.save()
        self.assertFalse(product.is_in_stock)
    
    def test_soft_delete(self):
        """Test soft delete functionality."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00')
        )
        product.soft_delete()
        self.assertTrue(product.is_deleted)
        self.assertFalse(product.is_active)
    
    def test_category_assignment(self):
        """Test product category assignment."""
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('100.00')
        )
        product.categories.add(self.category)
        self.assertIn(self.category, product.categories.all())

    def test_product_currency_fk(self):
        """Ensure product can be linked to a Currency FK and get_currency returns it."""
        from apps.currencies.models import Currency
        cur = Currency.objects.create(code='USD', name='US Dollar', symbol='$')
        product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
            currency=cur
        )
        self.assertIsNotNone(product.currency)
        self.assertEqual(product.get_currency().code, 'USD')


class ProductServiceTest(TestCase):
    """Tests for ProductService."""
    
    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        self.product1 = Product.objects.create(
            name='Product 1',
            price=Decimal('100.00'),
            is_featured=True
        )
        self.product2 = Product.objects.create(
            name='Product 2',
            price=Decimal('200.00'),
            sale_price=Decimal('150.00')
        )
        self.product1.categories.add(self.category)
    
    def test_get_featured_products(self):
        """Test get_featured_products method."""
        featured = ProductService.get_featured_products(limit=10)
        self.assertEqual(len(featured), 1)
        self.assertEqual(featured[0], self.product1)
    
    def test_get_on_sale_products(self):
        """Test get_on_sale_products method."""
        on_sale = ProductService.get_on_sale_products(limit=10)
        self.assertEqual(len(on_sale), 1)
        self.assertEqual(on_sale[0], self.product2)
    
    def test_search_products(self):
        """Test search_products method."""
        results = ProductService.search_products('Product 1')
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0], self.product1)
    
    def test_get_price_range(self):
        """Test get_price_range method."""
        price_range = ProductService.get_price_range()
        self.assertEqual(price_range['min_price'], Decimal('100.00'))
        self.assertEqual(price_range['max_price'], Decimal('200.00'))


class ProductAPITest(APITestCase):
    """API tests for product endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('99.99'),
            stock_quantity=10,
            is_active=True
        )
        self.product.categories.add(self.category)
    
    def test_list_products(self):
        """Test listing products."""
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_retrieve_product(self):
        """Test retrieving a product."""
        response = self.client.get(f'/api/v1/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Test Product')

    def test_retrieve_product_price_converted(self):
        """Product detail should return converted prices when currency param is provided."""
        from apps.currencies.models import Currency, ExchangeRate
        usd = Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)
        bdt = Currency.objects.create(code='BDT', name='Taka', symbol='৳', is_active=True)
        ExchangeRate.objects.create(from_currency=usd, to_currency=bdt, rate='110.00', source='manual')
        self.product.currency = usd
        self.product.price = Decimal('10.00')
        self.product.save()
        response = self.client.get(f'/api/v1/products/{self.product.id}/', {'currency': 'BDT'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        self.assertIn('price_converted', data)
        self.assertEqual(Decimal(str(data['price_converted'])), Decimal('1100.00'))
    
    def test_create_product_admin(self):
        """Test creating a product as admin."""
        self.client.force_authenticate(user=self.admin)
        from apps.currencies.models import Currency
        Currency.objects.get_or_create(code='USD', defaults={'name': 'US Dollar', 'symbol': '$'})
        data = {
            'name': 'New Product',
            'price': '149.99',
            'stock_quantity': 5,
            'currency': 'USD'
        }
        response = self.client.post('/api/v1/products/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['currency'], 'USD')
    
    def test_create_product_non_admin(self):
        """Test that non-admin cannot create product."""
        user = User.objects.create_user(
            email='user@example.com',
            password='userpass123'
        )
        self.client.force_authenticate(user=user)
        data = {'name': 'New Product', 'price': '149.99'}
        response = self.client.post('/api/v1/products/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_search_products(self):
        """Test searching products."""
        response = self.client.get('/api/v1/products/search/', {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_featured_products(self):
        """Test getting featured products."""
        response = self.client.get('/api/v1/products/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_filter_by_category(self):
        """Test filtering products by category."""
        response = self.client.get(f'/api/v1/products/', {'category': str(self.category.id)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_products_includes_currency(self):
        """List endpoint should include product currency."""
        from apps.currencies.models import Currency
        cur = Currency.objects.create(code='USD', name='US Dollar', symbol='$')
        self.product.currency = cur
        self.product.save()
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data'][0]['currency'], 'USD')

    def test_list_products_price_converted(self):
        """List endpoint should return converted prices when currency param is provided."""
        from apps.currencies.models import Currency, ExchangeRate
        usd = Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)
        bdt = Currency.objects.create(code='BDT', name='Taka', symbol='৳', is_active=True)
        ExchangeRate.objects.create(from_currency=usd, to_currency=bdt, rate='110.00', source='manual')
        # Set product base currency to USD and price 10
        self.product.currency = usd
        self.product.price = Decimal('10.00')
        self.product.save()
        # Request conversion to BDT
        response = self.client.get('/api/v1/products/', {'currency': 'BDT'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data'][0]
        # price_converted should be 1100.00 (10 * 110)
        self.assertIn('price_converted', data)
        self.assertEqual(Decimal(str(data['price_converted'])), Decimal('1100.00'))

    def test_product_detail_includes_product_currency(self):
        """Product detail JS object should include product currency code when product has currency FK."""
        from apps.currencies.models import Currency
        cur = Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)
        self.product.currency = cur
        self.product.save()
        response = self.client.get(f'/products/{self.product.slug}/')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn(f'currencyCode: "{cur.code}"', content)

    def test_product_detail_uses_default_currency_when_product_has_no_currency(self):
        """Product detail should fall back to site/default currency when product.currency is not set."""
        # Ensure a default currency exists
        from apps.currencies.models import Currency
        Currency.objects.all().delete()
        default = Currency.objects.create(code='AED', name='Dirham', symbol='د.إ', is_active=True, is_default=True)
        self.product.currency = None
        self.product.save()
        response = self.client.get(f'/products/{self.product.slug}/')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn(f'currencyCode: "{default.code}"', content)


class SeedTagsCommandTest(TestCase):
    """Tests for seed_tags management command"""

    def test_seed_tags_command_dry_run_and_overwrite(self):
        from django.core.management import call_command
        from .models import Tag

        # Ensure no tags initially
        Tag.objects.all().delete()
        # Dry-run should not create any tags
        call_command('seed_tags', '--dry-run')
        self.assertEqual(Tag.objects.count(), 0)

        # Run with file and overwrite
        call_command('seed_tags', '--file=apps/products/data/tags.json', '--overwrite')
        self.assertTrue(Tag.objects.exists())
        # Running again should not duplicate
        call_command('seed_tags', '--file=apps/products/data/tags.json')
        self.assertEqual(Tag.objects.count(), len([t for t in open('apps/products/data/tags.json').read().strip().splitlines() if t.strip()]))
