// frontend/static/js/store/auth.js
/**
 * Auth State Management
 * Handles authentication state across the application
 */

import { authApi } from '../api/index.js';
import { storage } from '../utils/helpers.js';

/**
 * Auth store
 */
class AuthStore {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = true;
        this.listeners = new Set();
        
        // Initialize
        this.init();
    }
    
    async init() {
        // Check for stored tokens
        const accessToken = storage.get('access_token');
        
        if (accessToken) {
            try {
                await this.fetchUser();
            } catch (error) {
                console.error('Failed to fetch user:', error);
                this.clear();
            }
        }
        
        this.isLoading = false;
        this.notify();
    }
    
    /**
     * Subscribe to auth changes
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
                console.error('Auth listener error:', error);
            }
        });
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            user: this.user,
            isAuthenticated: this.isAuthenticated,
            isLoading: this.isLoading
        };
    }
    
    /**
     * Fetch current user
     */
    async fetchUser() {
        const response = await authApi.getProfile();
        
        if (response.success) {
            this.user = response.data;
            this.isAuthenticated = true;
        } else {
            this.clear();
        }
        
        this.notify();
        return this.user;
    }
    
    /**
     * Login
     */
    async login(email, password) {
        const response = await authApi.login(email, password);
        
        if (response.success) {
            this.user = response.data.user;
            this.isAuthenticated = true;
            this.notify();
        }
        
        return response;
    }
    
    /**
     * Register
     */
    async register(data) {
        const response = await authApi.register(data);
        
        if (response.success) {
            this.user = response.data.user;
            this.isAuthenticated = true;
            this.notify();
        }
        
        return response;
    }
    
    /**
     * Logout
     */
    async logout() {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        this.clear();
        this.notify();
    }
    
    /**
     * Update user
     */
    async updateProfile(data) {
        const response = await authApi.updateProfile(data);
        
        if (response.success) {
            this.user = response.data;
            this.notify();
        }
        
        return response;
    }
    
    /**
     * Clear auth state
     */
    clear() {
        this.user = null;
        this.isAuthenticated = false;
        storage.remove('access_token');
        storage.remove('refresh_token');
    }
    
    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        if (!this.user) return false;
        if (this.user.is_superuser) return true;
        return this.user.permissions?.includes(permission) || false;
    }
    
    /**
     * Get user display name
     */
    getDisplayName() {
        if (!this.user) return 'Guest';
        return this.user.first_name || this.user.email?.split('@')[0] || 'User';
    }
}

// Singleton instance
const authStore = new AuthStore();

export { authStore };
export default authStore;
