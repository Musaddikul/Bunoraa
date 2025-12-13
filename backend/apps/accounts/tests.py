# apps/accounts/tests.py
"""
Tests for accounts app.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import UserAddress

User = get_user_model()


class UserRegistrationTests(APITestCase):
    """Test user registration."""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
    
    def test_user_registration_success(self):
        """Test successful user registration."""
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('tokens', response.data['data'])
    
    def test_user_registration_password_mismatch(self):
        """Test registration with mismatched passwords."""
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'SecurePass123!',
            'password_confirm': 'DifferentPass123!'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_duplicate_email(self):
        """Test registration with existing email."""
        User.objects.create_user(
            email='test@example.com',
            password='ExistingPass123!',
            first_name='Existing',
            last_name='User'
        )
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    """Test user login."""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/v1/auth/login/'
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123!',
            first_name='Test',
            last_name='User'
        )
    
    def test_login_success(self):
        """Test successful login."""
        data = {
            'email': 'test@example.com',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
    
    def test_login_wrong_password(self):
        """Test login with wrong password."""
        data = {
            'email': 'test@example.com',
            'password': 'WrongPass123!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_nonexistent_user(self):
        """Test login with nonexistent user."""
        data = {
            'email': 'nonexistent@example.com',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(APITestCase):
    """Test user profile endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.profile_url = '/api/v1/auth/profile/'
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123!',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_profile(self):
        """Test getting user profile."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['email'], 'test@example.com')
    
    def test_update_profile(self):
        """Test updating user profile."""
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = self.client.patch(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['first_name'], 'Updated')
    
    def test_profile_unauthenticated(self):
        """Test profile access without authentication."""
        self.client.logout()
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AddressTests(APITestCase):
    """Test user address endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.address_url = '/api/v1/auth/addresses/'
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123!',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_address(self):
        """Test creating an address."""
        data = {
            'full_name': 'Test User',
            'phone': '+8801234567890',
            'address_line_1': '123 Test Street',
            'city': 'Dhaka',
            'state': 'Dhaka',
            'postal_code': '1000',
            'country': 'Bangladesh'
        }
        response = self.client.post(self.address_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
    
    def test_list_addresses(self):
        """Test listing addresses."""
        UserAddress.objects.create(
            user=self.user,
            full_name='Test User',
            phone='+8801234567890',
            address_line_1='123 Test Street',
            city='Dhaka',
            state='Dhaka',
            postal_code='1000',
            country='Bangladesh'
        )
        response = self.client.get(self.address_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 1)
    
    def test_update_address(self):
        """Test updating an address."""
        address = UserAddress.objects.create(
            user=self.user,
            full_name='Test User',
            phone='+8801234567890',
            address_line_1='123 Test Street',
            city='Dhaka',
            state='Dhaka',
            postal_code='1000',
            country='Bangladesh'
        )
        url = f'{self.address_url}{address.id}/'
        data = {'city': 'Chittagong'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['city'], 'Chittagong')
    
    def test_delete_address(self):
        """Test deleting an address (soft delete)."""
        address = UserAddress.objects.create(
            user=self.user,
            full_name='Test User',
            phone='+8801234567890',
            address_line_1='123 Test Street',
            city='Dhaka',
            state='Dhaka',
            postal_code='1000',
            country='Bangladesh'
        )
        url = f'{self.address_url}{address.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify soft delete
        address.refresh_from_db()
        self.assertTrue(address.is_deleted)


class PasswordChangeTests(APITestCase):
    """Test password change functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.password_change_url = '/api/v1/auth/password/change/'
        self.user = User.objects.create_user(
            email='test@example.com',
            password='OldPass123!',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_change_password_success(self):
        """Test successful password change."""
        data = {
            'current_password': 'OldPass123!',
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        }
        response = self.client.post(self.password_change_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePass123!'))
    
    def test_change_password_wrong_current(self):
        """Test password change with wrong current password."""
        data = {
            'current_password': 'WrongPass123!',
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        }
        response = self.client.post(self.password_change_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
