# Bunoraa Premium Redesign - Quick Start Guide

## Overview
The website has been completely redesigned with a premium, production-ready architecture. All pages now fetch data from the API (no more fallback/mock data) and use a pure JavaScript application framework.

## Files Created/Modified

### Core Framework
- ✅ `/static/js/core/framework.js` - Main app framework with state management and event bus
- ✅ `/static/js/components/notifications.js` - Toast notification system
- ✅ `/static/js/components/navigation.js` - Navigation and category loading
- ✅ `/static/js/components/search.js` - Search autocomplete (already existed, enhanced)
- ✅ `/static/js/components/cart-widget.js` - Cart badge and sync management

### Templates
- ✅ `/templates/base_premium.html` - New premium base template (use this as the parent template)
- ✅ `/templates/pages/home_new.html` - Redesigned home page with API data loading
- ✅ `/templates/products/list_premium.html` - Redesigned products listing with advanced filters

## How to Start Using the New Design

### Step 1: Update Your Views
Change your view templates to use the new premium templates:

```python
# apps/pages/views.py - HomeView
class HomeView(TemplateView):
    template_name = 'pages/home_new.html'

# apps/products/views.py - ProductListView
class ProductListView(ListView):
    template_name = 'products/list_premium.html'

# ... and so on for other views
```

### Step 2: Update Old Base.html Usage
If you have other templates still extending `base.html`, gradually migrate them:

```html
<!-- Old -->
{% extends 'base.html' %}

<!-- New -->
{% extends 'base_premium.html' %}
```

### Step 3: Include the New Scripts
The new base template automatically includes:
- Core framework
- Notification component
- Navigation component
- Cart widget

No additional script includes needed!

## Key Architectural Changes

### Before (Old Design)
```
Templates render all HTML server-side
Static content/mock data
jQuery for interactions
Global window object pollution
```

### After (New Design)
```
Templates provide structure
JavaScript fetches data from API
Pure vanilla JavaScript with framework
Event-driven component communication
Global app namespace: window.app
```

## Core Concepts

### 1. Global App Instance
```javascript
// Available globally after DOMContentLoaded
window.app

// Access the Store
window.app.store.getState()

// Access the API client
window.app.api.get('/api/endpoint/')

// Show notification
window.app.showNotification('Message', 'success')
```

### 2. Event Bus
```javascript
// Global event communication
eventBus.on('event:name', handler)
eventBus.emit('event:name', data)

// Available events:
// - cart:updated
// - user:changed
// - user:logged-out
// - wishlist:updated
// - notification:show
// - app:online
// - app:offline
// - app:ready
```

### 3. API Client
```javascript
// All requests automatically include CSRF token and JWT if available
await window.app.api.get('/products/', { category: 1, limit: 10 })
await window.app.api.post('/cart/add/', { product_id: 1, quantity: 1 })
```

### 4. Store (State Management)
```javascript
// Get current state
const state = window.app.store.getState()
console.log(state.user, state.cart, state.wishlist)

// Update state
window.app.store.setState({ user: userData })

// Subscribe to changes
window.app.store.subscribe((prev, next) => {
    console.log('State changed')
})
```

## What's NOT Included Yet (TODO)

These pages still need to be redesigned. Create them using `base_premium.html`:

1. **Product Detail Page** - Image gallery, reviews, related products
2. **Cart Page** - Quantity editor, totals, checkout button
3. **Checkout Pages** - Shipping, payment, review, confirmation
4. **Account Pages** - Profile, orders, addresses, wishlist
5. **Search Results** - Display search query results
6. **Category Pages** - Category-specific product filtering
7. **Error Pages** - 404, 500 error handlers
8. **CMS Pages** - About, Privacy, Terms, etc.

## Template Inheritance Example

Create any new page like this:

