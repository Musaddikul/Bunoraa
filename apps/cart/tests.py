"""
Cart tests
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from apps.products.models import Product, ProductVariant
from apps.categories.ml import Category
from .models import Cart, CartItem
from .services import CartService


User = get_user_model()


class CartModelTest(TestCase):
    """Test cases for Cart model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        self.product.categories.add(self.category)
    
    def test_create_user_cart(self):
        """Test creating a cart for authenticated user."""
        cart = Cart.objects.create(user=self.user)
        self.assertEqual(cart.user, self.user)
        self.assertIsNone(cart.session_key)
    
    def test_create_session_cart(self):
        """Test creating a cart for session."""
        cart = Cart.objects.create(session_key='test-session-key')
        self.assertIsNone(cart.user)
        self.assertEqual(cart.session_key, 'test-session-key')
    
    def test_cart_item_creation(self):
        """Test adding item to cart."""
        cart = Cart.objects.create(user=self.user)
        item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            price_at_add=self.product.price
        )
        
        self.assertEqual(item.cart, cart)
        self.assertEqual(item.product, self.product)
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.price_at_add, Decimal('29.99'))
    
    def test_cart_item_line_total(self):
        """Test cart item line total calculation."""
        cart = Cart.objects.create(user=self.user)
        item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=3,
            price_at_add=Decimal('29.99')
        )
        
        self.assertEqual(item.line_total, Decimal('89.97'))
    
    def test_cart_item_with_variant(self):
        """Test cart item with product variant."""
        cart = Cart.objects.create(user=self.user)
        variant = ProductVariant.objects.create(
            product=self.product,
            sku='TEST-VAR-001',
            name='Test Variant',
            price=Decimal('34.99'),
            stock_quantity=50,
            is_active=True
        )
        
        item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            variant=variant,
            quantity=1,
            price_at_add=variant.price
        )
        
        self.assertEqual(item.variant, variant)
        self.assertEqual(item.price_at_add, Decimal('34.99'))


