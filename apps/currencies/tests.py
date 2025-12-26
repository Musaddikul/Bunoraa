from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Currency

User = get_user_model()

class CurrencyPreferenceApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Ensure currencies exist
        Currency.objects.create(code='BDT', name='Bangladeshi Taka', symbol='৳', is_active=True)
        Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)

    def test_set_currency_preference_anonymous(self):
        response = self.client.post('/api/v1/currencies/preference/', {'currency_code': 'USD'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get('success'))
        data = response.data.get('data') or {}
        self.assertEqual(data.get('currency', {}).get('code'), 'USD')
        # Session should have been set
        session = self.client.session
        self.assertEqual(session.get('currency_code'), 'USD')
        # Response should include cookie
        self.assertIn('currency', response.cookies)
        self.assertEqual(response.cookies['currency'].value, 'USD')

    def test_set_currency_preference_authenticated(self):
        user = User.objects.create_user(email='test@example.com', password='testpass')
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/v1/currencies/preference/', {'currency_code': 'USD', 'auto_detect': False}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get('success'))
        data = response.data.get('data') or {}
        self.assertEqual(data.get('currency', {}).get('code'), 'USD')
        # Preference should be stored for user
        # Fetch from service indirectly by calling the current endpoint
        resp2 = self.client.get('/api/v1/currencies/current/')
        self.assertEqual(resp2.status_code, 200)
        # Site is configured to force default currency, so current should be default (BDT)
        self.assertEqual(resp2.data.get('data', {}).get('code'), 'BDT' )

    def test_format_price_tag(self):
        from django.template import Context, Template
        # Ensure currencies exist
        Currency.objects.create(code='BDT', name='Bangladeshi Taka', symbol='৳', is_active=True, is_default=True)
        Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)
        t = Template('{% load currency_tags %}{% format_price 10 "BDT" %}')
        c = Context({'request': None})
        rendered = t.render(c)
        self.assertIn('৳', rendered)

    def test_convert_endpoint(self):
        # Create currencies and exchange rate
        usd = Currency.objects.create(code='USD', name='US Dollar', symbol='$', is_active=True)
        bdt = Currency.objects.create(code='BDT', name='Bangladeshi Taka', symbol='৳', is_active=True, is_default=True)
        from apps.currencies.models import ExchangeRate
        ExchangeRate.objects.create(from_currency=usd, to_currency=bdt, rate='110.00', source='manual')

        response = self.client.post('/api/v1/currencies/convert/', {'amount': '1.00', 'from_currency': 'USD', 'to_currency': 'BDT', 'round_result': True}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get('success'))
        data = response.data.get('data') or {}
        self.assertEqual(data.get('to_currency'), 'BDT')
        self.assertEqual(data.get('from_currency'), 'USD')
        self.assertEqual(data.get('rate'), '110.00')