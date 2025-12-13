// frontend/static/js/store/cart.js
/**
 * Cart State Management
 * Handles cart state across the application
 */

import { cartApi } from '../api/index.js';
import { storage } from '../utils/helpers.js';

/**
 * Cart store
 */
class CartStore {
    constructor() {
        this.cart = null;
        this.isLoading = false;
        this.listeners = new Set();
    }
    
    /**
     * Subscribe to cart changes
     */
    subscribe(callback) {
        this.listeners.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }
    
    /**
     * Notify all listeners
     */
    notify() {
        this.listeners.forEach(callback => {
            try {
                callback(this.getState());
            } catch (error) {
                console.error('Cart listener error:', error);
            }
        });
        
        // Also dispatch a custom event for non-JS subscribers
        window.dispatchEvent(new CustomEvent('cart:updated', {
            detail: this.getState()
        }));
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            cart: this.cart,
            items: this.cart?.items || [],
            itemCount: this.getItemCount(),
            subtotal: this.cart?.subtotal || 0,
            total: this.cart?.total || 0,
            isLoading: this.isLoading
        };
    }
    
    /**
     * Get item count
     */
    getItemCount() {
        if (!this.cart?.items) return 0;
        return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    /**
     * Fetch cart from server
     */
    async fetch() {
        this.isLoading = true;
        this.notify();
        
        try {
            const response = await cartApi.getCart();
            
            if (response.success) {
                this.cart = response.data;
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
        
        this.isLoading = false;
        this.notify();
        
        return this.cart;
    }
    
    /**
     * Add item to cart
     */
    async addItem(productId, quantity = 1, variantId = null) {
        this.isLoading = true;
        this.notify();
        
        try {
            const response = await cartApi.addItem(productId, quantity, variantId);
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true, message: 'Added to cart' };
            } else {
                return { success: false, message: response.message || 'Failed to add item' };
            }
        } catch (error) {
            console.error('Failed to add item:', error);
            return { success: false, message: 'Failed to add item' };
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }
    
    /**
     * Update item quantity
     */
    async updateItem(itemId, quantity) {
        if (quantity < 1) {
            return this.removeItem(itemId);
        }
        
        try {
            const response = await cartApi.updateItem(itemId, quantity);
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to update item:', error);
            return { success: false, message: 'Failed to update item' };
        }
    }
    
    /**
     * Remove item from cart
     */
    async removeItem(itemId) {
        try {
            const response = await cartApi.removeItem(itemId);
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true, message: 'Item removed' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
            return { success: false, message: 'Failed to remove item' };
        }
    }
    
    /**
     * Apply coupon
     */
    async applyCoupon(code) {
        try {
            const response = await cartApi.applyCoupon(code);
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true, message: 'Coupon applied' };
            } else {
                return { success: false, message: response.message || 'Invalid coupon' };
            }
        } catch (error) {
            console.error('Failed to apply coupon:', error);
            return { success: false, message: 'Failed to apply coupon' };
        }
    }
    
    /**
     * Remove coupon
     */
    async removeCoupon() {
        try {
            const response = await cartApi.removeCoupon();
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true, message: 'Coupon removed' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to remove coupon:', error);
            return { success: false, message: 'Failed to remove coupon' };
        }
    }
    
    /**
     * Clear cart
     */
    async clear() {
        try {
            const response = await cartApi.clearCart();
            
            if (response.success) {
                this.cart = response.data;
                this.notify();
                return { success: true, message: 'Cart cleared' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return { success: false, message: 'Failed to clear cart' };
        }
    }
    
    /**
     * Check if product is in cart
     */
    hasItem(productId, variantId = null) {
        if (!this.cart?.items) return false;
        
        return this.cart.items.some(item => {
            if (item.product?.id !== productId) return false;
            if (variantId && item.variant?.id !== variantId) return false;
            return true;
        });
    }
    
    /**
     * Get item by product ID
     */
    getItem(productId, variantId = null) {
        if (!this.cart?.items) return null;
        
        return this.cart.items.find(item => {
            if (item.product?.id !== productId) return false;
            if (variantId && item.variant?.id !== variantId) return false;
            return true;
        });
    }
}

// Singleton instance
const cartStore = new CartStore();

export { cartStore };
export default cartStore;
