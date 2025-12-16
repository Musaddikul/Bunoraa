# JavaScript File Organization

## Overview

The JavaScript code is organized following best practices for maintainability and separation of concerns.

## Directory Structure

```
static/js/
├── core/
│   └── framework.js          # Core framework (Store, EventEmitter, APIClient, Router)
├── components/               # Reusable UI components
│   ├── notifications.js      # Toast notification system
│   ├── navigation.js         # Navigation menu with badge updates
│   ├── cart-widget.js        # Cart/wishlist badge synchronization
│   ├── search.js             # Search autocomplete
│   ├── filters.js            # Filter UI components
│   └── reviews.js            # Review display component
└── pages/                    # Page-specific logic
    ├── home.js               # Home page functionality
    ├── products-list.js      # Products listing with filters
    ├── product-detail.js     # Single product page
    ├── cart.js               # Shopping cart page
    ├── checkout.js           # Checkout flow
    ├── wishlist.js           # Wishlist page
    ├── account.js            # Account/profile pages
    └── auth.js               # Login/register/password reset
```

## File Responsibilities

### Core (`/static/js/core/`)

**framework.js** - Foundation of the entire application
- `Store`: Global state management for cart, wishlist, user data
- `EventEmitter`: Event bus for component communication
- `APIClient`: REST API client with CSRF/JWT token handling
- `Router`: Client-side navigation
- `Bunoraa`: Main application coordinator

### Components (`/static/js/components/`)

Reusable UI elements that can be used across multiple pages.

**notifications.js** - Toast Notification System
- Success, error, warning, info messages
- Auto-dismiss with configurable timeout
- Undo actions support
- Event-driven integration

**navigation.js** - Navigation Component
- Dynamic category loading from API
- Cart/wishlist badge updates
- Mobile menu handling
- Account menu rendering

**cart-widget.js** - Cart Widget Component
- Real-time cart/wishlist synchronization
- Badge updates via event bus
- Server-side persistence
- Offline support

### Pages (`/static/js/pages/`)

Page-specific functionality that is not reusable.

**home.js** - Home Page
- `HomePage` class
- Trending products loading
- Featured categories display
- New arrivals section
- Testimonials/reviews
- Hero canvas animation
- Newsletter subscription

**products-list.js** - Products Listing Page
- `ProductsPage` class
- Advanced filtering (price, category, rating, stock)
- Sorting options
- Pagination rendering
- Grid/list view toggle
- Product card rendering

## Usage Pattern

### In Templates

All page-specific JavaScript is now loaded via external files in the `{% block extra_js %}` section:

```django
{% extends "base_premium.html" %}

{% block content %}
<!-- Page HTML content -->
{% endblock %}

{% block extra_js %}
<script src="{% static 'js/pages/home.js' %}"></script>
{% endblock %}
```

### Component Initialization

Components initialize automatically when the app is ready:

```javascript
// In component files
document.addEventListener('app:ready', () => {
    new ComponentName();
});
```

### Page Classes

Page-specific classes follow this pattern:

```javascript
class PageName {
    constructor() {
        this.api = window.app?.api;
        this.init();
    }

    init() {
        // Setup code
        this.setupEventListeners();
        this.loadData();
    }

    async loadData() {
        // Fetch data from API
    }

    setupEventListeners() {
        // Attach event listeners
    }
}

// Initialize when app is ready
document.addEventListener('app:ready', () => {
    new PageName();
});
```

## Load Order

The scripts are loaded in this order (defined in base_premium.html):

1. **Tailwind CSS** (via CDN)
2. **framework.js** - Core framework
3. **notifications.js** - Notification system
4. **navigation.js** - Navigation component
5. **cart-widget.js** - Cart synchronization
6. **Page-specific JS** - Via {% block extra_js %}

This ensures dependencies are available when needed.

## Event Communication

Components communicate via the global event bus:

```javascript
// Emit event
window.eventBus.emit('cart:updated', { count: 5 });

// Listen to event
window.eventBus.on('cart:updated', (data) => {
    console.log('Cart updated:', data.count);
});
```

### Standard Events

- `cart:updated` - Cart item count changed
- `wishlist:updated` - Wishlist item count changed
- `user:login` - User logged in
- `user:logout` - User logged out
- `app:ready` - Application initialized

## Best Practices

### When to Create a Component

Create a **component** when:
- The UI element is reusable across multiple pages
- It manages its own state and behavior
- Examples: notifications, modals, dropdowns, autocomplete

### When to Create a Page File

Create a **page file** when:
- The logic is specific to one page
- It manages page-level data fetching and rendering
- Examples: home page product carousel, product filters

### Global Access

- Use `window.app` to access the Bunoraa app instance
- Use `window.app.api` for API calls
- Use `window.app.store` for state access
- Use `window.eventBus` for event communication

### API Calls

Always use the APIClient for consistency:

```javascript
// GET request
const products = await window.app.api.get('/products/', { 
    category: 'electronics',
    limit: 10 
});

// POST request
const result = await window.app.api.post('/cart/', {
    product_id: 123,
    quantity: 1
});
```

## Adding New Pages

To add a new page:

1. **Create JavaScript file** in `/static/js/pages/`
2. **Follow naming convention**: `page-name.js` (lowercase with hyphens)
3. **Create page class** with constructor and init method
4. **Load in template**:
   ```django
   {% block extra_js %}
   <script src="{% static 'js/pages/page-name.js' %}"></script>
   {% endblock %}
   ```

## Testing

Test each component/page independently:

```javascript
// Check if component initialized
console.log(window.app);  // Should show Bunoraa instance

// Check event bus
window.eventBus.emit('test', { data: 'hello' });

// Check API client
window.app.api.get('/products/').then(console.log);
```

## Future Enhancements

Planned additions to the pages directory:
- `product-detail.js` - Single product page with image gallery, reviews
- `cart.js` - Shopping cart with quantity editor
- `checkout.js` - Multi-step checkout flow
- `account.js` - User account management
- `wishlist.js` - Wishlist page
- `search-results.js` - Search results page

## Migration Guide

For developers working with the old embedded JavaScript:

**Before:**
```django
<script>
    class HomePage {
        // 200 lines of code
    }
</script>
```

**After:**
```django
{% block extra_js %}
<script src="{% static 'js/pages/home.js' %}"></script>
{% endblock %}
```

Benefits:
- Better code organization
- Easier testing and debugging
- Cleaner templates
- Reusable code
- Proper separation of concerns
