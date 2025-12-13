/**
 * Vendors Module
 * Vendor browsing and management.
 */

import api from './client.js';

class VendorService {
    // =========================================================================
    // Public Vendor Browsing
    // =========================================================================

    async getVendors(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/${queryString ? '?' + queryString : ''}`, false);
    }

    async getVendor(slug) {
        return api.get(`/vendors/${slug}/`, false);
    }

    async getVendorProducts(slug, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/${slug}/products/${queryString ? '?' + queryString : ''}`, false);
    }

    async getVendorReviews(slug, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/${slug}/reviews/${queryString ? '?' + queryString : ''}`, false);
    }

    // =========================================================================
    // Vendor Registration
    // =========================================================================

    async registerAsVendor(data) {
        return api.post('/vendors/register/', data);
    }

    // =========================================================================
    // Vendor Dashboard (for logged-in vendors)
    // =========================================================================

    async getDashboard() {
        return api.get('/vendors/dashboard/');
    }

    async getDashboardStats() {
        return api.get('/vendors/dashboard/stats/');
    }

    async getVendorOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/dashboard/orders/${queryString ? '?' + queryString : ''}`);
    }

    async getVendorProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/dashboard/products/${queryString ? '?' + queryString : ''}`);
    }

    async updateVendorSettings(data) {
        return api.patch('/vendors/dashboard/settings/', data);
    }

    async updateStorePage(data) {
        return api.patch('/vendors/dashboard/page/', data);
    }

    // =========================================================================
    // Product Management (for vendors)
    // =========================================================================

    async createProduct(data) {
        return api.post('/vendors/dashboard/products/', data);
    }

    async updateProduct(id, data) {
        return api.patch(`/vendors/dashboard/products/${id}/`, data);
    }

    async deleteProduct(id) {
        return api.delete(`/vendors/dashboard/products/${id}/`);
    }

    async uploadProductImage(productId, file) {
        const formData = new FormData();
        formData.append('image', file);
        return api.upload(`/vendors/dashboard/products/${productId}/images/`, formData);
    }

    // =========================================================================
    // Payouts
    // =========================================================================

    async getPayouts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/vendors/dashboard/payouts/${queryString ? '?' + queryString : ''}`);
    }

    async requestPayout(amount) {
        return api.post('/vendors/dashboard/payouts/request/', { amount });
    }
}

// Export singleton
const vendors = new VendorService();
export default vendors;
export { VendorService };
