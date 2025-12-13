/**
 * Orders Module
 * Order management and checkout functionality.
 */

import api from './client.js';

class OrderService {
    // =========================================================================
    // Order List
    // =========================================================================

    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/orders/my-orders/${queryString ? '?' + queryString : ''}`);
    }

    async getOrder(orderNumber) {
        return api.get(`/orders/my-orders/${orderNumber}/`);
    }

    async getOrderByUuid(uuid) {
        return api.get(`/orders/track/${uuid}/`);
    }

    // =========================================================================
    // Checkout
    // =========================================================================

    async checkout(data) {
        return api.post('/orders/checkout/', data);
    }

    async validateCheckout(data) {
        return api.post('/orders/checkout/validate/', data);
    }

    // =========================================================================
    // Order Actions
    // =========================================================================

    async cancelOrder(orderNumber, reason = '') {
        return api.post(`/orders/my-orders/${orderNumber}/cancel/`, { reason });
    }

    async trackOrder(orderNumber) {
        return api.get(`/orders/my-orders/${orderNumber}/track/`);
    }

    // =========================================================================
    // Addresses
    // =========================================================================

    async getAddresses() {
        return api.get('/accounts/addresses/');
    }

    async getAddress(id) {
        return api.get(`/accounts/addresses/${id}/`);
    }

    async createAddress(data) {
        return api.post('/accounts/addresses/', data);
    }

    async updateAddress(id, data) {
        return api.patch(`/accounts/addresses/${id}/`, data);
    }

    async deleteAddress(id) {
        return api.delete(`/accounts/addresses/${id}/`);
    }

    async setDefaultAddress(id) {
        return api.post(`/accounts/addresses/${id}/set-default/`, {});
    }

    // =========================================================================
    // Shipping
    // =========================================================================

    async getShippingMethods(data) {
        return api.post('/shipping/calculate/', data, false);
    }

    async getShippingZones() {
        return api.get('/shipping/zones/', false);
    }
}

// Export singleton
const orders = new OrderService();
export default orders;
export { OrderService };