class CartServiceTest(TestCase):
    """Test cases for CartService."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        self.product.categories.add(self.category)
    
    def test_get_or_create_cart_for_user(self):
        """Test get or create cart for user."""
        cart = CartService.get_or_create_cart(user=self.user)
        
        self.assertIsNotNone(cart)
        self.assertEqual(cart.user, self.user)
        
        # Getting again should return same cart
        cart2 = CartService.get_or_create_cart(user=self.user)
        self.assertEqual(cart.id, cart2.id)
    
    def test_get_or_create_cart_for_session(self):
        """Test get or create cart for session."""
        cart = CartService.get_or_create_cart(session_key='test-session')
        
        self.assertIsNotNone(cart)
        self.assertEqual(cart.session_key, 'test-session')
        
        # Getting again should return same cart
        cart2 = CartService.get_or_create_cart(session_key='test-session')
        self.assertEqual(cart.id, cart2.id)
    
    def test_add_item_to_cart(self):
        """Test adding item to cart."""
        cart = CartService.get_or_create_cart(user=self.user)
        item = CartService.add_item(cart, self.product, quantity=2)
        
        self.assertEqual(item.product, self.product)
        self.assertEqual(item.quantity, 2)
        self.assertEqual(cart.items.count(), 1)
    
    def test_add_same_item_increases_quantity(self):
        """Test adding same item increases quantity."""
        cart = CartService.get_or_create_cart(user=self.user)
        CartService.add_item(cart, self.product, quantity=2)
        CartService.add_item(cart, self.product, quantity=3)
        
        self.assertEqual(cart.items.count(), 1)
        item = cart.items.first()
        self.assertEqual(item.quantity, 5)
    
    def test_update_item_quantity(self):
        """Test updating item quantity."""
        cart = CartService.get_or_create_cart(user=self.user)
        item = CartService.add_item(cart, self.product, quantity=2)
        
        updated_item = CartService.update_item_quantity(cart, item.id, 5)
        
        self.assertEqual(updated_item.quantity, 5)
    
    def test_remove_item(self):
        """Test removing item from cart."""
        cart = CartService.get_or_create_cart(user=self.user)
        item = CartService.add_item(cart, self.product, quantity=2)
        
        CartService.remove_item(cart, item.id)
        
        self.assertEqual(cart.items.count(), 0)
    
    def test_validate_cart_out_of_stock(self):
        """Test validation catches out of stock items."""
        self.product.stock_quantity = 0
        self.product.save()
        
        cart = CartService.get_or_create_cart(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1,
            price_at_add=self.product.price
        )
        
        issues = CartService.validate_cart(cart)
        
        self.assertTrue(len(issues) > 0)
        self.assertTrue(any('out of stock' in issue.get('issue', '').lower() for issue in issues))
    
    def test_validate_cart_insufficient_stock(self):
        """Test validation catches insufficient stock."""
        self.product.stock_quantity = 5
        self.product.save()
        
        cart = CartService.get_or_create_cart(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=10,
            price_at_add=self.product.price
        )
        
        issues = CartService.validate_cart(cart)
        
        self.assertTrue(len(issues) > 0)
        self.assertTrue(any('only 5' in issue.get('issue', '').lower() for issue in issues))
    
    def test_get_cart_summary(self):
        """Test getting cart summary."""
        cart = CartService.get_or_create_cart(user=self.user)
        CartService.add_item(cart, self.product, quantity=2)
        
        # Use default currency (no user request) - subtotal should still be 59.98
        summary = CartService.get_cart_summary(cart)
        
        self.assertEqual(summary['item_count'], 2)
        self.assertEqual(Decimal(summary['subtotal']), Decimal('59.98'))
        self.assertEqual(len(summary['items']), 1)
        # Ensure formatted subtotal and per-item formatted amounts are present
        self.assertIn('formatted_subtotal', summary)
        self.assertTrue(summary['formatted_subtotal'])
        self.assertIn('formatted_total', summary)
        self.assertTrue(summary['formatted_total'])
        self.assertIn('formatted_unit_price', summary['items'][0])
        self.assertIn('formatted_total', summary['items'][0])

    def test_get_cart_summary_handles_missing_shipping(self):
        """Ensure get_cart_summary doesn't raise when cart has no shipping_cost attr."""
        cart = CartService.get_or_create_cart(user=self.user)
        CartService.add_item(cart, self.product, quantity=1)
        summary = CartService.get_cart_summary(cart)
        self.assertEqual(summary['shipping_cost'], '0.00')


class CartAPITest(APITestCase):
    """Test cases for Cart API."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        self.product.categories.add(self.category)
    
    def test_get_cart_unauthenticated(self):
        """Test getting cart as unauthenticated user."""
        response = self.client.get('/api/v1/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_get_cart_authenticated(self):
        """Test getting cart as authenticated user."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_add_to_cart(self):
        """Test adding item to cart."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['item']['quantity'], 2)
    
    def test_add_to_cart_invalid_product(self):
        """Test adding invalid product to cart."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/cart/add/', {
            'product_id': '00000000-0000-0000-0000-000000000000',
            'quantity': 1
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_update_cart_item(self):
        """Test updating cart item quantity."""
        self.client.force_authenticate(user=self.user)
        
        # Add item first
        response = self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        item_id = response.data['data']['item']['id']
        
        # Update quantity
        response = self.client.patch(f'/api/v1/cart/items/{item_id}/', {
            'quantity': 5
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['item']['quantity'], 5)
    
    def test_remove_cart_item(self):
        """Test removing item from cart."""
        self.client.force_authenticate(user=self.user)
        
        # Add item first
        response = self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        item_id = response.data['data']['item']['id']
        
        # Remove item
        response = self.client.delete(f'/api/v1/cart/items/{item_id}/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_validate_cart(self):
        """Test validating cart."""
        self.client.force_authenticate(user=self.user)
        
        # Add item first
        self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        # Validate
        response = self.client.get('/api/v1/cart/validate/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertTrue(response.data['data']['is_valid'])
    
    def test_clear_cart(self):
        """Test clearing cart."""
        self.client.force_authenticate(user=self.user)
        
        # Add item first
        self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        # Clear cart
        response = self.client.delete('/api/v1/cart/clear/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']['cart']['items']), 0)
