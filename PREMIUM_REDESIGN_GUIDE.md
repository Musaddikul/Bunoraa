# Bunoraa Premium Redesign - Implementation Guide

## Overview
The website has been completely redesigned with a premium, production-ready, enterprise-grade architecture using pure JavaScript (no frameworks).

## What Has Been Built

### 1. **Core Framework** (`/static/js/core/framework.js`)
- **Store**: Global state management for user, cart, wishlist, notifications
- **EventEmitter**: App-wide event bus for component communication
- **APIClient**: Enhanced REST API client with JWT/CSRF support
- **Router**: Client-side routing capabilities
- **Bunoraa App**: Main application class coordinating all systems

**Key Features:**
- Automatic network detection and offline handling
- User authentication state management
- Cart and wishlist management with real-time sync
- Event-driven architecture for loose coupling

### 2. **Premium Base Template** (`/templates/base_premium.html`)
- Sticky navigation with logo, search, cart, wishlist, account
- Mobile-responsive design with hamburger menu
- Premium footer with multiple sections
- Notification container for toasts
- Clean, modern Tailwind CSS styling
- SEO-optimized meta tags

### 3. **Components**

#### Navigation Component (`/static/js/components/navigation.js`)
- Loads categories dynamically
- Updates cart/wishlist badges
- Manages account menu
- Mobile menu toggling

#### Notification Component (`/static/js/components/notifications.js`)
- Toast-based notifications
- Support for success, error, warning, info types
- Auto-dismiss with configurable duration
- Undo action support

#### Search Component (`/static/js/components/search.js`)
- Real-time product search with autocomplete
- Debounced API requests
- Mobile and desktop support
- Click-outside handling

### 4. **Premium Pages**

#### Home Page (`/templates/pages/home_new.html`)
- Animated hero section with canvas particles
- Trending products section
- Featured categories grid
- Benefits section
- New arrivals showcase
- Testimonials carousel
- Newsletter subscription
- All content loaded dynamically from API

#### Products Listing (`/templates/products/list_premium.html`)
- Advanced filtering (price range, categories, rating)
- Sorting options (newest, price, popularity, name)
- Pagination with smart page numbers
- Grid/List view toggle
- In-stock filtering
- Real-time filter updates
- Lazy loading with skeletons
- Mobile-responsive design

## How to Use

### Switching to Premium Templates

1. **Update Home Page View:**
```python
# In apps/pages/views.py
class HomeView(TemplateView):
    template_name = 'pages/home_new.html'  # Changed from 'pages/home.html'
```

2. **Update Products List View:**
```python
# In apps/products/views.py
class ProductListView(ListView):
    template_name = 'products/list_premium.html'  # Changed from 'products/list.html'
```

3. **Inherit from base_premium.html:**
```html
{% extends 'base_premium.html' %}
{% load static %}

{% block title %}Your Page Title{% endblock %}

{% block content %}
<!-- Your content here -->
{% endblock %}
```

### API Integration

All pages use the REST API (`/api/v1/`) to fetch data:

```javascript
// Products with filters
await api.get('/products/', {
    search: 'laptop',
    price_min: 100,
    price_max: 1000,
    category: 5,
    ordering: '-price',
    page: 1,
    page_size: 12
});

// Categories
await api.get('/categories/', { limit: 10 });

// Reviews
await api.get('/reviews/', { product_id: 1, limit: 5 });

// User profile
await api.get('/accounts/profile/');

// Cart
await api.get('/cart/');

// Wishlist
await api.get('/wishlist/');
```

### Working with Global State

```javascript
// Access current state
const state = window.app.store.getState();
console.log(state.user);
console.log(state.cart);
console.log(state.wishlist);

// Update state
window.app.store.setState({ ... });

// Subscribe to changes
const unsubscribe = window.app.store.subscribe((prevState, nextState) => {
    console.log('State changed', nextState);
});

// Add to cart
window.app.addToCart({
    id: 1,
    name: 'Product Name',
    price: 99.99,
    image: '/path/to/image.jpg'
});

// Add to wishlist
window.app.addToWishlist({
    id: 1,
    name: 'Product Name',
    price: 99.99
});
```

### Event Bus Usage

```javascript
// Listen for events
eventBus.on('cart:updated', (items) => {
    console.log('Cart updated:', items);
});

eventBus.on('user:changed', () => {
    console.log('User state changed');
});

eventBus.on('notification:show', (notification) => {
    console.log('Show notification:', notification);
});

// Emit events
eventBus.emit('notification:show', {
    message: 'Product added to cart!',
    type: 'success',
    duration: 3000
});
```

