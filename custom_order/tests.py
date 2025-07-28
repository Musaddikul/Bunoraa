# custom_order/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Category, SubCategory, FabricType, SizeOption, ColorOption, CustomOrder
from accounts.models import UserAddress
from shipping.models import ShippingCarrier
from payments.models import PaymentMethod
import json

User = get_user_model()

class CustomOrderTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test data
        cls.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        cls.address = UserAddress.objects.create(
            user=cls.user,
            full_name='Test User',
            phone_number='+8801712345678',
            address_line_1='123 Test St',
            city='Dhaka',
            state='Dhaka',
            postal_code='1234',
            country='BD'
        )
        
        cls.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        cls.subcategory = SubCategory.objects.create(
            category=cls.category,
            name='Test Subcategory',
            slug='test-subcategory',
            base_price_multiplier=1.5
        )
        
        cls.fabric = FabricType.objects.create(
            name='Test Fabric',
            base_price=100.00
        )
        
        cls.size = SizeOption.objects.create(
            name='Medium',
            measurements={'chest': 40, 'waist': 32}
        )
        
        cls.color = ColorOption.objects.create(
            name='Red',
            hex_code='#FF0000'
        )
        
        cls.shipping_carrier = ShippingCarrier.objects.create(
            name='Test Carrier',
            base_rate=50.00
        )
        
        cls.payment_method = PaymentMethod.objects.create(
            name='Test Payment',
            code='testpay',
            is_online=True
        )

    def test_order_creation(self):
        self.client.force_login(self.user)
        
        response = self.client.post(reverse('custom_order:create'), {
            'order_type': 'OWN_DESIGN',
            'customer_name': 'Test User',
            'phone': '+8801712345678',
            'email': 'test@example.com',
            'contact_method': 'whatsapp',
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'fabric_type': self.fabric.id,
            'size_option': self.size.id,
            'color_option': self.color.id,
            'quantity': 1,
            'design_description': 'Test design',
            'shipping_address': self.address.id,
            'shipping_carrier': self.shipping_carrier.id,
            'payment_method': self.payment_method.id,
            'is_draft': False,
            'design_images-TOTAL_FORMS': 0,
            'design_images-INITIAL_FORMS': 0,
            'item_images-TOTAL_FORMS': 0,
            'item_images-INITIAL_FORMS': 0,
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(CustomOrder.objects.count(), 1)
        
        order = CustomOrder.objects.first()
        self.assertEqual(order.total_amount, Decimal('187.50'))  # 100*1.5 + 15% VAT + 50 shipping

    def test_api_endpoints(self):
        self.client.force_login(self.user)
        
        # Test categories API
        response = self.client.get(reverse('custom_order:api_categories'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        
        # Test price calculation API
        response = self.client.post(reverse('custom_order:api_calculate_price'), {
            'fabric_id': self.fabric.id,
            'subcategory_id': self.subcategory.id,
            'quantity': 1
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['base_price'], '150.00')
        
        # Test shipping carriers API
        response = self.client.get(reverse('custom_order:api_shipping_carriers'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_form_validation(self):
        form_data = {
            'order_type': 'OWN_DESIGN',
            'customer_name': '',
            'phone': 'invalid',
            'email': 'invalid',
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'fabric_type': self.fabric.id,
            'quantity': 0,
            'is_draft': False
        }
        
        form = CustomOrderForm(data=form_data, user=self.user)
        self.assertFalse(form.is_valid())
        self.assertIn('customer_name', form.errors)
        self.assertIn('phone', form.errors)
        self.assertIn('email', form.errors)
        self.assertIn('quantity', form.errors)
        self.assertIn('design_description', form.errors)
        self.assertIn('size_option', form.errors)
        self.assertIn('shipping_carrier', form.errors)
        self.assertIn('payment_method', form.errors)

    def test_order_workflow(self):
        order = CustomOrder.objects.create(
            user=self.user,
            order_type='OWN_DESIGN',
            status='draft',
            customer_name='Test User',
            phone='+8801712345678',
            email='test@example.com',
            contact_method='whatsapp',
            category=self.category,
            subcategory=self.subcategory,
            fabric_type=self.fabric,
            size_option=self.size,
            color_option=self.color,
            quantity=1,
            design_description='Test design',
            shipping_address=self.address,
            shipping_carrier=self.shipping_carrier,
            payment_method=self.payment_method,
            is_draft=True
        )
        
        # Convert draft to order
        from .services import create_order_from_draft
        create_order_from_draft(order)
        
        self.assertFalse(order.is_draft)
        self.assertEqual(order.status, 'pending')