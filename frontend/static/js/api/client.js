// frontend/static/js/api/client.js
/**
 * API Client Module
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = '/api/v1';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    /**
     * Get default headers for API requests
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        return headers;
    }

    /**
     * Make an HTTP request
     */
    async request(method, endpoint, data = null, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            method,
            headers: this.getHeaders(),
            ...options,
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(data);
        }

        try {
            let response = await fetch(url, config);

            // If 401 and we have a refresh token, try to refresh
            if (response.status === 401 && this.refreshToken) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    config.headers = this.getHeaders();
                    response = await fetch(url, config);
                }
            }

            const result = await response.json();

            if (!response.ok) {
                throw new ApiError(result.message || 'Request failed', response.status, result);
            }

            return result;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(error.message || 'Network error', 0, null);
        }
    }

    /**
     * Refresh the access token
     */
    async refreshAccessToken() {
        try {
            const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: this.refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data.access, this.refreshToken);
                return true;
            }

            // Refresh failed, clear tokens
            this.clearTokens();
            return false;
        } catch {
            this.clearTokens();
            return false;
        }
    }

    /**
     * Set authentication tokens
     */
    setTokens(access, refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('access_token', access);
        if (refresh) {
            localStorage.setItem('refresh_token', refresh);
        }
    }

    /**
     * Clear authentication tokens
     */
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    // HTTP method shortcuts
    get(endpoint, options) {
        return this.request('GET', endpoint, null, options);
    }

    post(endpoint, data, options) {
        return this.request('POST', endpoint, data, options);
    }

    put(endpoint, data, options) {
        return this.request('PUT', endpoint, data, options);
    }

    patch(endpoint, data, options) {
        return this.request('PATCH', endpoint, data, options);
    }

    delete(endpoint, options) {
        return this.request('DELETE', endpoint, null, options);
    }

    /**
     * Upload file(s)
     */
    async upload(endpoint, formData) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {};
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new ApiError(result.message || 'Upload failed', response.status, result);
        }

        return result;
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Create singleton instance
const api = new ApiClient();

export { api, ApiClient, ApiError };
export default api;
