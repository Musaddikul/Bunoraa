/**
 * Authentication Module
 * Handles user authentication, registration, and session management.
 */

import api from './client.js';

class AuthService {
    constructor() {
        this.user = null;
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
        this.listeners.forEach(callback => callback(this.user));
    }

    // =========================================================================
    // Authentication
    // =========================================================================

    async login(email, password) {
        const response = await api.post('/auth/token/', { email, password }, false);
        
        api.setTokens(response.access, response.refresh);
        await this.fetchUser();
        
        window.dispatchEvent(new CustomEvent('auth:login', { detail: this.user }));
        
        return this.user;
    }

    async register(data) {
        const response = await api.post('/accounts/register/', data, false);
        
        // Auto-login after registration
        if (response.tokens) {
            api.setTokens(response.tokens.access, response.tokens.refresh);
            await this.fetchUser();
            window.dispatchEvent(new CustomEvent('auth:login', { detail: this.user }));
        }
        
        return response;
    }

    async logout() {
        try {
            await api.post('/accounts/logout/', {});
        } catch (error) {
            // Ignore logout errors
        }
        
        api.clearTokens();
        this.user = null;
        this.notify();
        
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    async fetchUser() {
        try {
            this.user = await api.get('/accounts/me/');
            this.notify();
            return this.user;
        } catch (error) {
            this.user = null;
            this.notify();
            return null;
        }
    }

    // =========================================================================
    // Password Management
    // =========================================================================

    async requestPasswordReset(email) {
        return api.post('/accounts/password-reset/', { email }, false);
    }

    async resetPassword(token, password, confirmPassword) {
        return api.post('/accounts/password-reset-confirm/', {
            token,
            password,
            confirm_password: confirmPassword
        }, false);
    }

    async changePassword(oldPassword, newPassword) {
        return api.post('/accounts/change-password/', {
            old_password: oldPassword,
            new_password: newPassword
        });
    }

    // =========================================================================
    // Profile Management
    // =========================================================================

    async getProfile() {
        return this.fetchUser();
    }

    async updateProfile(data) {
        const response = await api.patch('/accounts/me/', data);
        this.user = response;
        this.notify();
        return this.user;
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await api.upload('/accounts/me/avatar/', formData);
        this.user = response;
        this.notify();
        return this.user;
    }

    // =========================================================================
    // Orders
    // =========================================================================

    async getOrders(params = {}) {
        return api.get('/orders/', params);
    }

    async getOrder(orderNumber) {
        return api.get(`/orders/${orderNumber}/`);
    }

    // =========================================================================
    // Wishlist
    // =========================================================================

    async getWishlist(params = {}) {
        return api.get('/wishlist/', params);
    }

    async addToWishlist(productId) {
        return api.post('/wishlist/', { product_id: productId });
    }

    async removeFromWishlist(productId) {
        return api.delete(`/wishlist/${productId}/`);
    }

    // =========================================================================
    // Addresses
    // =========================================================================

    async getAddresses() {
        return api.get('/accounts/addresses/');
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
        return api.post(`/accounts/addresses/${id}/set-default/`);
    }

    // =========================================================================
    // Email Verification
    // =========================================================================

    async verifyEmail(token) {
        return api.post('/accounts/verify-email/', { token }, false);
    }

    async resendVerification() {
        return api.post('/accounts/resend-verification/', {});
    }

    // =========================================================================
    // Session Check
    // =========================================================================

    async checkSession() {
        if (!api.isAuthenticated()) {
            return false;
        }

        try {
            await this.fetchUser();
            return !!this.user;
        } catch (error) {
            return false;
        }
    }

    isAuthenticated() {
        return api.isAuthenticated() && !!this.user;
    }

    getUser() {
        return this.user;
    }
}

// Export singleton
const auth = new AuthService();
export default auth;
export { AuthService };
export { auth as authApi };
