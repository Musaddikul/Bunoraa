# Bunoraa Premium Redesign - Testing & Verification Guide

## Quick Testing Checklist

### 1. Core Framework
- [ ] Open browser console: `window.app` is defined
- [ ] Check app is initialized: `window.app.store.getState()` returns valid state
- [ ] Test event bus: `eventBus.emit('notification:show', {message: 'Test', type: 'success'})`
- [ ] Verify API client: `window.app.api.getCsrfToken()` returns a token
- [ ] Test state updates: `window.app.store.setState({user: {name: 'Test'}})`

### 2. Base Template
- [ ] Navigation appears at top of page
- [ ] Logo clickable and links to home
- [ ] Cart icon with badge visible (showing 0)
- [ ] Wishlist icon with badge visible (showing 0)
- [ ] Account icon visible
- [ ] Mobile menu toggle appears on small screens
- [ ] Footer appears at bottom with links
- [ ] Notification container exists (bottom-right)

### 3. Home Page (`pages/home_new.html`)
Navigate to `/` or configure home view to use `pages/home_new.html`

- [ ] Hero section visible with animated background
- [ ] "Explore Collection" button clickable
- [ ] "Trending Now" section loads products from API
- [ ] Products display: image, name, price, rating
- [ ] "Add to Cart" button works (cart badge updates)
- [ ] "Add to Wishlist" button works (wishlist badge updates)
- [ ] "Featured Categories" section loads from API
- [ ] Benefits section visible with 4 items
- [ ] "New Arrivals" section loads from API
- [ ] Testimonials section loads from API
- [ ] Newsletter subscription form present
- [ ] Footer with multiple sections

### 4. Products Page (`products/list_premium.html`)
Navigate to `/products/` or configure ProductListView to use `products/list_premium.html`

- [ ] Filter sidebar appears on desktop
- [ ] "Price Range" slider works and filters products
- [ ] "Categories" list loads from API
- [ ] Selecting category filters products
- [ ] "Sort By" dropdown changes order
- [ ] "Rating" filter checkboxes work
- [ ] "In Stock Only" checkbox works
- [ ] Products grid displays (4 columns on desktop, 2 on tablet, 1 on mobile)
- [ ] Product cards show: image, name, price, discount badge, rating
- [ ] "Add to Cart" and wishlist buttons work
- [ ] Pagination controls appear
- [ ] Page numbers are clickable
- [ ] "Results info" text updates (e.g., "Showing 1-12 of 150")
- [ ] Grid/list view toggle works

### 5. API Integration
Open browser DevTools Network tab and check:

- [ ] GET `/api/v1/products/` - loads correctly with filters
- [ ] GET `/api/v1/categories/` - loads category list
- [ ] GET `/api/v1/reviews/` - (if on home) loads reviews
- [ ] Status 200 for all requests
- [ ] Response time < 500ms
- [ ] CSRF token sent in headers

### 6. Notifications
- [ ] Click "Add to Cart" → success notification appears (bottom-right)
- [ ] Notification auto-dismisses after 3 seconds
- [ ] Click X on notification to dismiss manually
- [ ] Error notifications are red
- [ ] Success notifications are green
- [ ] Toast slides in smoothly

### 7. Mobile Responsiveness
Test on mobile (or use DevTools device emulation):

- [ ] Navigation hamburger menu appears
- [ ] Mobile menu items clickable
- [ ] Products show 1-2 columns
- [ ] Filters stack vertically
- [ ] Cart/wishlist icons still visible
- [ ] Footer is readable
- [ ] No horizontal scrolling needed
- [ ] All buttons are tap-friendly (>44px)

### 8. Cart Management
- [ ] Add product to cart → badge shows count
- [ ] Add multiple products → count increases
- [ ] Remove from cart → badge decreases
- [ ] Empty cart → badge hidden
- [ ] Cart persists on page reload

### 9. Wishlist Management
- [ ] Add product to wishlist → badge shows count
- [ ] Wishlist icon badge visible
- [ ] Add/remove wishlist → notification appears
- [ ] Wishlist persists on page reload

### 10. Search (if implemented)
- [ ] Search input appears (desktop)
- [ ] Type characters → results show in dropdown
- [ ] Results display product image, name, price
- [ ] Click result → navigates to product
- [ ] Click outside → dropdown closes

### 11. Performance
- [ ] Page loads in < 2 seconds
- [ ] First Contentful Paint < 1 second
- [ ] Smooth scrolling (60 FPS)
- [ ] Filter/sort changes are instant
- [ ] No janky animations
- [ ] Images lazy load

### 12. Errors & Edge Cases
- [ ] Open DevTools and disable network
- [ ] Page shows graceful offline message
- [ ] Re-enable network
- [ ] "You're offline" notification disappears
- [ ] Try invalid API endpoint
- [ ] Error message displays appropriately
- [ ] Page doesn't crash

