# apps/cart/tests.py
"""
Tests for cart app.
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from .models import Cart, CartItem
from .services import CartService
from apps.products.models import Product
from apps.categories.models import Category

User = get_user_model()


class CartModelTests(TestCase):
    """Tests for Cart model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            category=self.category,
            price=Decimal('99.99'),
            stock=10
        )
    
    def test_create_cart_for_user(self):
        """Test creating a cart for authenticated user."""
        cart = Cart.objects.create(user=self.user)
        
        self.assertEqual(cart.user, self.user)
        self.assertEqual(cart.item_count, 0)
        self.assertEqual(cart.subtotal, Decimal('0'))
    
    def test_create_cart_for_session(self):
        """Test creating a cart for guest user."""
        cart = Cart.objects.create(session_key='test-session-123')
        
        self.assertIsNone(cart.user)
        self.assertEqual(cart.session_key, 'test-session-123')
    
    def test_cart_item_count(self):
        """Test cart item count property."""
        cart = Cart.objects.create(user=self.user)
        
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            unit_price=self.product.price
        )
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=3,
            unit_price=self.product.price
        )
        
        self.assertEqual(cart.item_count, 5)
    
    def test_cart_subtotal(self):
        """Test cart subtotal calculation."""
        cart = Cart.objects.create(user=self.user)
        
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            unit_price=Decimal('50.00')
        )
        
        self.assertEqual(cart.subtotal, Decimal('100.00'))
    
    def test_cart_clear(self):
        """Test clearing cart items."""
        cart = Cart.objects.create(user=self.user)
        
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            unit_price=self.product.price
        )
        
        self.assertEqual(cart.item_count, 2)
        
        cart.clear()
        
        self.assertEqual(cart.item_count, 0)


class CartItemModelTests(TestCase):
    """Tests for CartItem model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            category=self.category,
            price=Decimal('25.00'),
            stock=10
        )
        self.cart = Cart.objects.create(user=self.user)
    
    def test_cart_item_line_total(self):
        """Test cart item line total calculation."""
        item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=3,
            unit_price=Decimal('25.00')
        )
        
        self.assertEqual(item.line_total, Decimal('75.00'))


class CartServiceTests(TestCase):
    """Tests for CartService."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            category=self.category,
            price=Decimal('50.00'),
            sale_price=Decimal('40.00'),
            stock=10
        )
    
    def test_add_item_to_cart(self):
        """Test adding item to cart."""
        cart = Cart.objects.create(user=self.user)
        
        item = CartService.add_item(
            cart=cart,
            product=self.product,
            quantity=2
        )
        
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.unit_price, Decimal('40.00'))  # Sale price
        self.assertEqual(cart.item_count, 2)
    
    def test_add_existing_item_increases_quantity(self):
        """Test adding same item increases quantity."""
        cart = Cart.objects.create(user=self.user)
        
        CartService.add_item(cart=cart, product=self.product, quantity=2)
        CartService.add_item(cart=cart, product=self.product, quantity=3)
        
        self.assertEqual(cart.items.count(), 1)
        self.assertEqual(cart.items.first().quantity, 5)
    
    def test_update_item_quantity(self):
        """Test updating item quantity."""
        cart = Cart.objects.create(user=self.user)
        item = CartService.add_item(cart=cart, product=self.product, quantity=2)
        
        updated_item = CartService.update_item_quantity(
            cart=cart,
            item_id=item.id,
            quantity=5
        )
        
        self.assertEqual(updated_item.quantity, 5)
    
    def test_update_item_quantity_to_zero_removes_item(self):
        """Test setting quantity to 0 removes item."""
        cart = Cart.objects.create(user=self.user)
        item = CartService.add_item(cart=cart, product=self.product, quantity=2)
        
        CartService.update_item_quantity(
            cart=cart,
            item_id=item.id,
            quantity=0
        )
        
        self.assertEqual(cart.items.count(), 0)
    
    def test_remove_item(self):
        """Test removing item from cart."""
        cart = Cart.objects.create(user=self.user)
        item = CartService.add_item(cart=cart, product=self.product, quantity=2)
        
        result = CartService.remove_item(cart=cart, item_id=item.id)
        
        self.assertTrue(result)
        self.assertEqual(cart.items.count(), 0)
    
    def test_merge_carts(self):
        """Test merging two carts."""
        user_cart = Cart.objects.create(user=self.user)
        session_cart = Cart.objects.create(session_key='test-session')
        
        # Add items to both carts
        CartService.add_item(cart=user_cart, product=self.product, quantity=2)
        CartService.add_item(cart=session_cart, product=self.product, quantity=3)
        
        CartService.merge_carts(user_cart, session_cart)
        
        # Session cart should be deleted
        self.assertFalse(Cart.objects.filter(session_key='test-session').exists())
        
        # User cart should have merged quantity
        self.assertEqual(user_cart.items.first().quantity, 5)
    
    def test_validate_cart_for_checkout_empty_cart(self):
        """Test checkout validation with empty cart."""
        cart = Cart.objects.create(user=self.user)
        
        is_valid, errors = CartService.validate_cart_for_checkout(cart)
        
        self.assertFalse(is_valid)
        self.assertIn('Cart is empty', errors)
    
    def test_validate_cart_for_checkout_out_of_stock(self):
        """Test checkout validation with out of stock item."""
        self.product.stock = 0
        self.product.save()
        
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1,
            unit_price=self.product.price
        )
        
        is_valid, errors = CartService.validate_cart_for_checkout(cart)
        
        self.assertFalse(is_valid)
        self.assertTrue(any('out of stock' in e for e in errors))


class CartAPITests(APITestCase):
    """API tests for cart endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            category=self.category,
            price=Decimal('99.99'),
            stock=10,
            is_active=True
        )
    
    def test_get_cart_unauthenticated(self):
        """Test getting cart as guest."""
        response = self.client.get('/api/v1/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_get_cart_authenticated(self):
        """Test getting cart as authenticated user."""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/v1/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_add_item_to_cart(self):
        """Test adding item to cart via API."""
        response = self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['cart']['item_count'], 2)
    
    def test_add_item_invalid_product(self):
        """Test adding invalid product to cart."""
        response = self.client.post('/api/v1/cart/items/', {
            'product_id': '00000000-0000-0000-0000-000000000000',
            'quantity': 1
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_cart_item_quantity(self):
        """Test updating cart item quantity."""
        # First add item
        self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        # Get the item ID
        cart_response = self.client.get('/api/v1/cart/')
        item_id = cart_response.data['data']['items'][0]['id']
        
        # Update quantity
        response = self.client.patch(f'/api/v1/cart/items/{item_id}/', {
            'quantity': 5
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['item_count'], 5)
    
    def test_remove_cart_item(self):
        """Test removing item from cart."""
        # First add item
        self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
        
        # Get the item ID
        cart_response = self.client.get('/api/v1/cart/')
        item_id = cart_response.data['data']['items'][0]['id']
        
        # Remove item
        response = self.client.delete(f'/api/v1/cart/items/{item_id}/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['item_count'], 0)
    
    def test_clear_cart(self):
        """Test clearing cart."""
        # Add items
        self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 3
        })
        
        # Clear cart
        response = self.client.delete('/api/v1/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['item_count'], 0)
    
    def test_cart_count_endpoint(self):
        """Test cart count endpoint."""
        # Add items
        self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 3
        })
        
        response = self.client.get('/api/v1/cart/count/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 3)
