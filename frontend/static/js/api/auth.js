// frontend/static/js/api/auth.js
/**
 * Authentication API Module
 */

import api from './client.js';

export const authApi = {
    /**
     * Login user
     */
    async login(email, password) {
        const response = await api.post('/auth/login/', { email, password });
        
        if (response.success && response.data.tokens) {
            api.setTokens(response.data.tokens.access, response.data.tokens.refresh);
        }
        
        return response;
    },

    /**
     * Register new user
     */
    async register(userData) {
        const response = await api.post('/auth/register/', userData);
        
        if (response.success && response.data.tokens) {
            api.setTokens(response.data.tokens.access, response.data.tokens.refresh);
        }
        
        return response;
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            await api.post('/auth/logout/', {
                refresh: localStorage.getItem('refresh_token')
            });
        } finally {
            api.clearTokens();
        }
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        return api.get('/auth/profile/');
    },

    /**
     * Update user profile
     */
    async updateProfile(data) {
        return api.patch('/auth/profile/', data);
    },

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        return api.post('/auth/password/change/', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: newPassword
        });
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(email) {
        return api.post('/auth/password/reset/', { email });
    },

    /**
     * Confirm password reset
     */
    async confirmPasswordReset(token, newPassword) {
        return api.post('/auth/password/reset/confirm/', {
            token,
            new_password: newPassword,
            new_password_confirm: newPassword
        });
    },

    /**
     * Verify email
     */
    async verifyEmail(token) {
        return api.post('/auth/email/verify/', { token });
    },

    /**
     * Resend verification email
     */
    async resendVerification() {
        return api.post('/auth/email/resend/');
    },

    /**
     * Get user addresses
     */
    async getAddresses() {
        return api.get('/auth/addresses/');
    },

    /**
     * Add new address
     */
    async addAddress(addressData) {
        return api.post('/auth/addresses/', addressData);
    },

    /**
     * Update address
     */
    async updateAddress(addressId, addressData) {
        return api.patch(`/auth/addresses/${addressId}/`, addressData);
    },

    /**
     * Delete address
     */
    async deleteAddress(addressId) {
        return api.delete(`/auth/addresses/${addressId}/`);
    },

    /**
     * Set address as default
     */
    async setDefaultAddress(addressId) {
        return api.post(`/auth/addresses/${addressId}/default/`);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
};

export default authApi;
