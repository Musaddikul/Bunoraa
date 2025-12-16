# Bunoraa API Documentation

## Overview

All API endpoints are RESTful and versioned under `/api/v1/`. The API uses JSON for request/response bodies and follows a standardized response format.

### Base URL
```
https://yourdomain.com/api/v1/
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "error_code",
  "errors": {
    "field_name": ["Error details"]
  }
}
```

### Authentication
The API supports multiple authentication methods:
- **JWT (Bearer Token)** - Recommended for API clients
- **Session** - For browser-based access
- **Token** - For simple integrations

```
Authorization: Bearer <access_token>
```

---

## Authentication

### Get JWT Token
```http
POST /api/v1/auth/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /api/v1/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

### Register
```http
POST /api/v1/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Get Profile
```http
GET /api/v1/auth/profile/
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /api/v1/auth/profile/
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "phone": "+1234567890"
}
```

---

## Products

### List Products
```http
GET /api/v1/products/
```

Query Parameters:
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)
- `category` - Filter by category slug
- `brand` - Filter by brand slug
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `search` - Search query
- `ordering` - Sort field (price, -price, name, -created_at, popularity)
- `in_stock` - Filter in-stock only (true/false)

### Get Product Detail
```http
GET /api/v1/products/<slug>/
```

### Get Related Products
```http
GET /api/v1/products/<slug>/related/
```

---

## Categories

### List Categories (Tree)
```http
GET /api/v1/categories/
```

### Get Category Products
```http
GET /api/v1/categories/<slug>/products/
```

---

## Cart

### Get Cart
```http
GET /api/v1/cart/
```

### Add to Cart
```http
POST /api/v1/cart/add/
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 1,
  "variant_id": null
}
```

### Update Cart Item
```http
PATCH /api/v1/cart/item/<item_id>/
Content-Type: application/json

{
  "quantity": 2
}
```

### Remove Cart Item
```http
DELETE /api/v1/cart/item/<item_id>/
```

### Apply Coupon
```http
POST /api/v1/cart/coupon/
Content-Type: application/json

{
  "code": "SUMMER20"
}
```

### Remove Coupon
```http
DELETE /api/v1/cart/coupon/
```

### Clear Cart
```http
DELETE /api/v1/cart/clear/
```

---

## Orders

### List Orders
```http
GET /api/v1/orders/
Authorization: Bearer <token>
```

### Get Order Detail
```http
GET /api/v1/orders/<order_number>/
Authorization: Bearer <token>
```

### Create Order (Checkout)
```http
POST /api/v1/checkout/
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address_id": 1,
  "billing_address_id": 1,
  "shipping_method_id": 1,
  "payment_method": "stripe",
  "notes": "Leave at door"
}
```

### Cancel Order
```http
POST /api/v1/orders/<order_number>/cancel/
Authorization: Bearer <token>
```

---

## Reviews

### List Product Reviews
```http
GET /api/v1/reviews/?product=<product_id>
```

### Create Review
```http
POST /api/v1/reviews/
Authorization: Bearer <token>
Content-Type: application/json

{
  "product": 1,
  "rating": 5,
  "title": "Great product",
  "comment": "Really happy with this purchase."
}
```

### Mark Review Helpful
```http
POST /api/v1/reviews/<id>/helpful/
```

---

## Wishlist

### Get Wishlist
```http
GET /api/v1/wishlist/
Authorization: Bearer <token>
```

### Toggle Wishlist Item
```http
POST /api/v1/wishlist/toggle/
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1
}
```

### Move to Cart
```http
POST /api/v1/wishlist/<item_id>/move-to-cart/
Authorization: Bearer <token>
```

---

## Promotions

### List Active Coupons
```http
GET /api/v1/promotions/coupons/
```

### Apply Coupon
```http
POST /api/v1/promotions/coupons/apply/
Content-Type: application/json

{
  "code": "SAVE10",
  "target_amount": "100.00"
}
```

---

## Notifications

### List Notifications
```http
GET /api/v1/notifications/
Authorization: Bearer <token>
```

### Mark as Read
```http
PATCH /api/v1/notifications/<id>/
Authorization: Bearer <token>
```

### Mark All as Read
```http
POST /api/v1/notifications/mark-all-read/
Authorization: Bearer <token>
```

### Get Preferences
```http
GET /api/v1/notifications/preferences/
Authorization: Bearer <token>
```

---

## Support

### Create Support Ticket
```http
POST /api/v1/support/tickets/
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Order issue",
  "description": "I need help with my order",
  "category": "order",
  "priority": "medium"
}
```

### Add Ticket Response
```http
POST /api/v1/support/tickets/<id>/respond/
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Additional details..."
}
```

---

## Contact & FAQ

### Submit Contact Form
```http
POST /api/v1/contacts/submit/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "order",
  "message": "I have a question about..."
}
```

### Get FAQs
```http
GET /api/v1/contacts/faq/
```

### Subscribe to Newsletter
```http
POST /api/v1/contacts/newsletter/subscribe/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## Analytics

### Track Event
```http
POST /api/v1/analytics/track/
Content-Type: application/json

{
  "event_type": "product_view",
  "product_id": 1
}
```

### Get Recently Viewed
```http
GET /api/v1/analytics/recently-viewed/?limit=10
```

### Get Popular Products
```http
GET /api/v1/analytics/popular-products/?days=7&limit=10
```

---

## CMS/Pages

### Get Homepage Data
```http
GET /api/v1/pages/homepage/
```

### Get Banners
```http
GET /api/v1/pages/banners/
```

### Get Page
```http
GET /api/v1/pages/pages/<slug>/
```

### Get Site Settings
```http
GET /api/v1/pages/settings/
```

---

## Shipping

### List Shipping Methods
```http
GET /api/v1/shipping/methods/?zone_id=1
```

### Calculate Shipping Cost
```http
POST /api/v1/shipping/calculate/
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_method_id": 1,
  "shipping_address_id": 1,
  "weight_kg": "0.5",
  "order_total": "100.00"
}
```

---

## Payments

### List Payment Methods
```http
GET /api/v1/payments/methods/
```

### Create Payment Intent
```http
POST /api/v1/payments/intents/
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": 1,
  "amount": "100.00",
  "payment_method": 1,
  "currency": "BDT"
}
```

---

## Rate Limiting

API requests are rate-limited:
- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Standard endpoints: 60 requests/minute

---

## Error Codes

| Code | Description |
|------|-------------|
| `authentication_failed` | Invalid credentials |
| `token_expired` | JWT token has expired |
| `permission_denied` | Insufficient permissions |
| `not_found` | Resource not found |
| `validation_error` | Request validation failed |
| `out_of_stock` | Product is out of stock |
| `coupon_expired` | Coupon has expired |
| `coupon_invalid` | Coupon code is invalid |
| `cart_empty` | Cart is empty |

---

## Webhooks (For Payment Providers)

### Stripe Webhook
```http
POST /api/v1/payments/webhook/stripe/
```

### Other Gateway Webhooks
```http
POST /api/v1/payments/webhook/<gateway_slug>/
```