## Browser Testing

Test in these browsers:
- [ ] Chrome/Edge 90+ (Desktop)
- [ ] Firefox 88+ (Desktop)
- [ ] Safari 14+ (Desktop)
- [ ] Chrome (Android)
- [ ] Safari (iOS)

## Console Check
Open browser DevTools Console and verify:

```javascript
// Should return object with state
console.log(window.app.store.getState())

// Should return object with methods
console.log(window.app.api)

// Should return event emitter
console.log(eventBus)

// Should not have errors
// No 404s for CSS/JS files
// No CORS errors
// No CSRF token errors
```

## Network Check
In DevTools Network tab:

```
✓ No 404 errors
✓ No 500 errors
✓ CSRF token present in request headers
✓ Content-Type: application/json
✓ Response times reasonable
✓ Images loading
✓ CSS/JS loaded
✓ API calls working
```

## SEO Check
- [ ] Page title tag unique and descriptive
- [ ] Meta description present and under 160 chars
- [ ] H1 tag present (only one)
- [ ] Alt text on images
- [ ] Open Graph tags present
- [ ] Mobile viewport configured

## Accessibility Check
- [ ] Can navigate with Tab key
- [ ] Focus indicators visible
- [ ] Form labels associated
- [ ] Alt text on all images
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Buttons have aria-labels if icon-only
- [ ] Links are distinguishable

## Loading States
- [ ] Skeleton screens show while loading
- [ ] "Loading..." spinner visible for slow requests
- [ ] Buttons show disabled state during submission
- [ ] No duplicate submissions possible

## State Persistence
- [ ] User state persists on reload
- [ ] Cart persists on reload
- [ ] Wishlist persists on reload
- [ ] Filters persist (if using URL params)

## Testing Commands

Run in browser console:

```javascript
// Test notification
window.app.showNotification('Test notification', 'success')

// Test adding to cart
window.app.addToCart({ id: 1, name: 'Test', price: 99, image: '/img.jpg' })

// Test adding to wishlist
window.app.addToWishlist({ id: 1, name: 'Test', price: 99 })

// Check cart
console.log(window.app.store.getState().cart)

// Check wishlist
console.log(window.app.store.getState().wishlist)

// Test API
window.app.api.get('/products/').then(r => console.log(r))

// Subscribe to state changes
window.app.store.subscribe((p, n) => console.log('State changed', n))

// Listen to events
eventBus.on('cart:updated', () => console.log('Cart updated'))
```

## Common Issues & Solutions

### Products not loading
```javascript
// Check API
window.app.api.get('/products/')

// Check store
console.log(window.app.store.getState())

// Check for errors in console
```

### Badges not updating
```javascript
// Check cart update listener
eventBus.on('cart:updated', () => console.log('Cart event fired'))

// Manually trigger update
eventBus.emit('cart:updated', [])
```

### Notifications not showing
```javascript
// Check container exists
document.getElementById('notification-container')

// Manually show
eventBus.emit('notification:show', { message: 'Test', type: 'info' })
```

### Styling issues
```javascript
// Check Tailwind loaded
document.querySelector('script[src*="cdn.tailwindcss"]')

// Check critical CSS loaded
document.querySelector('style')
```

### API CSRF issues
```javascript
// Check CSRF token
window.app.api.getCsrfToken()

// Check in cookie
document.cookie
```

## Performance Audit

Use Chrome DevTools Lighthouse:

1. **Performance** tab → Lighthouse
2. Run audit
3. Check scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

If not meeting targets:
- Check for render-blocking resources
- Optimize images
- Minify CSS/JS
- Remove unused code
- Enable caching

## Final Sign-Off Checklist

- [ ] All pages load without errors
- [ ] All API calls return 200 status
- [ ] No console errors
- [ ] No console warnings (acceptable only)
- [ ] Responsive design works
- [ ] Performance metrics met
- [ ] Accessibility standards met
- [ ] Security checks passed
- [ ] Cross-browser compatibility verified
- [ ] Mobile testing passed
- [ ] Ready for production

## Deployment Readiness

Before deploying:

1. [ ] Set `.env` variables correctly
2. [ ] Configure database with migrations
3. [ ] Collect static files: `python manage.py collectstatic`
4. [ ] Run tests: `python manage.py test`
5. [ ] Check for security issues: `python manage.py check --deploy`
6. [ ] Configure SSL/HTTPS
7. [ ] Set up monitoring/alerts
8. [ ] Configure email backend for notifications
9. [ ] Set up backup strategy
10. [ ] Create deployment rollback plan

Good luck! 🚀
