/**
 * Cart Module
 * Shopping cart management with real-time updates.
 */

import api from './client.js';

class CartService {
    constructor() {
        this.cart = null;
        this.listeners = new Set();
    }

    // =========================================================================
    // Event Management
    // =========================================================================

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback(this.cart));
        window.dispatchEvent(new CustomEvent('cart:updated', { detail: this.cart }));
    }

    // =========================================================================
    // Cart Operations
    // =========================================================================

    async fetch() {
        this.cart = await api.get('/cart/', false);
        this.notify();
        return this.cart;
    }

    async addItem(productId, variantId = null, quantity = 1) {
        const response = await api.post('/cart/add/', {
            product_id: productId,
            variant_id: variantId,
            quantity
        }, false);
        
        this.cart = response.cart;
        this.notify();
        
        // Show notification
        window.dispatchEvent(new CustomEvent('notification:show', {
            detail: {
                type: 'success',
                message: 'Added to cart',
                action: { text: 'View Cart', url: '/cart/' }
            }
        }));
        
        return response;
    }

    async updateItem(itemId, quantity) {
        const response = await api.put(`/cart/items/${itemId}/`, { quantity }, false);
        this.cart = response.cart;
        this.notify();
        return response;
    }

    async removeItem(itemId) {
        const response = await api.delete(`/cart/items/${itemId}/remove/`, null, false);
        this.cart = response.cart;
        this.notify();
        return response;
    }

    async clear() {
        const response = await api.post('/cart/clear/', {}, false);
        this.cart = response.cart;
        this.notify();
        return response;
    }

    // =========================================================================
    // Coupon Management
    // =========================================================================

    async applyCoupon(code) {
        try {
            const response = await api.post('/cart/coupon/apply/', { code }, false);
            this.cart = response.cart;
            this.notify();
            
            window.dispatchEvent(new CustomEvent('notification:show', {
                detail: { type: 'success', message: 'Coupon applied!' }
            }));
            
            return response;
        } catch (error) {
            window.dispatchEvent(new CustomEvent('notification:show', {
                detail: { type: 'error', message: error.data?.error || 'Invalid coupon' }
            }));
            throw error;
        }
    }

    async removeCoupon() {
        const response = await api.post('/cart/coupon/remove/', {}, false);
        this.cart = response.cart;
        this.notify();
        return response;
    }

    // =========================================================================
    // Getters
    // =========================================================================

    getCart() {
        return this.cart;
    }

    getItemCount() {
        return this.cart?.item_count || 0;
    }

    getSubtotal() {
        return parseFloat(this.cart?.subtotal || 0);
    }

    getTotal() {
        return parseFloat(this.cart?.total || 0);
    }

    isEmpty() {
        return this.cart?.is_empty ?? true;
    }

    hasItem(productId, variantId = null) {
        if (!this.cart?.items) return false;
        
        return this.cart.items.some(item => {
            if (item.product.id !== productId) return false;
            if (variantId && item.variant?.id !== variantId) return false;
            return true;
        });
    }
}

// Export singleton
const cart = new CartService();
export default cart;
export { CartService };
export { cart as cartService };
