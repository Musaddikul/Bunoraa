# Bunoraa E-Commerce Platform

A premium, robust, production-ready single-store e-commerce platform built with Django 5.x, Django REST Framework, and a modern frontend stack using pure JavaScript (ES6 modules) and TailwindCSS.

## 🚀 Features

### Backend
- **Django 5.x** with Django REST Framework
- **RESTful API** under `/api/v1/` with standardized response format
- **Modular Architecture** with clean separation of concerns
- **Authentication** with JWT, social auth (Google, Facebook)
- **Multi-currency** support with real-time exchange rates
- **Comprehensive Admin** with Django admin customizations
- **Celery** for async tasks and scheduled jobs
- **Redis** for caching and Celery broker

### Frontend
- **Pure ES6 JavaScript** modules (no build step required)
- **TailwindCSS** with custom design system
- **Responsive Design** mobile-first approach
- **Modern UI Components** (modals, tabs, accordions, etc.)
- **Progressive Enhancement** works without JavaScript

### E-Commerce
- Product catalog with categories, variants, and images
- Shopping cart with session and user-based persistence
- Checkout flow with multiple payment methods
- Order management and tracking
- Wishlist functionality
- Product reviews and ratings
- Promotional campaigns and coupons
- Inventory management

## 📁 Project Structure

```
bunoraa/
├── backend/
│   ├── accounts/          # User authentication & profiles
│   ├── products/          # Product catalog
│   ├── categories/        # Category management
│   ├── cart/             # Shopping cart
│   ├── orders/           # Order processing
│   ├── payments/         # Payment integrations
│   ├── shipping/         # Shipping methods
│   ├── promotions/       # Coupons & campaigns
│   ├── reviews/          # Product reviews
│   ├── wishlist/         # User wishlists
│   ├── notifications/    # Email & push notifications
│   ├── analytics/        # Business analytics
│   ├── cms/             # Content management
│   ├── currencies/       # Multi-currency
│   ├── frontend/         # Frontend templates & assets
│   │   ├── static/
│   │   │   ├── js/       # ES6 modules
│   │   │   ├── css/      # TailwindCSS
│   │   │   └── images/   # Static images
│   │   ├── templates/    # Django templates
│   │   └── templatetags/ # Custom template tags
│   └── core/            # Core settings & utilities
├── static/              # Collected static files
├── media/               # User uploads
├── locale/              # Translations
└── requirements.txt     # Python dependencies
```

## 🛠️ Installation

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Node.js 18+ (for TailwindCSS CLI)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bunoraa.git
cd bunoraa
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Install Node dependencies** (for TailwindCSS)
```bash
npm install
```

5. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your settings
```

6. **Run migrations**
```bash
python manage.py migrate
```

7. **Create superuser**
```bash
python manage.py createsuperuser
```

8. **Collect static files**
```bash
python manage.py collectstatic
```

9. **Build TailwindCSS**
```bash
npm run build:css
# or for development with watch mode:
npm run dev:css
```

10. **Run development server**
```bash
python manage.py runserver
```

## 🔧 Configuration

### Environment Variables

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/bunoraa

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=your-password

# Payments
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx

# Social Auth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx

# AWS (for file storage)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_STORAGE_BUCKET_NAME=xxx
```

## 📡 API Reference

### Authentication

```http
POST /api/v1/auth/login/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
POST /api/v1/auth/password/reset/
POST /api/v1/auth/token/refresh/
```

### Products

```http
GET    /api/v1/products/
GET    /api/v1/products/{slug}/
GET    /api/v1/products/{slug}/reviews/
GET    /api/v1/categories/
GET    /api/v1/categories/{slug}/
```

### Cart

```http
GET    /api/v1/cart/
POST   /api/v1/cart/items/
PATCH  /api/v1/cart/items/{id}/
DELETE /api/v1/cart/items/{id}/
POST   /api/v1/cart/coupon/
```

### Orders

```http
GET    /api/v1/orders/
POST   /api/v1/orders/
GET    /api/v1/orders/{order_number}/
POST   /api/v1/orders/{order_number}/cancel/
```

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

## 🎨 Frontend Architecture

### JavaScript Modules

```javascript
// API Client
import { api } from '/static/js/api/client.js';

// Utilities
import { formatCurrency } from '/static/js/utils/currency.js';
import { debounce } from '/static/js/utils/helpers.js';

// UI Components
import { Modal } from '/static/js/components/modal.js';
import { Toast } from '/static/js/components/toast.js';

// State Stores
import { cartStore } from '/static/js/stores/cart.js';
import { authStore } from '/static/js/stores/auth.js';
```

### TailwindCSS Theme

The custom theme includes:
- **Primary Color**: Coral (#e5604d)
- **Secondary Color**: Gray scale
- **Accent Color**: Orange
- **Font Family**: Inter (sans-serif)
- **Custom Components**: Buttons, inputs, cards, badges

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test products

# Run with coverage
coverage run manage.py test
coverage report
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Configure production database
- [ ] Set up Redis for caching
- [ ] Configure email backend
- [ ] Set up static file serving (CDN/S3)
- [ ] Configure media file storage (S3)
- [ ] Set up SSL certificate
- [ ] Configure Celery workers
- [ ] Set up monitoring (Sentry, etc.)

### Docker Deployment

```bash
docker-compose up -d
```

### Render Deployment

The project includes `render.yaml` for easy deployment on Render:

```bash
# Push to GitHub and connect to Render
# Services will be auto-created from render.yaml
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support, email support@bunoraa.com or open an issue on GitHub.

---

Built with ❤️ by the Bunoraa Team
