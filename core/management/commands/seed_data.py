"""
Management command to seed the database with sample data for development.
Usage: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone
from decimal import Decimal
import random
import uuid

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with sample data for development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )
        parser.add_argument(
            '--products',
            type=int,
            default=50,
            help='Number of products to create',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...\n')

        if options['clear']:
            self.clear_data()

        self.create_users()
        self.create_categories()
        self.create_brands()
        self.create_products(options['products'])
        self.create_promotions()
        self.create_pages()
        self.create_reviews()
        
        # Seed additional data
        self.seed_localization()
        self.seed_shipping()
        self.seed_payment_gateways()

        self.stdout.write(self.style.SUCCESS('\nDatabase seeding completed successfully!'))

    def clear_data(self):
        """Clear existing data"""
        self.stdout.write('Clearing existing data...')
        
        from apps.products.models import Product, Category, Brand
        from apps.promotions.models import Promotion, Coupon
        from apps.reviews.models import Review
        from apps.pages.models import Page
        
        Product.objects.all().delete()
        Category.objects.all().delete()
        Brand.objects.all().delete()
        Promotion.objects.all().delete()
        Coupon.objects.all().delete()
        Review.objects.all().delete()
        Page.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

    def create_users(self):
        """Create sample users"""
        self.stdout.write('Creating users...')

        # Create admin user
        if not User.objects.filter(email='admin@bunoraa.com').exists():
            User.objects.create_superuser(
                email='admin@bunoraa.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write('  Created admin user: admin@bunoraa.com')

        # Create sample customers
        customers = [
            ('john@example.com', 'John', 'Doe'),
            ('jane@example.com', 'Jane', 'Smith'),
            ('bob@example.com', 'Bob', 'Johnson'),
        ]

        for email, first_name, last_name in customers:
            if not User.objects.filter(email=email).exists():
                User.objects.create_user(
                    email=email,
                    password='password123',
                    first_name=first_name,
                    last_name=last_name
                )
                self.stdout.write(f'  Created customer: {email}')

    def create_categories(self):
        """Create sample categories"""
        self.stdout.write('Creating categories...')

        from apps.products.models import Category

        categories_data = [
            {
                'name': 'Electronics',
                'description': 'Latest electronic gadgets and devices',
                'subcategories': [
                    {'name': 'Smartphones', 'description': 'Mobile phones and accessories'},
                    {'name': 'Laptops', 'description': 'Notebooks and laptops'},
                    {'name': 'Audio', 'description': 'Headphones, speakers, and audio equipment'},
                    {'name': 'Cameras', 'description': 'Digital cameras and photography gear'},
                ]
            },
            {
                'name': 'Fashion',
                'description': 'Trendy clothing and accessories',
                'subcategories': [
                    {'name': 'Men', 'description': "Men's clothing and accessories"},
                    {'name': 'Women', 'description': "Women's clothing and accessories"},
                    {'name': 'Shoes', 'description': 'Footwear for all occasions'},
                    {'name': 'Accessories', 'description': 'Bags, belts, and more'},
                ]
            },
            {
                'name': 'Home & Living',
                'description': 'Everything for your home',
                'subcategories': [
                    {'name': 'Furniture', 'description': 'Sofas, tables, chairs, and more'},
                    {'name': 'Decor', 'description': 'Home decoration items'},
                    {'name': 'Kitchen', 'description': 'Kitchen appliances and utensils'},
                    {'name': 'Bedding', 'description': 'Bed sheets, pillows, and blankets'},
                ]
            },
            {
                'name': 'Sports & Outdoors',
                'description': 'Sports equipment and outdoor gear',
                'subcategories': [
                    {'name': 'Fitness', 'description': 'Gym equipment and fitness accessories'},
                    {'name': 'Outdoor', 'description': 'Camping and hiking gear'},
                    {'name': 'Sports Equipment', 'description': 'Equipment for various sports'},
                ]
            },
            {
                'name': 'Beauty & Health',
                'description': 'Beauty products and health essentials',
                'subcategories': [
                    {'name': 'Skincare', 'description': 'Skincare products and treatments'},
                    {'name': 'Makeup', 'description': 'Makeup and cosmetics'},
                    {'name': 'Health', 'description': 'Health supplements and equipment'},
                ]
            },
        ]

        for cat_data in categories_data:
            parent, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': slugify(cat_data['name']),
                    'description': cat_data['description'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f"  Created category: {parent.name}")

            for sub_data in cat_data.get('subcategories', []):
                sub, created = Category.objects.get_or_create(
                    name=sub_data['name'],
                    parent=parent,
                    defaults={
                        'slug': slugify(sub_data['name']),
                        'description': sub_data['description'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(f"    Created subcategory: {sub.name}")

        self.categories = list(Category.objects.filter(parent__isnull=False))

    def create_brands(self):
        """Create sample brands"""
        self.stdout.write('Creating brands...')

        from apps.products.models import Brand

        brands_data = [
            {'name': 'Apple', 'description': 'Think Different'},
            {'name': 'Samsung', 'description': 'Do What You Cant'},
            {'name': 'Sony', 'description': 'Be Moved'},
            {'name': 'Nike', 'description': 'Just Do It'},
            {'name': 'Adidas', 'description': 'Impossible Is Nothing'},
            {'name': 'Zara', 'description': 'Fashion Forward'},
            {'name': 'IKEA', 'description': 'The Wonderful Everyday'},
            {'name': 'LG', 'description': 'Life is Good'},
            {'name': 'HP', 'description': 'Keep Reinventing'},
            {'name': 'Bunoraa', 'description': 'Premium Quality'},
        ]

        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                name=brand_data['name'],
                defaults={
                    'slug': slugify(brand_data['name']),
                    'description': brand_data['description'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f"  Created brand: {brand.name}")

        self.brands = list(Brand.objects.all())

    def create_products(self, count):
        """Create sample products"""
        self.stdout.write(f'Creating {count} products...')

        from apps.products.models import Product

        product_templates = [
            # Electronics
            {'name': 'Wireless Bluetooth Headphones', 'base_price': 79.99, 'category': 'Audio'},
            {'name': 'Smart Watch Series 5', 'base_price': 299.99, 'category': 'Smartphones'},
            {'name': 'Gaming Laptop Pro', 'base_price': 1299.99, 'category': 'Laptops'},
            {'name': '4K Action Camera', 'base_price': 199.99, 'category': 'Cameras'},
            {'name': 'Noise Cancelling Earbuds', 'base_price': 149.99, 'category': 'Audio'},
            {'name': 'Portable Bluetooth Speaker', 'base_price': 59.99, 'category': 'Audio'},
            {'name': 'Ultra HD Monitor 27"', 'base_price': 399.99, 'category': 'Laptops'},
            
            # Fashion
            {'name': 'Classic Cotton T-Shirt', 'base_price': 24.99, 'category': 'Men'},
            {'name': 'Slim Fit Jeans', 'base_price': 59.99, 'category': 'Men'},
            {'name': 'Elegant Summer Dress', 'base_price': 89.99, 'category': 'Women'},
            {'name': 'Running Shoes Pro', 'base_price': 129.99, 'category': 'Shoes'},
            {'name': 'Leather Crossbody Bag', 'base_price': 79.99, 'category': 'Accessories'},
            {'name': 'Wool Winter Coat', 'base_price': 199.99, 'category': 'Women'},
            
            # Home
            {'name': 'Modern Coffee Table', 'base_price': 249.99, 'category': 'Furniture'},
            {'name': 'Ceramic Vase Set', 'base_price': 49.99, 'category': 'Decor'},
            {'name': 'Stainless Steel Cookware Set', 'base_price': 149.99, 'category': 'Kitchen'},
            {'name': 'Luxury Bed Sheet Set', 'base_price': 89.99, 'category': 'Bedding'},
            {'name': 'Ergonomic Office Chair', 'base_price': 299.99, 'category': 'Furniture'},
            
            # Sports
            {'name': 'Yoga Mat Premium', 'base_price': 39.99, 'category': 'Fitness'},
            {'name': 'Camping Tent 4-Person', 'base_price': 179.99, 'category': 'Outdoor'},
            {'name': 'Professional Basketball', 'base_price': 29.99, 'category': 'Sports Equipment'},
            {'name': 'Adjustable Dumbbell Set', 'base_price': 249.99, 'category': 'Fitness'},
            
            # Beauty
            {'name': 'Anti-Aging Serum', 'base_price': 49.99, 'category': 'Skincare'},
            {'name': 'Professional Makeup Kit', 'base_price': 89.99, 'category': 'Makeup'},
            {'name': 'Vitamin D3 Supplements', 'base_price': 19.99, 'category': 'Health'},
        ]

        from apps.products.models import Category

        created_count = 0
        for i in range(count):
            template = random.choice(product_templates)
            
            # Add variation to name
            suffix = f" - Edition {i+1}" if i > len(product_templates) else ""
            name = template['name'] + suffix
            
            # Find category
            try:
                category = Category.objects.get(name=template['category'])
            except Category.DoesNotExist:
                category = random.choice(self.categories) if self.categories else None

            # Random price variation
            price = Decimal(str(template['base_price'])) * Decimal(str(random.uniform(0.8, 1.2)))
            price = price.quantize(Decimal('0.01'))
            
            # Maybe add compare price (sale)
            compare_price = None
            if random.random() > 0.7:
                compare_price = price * Decimal(str(random.uniform(1.1, 1.5)))
                compare_price = compare_price.quantize(Decimal('0.01'))

            # Create product
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'slug': slugify(name) + '-' + str(uuid.uuid4())[:8],
                    'description': f'Premium quality {name.lower()}. Perfect for everyday use.',
                    'price': price,
                    'compare_price': compare_price,
                    'category': category,
                    'brand': random.choice(self.brands) if self.brands else None,
                    'stock_quantity': random.randint(0, 100),
                    'is_active': True,
                    'is_featured': random.random() > 0.8,
                }
            )
            
            if created:
                created_count += 1

        self.stdout.write(f'  Created {created_count} products')

    def create_promotions(self):
        """Create sample promotions and coupons"""
        self.stdout.write('Creating promotions...')

        from apps.promotions.models import Promotion, Coupon

        promotions_data = [
            {
                'name': 'Summer Sale',
                'discount_type': 'percentage',
                'discount_value': 20,
                'description': 'Get 20% off on all summer collection items!',
            },
            {
                'name': 'New Customer Offer',
                'discount_type': 'percentage',
                'discount_value': 15,
                'description': '15% off for first-time customers!',
            },
            {
                'name': 'Flash Sale',
                'discount_type': 'percentage',
                'discount_value': 30,
                'description': 'Limited time offer - 30% off!',
            },
        ]

        for promo_data in promotions_data:
            promo, created = Promotion.objects.get_or_create(
                name=promo_data['name'],
                defaults={
                    'discount_type': promo_data['discount_type'],
                    'discount_value': promo_data['discount_value'],
                    'description': promo_data['description'],
                    'is_active': True,
                    'start_date': timezone.now(),
                    'end_date': timezone.now() + timezone.timedelta(days=30),
                }
            )
            if created:
                self.stdout.write(f"  Created promotion: {promo.name}")

        coupons_data = [
            {'code': 'WELCOME10', 'discount_type': 'percentage', 'discount_value': 10},
            {'code': 'SAVE20', 'discount_type': 'percentage', 'discount_value': 20},
            {'code': 'FLAT50', 'discount_type': 'fixed', 'discount_value': 50},
            {'code': 'FREESHIP', 'discount_type': 'free_shipping', 'discount_value': 0},
        ]

        for coupon_data in coupons_data:
            coupon, created = Coupon.objects.get_or_create(
                code=coupon_data['code'],
                defaults={
                    'discount_type': coupon_data['discount_type'],
                    'discount_value': coupon_data['discount_value'],
                    'is_active': True,
                    'valid_from': timezone.now(),
                    'valid_until': timezone.now() + timezone.timedelta(days=90),
                    'usage_limit': 100,
                }
            )
            if created:
                self.stdout.write(f"  Created coupon: {coupon.code}")

    def create_pages(self):
        """Create sample CMS pages"""
        self.stdout.write('Creating pages...')

        from apps.pages.models import Page

        pages_data = [
            {
                'title': 'About Us',
                'slug': 'about-us',
                'content': '''
                    <h2>Welcome to Bunoraa</h2>
                    <p>Bunoraa is your premier destination for premium products at competitive prices. 
                    Founded in 2024, we've quickly become a trusted name in online retail.</p>
                    <h3>Our Mission</h3>
                    <p>To provide exceptional products with outstanding customer service, 
                    making quality accessible to everyone.</p>
                    <h3>Our Values</h3>
                    <ul>
                        <li>Quality First</li>
                        <li>Customer Satisfaction</li>
                        <li>Integrity & Transparency</li>
                        <li>Innovation</li>
                    </ul>
                ''',
            },
            {
                'title': 'Contact Us',
                'slug': 'contact-us',
                'content': '''
                    <h2>Get in Touch</h2>
                    <p>We'd love to hear from you! Contact us through any of the following methods:</p>
                    <h3>Customer Service</h3>
                    <p>Email: support@bunoraa.com<br>Phone: 1-800-BUNORAA</p>
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 9AM - 6PM EST<br>Saturday: 10AM - 4PM EST<br>Sunday: Closed</p>
                ''',
            },
            {
                'title': 'Shipping Information',
                'slug': 'shipping',
                'content': '''
                    <h2>Shipping Policy</h2>
                    <h3>Delivery Times</h3>
                    <ul>
                        <li>Standard Shipping: 5-7 business days</li>
                        <li>Express Shipping: 2-3 business days</li>
                        <li>Overnight Shipping: Next business day</li>
                    </ul>
                    <h3>Free Shipping</h3>
                    <p>Enjoy free standard shipping on all orders over $50!</p>
                ''',
            },
            {
                'title': 'Returns & Refunds',
                'slug': 'returns',
                'content': '''
                    <h2>Returns Policy</h2>
                    <p>We want you to be completely satisfied with your purchase. 
                    If you're not happy, you can return items within 30 days.</p>
                    <h3>How to Return</h3>
                    <ol>
                        <li>Log into your account</li>
                        <li>Navigate to your orders</li>
                        <li>Select the item to return</li>
                        <li>Print the return label</li>
                        <li>Ship the item back to us</li>
                    </ol>
                ''',
            },
        ]

        for page_data in pages_data:
            page, created = Page.objects.get_or_create(
                slug=page_data['slug'],
                defaults={
                    'title': page_data['title'],
                    'content': page_data['content'],
                    'is_published': True,
                }
            )
            if created:
                self.stdout.write(f"  Created page: {page.title}")

    def create_reviews(self):
        """Create sample reviews"""
        self.stdout.write('Creating reviews...')

        from apps.products.models import Product
        from apps.reviews.models import Review

        review_templates = [
            {'rating': 5, 'title': 'Excellent product!', 'content': 'Exceeded my expectations. Highly recommend!'},
            {'rating': 5, 'title': 'Perfect!', 'content': 'Exactly what I was looking for. Great quality.'},
            {'rating': 4, 'title': 'Very good', 'content': 'Good product, fast shipping. Minor issues but overall satisfied.'},
            {'rating': 4, 'title': 'Great value', 'content': 'Good quality for the price. Would buy again.'},
            {'rating': 3, 'title': 'Decent', 'content': 'Average product. Does the job but nothing special.'},
            {'rating': 5, 'title': 'Amazing!', 'content': 'Best purchase I\'ve made. Five stars!'},
        ]

        users = list(User.objects.filter(is_superuser=False))
        products = list(Product.objects.all()[:30])

        review_count = 0
        for product in products:
            num_reviews = random.randint(1, 5)
            for _ in range(num_reviews):
                if not users:
                    continue
                    
                template = random.choice(review_templates)
                user = random.choice(users)

                review, created = Review.objects.get_or_create(
                    product=product,
                    user=user,
                    defaults={
                        'rating': template['rating'],
                        'title': template['title'],
                        'content': template['content'],
                        'is_approved': True,
                    }
                )
                if created:
                    review_count += 1

        self.stdout.write(f'  Created {review_count} reviews')

    def seed_localization(self):
        """Seed Bangladesh location data."""
        self.stdout.write('Seeding Bangladesh locations...')
        from django.core.management import call_command
        try:
            call_command('seed_bangladesh_locations')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  Could not seed locations: {e}'))

    def seed_shipping(self):
        """Seed shipping zones and rates."""
        self.stdout.write('Seeding shipping data...')
        from django.core.management import call_command
        try:
            call_command('seed_bangladesh_shipping')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  Could not seed shipping: {e}'))

    def seed_payment_gateways(self):
        """Seed payment gateways."""
        self.stdout.write('Seeding payment gateways...')
        from django.core.management import call_command
        try:
            call_command('seed_payment_gateways')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  Could not seed payment gateways: {e}'))
