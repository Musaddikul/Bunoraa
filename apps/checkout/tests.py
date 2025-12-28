"""
Checkout tests
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from apps.products.models import Product
from apps.categories.models import Category
from apps.cart.models import Cart, CartItem
from apps.cart.services import CartService
from .models import CheckoutSession, ShippingRate
from .services import CheckoutService


User = get_user_model()


class CheckoutSessionModelTest(TestCase):
    """Test cases for CheckoutSession model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.cart = Cart.objects.create(user=self.user)
    
    def test_create_checkout_session(self):
        """Test creating checkout session."""
        session = CheckoutSession.objects.create(
            user=self.user,
            cart=self.cart
        )
        
        self.assertEqual(session.user, self.user)
        self.assertEqual(session.cart, self.cart)
        self.assertEqual(session.current_step, CheckoutSession.STEP_CART)
    
    def test_checkout_session_defaults(self):
        """Test checkout session default values."""
        session = CheckoutSession.objects.create(
            user=self.user,
            cart=self.cart
        )
        
        self.assertTrue(session.billing_same_as_shipping)
        self.assertEqual(session.shipping_method, CheckoutSession.SHIPPING_STANDARD)
        self.assertEqual(session.payment_method, CheckoutSession.PAYMENT_STRIPE)
    
    def test_can_proceed_to_shipping(self):
        """Test can proceed to shipping check."""
        category = Category.objects.create(name='Test', slug='test')
        product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        product.categories.add(category)
        CartItem.objects.create(
            cart=self.cart,
            product=product,
            quantity=1,
            price_at_add=product.price
        )
        
        session = CheckoutSession.objects.create(
            user=self.user,
            cart=self.cart
        )
        
        self.assertTrue(session.can_proceed_to_shipping)
    
    def test_can_proceed_to_payment(self):
        """Test can proceed to payment check."""
        session = CheckoutSession.objects.create(
            user=self.user,
            cart=self.cart,
            shipping_first_name='John',
            shipping_last_name='Doe',
            shipping_address_line_1='123 Main St',
            shipping_city='New York',
            shipping_postal_code='10001',
            shipping_country='United States'
        )
        
        # Add item to cart
        category = Category.objects.create(name='Test', slug='test')
        product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        product.categories.add(category)
        CartItem.objects.create(
            cart=self.cart,
            product=product,
            quantity=1,
            price_at_add=product.price
        )
        
        self.assertTrue(session.can_proceed_to_payment)


class ShippingRateModelTest(TestCase):
    """Test cases for ShippingRate model."""
    
    def test_create_shipping_rate(self):
        """Test creating shipping rate."""
        rate = ShippingRate.objects.create(
            name='Standard Shipping',
            code='standard',
            base_rate=Decimal('5.99'),
            min_delivery_days=5,
            max_delivery_days=7
        )
        
        self.assertEqual(rate.name, 'Standard Shipping')
        self.assertEqual(rate.base_rate, Decimal('5.99'))
    
    def test_calculate_cost_basic(self):
        """Test basic cost calculation."""
        rate = ShippingRate.objects.create(
            name='Standard',
            code='standard',
            base_rate=Decimal('5.99'),
            per_item_rate=Decimal('1.00')
        )
        
        cost = rate.calculate_cost(subtotal=Decimal('50.00'), item_count=3)
        self.assertEqual(cost, Decimal('8.99'))  # 5.99 + 3*1.00
    
    def test_calculate_cost_free_shipping(self):
        """Test free shipping threshold."""
        rate = ShippingRate.objects.create(
            name='Standard',
            code='standard',
            base_rate=Decimal('5.99'),
            free_shipping_threshold=Decimal('50.00')
        )
        
        cost = rate.calculate_cost(subtotal=Decimal('75.00'), item_count=1)
        self.assertEqual(cost, 0)
    
    def test_delivery_estimate(self):
        """Test delivery estimate string."""
        rate = ShippingRate.objects.create(
            name='Standard',
            code='standard',
            base_rate=Decimal('5.99'),
            min_delivery_days=5,
            max_delivery_days=7
        )
        
        self.assertEqual(rate.delivery_estimate, '5-7 days')


