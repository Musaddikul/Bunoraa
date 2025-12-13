// frontend/static/js/api/orders.js
/**
 * Orders API Module
 */

import api from './client.js';

export const ordersApi = {
    /**
     * Create order (checkout)
     */
    async createOrder(checkoutData) {
        return api.post('/orders/checkout/', checkoutData);
    },

    /**
     * Get user's orders
     */
    async getOrders(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page);

        const query = queryParams.toString();
        return api.get(`/orders/${query ? `?${query}` : ''}`);
    },

    /**
     * Get order by order number
     */
    async getOrder(orderNumber, email = null) {
        const params = email ? `?email=${encodeURIComponent(email)}` : '';
        return api.get(`/orders/${orderNumber}/${params}`);
    },

    /**
     * Cancel order
     */
    async cancelOrder(orderNumber, reason = '') {
        return api.post(`/orders/${orderNumber}/cancel/`, { reason });
    },

    /**
     * Get order tracking
     */
    async getOrderTracking(orderNumber, email = null) {
        const params = email ? `?email=${encodeURIComponent(email)}` : '';
        return api.get(`/orders/${orderNumber}/tracking/${params}`);
    },

    /**
     * Guest order lookup
     */
    async lookupOrder(orderNumber, email) {
        return api.post('/orders/lookup/', { order_number: orderNumber, email });
    }
};

export default ordersApi;