### Showing Notifications

```javascript
// Success notification
window.app.showNotification('Product added to cart!', 'success');

// Error notification
window.app.showNotification('Failed to add product', 'error');

// Custom notification with undo action
eventBus.emit('notification:show', {
    message: 'Item removed from cart',
    type: 'info',
    action: 'window.location.reload()'
});
```

## File Structure

```
templates/
├── base_premium.html           # New premium base template
├── pages/
│   └── home_new.html          # New home page
└── products/
    └── list_premium.html       # New products listing

static/js/
├── core/
│   └── framework.js            # Core app framework
├── components/
│   ├── notifications.js        # Toast notifications
│   ├── navigation.js           # Navigation logic
│   └── search.js               # Search component
└── api/
    └── client.js               # API client (existing)
```

## Features Implemented

✅ Premium, modern design with Tailwind CSS
✅ Pure JavaScript (no frontend frameworks)
✅ Global state management (Store)
✅ Event-driven architecture
✅ Dynamic API-driven content
✅ Real-time filtering and sorting
✅ Advanced search with autocomplete
✅ Mobile-responsive design
✅ Toast notifications
✅ Cart/wishlist management
✅ Sticky navigation
✅ Lazy loading with skeletons
✅ Network detection and offline support
✅ Pagination with smart page numbers
✅ User authentication integration
✅ CSRF/JWT token handling

## Features Not Yet Implemented

- Product detail page redesign
- Shopping cart page with quantity editor
- Checkout flow (shipping, payment, review)
- User account pages (profile, orders, addresses)
- Advanced product image gallery
- Product reviews and ratings display
- Wishlist dedicated page
- Search results page
- Category detail pages
- Error pages (404, 500, etc.)

## Database & API Requirements

The implementation assumes these API endpoints are available:

- `GET /api/v1/products/` - Product listing with filters
- `GET /api/v1/categories/` - Category listing
- `GET /api/v1/reviews/` - Product reviews
- `GET /api/v1/accounts/profile/` - User profile
- `GET /api/v1/cart/` - Get cart
- `POST /api/v1/cart/add/` - Add to cart
- `GET /api/v1/wishlist/` - Get wishlist
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/` - User logout

## Next Steps to Complete the Redesign

1. **Create Product Detail Page**
   - Image gallery with zoom
   - Product reviews and ratings
   - Related products
   - Quantity selector
   - Add to cart/wishlist buttons

2. **Create Shopping Cart Page**
   - Edit quantities
   - Remove items
   - Apply coupon codes
   - Estimated totals
   - Continue shopping link

3. **Create Checkout Flow**
   - Shipping address selection
   - Shipping method selection
   - Payment method selection
   - Order review
   - Order confirmation

4. **Create Account Pages**
   - Profile management
   - Order history
   - Address management
   - Wishlist
   - Settings

5. **Error Handling**
   - 404 page
   - 500 page
   - Network error overlay
   - Loading states

6. **Performance Optimization**
   - Image lazy loading
   - Code splitting
   - Service worker caching
   - API response caching

## Customization

### Colors
Edit Tailwind config in `base_premium.html`:
```javascript
colors: {
    primary: { /* ... */ },
    accent: { /* ... */ },
}
```

### Typography
Fonts are configured in base template head:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter&family=Playfair+Display">
```

### Layout
All pages use Tailwind CSS utility classes for responsive design.
- Mobile first approach
- `md:` breakpoint at 768px
- `lg:` breakpoint at 1024px
- `xl:` breakpoint at 1280px

## Performance Metrics

- **Lighthouse**: Target 90+
- **Page Load**: < 2s
- **API Response**: < 500ms
- **Search**: < 300ms with debouncing
- **Interactions**: 60 FPS animations

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android 90+

## Security Considerations

✅ CSRF token handling
✅ JWT token support
✅ XSS prevention via template escaping
✅ Secure password handling
✅ HTTPS-only cookies recommended
✅ Input validation on client
✅ API validation on server

## Troubleshooting

### Store not initializing
```javascript
// Make sure app is ready
document.addEventListener('app:ready', () => {
    console.log(window.app.store.getState());
});
```

### API requests failing
```javascript
// Check CSRF token
console.log(window.app.api.getCsrfToken());

// Check auth token
console.log(localStorage.getItem('auth_token'));
```

### Notifications not showing
```javascript
// Make sure container exists
console.log(document.getElementById('notification-container'));

// Manually trigger
eventBus.emit('notification:show', { message: 'Test', type: 'info' });
```
