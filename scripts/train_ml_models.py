"""
Train ML models for Bunoraa recommendation and personalization.

This module provides comprehensive ML model training for:
1. Collaborative filtering recommendations (SVD-based)
2. User segmentation (K-Means clustering)
3. Product similarity (Content-based filtering)
4. Price sensitivity analysis
5. Churn prediction

Run this script periodically (daily/weekly) to update models with fresh data.
"""
import json
import pickle
import logging
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime, timedelta

import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier
from scipy.sparse import csr_matrix

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
ML_MODELS_DIR = BASE_DIR / 'ml' / 'models_data'
ML_MODELS_DIR.mkdir(parents=True, exist_ok=True)

TRAINING_DATA_DIR = BASE_DIR / 'ml' / 'training_data'
TRAINING_DATA_DIR.mkdir(parents=True, exist_ok=True)


class DataLoader:
    """Load and preprocess training data from various sources."""
    
    @staticmethod
    def load_from_jsonl(filepath: Path) -> List[Dict]:
        """Load data from JSONL file."""
        data = []
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        data.append(json.loads(line))
        return data
    
    @staticmethod
    def load_from_database() -> Tuple[List[Dict], List[Dict], List[Dict]]:
        """Load training data directly from database."""
        import os
        import sys
        
        # Setup Django
        sys.path.insert(0, str(BASE_DIR))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.local')
        
        import django
        django.setup()
        
        from django.utils import timezone
        from apps.accounts.models import User
        from apps.accounts.behavior_models import UserBehaviorProfile, UserInteraction
        from apps.products.models import Product
        from apps.orders.models import Order, OrderItem
        from apps.analytics.models import ProductView
        
        interactions = []
        products = []
        users = []
        
        # Load user interactions
        since = timezone.now() - timedelta(days=90)
        
        # Product views
        for view in ProductView.objects.filter(created_at__gte=since).select_related('product', 'user'):
            if view.user and view.product:
                interactions.append({
                    'user_id': str(view.user.id),
                    'product_id': str(view.product.id),
                    'interaction_type': 'view',
                    'weight': 1.0,
                    'timestamp': view.created_at.isoformat(),
                })
        
        # Order items (purchases)
        for item in OrderItem.objects.filter(
            order__created_at__gte=since,
            order__user__isnull=False
        ).select_related('product', 'order__user'):
            if item.order.user and item.product:
                interactions.append({
                    'user_id': str(item.order.user.id),
                    'product_id': str(item.product.id),
                    'interaction_type': 'purchase',
                    'weight': 5.0,  # Purchases weighted higher
                    'quantity': item.quantity,
                    'timestamp': item.order.created_at.isoformat(),
                })
        
        # User interactions (detailed)
        for interaction in UserInteraction.objects.filter(
            created_at__gte=since,
            user__isnull=False,
            product__isnull=False
        ).select_related('user', 'product'):
            weight_map = {
                'view': 1.0,
                'click': 1.5,
                'add_to_cart': 3.0,
                'wishlist_add': 2.0,
                'purchase': 5.0,
                'review': 4.0,
            }
            interactions.append({
                'user_id': str(interaction.user.id),
                'product_id': str(interaction.product.id),
                'interaction_type': interaction.interaction_type,
                'weight': weight_map.get(interaction.interaction_type, 1.0),
                'timestamp': interaction.created_at.isoformat(),
            })
        
        # Load product features
        for product in Product.objects.filter(is_active=True, is_deleted=False):
            products.append({
                'product_id': str(product.id),
                'name': product.name,
                'price': float(product.current_price),
                'category_ids': [str(c.id) for c in product.categories.all()],
                'tag_ids': [str(t.id) for t in product.tags.all()],
                'view_count': product.view_count,
                'sold_count': product.sold_count,
                'is_featured': product.is_featured,
                'is_bestseller': product.is_bestseller,
            })
        
        # Load user features
        for profile in UserBehaviorProfile.objects.select_related('user').all():
            users.append({
                'user_id': str(profile.user.id),
                'total_sessions': profile.total_sessions,
                'total_page_views': profile.total_page_views,
                'products_viewed': profile.products_viewed,
                'products_purchased': profile.products_purchased,
                'total_orders': profile.total_orders,
                'total_spent': float(profile.total_spent),
                'avg_order_value': float(profile.avg_order_value),
                'engagement_score': float(profile.engagement_score),
                'loyalty_score': float(profile.loyalty_score),
                'recency_score': float(profile.recency_score),
            })
        
        logger.info(f"Loaded {len(interactions)} interactions, {len(products)} products, {len(users)} users")
        return interactions, products, users


