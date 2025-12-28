"""
Wishlist API tests
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.products.models import Product
from .models import Wishlist, WishlistItem
from .services import WishlistService

User = get_user_model()


class WishlistApiTest(TestCase):
    """Tests for wishlist API endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='tester@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            price=Decimal('19.99'),
            stock_quantity=10,
            is_active=True
        )
        self.client = APIClient()

    def test_get_wishlist_requires_auth(self):
        resp = self.client.get('/api/v1/wishlist/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_wishlist_returns_items_for_authenticated_user(self):
        WishlistService.add_item(user=self.user, product=self.product)
        self.client.force_authenticate(user=self.user)
        resp = self.client.get('/api/v1/wishlist/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertIn('data', data)
        wishlist_data = data['data']
        self.assertIn('items', wishlist_data)
        self.assertEqual(len(wishlist_data['items']), 1)
