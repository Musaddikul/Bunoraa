"""
Synthetic Data Generator for Bunoraa ML Training
Generates Bangladesh-specific synthetic data using Faker
"""
import os
import sys
import json
import random
import hashlib
from datetime import datetime, timedelta
from decimal import Decimal
from pathlib import Path

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.local')

import django
django.setup()

from faker import Faker
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.products.models import Product, Tag, Attribute, AttributeValue
from apps.categories.models import Category
from apps.orders.models import Order, OrderItem
from apps.analytics.models import PageView, ProductView, SearchQuery, CartEvent
from apps.accounts.behavior_models import (
    UserBehaviorProfile, UserPreferences, UserSession, UserInteraction
)

# Initialize Faker with Bengali locale
fake = Faker(['bn_BD', 'en_US'])
Faker.seed(42)
random.seed(42)

User = get_user_model()


class BangladeshDataGenerator:
    """
    Generate synthetic data tailored for Bangladesh market.
    """
    
    # Bangladesh-specific data
    DIVISIONS = [
        'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 
        'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
    ]
    
    CITIES = {
        'Dhaka': ['Dhaka', 'Narayanganj', 'Gazipur', 'Savar', 'Tongi'],
        'Chattogram': ['Chattogram', "Cox's Bazar", 'Comilla', 'Brahmanbaria'],
        'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj'],
        'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Kushtia'],
        'Barishal': ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur'],
        'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
        'Rangpur': ['Rangpur', 'Dinajpur', 'Thakurgaon', 'Lalmonirhat'],
        'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
    }
    
    PHONE_PREFIXES = ['017', '018', '019', '013', '014', '015', '016']
    
    BENGALI_FIRST_NAMES = [
        'রহিম', 'করিম', 'আবদুল', 'মোহাম্মদ', 'সাকিব', 'তামিম', 'মাশরাফি',
        'ফাতিমা', 'আয়েশা', 'খাদিজা', 'মরিয়ম', 'সুমাইয়া', 'তাসনিম', 'নুসরাত',
        'Rahim', 'Karim', 'Abdul', 'Mohammad', 'Sakib', 'Tamim', 'Mashrafe',
        'Fatima', 'Ayesha', 'Khadija', 'Maryam', 'Sumaiya', 'Tasnim', 'Nusrat',
    ]
    
    BENGALI_LAST_NAMES = [
        'হাসান', 'হোসেন', 'আলী', 'খান', 'রহমান', 'আহমেদ', 'ইসলাম', 'উদ্দিন',
        'Hasan', 'Hossain', 'Ali', 'Khan', 'Rahman', 'Ahmed', 'Islam', 'Uddin',
    ]
    
    PRODUCT_CATEGORIES = [
        'পোশাক', 'ইলেকট্রনিক্স', 'গৃহসজ্জা', 'সৌন্দর্য', 'বই', 'খেলনা',
        'Clothing', 'Electronics', 'Home Decor', 'Beauty', 'Books', 'Toys',
    ]
    
    SEARCH_TERMS_BENGALI = [
        'শার্ট', 'শাড়ি', 'পাঞ্জাবি', 'জুতা', 'ব্যাগ', 'মোবাইল', 'ঘড়ি',
        'সানগ্লাস', 'জুয়েলারি', 'কসমেটিক্স', 'পারফিউম', 'হেডফোন',
    ]
    
    SEARCH_TERMS_ENGLISH = [
        'shirt', 'saree', 'panjabi', 'shoes', 'bag', 'mobile', 'watch',
        'sunglasses', 'jewelry', 'cosmetics', 'perfume', 'headphones',
        'laptop', 'camera', 'smart watch', 'earbuds', 'charger',
    ]
    
    def __init__(self, num_users=100, num_products=200, num_orders=500):
        self.num_users = num_users
        self.num_products = num_products
        self.num_orders = num_orders
        self.users = []
        self.products = []
        self.categories = []
    
    def generate_phone(self):
        """Generate Bangladesh phone number."""
        prefix = random.choice(self.PHONE_PREFIXES)
        return f'+880{prefix[1:]}{random.randint(10000000, 99999999)}'
    
    def generate_address(self):
        """Generate Bangladesh address."""
        division = random.choice(self.DIVISIONS)
        city = random.choice(self.CITIES[division])
        return {
            'city': city,
            'state': division,
            'postal_code': str(random.randint(1000, 9999)),
            'country': 'Bangladesh',
            'address_line_1': f'{random.randint(1, 500)} {fake.street_name()}',
            'address_line_2': fake.secondary_address() if random.random() > 0.5 else '',
        }
    
    def generate_users(self):
        """Generate synthetic users."""
        print(f"Generating {self.num_users} users...")
        
        for i in range(self.num_users):
            first_name = random.choice(self.BENGALI_FIRST_NAMES)
            last_name = random.choice(self.BENGALI_LAST_NAMES)
            email = f"{first_name.lower().replace(' ', '')}.{last_name.lower().replace(' ', '')}{random.randint(1, 999)}@example.com"
            
            # Create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': self.generate_phone(),
                    'is_verified': random.random() > 0.2,
                    'newsletter_subscribed': random.random() > 0.5,
                    'is_active': True,
                }
            )
            
            if created:
                user.set_password('BunoraTest123!')
                user.save()
                
                # Create behavior profile
                profile = UserBehaviorProfile.objects.create(
                    user=user,
                    total_sessions=random.randint(1, 100),
                    total_page_views=random.randint(10, 1000),
                    avg_session_duration=random.randint(60, 1800),
                    products_viewed=random.randint(5, 200),
                    products_added_to_cart=random.randint(0, 50),
                    total_orders=random.randint(0, 20),
                    total_spent=Decimal(str(random.randint(0, 100000))),
                    engagement_score=Decimal(str(random.randint(0, 100))),
                    loyalty_score=Decimal(str(random.randint(0, 100))),
                    recency_score=Decimal(str(random.randint(0, 100))),
                    preferred_device=random.choice(['mobile', 'desktop', 'tablet']),
                )
                
                # Create preferences
                UserPreferences.objects.create(
                    user=user,
                    language=random.choice(['bn', 'en']),
                    currency='BDT',
                    timezone='Asia/Dhaka',
                    theme=random.choice(['light', 'dark', 'system']),
                    email_notifications=random.random() > 0.3,
                    sms_notifications=random.random() > 0.5,
                )
                
                self.users.append(user)
            
            if (i + 1) % 50 == 0:
                print(f"  Created {i + 1} users...")
        
        print(f"Created {len(self.users)} new users")
    
    def generate_analytics_data(self):
        """Generate analytics data for ML training."""
        print("Generating analytics data...")
        
        all_users = list(User.objects.all())
        all_products = list(Product.objects.filter(is_active=True, is_deleted=False))
        
        if not all_users or not all_products:
            print("No users or products found. Skipping analytics generation.")
            return
        
        # Generate page views
        print("  Generating page views...")
        page_views = []
        for _ in range(min(self.num_users * 50, 5000)):
            user = random.choice(all_users) if random.random() > 0.3 else None
            page_views.append(PageView(
                user=user,
                session_key=fake.uuid4()[:40],
                path=random.choice(['/', '/products/', '/categories/', '/cart/', f'/products/{random.choice(all_products).slug}/']),
                user_agent=fake.user_agent(),
                device_type=random.choice(['mobile', 'desktop', 'tablet']),
                browser=random.choice(['Chrome', 'Firefox', 'Safari', 'Edge']),
                ip_address=fake.ipv4(),
                country='Bangladesh',
                city=random.choice(['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna']),
                time_on_page=random.randint(5, 600),
                created_at=timezone.now() - timedelta(days=random.randint(0, 90)),
            ))
        PageView.objects.bulk_create(page_views, ignore_conflicts=True)
        
        # Generate product views
        print("  Generating product views...")
        product_views = []
        for _ in range(min(self.num_users * 30, 3000)):
            user = random.choice(all_users) if random.random() > 0.4 else None
            product_views.append(ProductView(
                product=random.choice(all_products),
                user=user,
                session_key=fake.uuid4()[:40],
                source=random.choice(['direct', 'search', 'category', 'related', 'recommendation']),
                created_at=timezone.now() - timedelta(days=random.randint(0, 90)),
            ))
        ProductView.objects.bulk_create(product_views, ignore_conflicts=True)
        
        # Generate search queries
        print("  Generating search queries...")
        search_queries = []
        all_search_terms = self.SEARCH_TERMS_BENGALI + self.SEARCH_TERMS_ENGLISH
        for _ in range(min(self.num_users * 10, 1000)):
            user = random.choice(all_users) if random.random() > 0.5 else None
            search_queries.append(SearchQuery(
                query=random.choice(all_search_terms),
                user=user,
                session_key=fake.uuid4()[:40],
                results_count=random.randint(0, 100),
                clicked_product=random.choice(all_products) if random.random() > 0.6 else None,
                created_at=timezone.now() - timedelta(days=random.randint(0, 90)),
            ))
        SearchQuery.objects.bulk_create(search_queries, ignore_conflicts=True)
        
        # Generate cart events
        print("  Generating cart events...")
        cart_events = []
        for _ in range(min(self.num_users * 20, 2000)):
            user = random.choice(all_users) if random.random() > 0.3 else None
            product = random.choice(all_products)
            cart_events.append(CartEvent(
                event_type=random.choice(['add', 'remove', 'update', 'checkout_start']),
                user=user,
                session_key=fake.uuid4()[:40],
                product=product,
                quantity=random.randint(1, 5),
                cart_value=product.price * random.randint(1, 3),
                created_at=timezone.now() - timedelta(days=random.randint(0, 90)),
            ))
        CartEvent.objects.bulk_create(cart_events, ignore_conflicts=True)
        
        # Generate user interactions
        print("  Generating user interactions...")
        interactions = []
        interaction_types = ['view', 'click', 'add_to_cart', 'wishlist_add', 'scroll', 'quick_view']
        for user in all_users[:100]:  # Limit to first 100 users
            for _ in range(random.randint(10, 50)):
                product = random.choice(all_products)
                interactions.append(UserInteraction(
                    user=user,
                    interaction_type=random.choice(interaction_types),
                    product=product,
                    page_url=f'/products/{product.slug}/',
                    duration_ms=random.randint(100, 30000),
                    position=random.randint(1, 50),
                    source=random.choice(['homepage', 'category', 'search', 'recommendation']),
                    created_at=timezone.now() - timedelta(days=random.randint(0, 90)),
                ))
        UserInteraction.objects.bulk_create(interactions, ignore_conflicts=True)
        
        print("Analytics data generation complete!")
    
    def export_training_data(self, output_dir='ml/training_data'):
        """Export data in format suitable for ML training."""
        output_path = BASE_DIR / output_dir
        output_path.mkdir(exist_ok=True)
        
        print(f"Exporting training data to {output_path}...")
        
        # Export user-product interactions for collaborative filtering
        interactions = []
        for interaction in UserInteraction.objects.filter(
            user__isnull=False,
            product__isnull=False
        ).select_related('user', 'product')[:10000]:
            # Weight different interaction types
            weights = {
                'view': 1,
                'click': 2,
                'quick_view': 2,
                'add_to_cart': 4,
                'wishlist_add': 3,
                'purchase': 5,
            }
            interactions.append({
                'user_id': str(interaction.user.id),
                'product_id': str(interaction.product.id),
                'interaction_type': interaction.interaction_type,
                'weight': weights.get(interaction.interaction_type, 1),
                'timestamp': interaction.created_at.isoformat(),
            })
        
        with open(output_path / 'user_product_interactions.jsonl', 'w') as f:
            for item in interactions:
                f.write(json.dumps(item) + '\n')
        
        # Export product features for content-based filtering
        products = []
        for product in Product.objects.filter(
            is_active=True, is_deleted=False
        ).prefetch_related('categories', 'tags')[:1000]:
            products.append({
                'product_id': str(product.id),
                'name': product.name,
                'price': float(product.price),
                'categories': [str(c.id) for c in product.categories.all()],
                'tags': [str(t.id) for t in product.tags.all()],
                'sold_count': product.sold_count,
                'view_count': product.view_count,
            })
        
        with open(output_path / 'product_features.jsonl', 'w') as f:
            for item in products:
                f.write(json.dumps(item) + '\n')
        
        # Export user features for segmentation
        user_features = []
        for profile in UserBehaviorProfile.objects.select_related('user')[:1000]:
            user_features.append({
                'user_id': str(profile.user.id),
                'total_sessions': profile.total_sessions,
                'total_page_views': profile.total_page_views,
                'products_viewed': profile.products_viewed,
                'products_purchased': profile.products_purchased,
                'total_orders': profile.total_orders,
                'total_spent': float(profile.total_spent),
                'engagement_score': float(profile.engagement_score),
                'loyalty_score': float(profile.loyalty_score),
            })
        
        with open(output_path / 'user_features.jsonl', 'w') as f:
            for item in user_features:
                f.write(json.dumps(item) + '\n')
        
        print(f"Exported {len(interactions)} interactions, {len(products)} products, {len(user_features)} user profiles")
    
    def run(self):
        """Run the complete data generation pipeline."""
        print("=" * 60)
        print("Bunoraa Synthetic Data Generator")
        print("=" * 60)
        
        self.generate_users()
        self.generate_analytics_data()
        self.export_training_data()
        
        print("=" * 60)
        print("Data generation complete!")
        print("=" * 60)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate synthetic data for Bunoraa')
    parser.add_argument('--users', type=int, default=100, help='Number of users to generate')
    parser.add_argument('--products', type=int, default=200, help='Number of products')
    parser.add_argument('--orders', type=int, default=500, help='Number of orders')
    args = parser.parse_args()
    
    generator = BangladeshDataGenerator(
        num_users=args.users,
        num_products=args.products,
        num_orders=args.orders
    )
    generator.run()
