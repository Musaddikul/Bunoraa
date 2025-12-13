/**
 * Bunoraa API Client
 * Central API communication layer with authentication handling.
 */

const API_BASE = '/api/v1';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE;
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // =========================================================================
    // Token Management
    // =========================================================================

    setTokens(access, refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    isAuthenticated() {
        return !!this.accessToken;
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.clearTokens();
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: this.refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.access;
                localStorage.setItem('accessToken', data.access);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        this.clearTokens();
        return false;
    }

    // =========================================================================
    // Request Methods
    // =========================================================================

    getHeaders(authenticated = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (authenticated && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        // CSRF token for Django
        const csrfToken = this.getCookie('csrftoken');
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        return headers;
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    async request(method, endpoint, data = null, authenticated = true) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        
        const options = {
            method,
            headers: this.getHeaders(authenticated),
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            let response = await fetch(url, options);

            // Handle 401 - try to refresh token
            if (response.status === 401 && authenticated && this.refreshToken) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    options.headers = this.getHeaders(authenticated);
                    response = await fetch(url, options);
                } else {
                    // Redirect to login
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                    throw new Error('Session expired');
                }
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (!response.ok) {
                const error = new Error(result.detail || result.error || 'Request failed');
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    async get(endpoint, authenticated = true) {
        return this.request('GET', endpoint, null, authenticated);
    }

    async post(endpoint, data, authenticated = true) {
        return this.request('POST', endpoint, data, authenticated);
    }

    async put(endpoint, data, authenticated = true) {
        return this.request('PUT', endpoint, data, authenticated);
    }

    async patch(endpoint, data, authenticated = true) {
        return this.request('PATCH', endpoint, data, authenticated);
    }

    async delete(endpoint, data = null, authenticated = true) {
        return this.request('DELETE', endpoint, data, authenticated);
    }

    // =========================================================================
    // File Upload
    // =========================================================================

    async upload(endpoint, formData, authenticated = true) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {};
        if (authenticated && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        
        const csrfToken = this.getCookie('csrftoken');
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                const error = new Error(result.detail || 'Upload failed');
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            console.error(`Upload Error [${endpoint}]:`, error);
            throw error;
        }
    }
}

// Export singleton instance
const api = new ApiClient();
export default api;
export { ApiClient };
