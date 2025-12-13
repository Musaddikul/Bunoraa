# apps/categories/tests.py
"""
Tests for categories app.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Category

User = get_user_model()


class CategoryModelTests(APITestCase):
    """Test Category model functionality."""
    
    def setUp(self):
        self.root = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        self.child = Category.objects.create(
            name='Phones',
            slug='phones',
            parent=self.root
        )
        self.grandchild = Category.objects.create(
            name='Smartphones',
            slug='smartphones',
            parent=self.child
        )
    
    def test_category_creation(self):
        """Test category is created correctly."""
        self.assertEqual(self.root.name, 'Electronics')
        self.assertEqual(self.root.depth, 0)
        self.assertEqual(self.root.path, '')
    
    def test_child_category_depth(self):
        """Test child category has correct depth."""
        self.assertEqual(self.child.depth, 1)
        self.assertEqual(self.grandchild.depth, 2)
    
    def test_category_path(self):
        """Test category path is set correctly."""
        self.assertEqual(self.child.path, str(self.root.id))
        self.assertEqual(self.grandchild.path, f"{self.root.id},{self.child.id}")
    
    def test_get_ancestors(self):
        """Test getting ancestors."""
        ancestors = list(self.grandchild.get_ancestors())
        self.assertEqual(len(ancestors), 2)
        self.assertEqual(ancestors[0], self.root)
        self.assertEqual(ancestors[1], self.child)
    
    def test_get_descendants(self):
        """Test getting descendants."""
        descendants = list(self.root.get_descendants())
        self.assertEqual(len(descendants), 2)
    
    def test_get_children(self):
        """Test getting immediate children."""
        children = list(self.root.get_children())
        self.assertEqual(len(children), 1)
        self.assertEqual(children[0], self.child)
    
    def test_get_breadcrumb(self):
        """Test breadcrumb generation."""
        breadcrumb = self.grandchild.get_breadcrumb()
        self.assertEqual(len(breadcrumb), 3)
        self.assertEqual(breadcrumb[0]['name'], 'Electronics')
        self.assertEqual(breadcrumb[1]['name'], 'Phones')
        self.assertEqual(breadcrumb[2]['name'], 'Smartphones')
    
    def test_soft_delete(self):
        """Test soft delete functionality."""
        self.root.soft_delete()
        self.root.refresh_from_db()
        self.assertTrue(self.root.is_deleted)
        self.assertFalse(self.root.is_active)


class CategoryAPITests(APITestCase):
    """Test Category API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPass123!',
            first_name='Admin',
            last_name='User'
        )
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='UserPass123!',
            first_name='Regular',
            last_name='User'
        )
        
        self.root = Category.objects.create(
            name='Electronics',
            slug='electronics',
            is_active=True
        )
        self.child = Category.objects.create(
            name='Phones',
            slug='phones',
            parent=self.root,
            is_active=True
        )
    
    def test_list_categories(self):
        """Test listing categories."""
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_get_category_detail(self):
        """Test getting category detail."""
        response = self.client.get(f'/api/v1/categories/{self.root.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], 'Electronics')
    
    def test_get_category_by_slug(self):
        """Test getting category by slug."""
        response = self.client.get(f'/api/v1/categories/slug/{self.root.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_create_category_admin(self):
        """Test creating category as admin."""
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'name': 'New Category',
            'slug': 'new-category'
        }
        response = self.client.post('/api/v1/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
    
    def test_create_category_non_admin(self):
        """Test creating category as non-admin fails."""
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'name': 'New Category',
            'slug': 'new-category-2'
        }
        response = self.client.post('/api/v1/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_category_admin(self):
        """Test updating category as admin."""
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'Updated Electronics'}
        response = self.client.patch(f'/api/v1/categories/{self.root.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_delete_category_admin(self):
        """Test deleting category as admin."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/v1/categories/{self.child.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify soft delete
        self.child.refresh_from_db()
        self.assertTrue(self.child.is_deleted)
    
    def test_get_category_tree(self):
        """Test getting category tree."""
        response = self.client.get('/api/v1/categories/tree/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_get_category_children(self):
        """Test getting category children."""
        response = self.client.get(f'/api/v1/categories/{self.root.id}/children/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 1)
    
    def test_get_root_categories(self):
        """Test getting root categories."""
        response = self.client.get('/api/v1/categories/root/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
