/**
 * Wishlist API Module
 * @module api/wishlist
 */

const WishlistApi = (function() {
    'use strict';

    const WISHLIST_PATH = '/wishlist/';

    async function getWishlist(params = {}) {
        const response = await ApiClient.get(WISHLIST_PATH, {
            page: params.page || 1,
            page_size: params.pageSize || 20
        }, { requiresAuth: true });

        if (response.success) {
            updateBadge(response.data);
        }

        return response;
    }

    async function addItem(productId, variantId = null, notes = '') {
        const data = {
            product_id: productId,
            variant_id: variantId,
            notes
        };

        const response = await ApiClient.post(WISHLIST_PATH, data, { requiresAuth: true });

        if (response.success) {
            window.dispatchEvent(new CustomEvent('wishlist:item-added', { detail: { productId } }));
            window.dispatchEvent(new CustomEvent('wishlist:updated'));
        }

        return response;
    }

    async function removeItem(itemId) {
        const response = await ApiClient.delete(`${WISHLIST_PATH}${itemId}/`, { requiresAuth: true });

        if (response.success) {
            window.dispatchEvent(new CustomEvent('wishlist:item-removed', { detail: { itemId } }));
            window.dispatchEvent(new CustomEvent('wishlist:updated'));
        }

        return response;
    }

    async function updateItem(itemId, data) {
        return ApiClient.patch(`${WISHLIST_PATH}${itemId}/update_item/`, data, { requiresAuth: true });
    }

    async function moveToCart(itemId, quantity = 1) {
        const response = await ApiClient.post(`${WISHLIST_PATH}${itemId}/move_to_cart/`, { quantity }, { requiresAuth: true });

        if (response.success) {
            window.dispatchEvent(new CustomEvent('wishlist:item-moved', { detail: { itemId } }));
            window.dispatchEvent(new CustomEvent('wishlist:updated'));
            window.dispatchEvent(new CustomEvent('cart:updated'));
        }

        return response;
    }

    async function clearWishlist() {
        const response = await ApiClient.delete(`${WISHLIST_PATH}clear/`, { requiresAuth: true });

        if (response.success) {
            updateBadge({ items: [] });
            window.dispatchEvent(new CustomEvent('wishlist:cleared'));
            window.dispatchEvent(new CustomEvent('wishlist:updated'));
        }

        return response;
    }

    async function check(productIds) {
        return ApiClient.post(`${WISHLIST_PATH}check/`, { product_ids: productIds }, { requiresAuth: true });
    }

    function updateBadge(wishlist) {
        const count = wishlist?.items?.length || wishlist?.item_count || 0;
        const badges = document.querySelectorAll('[data-wishlist-count]');
        
        badges.forEach(badge => {
            // Cap visible badge to 99+ and show smaller, compact badges
            badge.textContent = count > 99 ? '99+' : count;
            badge.classList.toggle('hidden', count === 0);
        });
    }

    return {
        getWishlist,
        addItem,
        removeItem,
        updateItem,
        moveToCart,
        clearWishlist,
        check,
        updateBadge
    };
})();

window.WishlistApi = WishlistApi;