def load_training_data() -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """Load training data from JSONL files or database."""
    # Try JSONL files first
    interactions_file = TRAINING_DATA_DIR / 'user_product_interactions.jsonl'
    products_file = TRAINING_DATA_DIR / 'product_features.jsonl'
    users_file = TRAINING_DATA_DIR / 'user_features.jsonl'
    
    if interactions_file.exists() and products_file.exists():
        interactions = DataLoader.load_from_jsonl(interactions_file)
        products = DataLoader.load_from_jsonl(products_file)
        users = DataLoader.load_from_jsonl(users_file)
        
        if interactions and products:
            logger.info(f"Loaded data from JSONL files")
            return interactions, products, users
    
    # Load from database
    logger.info("Loading data from database...")
    return DataLoader.load_from_database()


class RecommendationModelTrainer:
    """Train collaborative filtering recommendation model."""
    
    def __init__(self, interactions: List[Dict], products: List[Dict]):
        self.interactions = interactions
        self.products = products
        self.model = None
        self.user_factors = None
        self.product_factors = None
        self.similarity_matrix = None
        
    def prepare_data(self) -> Tuple[csr_matrix, Dict, Dict]:
        """Prepare interaction matrix."""
        if not self.interactions:
            return None, {}, {}
        
        # Create user and product indices
        user_ids = list(set(i['user_id'] for i in self.interactions))
        product_ids = list(set(i['product_id'] for i in self.interactions))
        
        user_idx = {uid: i for i, uid in enumerate(user_ids)}
        product_idx = {pid: i for i, pid in enumerate(product_ids)}
        
        # Build sparse matrix
        rows, cols, data = [], [], []
        
        for interaction in self.interactions:
            uid = interaction['user_id']
            pid = interaction['product_id']
            weight = interaction.get('weight', 1.0)
            
            if uid in user_idx and pid in product_idx:
                rows.append(user_idx[uid])
                cols.append(product_idx[pid])
                data.append(weight)
        
        if not rows:
            return None, user_idx, product_idx
        
        matrix = csr_matrix(
            (data, (rows, cols)),
            shape=(len(user_ids), len(product_ids))
        )
        
        return matrix, user_idx, product_idx
    
    def train(self, n_components: int = 50) -> Dict[str, Any]:
        """Train the recommendation model using SVD."""
        matrix, user_idx, product_idx = self.prepare_data()
        
        if matrix is None or matrix.nnz == 0:
            logger.warning("Insufficient data for recommendation model")
            return None
        
        logger.info(f"Training recommendation model with {matrix.shape[0]} users, {matrix.shape[1]} products")
        
        # Adjust components if matrix is small
        n_components = min(n_components, min(matrix.shape) - 1)
        if n_components < 1:
            logger.warning("Matrix too small for SVD")
            return None
        
        # Apply SVD
        svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.user_factors = svd.fit_transform(matrix)
        self.product_factors = svd.components_.T
        
        # Compute product similarity
        self.similarity_matrix = cosine_similarity(self.product_factors)
        
        model_data = {
            'model': svd,
            'user_factors': self.user_factors,
            'product_factors': self.product_factors,
            'similarity_matrix': self.similarity_matrix,
            'user_idx': user_idx,
            'product_idx': product_idx,
            'idx_to_user': {v: k for k, v in user_idx.items()},
            'idx_to_product': {v: k for k, v in product_idx.items()},
            'trained_at': datetime.now().isoformat(),
            'n_users': len(user_idx),
            'n_products': len(product_idx),
            'n_interactions': len(self.interactions),
        }
        
        return model_data
    
    def save(self, model_data: Dict) -> Path:
        """Save model to disk."""
        model_path = ML_MODELS_DIR / 'recommendation_model.pkl'
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        logger.info(f"Recommendation model saved to {model_path}")
        return model_path


