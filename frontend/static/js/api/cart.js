// frontend/static/js/api/cart.js
/**
 * Cart API Module
 */

import api from './client.js';

export const cartApi = {
    /**
     * Get current cart
     */
    async getCart() {
        return api.get('/cart/');
    },

    /**
     * Add item to cart
     */
    async addItem(productId, quantity = 1, variantId = null) {
        const data = {
            product_id: productId,
            quantity
        };
        
        if (variantId) {
            data.variant_id = variantId;
        }
        
        return api.post('/cart/items/', data);
    },

    /**
     * Update cart item quantity
     */
    async updateItem(itemId, quantity) {
        return api.patch(`/cart/items/${itemId}/`, { quantity });
    },

    /**
     * Remove item from cart
     */
    async removeItem(itemId) {
        return api.delete(`/cart/items/${itemId}/`);
    },

    /**
     * Clear cart
     */
    async clearCart() {
        return api.delete('/cart/');
    },

    /**
     * Get cart count (lightweight)
     */
    async getCartCount() {
        return api.get('/cart/count/');
    },

    /**
     * Apply coupon
     */
    async applyCoupon(code) {
        return api.post('/cart/coupon/apply/', { code });
    },

    /**
     * Remove coupon
     */
    async removeCoupon() {
        return api.post('/cart/coupon/remove/');
    },

    /**
     * Validate coupon
     */
    async validateCoupon(code) {
        return api.post('/promotions/coupons/validate/', { code });
    }
};

export default cartApi;
