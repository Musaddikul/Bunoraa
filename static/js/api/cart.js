/**
 * Cart API Module
 * @module api/cart
 */

const CartApi = (function() {
    'use strict';

    const CART_PATH = '/cart/';

    async function getCart() {
        const response = await ApiClient.get(CART_PATH);
        if (response.success) {
            updateBadge(response.data);
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data }));
        }
        return response;
    }

    async function addItem(productId, quantity = 1, variantId = null) {
        const data = { product_id: productId, quantity };
        if (variantId) data.variant_id = variantId;

        const response = await ApiClient.post(`${CART_PATH}add/`, data);
        
        if (response.success) {
            updateBadge(response.data?.cart);
            window.dispatchEvent(new CustomEvent('cart:item-added', { detail: response.data }));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function updateItem(itemId, quantity) {
        const response = await ApiClient.patch(`${CART_PATH}items/${itemId}/`, { quantity });
        
        if (response.success) {
            updateBadge(response.data?.cart);
            window.dispatchEvent(new CustomEvent('cart:item-updated', { detail: response.data }));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function removeItem(itemId) {
        const response = await ApiClient.delete(`${CART_PATH}items/${itemId}/`);
        
        if (response.success) {
            updateBadge(response.data?.cart);
            window.dispatchEvent(new CustomEvent('cart:item-removed', { detail: { itemId, cart: response.data?.cart } }));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function clearCart() {
        const response = await ApiClient.delete(`${CART_PATH}clear/`);
        
        if (response.success) {
            updateBadge({ item_count: 0 });
            window.dispatchEvent(new CustomEvent('cart:cleared'));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function applyCoupon(code) {
        const response = await ApiClient.post(`${CART_PATH}coupon/`, { code });
        
        if (response.success) {
            window.dispatchEvent(new CustomEvent('cart:coupon-applied', { detail: response.data }));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function removeCoupon() {
        const response = await ApiClient.delete(`${CART_PATH}coupon/`);
        
        if (response.success) {
            window.dispatchEvent(new CustomEvent('cart:coupon-removed'));
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: response.data?.cart }));
        }
        
        return response;
    }

    async function validate() {
        return ApiClient.get(`${CART_PATH}validate/`);
    }

    async function merge() {
        return ApiClient.post(`${CART_PATH}merge/`, {}, { requiresAuth: true });
    }

    function updateBadge(cart) {
        const count = cart?.item_count || cart?.items?.length || 0;
        const badges = document.querySelectorAll('[data-cart-count]');
        
        badges.forEach(badge => {
            // Cap visible badge to a single digit display to reduce layout width on small viewports
            badge.textContent = count > 9 ? '9+' : count;
            badge.classList.toggle('hidden', count === 0);
        });
    }

    return {
        getCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        validate,
        merge,
        updateBadge
    };
})();

window.CartApi = CartApi;