```html
{% extends 'base_premium.html' %}
{% load static %}

{% block title %}Your Page Title - Bunoraa{% endblock %}

{% block content %}
<div class="container mx-auto px-4 py-12">
    <!-- Your content -->
</div>

<script>
    // Your JavaScript
    class YourPageComponent {
        constructor() {
            this.api = window.app.api;
            this.store = window.app.store;
            this.init();
        }

        async init() {
            // Load data from API
            const data = await this.api.get('/your/endpoint/');
            this.render(data);
        }

        render(data) {
            // Update DOM with data
        }
    }

    document.addEventListener('app:ready', () => {
        new YourPageComponent();
    });
</script>

{% endblock %}
```

## CSS Styling

All pages use Tailwind CSS utility classes. The color scheme is:

```css
/* Primary Color (Purple) */
primary-50 through primary-900

/* Accent Color (Pink) */
accent-50 through accent-900

/* Usage */
class="bg-primary-600 text-white"
class="hover:bg-primary-700"
class="border-primary-300"
```

## JavaScript Guidelines

### Component Structure
```javascript
class MyComponent {
    constructor(options = {}) {
        this.api = window.app?.api;
        this.store = window.app?.store;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // Attach listeners
        eventBus.on('event:name', this.handleEvent.bind(this));
    }

    async loadData() {
        try {
            const response = await this.api.get('/endpoint/');
            this.render(response);
        } catch (error) {
            window.app.showNotification('Error loading data', 'error');
        }
    }

    render(data) {
        // Update DOM
    }
}

// Initialize when app is ready
document.addEventListener('app:ready', () => {
    new MyComponent();
});
```

## API Endpoints You Can Use

```
Products
GET /api/v1/products/?search=&category=&price_min=&price_max=&ordering=&page=&page_size=
GET /api/v1/products/{id}/
POST /api/v1/products/{id}/reviews/

Categories
GET /api/v1/categories/?limit=&offset=
GET /api/v1/categories/{id}/

User
GET /api/v1/accounts/profile/
PATCH /api/v1/accounts/profile/
POST /api/v1/accounts/logout/

Cart
GET /api/v1/cart/
POST /api/v1/cart/add/
POST /api/v1/cart/remove/
POST /api/v1/cart/update/

Wishlist
GET /api/v1/wishlist/
POST /api/v1/wishlist/add/
POST /api/v1/wishlist/remove/

Orders
GET /api/v1/orders/
GET /api/v1/orders/{id}/
```

## Troubleshooting

### Problem: App not initialized
**Solution:** Make sure to wait for `app:ready` event
```javascript
document.addEventListener('app:ready', () => {
    // Now window.app is available
});
```

### Problem: API requests failing
**Solution:** Check:
1. Browser DevTools Network tab for status codes
2. CSRF token: `window.app.api.getCsrfToken()`
3. Auth token: `localStorage.getItem('auth_token')`

### Problem: Styles not applying
**Solution:** Make sure you're extending `base_premium.html` not old `base.html`

### Problem: Components not initializing
**Solution:** Check console for errors, ensure all dependencies are loaded in correct order

## Performance Tips

1. **Use data-loading attribute** to show loading state
   ```html
   <div id="content" data-loading="true">Loading...</div>
   ```

2. **Lazy load images** with `loading="lazy"`
   ```html
   <img src="..." loading="lazy" />
   ```

3. **Use pagination** for lists
   ```javascript
   const response = await api.get('/products/', { page: 1, page_size: 12 });
   ```

4. **Debounce search inputs**
   ```javascript
   setTimeout(() => this.search(), 300);  // Wait 300ms after last keystroke
   ```

## Browser Compatibility

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ iOS Safari 14+
✅ Chrome Android 90+

## Next Steps

1. Update your views to use the new templates
2. Test the new home page and products listing
3. Create remaining pages using the same pattern
4. Update any remaining old templates
5. Remove old template files when migration is complete
6. Optimize images and assets
7. Set up analytics and monitoring

## Support

Refer to `PREMIUM_REDESIGN_GUIDE.md` for more detailed documentation.
