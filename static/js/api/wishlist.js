/**
 * Wishlist Module
 * Wishlist management functionality.
 */

import api from './client.js';

class WishlistService {
    constructor() {
        this.wishlist = null;
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
        this.listeners.forEach(callback => callback(this.wishlist));
        window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: this.wishlist }));
    }

    // =========================================================================
    // Wishlist Operations
    // =========================================================================

    async fetch() {
        try {
            this.wishlist = await api.get('/wishlist/default/');
            this.notify();
            return this.wishlist;
        } catch (error) {
            this.wishlist = { items: [], item_count: 0 };
            return this.wishlist;
        }
    }

    async getLists() {
        return api.get('/wishlist/');
    }

    async createList(name, isPublic = false) {
        return api.post('/wishlist/', { name, is_public: isPublic });
    }

    async deleteList(id) {
        return api.delete(`/wishlist/${id}/`);
    }

    // =========================================================================
    // Item Operations
    // =========================================================================

    async addItem(productId, variantId = null, wishlistId = null) {
        const response = await api.post('/wishlist/items/', {
            product_id: productId,
            variant_id: variantId,
            wishlist_id: wishlistId
        });
        
        await this.fetch();
        
        window.dispatchEvent(new CustomEvent('notification:show', {
            detail: {
                type: 'success',
                message: response.created ? 'Added to wishlist' : 'Already in wishlist',
                action: { text: 'View Wishlist', url: '/account/wishlist/' }
            }
        }));
        
        return response;
    }

    async removeItem(productId, variantId = null) {
        const response = await api.delete('/wishlist/items/', {
            product_id: productId,
            variant_id: variantId
        });
        
        await this.fetch();
        return response;
    }

    async moveToCart(itemId) {
        const response = await api.post(`/wishlist/items/${itemId}/to-cart/`, {});
        await this.fetch();
        
        window.dispatchEvent(new CustomEvent('cart:updated'));
        
        return response;
    }

    async toggle(productId, variantId = null) {
        const inWishlist = this.hasItem(productId, variantId);
        
        if (inWishlist) {
            return this.removeItem(productId, variantId);
        } else {
            return this.addItem(productId, variantId);
        }
    }

    // =========================================================================
    // Utilities
    // =========================================================================

    async check(productId) {
        try {
            const response = await api.get(`/wishlist/check/${productId}/`);
            return response.in_wishlist;
        } catch {
            return false;
        }
    }

    hasItem(productId, variantId = null) {
        if (!this.wishlist?.items) return false;
        
        return this.wishlist.items.some(item => {
            if (item.product.id !== productId) return false;
            if (variantId && item.variant?.id !== variantId) return false;
            return true;
        });
    }

    getItemCount() {
        return this.wishlist?.item_count || 0;
    }

    getWishlist() {
        return this.wishlist;
    }
}

// Export singleton
const wishlist = new WishlistService();
export default wishlist;
export { WishlistService };
export { wishlist as wishlistService };