class SegmentationModelTrainer:
    """Train user segmentation model using K-Means clustering."""
    
    def __init__(self, users: List[Dict]):
        self.users = users
        self.scaler = StandardScaler()
        self.model = None
        
    def prepare_features(self) -> Tuple[np.ndarray, List[str]]:
        """Extract and prepare user features."""
        if not self.users or len(self.users) < 10:
            return None, []
        
        features = []
        user_ids = []
        
        for user in self.users:
            features.append([
                user.get('total_sessions', 0),
                user.get('total_page_views', 0),
                user.get('products_viewed', 0),
                user.get('products_purchased', 0),
                user.get('total_orders', 0),
                user.get('total_spent', 0),
                user.get('engagement_score', 0),
                user.get('loyalty_score', 0),
                user.get('recency_score', 0),
            ])
            user_ids.append(user['user_id'])
        
        return np.array(features), user_ids
    
    def train(self, n_clusters: int = 6) -> Dict[str, Any]:
        """Train segmentation model."""
        features, user_ids = self.prepare_features()
        
        if features is None:
            logger.warning("Insufficient data for segmentation model")
            return None
        
        logger.info(f"Training segmentation model with {len(user_ids)} users")
        
        # Adjust cluster count based on data size
        n_clusters = min(n_clusters, len(user_ids) // 10)
        n_clusters = max(2, n_clusters)
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Train K-Means
        self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = self.model.fit_predict(features_scaled)
        
        # Generate cluster profiles
        cluster_profiles = self._analyze_clusters(features, clusters)
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'n_clusters': n_clusters,
            'cluster_profiles': cluster_profiles,
            'user_clusters': dict(zip(user_ids, clusters.tolist())),
            'feature_names': [
                'total_sessions', 'total_page_views', 'products_viewed',
                'products_purchased', 'total_orders', 'total_spent',
                'engagement_score', 'loyalty_score', 'recency_score'
            ],
            'trained_at': datetime.now().isoformat(),
        }
        
        return model_data
    
    def _analyze_clusters(self, features: np.ndarray, clusters: np.ndarray) -> Dict:
        """Analyze and profile each cluster."""
        profiles = {}
        labels = ['New Visitors', 'Browsers', 'Engagers', 'Buyers', 'Loyalists', 'Champions']
        
        for i in range(max(clusters) + 1):
            mask = clusters == i
            cluster_features = features[mask]
            
            profile = {
                'size': int(mask.sum()),
                'percentage': round(mask.sum() / len(clusters) * 100, 1),
                'avg_sessions': round(float(cluster_features[:, 0].mean()), 1),
                'avg_page_views': round(float(cluster_features[:, 1].mean()), 1),
                'avg_products_viewed': round(float(cluster_features[:, 2].mean()), 1),
                'avg_products_purchased': round(float(cluster_features[:, 3].mean()), 1),
                'avg_orders': round(float(cluster_features[:, 4].mean()), 1),
                'avg_spent': round(float(cluster_features[:, 5].mean()), 2),
                'avg_engagement': round(float(cluster_features[:, 6].mean()), 1),
                'avg_loyalty': round(float(cluster_features[:, 7].mean()), 1),
            }
            
            # Assign label based on characteristics
            if profile['avg_orders'] >= 5 and profile['avg_engagement'] >= 70:
                profile['label'] = 'Champions'
            elif profile['avg_orders'] >= 3 and profile['avg_engagement'] >= 50:
                profile['label'] = 'Loyalists'
            elif profile['avg_products_purchased'] >= 2:
                profile['label'] = 'Buyers'
            elif profile['avg_engagement'] >= 30:
                profile['label'] = 'Engagers'
            elif profile['avg_page_views'] >= 5:
                profile['label'] = 'Browsers'
            else:
                profile['label'] = 'New Visitors'
            
            profiles[i] = profile
        
        return profiles
    
    def save(self, model_data: Dict) -> Path:
        """Save model to disk."""
        model_path = ML_MODELS_DIR / 'segmentation_model.pkl'
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        logger.info(f"Segmentation model saved to {model_path}")
        return model_path