class CheckoutServiceTest(TestCase):
    """Test cases for CheckoutService."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.cart = CartService.get_or_create_cart(user=self.user)
        self.category = Category.objects.create(name='Test', slug='test')
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        self.product.categories.add(self.category)
        CartService.add_item(self.cart, self.product, quantity=2)
    
    def test_get_or_create_session(self):
        """Test get or create checkout session."""
        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )
        
        self.assertIsNotNone(session)
        self.assertEqual(session.user, self.user)
        self.assertEqual(session.cart, self.cart)
        
        # Pre-filled from user
        self.assertEqual(session.shipping_first_name, 'Test')
        self.assertEqual(session.shipping_last_name, 'User')
    
    def test_update_shipping_address(self):
        """Test updating shipping address."""
        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )
        
        address_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'phone': '555-1234',
            'address_line_1': '123 Main St',
            'city': 'New York',
            'state': 'NY',
            'postal_code': '10001',
            'country': 'United States',
            'billing_same_as_shipping': True
        }
        
        updated_session = CheckoutService.update_shipping_address(session, address_data)
        
        self.assertEqual(updated_session.shipping_first_name, 'John')
        self.assertEqual(updated_session.shipping_city, 'New York')
    
    def test_set_shipping_method(self):
        """Test setting shipping method."""
        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )
        
        updated_session = CheckoutService.set_shipping_method(
            session,
            CheckoutSession.SHIPPING_EXPRESS
        )
        
        self.assertEqual(updated_session.shipping_method, CheckoutSession.SHIPPING_EXPRESS)
        self.assertGreater(updated_session.shipping_cost, 0)
    
    def test_get_shipping_options(self):
        """Test getting shipping options."""
        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )
        
        options = CheckoutService.get_shipping_options(session)
        
        self.assertTrue(len(options) > 0)
        self.assertIn('code', options[0])
        self.assertIn('cost', options[0])
    
    def test_get_checkout_summary(self):
        """Test getting checkout summary."""
        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )
        
        summary = CheckoutService.get_checkout_summary(session)
        
        self.assertIn('subtotal', summary)
        self.assertIn('total', summary)
        self.assertIn('items', summary)

    def test_subscribe_guest_creates_subscriber(self):
        """Subscribing during checkout as a guest should create a Subscriber."""
        from apps.pages.models import Subscriber

        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            session_key='guest-sub-1'
        )

        data = {
            'email': 'guest@example.com',
            'first_name': 'Guest',
            'last_name': 'User',
            'address_line_1': '123 Guest St',
            'city': 'Dhaka',
            'postal_code': '1000',
            'country': 'Bangladesh',
            'subscribe_newsletter': True
        }

        updated = CheckoutService.update_contact_information(session, data)
        self.assertTrue(updated.subscribe_newsletter)
        self.assertTrue(Subscriber.objects.filter(email='guest@example.com', is_active=True).exists())

    def test_subscribe_and_unsubscribe_updates_user_and_subscriber(self):
        """Toggling the newsletter checkbox for authenticated users updates user preference and subscriber record."""
        from apps.pages.models import Subscriber

        # Ensure there is a Subscriber (inactive) initially
        Subscriber.objects.filter(email=self.user.email).delete()

        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )

        data = {
            'email': self.user.email,
            'first_name': 'Test',
            'last_name': 'User',
            'address_line_1': '123 Main St',
            'city': 'Dhaka',
            'postal_code': '1000',
            'country': 'Bangladesh',
            'subscribe_newsletter': True
        }

        CheckoutService.update_contact_information(session, data)
        self.user.refresh_from_db()
        self.assertTrue(self.user.newsletter_subscribed)
        self.assertTrue(Subscriber.objects.filter(email=self.user.email, is_active=True).exists())

        # Now unsubscribe via the checkout form
        data['subscribe_newsletter'] = False
        CheckoutService.update_contact_information(session, data)
        self.user.refresh_from_db()
        self.assertFalse(self.user.newsletter_subscribed)
        self.assertFalse(Subscriber.objects.filter(email=self.user.email, is_active=True).exists())

    def test_set_gift_options_uses_cart_setting(self):
        """Gift wrap cost should come from CartSettings when enabled."""
        from apps.cart.models import CartSettings
        s = CartSettings.get_settings()
        s.gift_wrap_enabled = True
        s.gift_wrap_amount = 99.00
        s.save()

        session = CheckoutService.get_or_create_session(
            cart=self.cart,
            user=self.user
        )

        # Enable gift wrap via service
        updated = CheckoutService.set_gift_options(session, is_gift=True, gift_message='Test', gift_wrap=True)
        self.assertTrue(updated.gift_wrap)
        self.assertEqual(updated.gift_wrap_cost, Decimal('99.00'))

        # Disable in settings and ensure fee is zeroed
        s.gift_wrap_enabled = False
        s.save()
        updated2 = CheckoutService.set_gift_options(session, is_gift=True, gift_message='Test 2', gift_wrap=True)
        self.assertFalse(updated2.gift_wrap)
        self.assertEqual(updated2.gift_wrap_cost, Decimal('0'))


class CheckoutAPITest(APITestCase):
    """Test cases for Checkout API."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(name='Test', slug='test')
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('29.99'),
            stock_quantity=100,
            is_active=True
        )
        self.product.categories.add(self.category)
        
        # Create cart with item
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/v1/cart/add/', {
            'product_id': str(self.product.id),
            'quantity': 2
        })
    
    def test_start_checkout(self):
        """Test starting checkout."""
        response = self.client.post('/api/v1/checkout/start/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('id', response.data['data'])
    
    def test_start_checkout_empty_cart(self):
        """Test starting checkout with empty cart."""
        # Clear cart
        self.client.delete('/api/v1/cart/clear/')
        
        response = self.client.post('/api/v1/checkout/start/')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_get_shipping_options(self):
        """Test getting shipping options."""
        # Start checkout first
        self.client.post('/api/v1/checkout/start/')
        
        response = self.client.get('/api/v1/checkout/shipping-options/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertTrue(len(response.data['data']) > 0)
    
    def test_update_shipping(self):
        """Test updating shipping info."""
        # Start checkout first
        self.client.post('/api/v1/checkout/start/')
        
        response = self.client.post('/api/v1/checkout/shipping/', {
            'shipping_address': {
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'john@example.com',
                'address_line_1': '123 Main St',
                'city': 'New York',
                'postal_code': '10001',
                'country': 'United States'
            },
            'billing_same_as_shipping': True,
            'shipping_method': 'standard'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_get_checkout_summary(self):
        """Test getting checkout summary."""
        # Start checkout first
        self.client.post('/api/v1/checkout/start/')
        
        response = self.client.get('/api/v1/checkout/summary/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('subtotal', response.data['data'])
        self.assertIn('total', response.data['data'])
