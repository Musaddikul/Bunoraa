"""
Category tests
"""
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Category
from .services import CategoryService

User = get_user_model()


class CategoryModelTest(TestCase):
    """Tests for Category model."""
    
    def test_create_category(self):
        """Test creating a category."""
        category = Category.objects.create(name='Test Category')
        self.assertEqual(category.name, 'Test Category')
        self.assertEqual(category.level, 0)
        self.assertIsNotNone(category.slug)
    
    def test_create_child_category(self):
        """Test creating a child category."""
        parent = Category.objects.create(name='Parent Category')
        child = Category.objects.create(name='Child Category', parent=parent)
        
        self.assertEqual(child.parent, parent)
        self.assertEqual(child.level, 1)
    
    def test_get_ancestors(self):
        """Test get_ancestors method."""
        grandparent = Category.objects.create(name='Grandparent')
        parent = Category.objects.create(name='Parent', parent=grandparent)
        child = Category.objects.create(name='Child', parent=parent)
        
        ancestors = child.get_ancestors()
        self.assertEqual(len(ancestors), 2)
        self.assertEqual(ancestors[0], grandparent)
        self.assertEqual(ancestors[1], parent)
    
    def test_get_descendants(self):
        """Test get_descendants method."""
        parent = Category.objects.create(name='Parent')
        child1 = Category.objects.create(name='Child 1', parent=parent)
        child2 = Category.objects.create(name='Child 2', parent=parent)
        grandchild = Category.objects.create(name='Grandchild', parent=child1)
        
        descendants = parent.get_descendants()
        self.assertEqual(len(descendants), 3)
    
    def test_get_breadcrumbs(self):
        """Test get_breadcrumbs method."""
        parent = Category.objects.create(name='Parent')
        child = Category.objects.create(name='Child', parent=parent)
        
        breadcrumbs = child.get_breadcrumbs()
        self.assertEqual(len(breadcrumbs), 2)
        self.assertEqual(breadcrumbs[0]['name'], 'Parent')
        self.assertEqual(breadcrumbs[1]['name'], 'Child')
    
    def test_soft_delete(self):
        """Test soft delete functionality."""
        parent = Category.objects.create(name='Parent')
        child = Category.objects.create(name='Child', parent=parent)
        
        parent.soft_delete()
        parent.refresh_from_db()
        child.refresh_from_db()
        
        self.assertTrue(parent.is_deleted)
        self.assertTrue(child.is_deleted)


class CategoryServiceTest(TestCase):
    """Tests for CategoryService."""
    
    def setUp(self):
        self.parent = Category.objects.create(name='Electronics')
        self.child1 = Category.objects.create(name='Phones', parent=self.parent)
        self.child2 = Category.objects.create(name='Laptops', parent=self.parent)
    
    def test_get_category_tree(self):
        """Test get_category_tree method."""
        tree = CategoryService.get_category_tree()
        self.assertEqual(len(tree), 1)
        self.assertEqual(tree[0]['name'], 'Electronics')
        self.assertEqual(len(tree[0]['children']), 2)
    
    def test_get_root_categories(self):
        """Test get_root_categories method."""
        roots = CategoryService.get_root_categories()
        self.assertEqual(roots.count(), 1)
        self.assertEqual(roots[0], self.parent)
    
    def test_get_category_by_slug(self):
        """Test get_category_by_slug method."""
        category = CategoryService.get_category_by_slug(self.parent.slug)
        self.assertEqual(category, self.parent)


class CategoryAPITest(APITestCase):
    """API tests for category endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.parent = Category.objects.create(name='Electronics')
        self.child = Category.objects.create(name='Phones', parent=self.parent)
    
    def test_list_categories(self):
        """Test listing categories."""
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_retrieve_category(self):
        """Test retrieving a category."""
        response = self.client.get(f'/api/v1/categories/{self.parent.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Electronics')
    
    def test_get_category_tree(self):
        """Test getting category tree."""
        response = self.client.get('/api/v1/categories/tree/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_create_category_admin(self):
        """Test creating a category as admin."""
        self.client.force_authenticate(user=self.admin)
        data = {'name': 'New Category'}
        response = self.client.post('/api/v1/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_category_non_admin(self):
        """Test that non-admin cannot create category."""
        user = User.objects.create_user(
            email='user@example.com',
            password='userpass123'
        )
        self.client.force_authenticate(user=user)
        data = {'name': 'New Category'}
        response = self.client.post('/api/v1/categories/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_category_products(self):
        """Test getting products in a category."""
        response = self.client.get(f'/api/v1/categories/{self.parent.id}/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