class ProductSimilarityTrainer:
    """Train content-based product similarity model."""
    
    def __init__(self, products: List[Dict]):
        self.products = products
        
    def train(self) -> Dict[str, Any]:
        """Train product similarity model based on categories and tags."""
        if not self.products:
            return None
        
        logger.info(f"Training product similarity model with {len(self.products)} products")
        
        product_ids = [p['product_id'] for p in self.products]
        product_idx = {pid: i for i, pid in enumerate(product_ids)}
        
        # Build feature vectors
        all_categories = set()
        all_tags = set()
        
        for p in self.products:
            all_categories.update(p.get('category_ids', []))
            all_tags.update(p.get('tag_ids', []))
        
        category_list = sorted(all_categories)
        tag_list = sorted(all_tags)
        
        category_idx = {c: i for i, c in enumerate(category_list)}
        tag_idx = {t: i for i, t in enumerate(tag_list)}
        
        # Build feature matrix
        n_products = len(self.products)
        n_features = len(category_list) + len(tag_list) + 3  # +3 for price, featured, bestseller
        
        feature_matrix = np.zeros((n_products, n_features))
        
        for i, product in enumerate(self.products):
            # Category features
            for cat_id in product.get('category_ids', []):
                if cat_id in category_idx:
                    feature_matrix[i, category_idx[cat_id]] = 1.0
            
            # Tag features
            offset = len(category_list)
            for tag_id in product.get('tag_ids', []):
                if tag_id in tag_idx:
                    feature_matrix[i, offset + tag_idx[tag_id]] = 1.0
            
            # Numeric features
            base = len(category_list) + len(tag_list)
            price = product.get('price', 0)
            feature_matrix[i, base] = np.log1p(price) / 10  # Normalized log price
            feature_matrix[i, base + 1] = 1.0 if product.get('is_featured') else 0.0
            feature_matrix[i, base + 2] = 1.0 if product.get('is_bestseller') else 0.0
        
        # Compute similarity matrix
        similarity_matrix = cosine_similarity(feature_matrix)
        
        model_data = {
            'similarity_matrix': similarity_matrix,
            'product_idx': product_idx,
            'idx_to_product': {v: k for k, v in product_idx.items()},
            'category_list': category_list,
            'tag_list': tag_list,
            'trained_at': datetime.now().isoformat(),
        }
        
        return model_data
    
    def save(self, model_data: Dict) -> Path:
        """Save model to disk."""
        model_path = ML_MODELS_DIR / 'product_similarity_model.pkl'
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        logger.info(f"Product similarity model saved to {model_path}")
        return model_path


def train_all_models():
    """Train all ML models."""
    logger.info("=" * 60)
    logger.info("Bunoraa ML Model Training Pipeline")
    logger.info("=" * 60)
    
    # Load data
    interactions, products, users = load_training_data()
    
    results = {}
    
    # Train recommendation model
    if interactions and products:
        trainer = RecommendationModelTrainer(interactions, products)
        model_data = trainer.train()
        if model_data:
            trainer.save(model_data)
            results['recommendation'] = {
                'status': 'success',
                'n_users': model_data['n_users'],
                'n_products': model_data['n_products'],
            }
    
    # Train segmentation model
    if users:
        trainer = SegmentationModelTrainer(users)
        model_data = trainer.train()
        if model_data:
            trainer.save(model_data)
            results['segmentation'] = {
                'status': 'success',
                'n_clusters': model_data['n_clusters'],
                'cluster_profiles': model_data['cluster_profiles'],
            }
    
    # Train product similarity model
    if products:
        trainer = ProductSimilarityTrainer(products)
        model_data = trainer.train()
        if model_data:
            trainer.save(model_data)
            results['product_similarity'] = {
                'status': 'success',
                'n_products': len(products),
            }
    
    logger.info("=" * 60)
    logger.info("Training Complete!")
    logger.info(json.dumps(results, indent=2))
    logger.info("=" * 60)
    
    return results


def main():
    """Main entry point."""
    train_all_models()


if __name__ == '__main__':
    main()
