/**
 * Bunoraa API Client
 * Core API communication module with fetch wrapper, error handling, and caching.
 */

const API_BASE_URL = '/api/v1';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get CSRF token from meta tag or cookie
     */
    getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
        
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }

    /**
     * Build headers for request
     */
    buildHeaders(options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': this.getCsrfToken(),
            ...options.headers
        };

        if (options.multipart) {
            delete headers['Content-Type'];
        }

        return headers;
    }

    /**
     * Build URL with query parameters
     */
    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(key, v));
                } else {
                    url.searchParams.append(key, value);
                }
            }
        });

        return url.toString();
    }

    /**
     * Check cache for valid entry
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    /**
     * Set cache entry
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Clear cache
     */
    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    /**
     * Handle API response
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new ApiError(
                data.message || data.detail || 'An error occurred',
                response.status,
                data
            );
            throw error;
        }

        return data;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body,
            params,
            cache = false,
            multipart = false,
            ...rest
        } = options;

        const url = this.buildUrl(endpoint, params);

        // Check cache for GET requests
        if (method === 'GET' && cache) {
            const cached = this.getFromCache(url);
            if (cached) {
                return cached;
            }
        }

        const requestOptions = {
            method,
            headers: this.buildHeaders({ multipart }),
            credentials: 'same-origin',
            ...rest
        };

        if (body) {
            requestOptions.body = multipart ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(url, requestOptions);
            const data = await this.handleResponse(response);

            // Cache GET responses
            if (method === 'GET' && cache) {
                this.setCache(url, data);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(error.message || 'Network error', 0);
        }
    }

    // HTTP method shortcuts
    async get(endpoint, params = {}, options = {}) {
        return this.request(endpoint, { method: 'GET', params, ...options });
    }

    async post(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { method: 'POST', body, ...options });
    }

    async put(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { method: 'PUT', body, ...options });
    }

    async patch(endpoint, body = {}, options = {}) {
        return this.request(endpoint, { method: 'PATCH', body, ...options });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    get isUnauthorized() {
        return this.status === 401;
    }

    get isForbidden() {
        return this.status === 403;
    }

    get isNotFound() {
        return this.status === 404;
    }

    get isValidationError() {
        return this.status === 400;
    }

    get isServerError() {
        return this.status >= 500;
    }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export for ES modules
export { apiClient, ApiClient, ApiError };

// Make available globally
window.Bunoraa = window.Bunoraa || {};
window.Bunoraa.api = apiClient;
window.Bunoraa.ApiError = ApiError;
