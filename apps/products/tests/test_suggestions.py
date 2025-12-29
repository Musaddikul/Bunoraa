from django.test import TestCase
from django.core.management import call_command
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.products.services import generate_product_suggestions, ProductService
from apps.categories.ml import Category

User = get_user_model()


class SuggestionServiceTests(TestCase):
    def test_heuristic_from_image_filename(self):
        payload = {'image_filenames': ['handwoven_shawl_silk.jpg']}
        res = generate_product_suggestions(payload)
        self.assertIsInstance(res, list)
        self.assertGreaterEqual(len(res), 1)
        s = res[0]
        self.assertIn('name', s)
        self.assertIn('short_description', s)
        self.assertIn('tags', s)


class SuggestionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(email='admin@example.com', password='adminpass')
        # ensure a category exists for matching
        Category.objects.create(name='Shawls', slug='shawls', code='CAT_SHAWLS')

    def test_suggest_requires_admin(self):
        resp = self.client.post('/api/v1/products/suggest/', {'name': 'Handwoven Shawl'})
        self.assertEqual(resp.status_code, 403)

    def test_suggest_returns_suggestions_for_admin(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post('/api/v1/products/suggest/', {'name': 'Handwoven Shawl', 'description': 'silk shawl'})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertIsInstance(data.get('data'), list)
